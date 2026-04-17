// ============================================================
// BACKZO BACKEND - Node.js + Express + Stripe + MongoDB
// ============================================================

// Charger les variables d'environnement
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Puppeteer pour génération PDF
let chromium;
let puppeteer;
let puppeteerLocal;
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

console.log('🔍 Environnement détecté:', {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL,
  isProduction: isProduction
});

try {
  if (isProduction) {
    // En production (Vercel), utiliser chrome-aws-lambda
    chromium = require('chrome-aws-lambda');
    puppeteer = require('puppeteer-core');
    console.log('✓ chrome-aws-lambda chargé pour production');
  } else {
    // En local, utiliser puppeteer standard
    puppeteerLocal = require('puppeteer');
    console.log('✓ puppeteer chargé pour développement local');
  }
} catch (error) {
  console.log('⚠️ Puppeteer non disponible, génération PDF désactivée');
  console.log('   Erreur:', error.message);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de l'authentification admin
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10) : bcrypt.hashSync('BackZo2024!', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'changez_ce_secret_en_production_avec_une_chaine_aleatoire_longue';

// Initialiser Stripe seulement si la clé est configurée
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  console.log('✓ Stripe initialisé avec clé secrète:', process.env.STRIPE_SECRET_KEY.substring(0, 20) + '...');
} else {
  console.error('❌ STRIPE_SECRET_KEY manquante ou invalide !');
  console.log('⚠️  Les paiements ne fonctionneront pas sans cette clé.');
}

// Middleware
// Configuration CORS pour autoriser le frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (comme les apps mobiles ou curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://backzo.eu',
      'https://www.backzo.eu',
      'https://projet-tati.vercel.app'
    ];
    
    // Autoriser toutes les origines Vercel en développement
    if (origin.includes('vercel.app') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('⚠️  Origine CORS non autorisée:', origin);
      callback(null, true); // Autoriser quand même pour éviter les blocages
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// ============================================================
// MIDDLEWARE D'AUTHENTIFICATION
// ============================================================

// Middleware pour vérifier le token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
    req.user = user;
    next();
  });
}

// ============================================================
// ROUTES D'AUTHENTIFICATION ADMIN
// ============================================================

// Route de connexion admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('🔐 Tentative de connexion admin:', username);

    // Validation des champs
    if (!username || !password) {
      return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
    }

    // Vérifier l'identifiant
    if (username !== ADMIN_USERNAME) {
      console.log('❌ Identifiant incorrect');
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!passwordMatch) {
      console.log('❌ Mot de passe incorrect');
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    // Générer un token JWT valide 24h
    const token = jwt.sign(
      { username: username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✓ Connexion admin réussie');

    res.json({
      success: true,
      token: token,
      expiresIn: 86400 // 24h en secondes
    });

  } catch (error) {
    console.error('❌ Erreur connexion admin:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour vérifier si le token est valide
app.get('/api/admin/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Route pour changer le mot de passe admin (protégée)
app.post('/api/admin/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mots de passe requis' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
    }

    // Vérifier le mot de passe actuel
    const passwordMatch = await bcrypt.compare(currentPassword, ADMIN_PASSWORD_HASH);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    // Note: Pour changer le mot de passe de manière permanente,
    // il faudrait mettre à jour la variable d'environnement ADMIN_PASSWORD
    // Ce qui nécessite un redémarrage du serveur
    console.log('⚠️  Pour changer le mot de passe de manière permanente, mettez à jour ADMIN_PASSWORD dans .env');
    
    res.json({ 
      success: true, 
      message: 'Pour changer le mot de passe de manière permanente, mettez à jour ADMIN_PASSWORD dans votre fichier .env et redémarrez le serveur' 
    });

  } catch (error) {
    console.error('❌ Erreur changement mot de passe:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================================
// CONFIGURATION EMAIL
// ============================================================

let emailTransporter = null;

// Créer le transporteur email seulement si les credentials sont configurés
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'ssl0.ovh.net',
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: true, // true pour le port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Vérifier la configuration email au démarrage
  emailTransporter.verify(function(error, success) {
    if (error) {
      console.log('⚠️  Configuration email incorrecte:', error.message);
    } else {
      console.log('✓ Serveur email prêt');
    }
  });
} else {
  console.log('ℹ️  Email non configuré (optionnel)');
}

// Fonction pour envoyer un email de confirmation de commande
async function sendOrderConfirmationEmail(order) {
  if (!emailTransporter) {
    throw new Error('Email non configuré');
  }
  
  const itemsList = order.items.map(item => 
    `<li style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name} ${item.size ? `(${item.size})` : ''} - ${item.quantity}x - ${item.price}€</li>`
  ).join('');
  
  // Email pour le client
  const customerMailOptions = {
    from: process.env.EMAIL_FROM || 'team@backzo.eu',
    to: order.customer.email,
    subject: `✅ Confirmation de commande ${order.id} - BackZo`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: #000; color: #b8ff57; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">BACK<span style="color: #fff;">ZO</span></h1>
          <p style="margin: 10px 0 0; font-size: 14px; color: #999;">Confirmation de commande</p>
        </div>
        
        <div style="background: #fff; padding: 30px; margin-top: 20px; border-radius: 8px;">
          <h2 style="color: #000; margin-top: 0;">Merci pour votre commande !</h2>
          <p style="color: #333; line-height: 1.6;">Bonjour ${order.customer.firstName} ${order.customer.lastName},</p>
          <p style="color: #333; line-height: 1.6;">Votre commande a été confirmée et payée avec succès. Nous la préparons avec soin.</p>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #b8ff57; border-radius: 4px;">
            <h3 style="margin: 0 0 15px; color: #000;">Détails de la commande</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Numéro de commande :</td>
                <td style="padding: 8px 0; color: #000; font-weight: bold;">${order.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Date :</td>
                <td style="padding: 8px 0; color: #000;">${new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Statut :</td>
                <td style="padding: 8px 0; color: #223a00; font-weight: bold;">✓ En cours de traitement</td>
              </tr>
            </table>
          </div>
          
          <h3 style="color: #000; margin-top: 30px; margin-bottom: 15px;">Articles commandés</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${itemsList}
          </ul>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px 0; color: #666;">Sous-total :</td>
                <td style="padding: 5px 0; text-align: right; color: #000;">${(order.total - order.shipping).toFixed(2).replace('.', ',')} €</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;">Livraison :</td>
                <td style="padding: 5px 0; text-align: right; color: #000;">${order.shipping.toFixed(2).replace('.', ',')} €</td>
              </tr>
              <tr style="border-top: 2px solid #ddd;">
                <td style="padding: 10px 0 5px; color: #000; font-size: 18px; font-weight: bold;">Total TTC :</td>
                <td style="padding: 10px 0 5px; text-align: right; color: #b8ff57; font-size: 20px; font-weight: bold;">${order.total.toFixed(2).replace('.', ',')} €</td>
              </tr>
            </table>
          </div>
          
          <h3 style="color: #000; margin-top: 30px; margin-bottom: 10px;">Adresse de livraison</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 4px;">
            <p style="margin: 0; color: #333; line-height: 1.6;">
              ${order.customer.firstName} ${order.customer.lastName}<br>
              ${order.customer.address}<br>
              ${order.customer.zip} ${order.customer.city}
            </p>
          </div>
          
          <div style="background: #fff9e6; border-left: 4px solid #ffcc00; padding: 15px; margin: 30px 0; border-radius: 4px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              📦 <strong>Suivi de commande :</strong> Vous recevrez un email de confirmation dès que votre commande sera expédiée.
            </p>
          </div>
          
          <p style="color: #333; line-height: 1.6; margin-top: 30px;">
            Pour toute question concernant votre commande, n'hésitez pas à nous contacter à 
            <a href="mailto:${process.env.EMAIL_FROM || 'team@backzo.eu'}" style="color: #233b00; text-decoration: none;">${process.env.EMAIL_FROM || 'team@backzo.eu'}</a>
          </p>
          
          <p style="color: #333; line-height: 1.6; margin-top: 20px;">
            Merci de votre confiance,<br/>
            <strong>L'équipe BackZo</strong>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p style="margin: 0;">BackZo — Flocage amovible premium pour clubs et particuliers</p>
          <p style="margin: 5px 0 0;">www.backzo.eu</p>
        </div>
      </div>
    `
  };
  
  // Email pour l'admin
  const adminMailOptions = {
    from: process.env.EMAIL_FROM || 'team@backzo.eu',
    to: process.env.EMAIL_TO || 'team@backzo.eu',
    subject: `🔔 Nouvelle commande ${order.id} - BackZo`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: #000; color: #b8ff57; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">BACK<span style="color: #fff;">ZO</span></h1>
          <p style="margin: 10px 0 0; font-size: 14px; color: #999;">Nouvelle commande reçue</p>
        </div>
        
        <div style="background: #fff; padding: 30px; margin-top: 20px; border-radius: 8px;">
          <h2 style="color: #000; margin-top: 0;">🎉 Nouvelle commande !</h2>
          
          <div style="background: #e6ffe6; border-left: 4px solid #00cc00; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #006600; font-weight: bold;">
              Commande ${order.id} - ${order.total.toFixed(2)} €
            </p>
          </div>
          
          <h3 style="color: #000; margin-top: 30px; margin-bottom: 15px;">Informations client</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 40%;">Nom :</td>
              <td style="padding: 8px 0; color: #000; font-weight: bold;">${order.customer.firstName} ${order.customer.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Email :</td>
              <td style="padding: 8px 0;"><a href="mailto:${order.customer.email}" style="color: #b8ff57; text-decoration: none;">${order.customer.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Adresse :</td>
              <td style="padding: 8px 0; color: #000;">${order.customer.address}, ${order.customer.zip} ${order.customer.city}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Date :</td>
              <td style="padding: 8px 0; color: #000;">${new Date(order.date).toLocaleString('fr-FR')}</td>
            </tr>
          </table>
          
          <h3 style="color: #000; margin-top: 30px; margin-bottom: 15px;">Articles commandés</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${itemsList}
          </ul>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px 0; color: #666;">Sous-total :</td>
                <td style="padding: 5px 0; text-align: right; color: #000;">${(order.total - order.shipping).toFixed(2).replace('.', ',')} €</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;">Livraison :</td>
                <td style="padding: 5px 0; text-align: right; color: #000;">${order.shipping.toFixed(2).replace('.', ',')} €</td>
              </tr>
              <tr style="border-top: 2px solid #ddd;">
                <td style="padding: 10px 0 5px; color: #000; font-size: 18px; font-weight: bold;">Total TTC :</td>
                <td style="padding: 10px 0 5px; text-align: right; color: #00cc00; font-size: 20px; font-weight: bold;">${order.total.toFixed(2).replace('.', ',')} €</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fff9e6; border-left: 4px solid #ffcc00; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              ⚡ <strong>Action requise :</strong> Préparez cette commande et mettez à jour son statut dans l'interface admin.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p style="margin: 0;">BackZo Admin - Gestion des commandes</p>
        </div>
      </div>
    `
  };
  
  // Envoyer les deux emails
  await emailTransporter.sendMail(customerMailOptions);
  await emailTransporter.sendMail(adminMailOptions);
}

// Fonction pour envoyer un email de mise à jour de statut
async function sendOrderStatusUpdateEmail(order, newStatus, oldStatus) {
  if (!emailTransporter) {
    throw new Error('Email non configuré');
  }
  
  const statusInfo = {
    pending: {
      label: 'En attente',
      color: '#ffcc00',
      icon: '⏳',
      message: 'Votre commande est en attente de traitement.'
    },
    processing: {
      label: 'En cours de traitement',
      color: '#3399ff',
      icon: '⚙️',
      message: 'Votre commande est en cours de préparation.'
    },
    shipped: {
      label: 'Expédiée',
      color: '#ff9900',
      icon: '📦',
      message: 'Votre commande a été expédiée et est en route vers vous !'
    },
    delivered: {
      label: 'Livrée',
      color: '#00cc00',
      icon: '✅',
      message: 'Votre commande a été livrée. Nous espérons que vous en êtes satisfait !'
    },
    cancelled: {
      label: 'Annulée',
      color: '#ff0000',
      icon: '❌',
      message: 'Votre commande a été annulée.'
    }
  };
  
  const status = statusInfo[newStatus] || statusInfo.processing;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'team@backzo.eu',
    to: order.customer.email,
    subject: `${status.icon} Mise à jour de votre commande ${order.id} - BackZo`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: #000; color: #b8ff57; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">BACK<span style="color: #fff;">ZO</span></h1>
          <p style="margin: 10px 0 0; font-size: 14px; color: #999;">Mise à jour de commande</p>
        </div>
        
        <div style="background: #fff; padding: 30px; margin-top: 20px; border-radius: 8px;">
          <h2 style="color: #000; margin-top: 0;">Bonjour ${order.customer.firstName} ${order.customer.lastName},</h2>
          <p style="color: #333; line-height: 1.6;">Le statut de votre commande a été mis à jour.</p>
          
          <div style="background: ${status.color}15; border-left: 4px solid ${status.color}; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px; color: #666; font-size: 14px;">Commande ${order.id}</p>
            <p style="margin: 0; color: ${status.color}; font-size: 24px; font-weight: bold;">
              ${status.icon} ${status.label}
            </p>
            <p style="margin: 15px 0 0; color: #333; line-height: 1.6;">
              ${status.message}
            </p>
          </div>
          
          ${newStatus === 'shipped' ? `
          <div style="background: #e6f7ff; border-left: 4px solid #3399ff; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #0066cc; font-size: 14px;">
              📍 <strong>Suivi de livraison :</strong> Votre colis devrait arriver sous 2-3 jours ouvrés.
            </p>
          </div>
          ` : ''}
          
          ${newStatus === 'delivered' ? `
          <div style="background: #e6ffe6; border-left: 4px solid #00cc00; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px; color: #006600; font-size: 14px;">
              ⭐ <strong>Votre avis compte !</strong>
            </p>
            <p style="margin: 0 0 15px; color: #333; font-size: 13px;">
              Nous espérons que vous êtes satisfait de votre commande. Partagez votre expérience avec nous !
            </p>
            <div style="text-align: center;">
              <a href="https://backzo.eu/review.html?orderId=${order.id}&email=${encodeURIComponent(order.customer.email)}" 
                 style="display: inline-block; background: #b8ff57; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">
                ⭐ Donner mon avis
              </a>
            </div>
          </div>
          ` : ''}
          
          <p style="color: #333; line-height: 1.6; margin-top: 30px;">
            Pour toute question, contactez-nous à 
            <a href="mailto:${process.env.EMAIL_FROM || 'team@backzo.eu'}" style="color: #b8ff57; text-decoration: none;">${process.env.EMAIL_FROM || 'team@backzo.eu'}</a>
          </p>
          
          <p style="color: #333; line-height: 1.6; margin-top: 20px;">
            Cordialement,<br/>
            <strong>L'équipe BackZo</strong>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p style="margin: 0;">BackZo — Your Name Your Story</p>
          <p style="margin: 5px 0 0;">www.backzo.eu</p>
        </div>
      </div>
    `
  };
  
  await emailTransporter.sendMail(mailOptions);
}


// ============================================================
// CONFIGURATION BASE DE DONNÉES
// ============================================================

// MongoDB (si configuré) ou fichiers JSON (fallback)
let mongoClient = null;
let db = null;
const USE_MONGODB = !!process.env.MONGODB_URI;
let isConnecting = false;
let connectionPromise = null;

// Chemins fichiers JSON (fallback)
const DB_PATH = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DB_PATH, 'orders.json');
const PRODUCTS_FILE = path.join(DB_PATH, 'products.json');
const SETTINGS_FILE = path.join(DB_PATH, 'settings.json');
const REVIEWS_FILE = path.join(DB_PATH, 'reviews.json');

// Connexion MongoDB avec cache
async function connectMongoDB() {
  // Si déjà connecté, retourner true
  if (db) {
    return true;
  }
  
  // Si une connexion est en cours, attendre
  if (isConnecting && connectionPromise) {
    return await connectionPromise;
  }
  
  if (!USE_MONGODB) {
    console.log('ℹ️  MongoDB non configuré - Utilisation des fichiers JSON');
    return false;
  }
  
  // Marquer qu'une connexion est en cours
  isConnecting = true;
  
  connectionPromise = (async () => {
    try {
      console.log('🔄 Connexion à MongoDB...');
      
      // Préparer l'URI avec les bons paramètres
      let uri = process.env.MONGODB_URI;
      
      // S'assurer que l'URI contient les bons paramètres
      if (!uri.includes('retryWrites')) {
        uri += (uri.includes('?') ? '&' : '?') + 'retryWrites=true';
      }
      if (!uri.includes('w=majority')) {
        uri += '&w=majority';
      }
      
      mongoClient = new MongoClient(uri, {
        serverSelectionTimeoutMS: 10000, // Augmenté à 10 secondes
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1
      });
      
      await mongoClient.connect();
      
      // Vérifier la connexion
      await mongoClient.db('admin').command({ ping: 1 });
      
      db = mongoClient.db('backzo');
      console.log('✓ MongoDB connecté');
      isConnecting = false;
      return true;
    } catch (error) {
      console.error('✗ Erreur connexion MongoDB:', error.message);
      console.error('   Stack:', error.stack);
      console.log('ℹ️  Fallback vers fichiers JSON');
      isConnecting = false;
      mongoClient = null;
      db = null;
      return false;
    }
  })();
  
  return await connectionPromise;
}

// Initialiser la base de données
async function initDB() {
  // Connecter MongoDB si configuré
  const mongoConnected = await connectMongoDB();
  
  if (mongoConnected) {
    // Initialiser les collections MongoDB avec des données par défaut
    try {
      // Vérifier si les produits existent
      const productsCount = await db.collection('products').countDocuments();
      if (productsCount === 0) {
        const defaultProducts = [
          {
            id: 'patch-s',
            name: 'Flocage Amovible — Taille S',
            price: 13,
            category: 'particuliers',
            desc: 'Patch 25×6 cm. Idéal pour maillots individuels.',
            stock: 100,
            active: true,
            createdAt: new Date()
          },
          {
            id: 'patch-l',
            name: 'Flocage Amovible — Taille L',
            price: 13,
            category: 'particuliers',
            desc: 'Patch 27×7 cm. Format large pour plus de visibilité.',
            stock: 100,
            active: true,
            createdAt: new Date()
          },
          {
            id: 'pack-club-10',
            name: 'Pack Club — 10 patchs',
            price: 110,
            category: 'clubs',
            desc: 'Pack de 10 patchs personnalisés pour votre équipe.',
            stock: 50,
            active: true,
            createdAt: new Date()
          },
          {
            id: 'pack-club-20',
            name: 'Pack Club — 20 patchs',
            price: 200,
            category: 'clubs',
            desc: 'Pack de 20 patchs avec tarif dégressif.',
            stock: 30,
            active: true,
            createdAt: new Date()
          }
        ];
        await db.collection('products').insertMany(defaultProducts);
        console.log('✓ Produits par défaut créés dans MongoDB');
      }
      
      // Vérifier si les paramètres existent
      const settings = await db.collection('settings').findOne({ _id: 'global' });
      if (!settings) {
        const defaultSettings = {
          _id: 'global',
          siteName: 'BackZo',
          email: 'team@backzo.eu',
          phone: '+33 6 00 00 00 00',
          currency: 'EUR',
          shipping: 5.90,
          freeShippingFrom: 50,
          stripeKey: 'pk_test_VOTRE_CLE_ICI',
          maintenance: false,
          notifications: true,
          autoBackup: false,
          updatedAt: new Date()
        };
        await db.collection('settings').insertOne(defaultSettings);
        console.log('✓ Paramètres par défaut créés dans MongoDB');
      }
      
      // Vérifier si les présentations produits existent
      const clubsPresentation = await db.collection('presentations').findOne({ _id: 'clubs' });
      if (!clubsPresentation) {
        const defaultClubsPresentation = {
          _id: 'clubs',
          title: 'Flocage Amovible pour Clubs',
          description: 'Découvrez notre solution de flocage amovible spécialement conçue pour les clubs sportifs. Personnalisez vos maillots avec facilité et professionnalisme.',
          mediaType: 'image',
          mediaUrl: '1.jpg',
          updatedAt: new Date()
        };
        await db.collection('presentations').insertOne(defaultClubsPresentation);
        console.log('✓ Présentation Clubs créée dans MongoDB');
      }
      
      const particuliersPresentation = await db.collection('presentations').findOne({ _id: 'particuliers' });
      if (!particuliersPresentation) {
        const defaultParticuliersPresentation = {
          _id: 'particuliers',
          title: 'Flocage Personnalisé pour Particuliers',
          description: 'Créez votre flocage sur-mesure en quelques clics. Choisissez votre taille, vos couleurs et personnalisez votre maillot comme vous le souhaitez.',
          mediaType: 'image',
          mediaUrl: '2.jpg',
          updatedAt: new Date()
        };
        await db.collection('presentations').insertOne(defaultParticuliersPresentation);
        console.log('✓ Présentation Particuliers créée dans MongoDB');
      }
      
      // Créer le fichier reviews.json s'il n'existe pas (pour le fallback)
      try {
        await fs.access(REVIEWS_FILE);
      } catch {
        await fs.writeFile(REVIEWS_FILE, JSON.stringify([]));
        console.log('✓ Fichier reviews.json créé');
      }
      
      console.log('✓ MongoDB initialisé');
    } catch (error) {
      console.error('Erreur initialisation MongoDB:', error);
    }
  } else {
    // Fallback : Créer les fichiers JSON
    try {
      await fs.mkdir(DB_PATH, { recursive: true });
      
      // Créer orders.json s'il n'existe pas
      try {
        await fs.access(ORDERS_FILE);
      } catch {
        await fs.writeFile(ORDERS_FILE, JSON.stringify([]));
      }
      
      // Créer products.json avec des produits par défaut
      try {
        await fs.access(PRODUCTS_FILE);
      } catch {
        const defaultProducts = [
          {
            id: 'patch-s',
            name: 'Flocage Amovible — Taille S',
            price: 13,
            category: 'particuliers',
            desc: 'Patch 25×6 cm. Idéal pour maillots individuels.',
            stock: 100,
            active: true
          },
          {
            id: 'patch-l',
            name: 'Flocage Amovible — Taille L',
            price: 13,
            category: 'particuliers',
            desc: 'Patch 27×7 cm. Format large pour plus de visibilité.',
            stock: 100,
            active: true
          },
          {
            id: 'pack-club-10',
            name: 'Pack Club — 10 patchs',
            price: 110,
            category: 'clubs',
            desc: 'Pack de 10 patchs personnalisés pour votre équipe.',
            stock: 50,
            active: true
          },
          {
            id: 'pack-club-20',
            name: 'Pack Club — 20 patchs',
            price: 200,
            category: 'clubs',
            desc: 'Pack de 20 patchs avec tarif dégressif.',
            stock: 30,
            active: true
          }
        ];
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2));
      }
      
      // Créer settings.json avec les paramètres par défaut
      try {
        await fs.access(SETTINGS_FILE);
      } catch {
        const defaultSettings = {
          siteName: 'BackZo',
          email: 'team@backzo.eu',
          phone: '+33 6 00 00 00 00',
          currency: 'EUR',
          shipping: 5.90,
          freeShippingFrom: 50,
          stripeKey: 'pk_test_VOTRE_CLE_ICI',
          maintenance: false,
          notifications: true,
          autoBackup: false,
          updatedAt: new Date().toISOString()
        };
        await fs.writeFile(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
      }
      
      console.log('✓ Fichiers JSON initialisés');
    } catch (error) {
      console.error('Erreur initialisation fichiers JSON:', error);
    }
  }
}

// ============================================================
// FONCTIONS HELPER BASE DE DONNÉES
// ============================================================

// Lire depuis MongoDB ou fichier JSON
async function readData(collection, filePath) {
  // Essayer de se connecter à MongoDB si pas encore fait
  if (USE_MONGODB && !db) {
    await connectMongoDB();
  }
  
  if (USE_MONGODB && db) {
    try {
      return await db.collection(collection).find({}).toArray();
    } catch (error) {
      console.error(`Erreur lecture MongoDB ${collection}:`, error.message);
      // Ne pas essayer le fallback fichier sur Vercel (système de fichiers en lecture seule)
      return [];
    }
  } else {
    // Mode fichier JSON (seulement en local)
    if (process.env.VERCEL) {
      console.warn('⚠️  MongoDB non disponible sur Vercel, retour tableau vide');
      return [];
    }
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erreur lecture fichier:', error.message);
      return [];
    }
  }
}

// Écrire dans MongoDB ou fichier JSON
async function writeData(collection, filePath, data) {
  // Essayer de se connecter à MongoDB si pas encore fait
  if (USE_MONGODB && !db) {
    await connectMongoDB();
  }
  
  if (USE_MONGODB && db) {
    try {
      // Supprimer tous les documents et insérer les nouveaux
      await db.collection(collection).deleteMany({});
      if (data.length > 0) {
        await db.collection(collection).insertMany(data);
      }
      return true;
    } catch (error) {
      console.error(`Erreur écriture MongoDB ${collection}:`, error.message);
      return false;
    }
  } else {
    // Mode fichier JSON (seulement en local)
    if (process.env.VERCEL) {
      console.error('⚠️  Impossible d\'écrire sur Vercel sans MongoDB');
      return false;
    }
    
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Erreur écriture fichier:', error.message);
      return false;
    }
  }
}

// Lire les paramètres
async function getSettings() {
  // Essayer de se connecter à MongoDB si pas encore fait
  if (USE_MONGODB && !db) {
    await connectMongoDB();
  }
  
  if (USE_MONGODB && db) {
    try {
      const settings = await db.collection('settings').findOne({ _id: 'global' });
      if (settings) {
        delete settings._id; // Retirer l'_id MongoDB
        return settings;
      }
      // Si pas de settings, retourner les valeurs par défaut
      return getDefaultSettings();
    } catch (error) {
      console.error('Erreur lecture paramètres MongoDB:', error.message);
      return getDefaultSettings();
    }
  } else {
    // Mode fichier JSON (seulement en local)
    if (process.env.VERCEL) {
      console.warn('⚠️  MongoDB non disponible, utilisation des valeurs par défaut');
      return getDefaultSettings();
    }
    
    try {
      const data = await fs.readFile(SETTINGS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erreur lecture paramètres fichier:', error.message);
      return getDefaultSettings();
    }
  }
}

// Valeurs par défaut des paramètres
function getDefaultSettings() {
  return {
    siteName: 'BackZo',
    email: 'team@backzo.eu',
    phone: '+33 6 00 00 00 00',
    currency: 'EUR',
    shipping: 5.90,
    freeShippingFrom: 50,
    stripeKey: '',
    maintenance: false,
    notifications: true,
    autoBackup: false
  };
}

// Sauvegarder les paramètres
async function saveSettings(settings) {
  // Essayer de se connecter à MongoDB si pas encore fait
  if (USE_MONGODB && !db) {
    await connectMongoDB();
  }
  
  if (USE_MONGODB && db) {
    try {
      await db.collection('settings').updateOne(
        { _id: 'global' },
        { $set: { ...settings, updatedAt: new Date() } },
        { upsert: true }
      );
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde paramètres MongoDB:', error.message);
      return false;
    }
  } else {
    // Mode fichier JSON (seulement en local)
    if (process.env.VERCEL) {
      console.error('⚠️  Impossible de sauvegarder sur Vercel sans MongoDB');
      return false;
    }
    
    try {
      await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde paramètres fichier:', error.message);
      return false;
    }
  }
}

// ============================================================
// ROUTES STRIPE - PAIEMENTS
// ============================================================

// Créer un PaymentIntent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;
    
    console.log('📝 Création PaymentIntent - Montant:', amount, currency || 'eur');
    
    // Validation
    if (!amount || amount <= 0) {
      console.error('❌ Montant invalide:', amount);
      return res.status(400).json({ error: 'Montant invalide' });
    }
    
    // Vérifier que Stripe est initialisé
    if (!stripe) {
      console.error('❌ Stripe non initialisé - Clé secrète manquante');
      return res.status(500).json({ error: 'Configuration Stripe manquante' });
    }
    
    // Créer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir en centimes
      currency: currency || 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: metadata || {}
    });
    
    console.log('✓ PaymentIntent créé:', paymentIntent.id);
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
    
  } catch (error) {
    console.error('❌ Erreur création PaymentIntent:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer la clé publique Stripe
app.get('/api/stripe-config', async (req, res) => {
  try {
    console.log('📡 Requête /api/stripe-config reçue');
    
    let publicKey = '';
    
    // Priorité 1 : Variables d'environnement (plus fiable sur Vercel)
    publicKey = process.env.STRIPE_PUBLIC_KEY || '';
    if (publicKey && publicKey !== 'pk_test_VOTRE_CLE_PUBLIQUE_ICI' && publicKey.startsWith('pk_')) {
      console.log('✓ Clé Stripe depuis variables d\'environnement:', publicKey.substring(0, 20) + '...');
      return res.json({ publicKey: publicKey });
    }
    
    // Priorité 2 : MongoDB (si disponible)
    if (USE_MONGODB && db) {
      try {
        console.log('🔍 Tentative de lecture depuis MongoDB...');
        const settings = await getSettings();
        publicKey = settings.stripeKey || '';
        
        if (publicKey && publicKey !== 'pk_test_VOTRE_CLE_ICI' && publicKey.startsWith('pk_')) {
          console.log('✓ Clé Stripe depuis MongoDB:', publicKey.substring(0, 20) + '...');
          return res.json({ publicKey: publicKey });
        }
      } catch (mongoError) {
        console.warn('⚠️  Erreur lecture MongoDB:', mongoError.message);
      }
    }
    
    // Aucune clé valide trouvée
    console.log('⚠️  Aucune clé Stripe valide configurée');
    return res.json({ publicKey: '' });
    
  } catch (error) {
    console.error('❌ Erreur route stripe-config:', error.message);
    // Ne pas renvoyer d'erreur 500, juste une clé vide
    return res.json({ publicKey: '' });
  }
});

// Confirmer un paiement et créer la commande
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, orderData } = req.body;
    
    console.log('📝 Confirmation paiement:', paymentIntentId);
    
    // Vérifier que Stripe est initialisé
    if (!stripe) {
      console.error('❌ Stripe non initialisé');
      return res.status(500).json({ error: 'Configuration Stripe manquante' });
    }
    
    // Récupérer le PaymentIntent pour vérifier son statut
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    console.log('📊 Statut paiement:', paymentIntent.status);
    
    if (paymentIntent.status !== 'succeeded') {
      console.error('❌ Paiement non confirmé:', paymentIntent.status);
      return res.status(400).json({ 
        error: 'Paiement non confirmé',
        status: paymentIntent.status 
      });
    }
    
    // Créer la commande
    const order = {
      id: 'BZ-' + Date.now(),
      date: new Date().toISOString(),
      status: 'processing',
      paymentIntentId: paymentIntentId,
      customer: orderData.customer,
      items: orderData.items,
      total: orderData.total,
      shipping: orderData.shipping || 0
    };
    
    console.log('💾 Sauvegarde de la commande:', order.id);
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    // Sauvegarder la commande dans MongoDB
    if (USE_MONGODB && db) {
      try {
        await db.collection('orders').insertOne(order);
        console.log('✓ Commande sauvegardée dans MongoDB');
      } catch (error) {
        console.error('❌ Erreur sauvegarde MongoDB:', error.message);
        
        // Sur Vercel, on ne peut pas utiliser les fichiers
        if (process.env.VERCEL) {
          throw new Error('Impossible de sauvegarder la commande sans MongoDB');
        }
        
        // Fallback vers fichier JSON (seulement en local)
        const orders = await readData('orders', ORDERS_FILE);
        orders.push(order);
        await writeData('orders', ORDERS_FILE, orders);
        console.log('✓ Commande sauvegardée dans fichier JSON (fallback)');
      }
    } else {
      // Sur Vercel sans MongoDB, erreur
      if (process.env.VERCEL) {
        throw new Error('MongoDB non disponible sur Vercel');
      }
      
      // Mode fichier JSON (seulement en local)
      const orders = await readData('orders', ORDERS_FILE);
      orders.push(order);
      await writeData('orders', ORDERS_FILE, orders);
      console.log('✓ Commande sauvegardée dans fichier JSON');
    }
    
    // Envoyer un email de confirmation (optionnel)
    if (emailTransporter) {
      try {
        await sendOrderConfirmationEmail(order);
        console.log('✓ Email de confirmation envoyé');
      } catch (emailError) {
        console.warn('⚠️  Erreur envoi email:', emailError.message);
      }
    }
    
    res.json({
      success: true,
      order: order
    });
    
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// FORMULAIRE DE CONTACT
// ============================================================

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }
    
    // Vérifier si l'email est configuré
    if (!emailTransporter) {
      console.log('Message de contact reçu (email non configuré):', { name, email, subject });
      return res.json({ 
        success: true, 
        message: 'Message reçu. Nous vous répondrons sous 48h.' 
      });
    }
    
    // Préparer l'email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'team@backzo.eu',
      to: process.env.EMAIL_TO || 'team@backzo.eu',
      subject: `[BackZo Contact] ${subject || 'Nouveau message'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: #000; color: #b8ff57; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">BACK<span style="color: #fff;">ZO</span></h1>
            <p style="margin: 10px 0 0; font-size: 14px; color: #999;">Nouveau message de contact</p>
          </div>
          
          <div style="background: #fff; padding: 30px; margin-top: 20px; border-radius: 8px;">
            <h2 style="color: #000; margin-top: 0;">Informations du contact</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Nom :</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #000;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Email :</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #000;"><a href="mailto:${email}" style="color: #b8ff57; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Sujet :</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #000;">${subject || 'Non spécifié'}</td>
              </tr>
            </table>
            
            <h3 style="color: #000; margin-top: 30px; margin-bottom: 15px;">Message :</h3>
            <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #b8ff57; border-radius: 4px;">
              <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p style="margin: 0;">Ce message a été envoyé depuis le formulaire de contact BackZo</p>
            <p style="margin: 5px 0 0;">Date : ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
          </div>
        </div>
      `,
      text: `
NOUVEAU MESSAGE DE CONTACT BACKZO
================================

Nom: ${name}
Email: ${email}
Sujet: ${subject || 'Non spécifié'}

Message:
${message}

---
Date: ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
      `
    };
    
    // Envoyer l'email
    await emailTransporter.sendMail(mailOptions);
    
    console.log('✓ Email de contact envoyé:', email);
    
    res.json({ 
      success: true, 
      message: 'Message envoyé avec succès. Nous vous répondrons sous 48h.' 
    });
    
  } catch (error) {
    console.error('Erreur envoi email contact:', error);
    
    // Si c'est une erreur d'authentification, logger plus de détails
    if (error.code === 'EAUTH') {
      console.error('❌ Erreur d\'authentification email OVH');
      console.error('   Vérifiez EMAIL_USER et EMAIL_PASS dans les variables d\'environnement Vercel');
      console.error('   EMAIL_USER actuel:', process.env.EMAIL_USER);
      console.error('   EMAIL_HOST actuel:', process.env.EMAIL_HOST);
      console.error('   EMAIL_PORT actuel:', process.env.EMAIL_PORT);
    }
    
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' 
    });
  }
});

// ============================================================
// ENDPOINT: Envoyer un devis par email
// ============================================================
app.post('/api/send-quote', async (req, res) => {
  try {
    const { clientEmail, clientName, quoteId, total, lines, quoteHTML } = req.body;
    
    if (!clientEmail || !quoteId || !total) {
      return res.status(400).json({ error: 'Données manquantes' });
    }
    
    if (!emailTransporter) {
      console.log('Devis généré (email non configuré):', { clientEmail, quoteId });
      return res.json({ 
        success: true, 
        message: 'Devis généré. Email non configuré.' 
      });
    }
    
    // Construire le tableau des lignes pour l'email
    let linesHTML = '';
    if (lines && Array.isArray(lines) && lines.length > 0) {
      linesHTML = `
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Désignation</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qté</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">PU</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${lines.map(line => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${line.desc || '—'}</td>
                <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${line.qty}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${line.pu.toFixed(2).replace('.', ',')} €</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${line.total.toFixed(2).replace('.', ',')} €</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'team@backzo.eu',
      to: clientEmail,
      subject: `Devis BackZo — ${quoteId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: #000; color: #b8ff57; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">BACK<span style="color: #fff;">ZO</span></h1>
            <p style="margin: 10px 0 0; font-size: 14px; color: #999;">Votre devis personnalisé</p>
          </div>
          
          <div style="background: #fff; padding: 30px; margin-top: 20px; border-radius: 8px;">
            <h2 style="color: #000; margin-top: 0;">Bonjour ${clientName || 'Cher client'},</h2>
            
            <p style="color: #333; line-height: 1.6;">Veuillez trouver ci-joint votre devis BackZo au format PDF.</p>
            
            <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #b8ff57;">
              <h3 style="margin: 0 0 10px; color: #000;">Devis N° ${quoteId}</h3>
              <p style="margin: 0; font-size: 24px; color: #b8ff57; font-weight: bold;">${total}</p>
              <p style="margin: 5px 0 0; font-size: 12px; color: #666;">TVA non applicable, article 293 B du CGI</p>
            </div>
            
            ${linesHTML}
            
            <div style="background: #fff9e6; padding: 15px; margin: 20px 0; border-left: 4px solid #b8ff57;">
              <p style="margin: 0; color: #666; font-size: 14px;">📎 Le devis complet est disponible en pièce jointe au format PDF</p>
            </div>
            
            <p style="color: #333; line-height: 1.6; margin-top: 30px;">Pour toute question ou pour valider ce devis, n'hésitez pas à nous contacter à <a href="mailto:team@backzo.eu" style="color: #b8ff57;">team@backzo.eu</a></p>
            
            <p style="color: #333; line-height: 1.6; margin-top: 20px;">Cordialement,<br/>L'équipe BackZo</p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p style="margin: 0;">BackZo — Flocage amovible premium</p>
            <p style="margin: 5px 0 0;">Date : ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
          </div>
        </div>
      `
    };
    
    // Générer le PDF avec Puppeteer si le HTML est fourni
    // Note: Sur Vercel, la génération PDF peut échouer à cause des dépendances système
    // Le système utilise alors automatiquement le fallback HTML
    if (quoteHTML && puppeteerLocal) {
      // Génération PDF uniquement en local pour éviter les problèmes Vercel
      try {
        console.log('Génération du PDF...');
        console.log('Mode: Local (puppeteer)');
        
        console.log('Lancement de puppeteer local...');
        const browser = await puppeteerLocal.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setContent(quoteHTML, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
          }
        });
        
        await browser.close();
        
        console.log('✓ PDF généré avec succès (' + pdfBuffer.length + ' octets)');
        
        // Attacher le PDF à l'email
        mailOptions.attachments = [
          {
            filename: `Devis_BackZo_${quoteId}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ];
      } catch (pdfError) {
        console.error('Erreur génération PDF:', pdfError.message);
        // En cas d'erreur, attacher le HTML comme fallback
        mailOptions.attachments = [
          {
            filename: `Devis_BackZo_${quoteId}.html`,
            content: quoteHTML,
            contentType: 'text/html'
          }
        ];
      }
    } else if (quoteHTML) {
      // Sur Vercel ou si Puppeteer n'est pas disponible, envoyer en HTML
      console.log('ℹ️ Génération PDF désactivée sur Vercel, envoi en HTML');
      mailOptions.attachments = [
        {
          filename: `Devis_BackZo_${quoteId}.html`,
          content: quoteHTML,
          contentType: 'text/html'
        }
      ];
    }
    
    await emailTransporter.sendMail(mailOptions);
    
    console.log('✓ Devis envoyé à:', clientEmail);
    
    res.json({ 
      success: true, 
      message: 'Devis envoyé avec succès avec pièce jointe PDF' 
    });
    
  } catch (error) {
    console.error('Erreur envoi devis:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du devis' 
    });
  }
});

// ============================================================
// ENDPOINT: Envoyer une notification de commande
// ============================================================
app.post('/api/send-order-notification', async (req, res) => {
  try {
    const { customerEmail, customerName, orderId, status } = req.body;
    
    if (!customerEmail || !orderId || !status) {
      return res.status(400).json({ error: 'Données manquantes' });
    }
    
    if (!emailTransporter) {
      console.log('Notification commande (email non configuré):', { customerEmail, orderId });
      return res.json({ 
        success: true, 
        message: 'Notification générée. Email non configuré.' 
      });
    }
    
    const statusLabels = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé'
    };
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'team@backzo.eu',
      to: customerEmail,
      subject: `Mise à jour commande BackZo ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: #000; color: #b8ff57; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">BACK<span style="color: #fff;">ZO</span></h1>
            <p style="margin: 10px 0 0; font-size: 14px; color: #999;">Mise à jour de votre commande</p>
          </div>
          
          <div style="background: #fff; padding: 30px; margin-top: 20px; border-radius: 8px;">
            <h2 style="color: #000; margin-top: 0;">Bonjour ${customerName || 'Cher client'},</h2>
            
            <p style="color: #333; line-height: 1.6;">Votre commande a été mise à jour.</p>
            
            <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #b8ff57;">
              <h3 style="margin: 0 0 10px; color: #000;">Commande N° ${orderId}</h3>
              <p style="margin: 0; font-size: 18px; color: #b8ff57; font-weight: bold;">Statut : ${statusLabels[status] || status}</p>
            </div>
            
            <p style="color: #333; line-height: 1.6; margin-top: 30px;">Pour toute question, n'hésitez pas à nous contacter à <a href="mailto:team@backzo.eu" style="color: #b8ff57;">team@backzo.eu</a></p>
            
            <p style="color: #333; line-height: 1.6; margin-top: 20px;">Cordialement,<br/>L'équipe BackZo</p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p style="margin: 0;">BackZo — Flocage amovible premium</p>
          </div>
        </div>
      `
    };
    
    await emailTransporter.sendMail(mailOptions);
    
    console.log('✓ Notification commande envoyée à:', customerEmail);
    
    res.json({ 
      success: true, 
      message: 'Notification envoyée avec succès' 
    });
    
  } catch (error) {
    console.error('Erreur envoi notification:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de la notification' 
    });
  }
});

// Webhook Stripe pour les événements
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Erreur webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Gérer les événements
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✓ Paiement réussi:', paymentIntent.id);
      // Mettre à jour le statut de la commande
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('✗ Paiement échoué:', failedPayment.id);
      break;
      
    default:
      console.log(`Event non géré: ${event.type}`);
  }
  
  res.json({ received: true });
});

// ============================================================
// ROUTES PRODUITS
// ============================================================

// Récupérer tous les produits
app.get('/api/products', async (req, res) => {
  try {
    const products = await readData('products', PRODUCTS_FILE);
    const activeProducts = products.filter(p => p.active !== false);
    res.json(activeProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer un produit par ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const products = await readData('products', PRODUCTS_FILE);
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ajouter un nouveau produit (admin)
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { name, price, category, desc, stock } = req.body;
    
    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }
    
    const products = await readData('products', PRODUCTS_FILE);
    
    const newProduct = {
      id: 'prod-' + Date.now(),
      name,
      price: parseFloat(price),
      category,
      desc: desc || '',
      stock: parseInt(stock) || 0,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    await writeData('products', PRODUCTS_FILE, products);
    
    res.json({
      success: true,
      product: newProduct
    });
    
  } catch (error) {
    console.error('Erreur ajout produit:', error);
    res.status(500).json({ error: error.message });
  }
});

// Modifier un produit (admin)
app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    console.log('📝 Mise à jour produit:', productId);
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    // Mise à jour dans MongoDB
    if (USE_MONGODB && db) {
      try {
        // Vérifier si le produit existe
        let product = await db.collection('products').findOne({ id: productId });
        
        // Si le produit n'existe pas, initialiser la collection avec les produits par défaut
        if (!product) {
          console.log('⚠️  Produit non trouvé, initialisation de la collection...');
          await initDB();
          
          // Réessayer de trouver le produit
          product = await db.collection('products').findOne({ id: productId });
          
          if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé même après initialisation' });
          }
        }
        
        // Mettre à jour le produit
        const result = await db.collection('products').findOneAndUpdate(
          { id: productId },
          { $set: updateData },
          { returnDocument: 'after' }
        );
        
        console.log('✓ Produit mis à jour dans MongoDB');
        return res.json({
          success: true,
          product: result.value
        });
      } catch (error) {
        console.error('❌ Erreur mise à jour MongoDB:', error.message);
        
        if (process.env.VERCEL) {
          return res.status(500).json({ error: 'Erreur mise à jour MongoDB: ' + error.message });
        }
      }
    }
    
    // Mode fichier JSON (seulement en local)
    if (process.env.VERCEL) {
      return res.status(500).json({ error: 'MongoDB non disponible' });
    }
    
    const products = await readData('products', PRODUCTS_FILE);
    const index = products.findIndex(p => p.id === productId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    products[index] = { ...products[index], ...updateData };
    await writeData('products', PRODUCTS_FILE, products);
    
    console.log('✓ Produit mis à jour dans fichier JSON');
    res.json({
      success: true,
      product: products[index]
    });
    
  } catch (error) {
    console.error('❌ Erreur mise à jour produit:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un produit (admin)
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    
    console.log('🗑️  Suppression produit:', productId);
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    // Suppression dans MongoDB
    if (USE_MONGODB && db) {
      try {
        const result = await db.collection('products').deleteOne({ id: productId });
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Produit non trouvé' });
        }
        
        console.log('✓ Produit supprimé de MongoDB');
        return res.json({ success: true });
      } catch (error) {
        console.error('❌ Erreur suppression MongoDB:', error.message);
        
        if (process.env.VERCEL) {
          return res.status(500).json({ error: 'Erreur suppression MongoDB' });
        }
      }
    }
    
    // Mode fichier JSON (seulement en local)
    if (process.env.VERCEL) {
      return res.status(500).json({ error: 'MongoDB non disponible' });
    }
    
    const products = await readData('products', PRODUCTS_FILE);
    const filteredProducts = products.filter(p => p.id !== productId);
    
    if (products.length === filteredProducts.length) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    await writeData('products', PRODUCTS_FILE, filteredProducts);
    
    console.log('✓ Produit supprimé du fichier JSON');
    res.json({ success: true });
    
  } catch (error) {
    console.error('❌ Erreur suppression produit:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROUTES COMMANDES
// ============================================================

// Récupérer toutes les commandes (admin)
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await readData('orders', ORDERS_FILE);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer une commande par ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const orders = await readData('orders', ORDERS_FILE);
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour le statut d'une commande (admin)
app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    console.log('📝 Mise à jour statut commande:', orderId, '→', status);
    
    let order = null;
    let oldStatus = null;
    
    // Mise à jour dans MongoDB ou fichier JSON
    if (USE_MONGODB && db) {
      try {
        // Récupérer l'ancien statut
        const oldOrder = await db.collection('orders').findOne({ id: orderId });
        if (oldOrder) {
          oldStatus = oldOrder.status;
        }
        
        const result = await db.collection('orders').findOneAndUpdate(
          { id: orderId },
          { 
            $set: { 
              status: status,
              updatedAt: new Date().toISOString()
            }
          },
          { returnDocument: 'after' }
        );
        
        // MongoDB 4+ retourne result directement, pas result.value
        const updatedOrder = result.value || result;
        
        if (!updatedOrder) {
          console.log('⚠️  Commande non trouvée dans MongoDB:', orderId);
          return res.status(404).json({ error: 'Commande non trouvée' });
        }
        
        order = updatedOrder;
        console.log('✓ Statut mis à jour dans MongoDB');
      } catch (error) {
        console.error('❌ Erreur mise à jour MongoDB:', error.message);
        console.error('   Stack:', error.stack);
        // Fallback vers fichier JSON
      }
    }
    
    // Mode fichier JSON (ou fallback)
    if (!order) {
      const orders = await readData('orders', ORDERS_FILE);
      const index = orders.findIndex(o => o.id === orderId);
      
      if (index === -1) {
        return res.status(404).json({ error: 'Commande non trouvée' });
      }
      
      oldStatus = orders[index].status;
      orders[index].status = status;
      orders[index].updatedAt = new Date().toISOString();
      
      await writeData('orders', ORDERS_FILE, orders);
      order = orders[index];
      
      console.log('✓ Statut mis à jour dans fichier JSON');
    }
    
    // Envoyer un email de notification au client si le statut a changé
    if (emailTransporter && oldStatus !== status && order.customer && order.customer.email) {
      try {
        console.log('📧 Envoi email de mise à jour:', {
          orderId: order.id,
          oldStatus,
          newStatus: status,
          customerEmail: order.customer.email
        });
        await sendOrderStatusUpdateEmail(order, status, oldStatus);
        console.log('✓ Email de mise à jour envoyé au client:', order.customer.email);
      } catch (emailError) {
        console.warn('⚠️  Erreur envoi email de mise à jour:', emailError.message);
        console.warn('   Stack:', emailError.stack);
        // Ne pas bloquer la réponse si l'email échoue
      }
    } else {
      console.log('ℹ️  Email non envoyé:', {
        hasTransporter: !!emailTransporter,
        statusChanged: oldStatus !== status,
        hasCustomer: !!order.customer,
        hasEmail: !!(order.customer && order.customer.email)
      });
    }
    
    console.log('✅ Réponse envoyée au client');
    res.json({
      success: true,
      order: order
    });
    
  } catch (error) {
    console.error('❌ Erreur mise à jour statut:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une commande (admin)
app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    
    console.log('🗑️ Suppression commande:', orderId);
    
    // Suppression dans MongoDB ou fichier JSON
    if (USE_MONGODB && db) {
      try {
        const result = await db.collection('orders').deleteOne({ id: orderId });
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Commande non trouvée' });
        }
        
        console.log('✓ Commande supprimée de MongoDB');
        return res.json({
          success: true,
          message: 'Commande supprimée avec succès'
        });
      } catch (error) {
        console.error('❌ Erreur suppression MongoDB:', error.message);
        // Fallback vers fichier JSON
      }
    }
    
    // Mode fichier JSON (ou fallback)
    const orders = await readData('orders', ORDERS_FILE);
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    orders.splice(index, 1);
    await writeData('orders', ORDERS_FILE, orders);
    
    console.log('✓ Commande supprimée du fichier JSON');
    res.json({
      success: true,
      message: 'Commande supprimée avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur suppression commande:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROUTES PRÉSENTATIONS PRODUITS
// ============================================================

// Récupérer une présentation (clubs ou particuliers)
app.get('/api/presentations/:type', async (req, res) => {
  try {
    const type = req.params.type; // 'clubs' ou 'particuliers'
    
    if (type !== 'clubs' && type !== 'particuliers') {
      return res.status(400).json({ error: 'Type invalide' });
    }
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    if (USE_MONGODB && db) {
      try {
        const presentation = await db.collection('presentations').findOne({ _id: type });
        if (presentation) {
          delete presentation._id;
          return res.json(presentation);
        }
      } catch (error) {
        console.error('Erreur lecture présentation MongoDB:', error.message);
      }
    }
    
    // Valeurs par défaut
    const defaultPresentations = {
      clubs: {
        title: 'Flocage Amovible pour Clubs',
        description: 'Découvrez notre solution de flocage amovible spécialement conçue pour les clubs sportifs. Personnalisez vos maillots avec facilité et professionnalisme.',
        mediaType: 'image',
        mediaUrl: '1.jpg'
      },
      particuliers: {
        title: 'Flocage Personnalisé pour Particuliers',
        description: 'Créez votre flocage sur-mesure en quelques clics. Choisissez votre taille, vos couleurs et personnalisez votre maillot comme vous le souhaitez.',
        mediaType: 'image',
        mediaUrl: '2.jpg'
      }
    };
    
    res.json(defaultPresentations[type]);
    
  } catch (error) {
    console.error('Erreur récupération présentation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une présentation (admin)
app.put('/api/presentations/:type', authenticateToken, async (req, res) => {
  try {
    const type = req.params.type;
    const { title, description, mediaType, mediaUrl } = req.body;
    
    if (type !== 'clubs' && type !== 'particuliers') {
      return res.status(400).json({ error: 'Type invalide' });
    }
    
    const presentationData = {
      title,
      description,
      mediaType,
      mediaUrl,
      updatedAt: new Date()
    };
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    if (USE_MONGODB && db) {
      try {
        await db.collection('presentations').updateOne(
          { _id: type },
          { $set: presentationData },
          { upsert: true }
        );
        
        console.log('✓ Présentation mise à jour dans MongoDB');
        return res.json({
          success: true,
          presentation: presentationData
        });
      } catch (error) {
        console.error('Erreur mise à jour présentation MongoDB:', error.message);
        
        if (process.env.VERCEL) {
          return res.status(500).json({ error: 'Erreur mise à jour MongoDB' });
        }
      }
    }
    
    // Sur Vercel sans MongoDB
    if (process.env.VERCEL) {
      return res.status(500).json({ error: 'MongoDB non disponible' });
    }
    
    res.json({
      success: true,
      presentation: presentationData
    });
    
  } catch (error) {
    console.error('Erreur mise à jour présentation:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROUTES PARAMÈTRES
// ============================================================

// Récupérer les paramètres
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sauvegarder les paramètres (admin)
app.post('/api/settings', authenticateToken, async (req, res) => {
  try {
    const settings = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await saveSettings(settings);
    
    res.json({
      success: true,
      settings: settings
    });
    
  } catch (error) {
    console.error('Erreur sauvegarde paramètres:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROUTES NEWSLETTER
// ============================================================

// Inscription à la newsletter
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    
    console.log('📧 Inscription newsletter:', email);
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    // Enregistrer dans MongoDB
    if (USE_MONGODB && db) {
      try {
        // Vérifier si l'email existe déjà
        const existing = await db.collection('newsletter').findOne({ email: email.toLowerCase() });
        
        if (existing) {
          if (existing.unsubscribed) {
            // Réabonner
            await db.collection('newsletter').updateOne(
              { email: email.toLowerCase() },
              { 
                $set: { 
                  unsubscribed: false,
                  resubscribedAt: new Date(),
                  updatedAt: new Date()
                }
              }
            );
            console.log('✓ Email réabonné à la newsletter');
            return res.json({ 
              success: true, 
              message: 'Vous êtes de nouveau inscrit à notre newsletter !' 
            });
          } else {
            return res.status(400).json({ error: 'Cet email est déjà inscrit' });
          }
        }
        
        // Créer un nouvel abonné
        const subscriber = {
          email: email.toLowerCase(),
          name: name || '',
          subscribedAt: new Date(),
          unsubscribed: false,
          source: 'website',
          updatedAt: new Date()
        };
        
        await db.collection('newsletter').insertOne(subscriber);
        
        console.log('✓ Email ajouté à la newsletter');
        
        // Envoyer un email de bienvenue si configuré
        if (emailTransporter) {
          try {
            await emailTransporter.sendMail({
              from: process.env.EMAIL_FROM || 'team@backzo.eu',
              to: email,
              subject: '✅ Bienvenue dans la newsletter BackZo !',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
                  <div style="background: #000; color: #b8ff57; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">BACK<span style="color: #fff;">ZO</span></h1>
                    <p style="margin: 10px 0 0; font-size: 14px; color: #999;">Newsletter</p>
                  </div>
                  
                  <div style="background: #fff; padding: 30px; margin-top: 20px; border-radius: 8px;">
                    <h2 style="color: #000; margin-top: 0;">Bienvenue ${name || 'cher abonné'} !</h2>
                    <p style="color: #333; line-height: 1.6;">Merci de vous être inscrit à notre newsletter. Vous recevrez désormais nos dernières actualités, offres exclusives et nouveautés en avant-première.</p>
                    
                    <div style="background: #e6ffe6; border-left: 4px solid #00cc00; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #006600; font-weight: bold;">
                        🎉 Votre inscription est confirmée !
                      </p>
                    </div>
                    
                    <p style="color: #333; line-height: 1.6; margin-top: 20px;">
                      À très bientôt,<br/>
                      <strong>L'équipe BackZo</strong>
                    </p>
                  </div>
                  
                  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                    <p style="margin: 0;">BackZo — Your Name Your Story</p>
                    <p style="margin: 5px 0 0;">www.backzo.eu</p>
                  </div>
                </div>
              `
            });
            console.log('✓ Email de bienvenue envoyé');
          } catch (emailError) {
            console.warn('⚠️  Erreur envoi email de bienvenue:', emailError.message);
          }
        }
        
        return res.json({ 
          success: true, 
          message: 'Merci ! Vous êtes maintenant inscrit à notre newsletter.' 
        });
        
      } catch (error) {
        console.error('❌ Erreur MongoDB newsletter:', error.message);
        
        if (process.env.VERCEL) {
          return res.status(500).json({ error: 'Erreur lors de l\'inscription' });
        }
      }
    }
    
    // Sur Vercel sans MongoDB
    if (process.env.VERCEL) {
      return res.status(500).json({ error: 'Service newsletter non disponible' });
    }
    
    // Mode local sans MongoDB
    res.json({ 
      success: true, 
      message: 'Inscription enregistrée (mode local)' 
    });
    
  } catch (error) {
    console.error('❌ Erreur inscription newsletter:', error.message);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// Désinscription de la newsletter
app.post('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }
    
    console.log('📧 Désinscription newsletter:', email);
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    if (USE_MONGODB && db) {
      try {
        const result = await db.collection('newsletter').updateOne(
          { email: email.toLowerCase() },
          { 
            $set: { 
              unsubscribed: true,
              unsubscribedAt: new Date(),
              updatedAt: new Date()
            }
          }
        );
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Email non trouvé' });
        }
        
        console.log('✓ Email désinscrit de la newsletter');
        return res.json({ 
          success: true, 
          message: 'Vous avez été désinscrit de notre newsletter.' 
        });
        
      } catch (error) {
        console.error('❌ Erreur MongoDB désinscription:', error.message);
        
        if (process.env.VERCEL) {
          return res.status(500).json({ error: 'Erreur lors de la désinscription' });
        }
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Désinscription enregistrée' 
    });
    
  } catch (error) {
    console.error('❌ Erreur désinscription newsletter:', error.message);
    res.status(500).json({ error: 'Erreur lors de la désinscription' });
  }
});

// Récupérer tous les abonnés (admin)
app.get('/api/newsletter/subscribers', authenticateToken, async (req, res) => {
  try {
    console.log('📧 Récupération des abonnés newsletter');
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    if (USE_MONGODB && db) {
      try {
        const subscribers = await db.collection('newsletter')
          .find({ unsubscribed: { $ne: true } })
          .sort({ subscribedAt: -1 })
          .toArray();
        
        console.log(`✓ ${subscribers.length} abonnés trouvés`);
        return res.json(subscribers);
        
      } catch (error) {
        console.error('❌ Erreur MongoDB récupération abonnés:', error.message);
        
        if (process.env.VERCEL) {
          return res.status(500).json({ error: 'Erreur lors de la récupération' });
        }
      }
    }
    
    // Mode local sans MongoDB
    res.json([]);
    
  } catch (error) {
    console.error('❌ Erreur récupération abonnés:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

// Envoyer un email groupé (admin)
app.post('/api/newsletter/send', authenticateToken, async (req, res) => {
  try {
    const { subject, message, htmlMessage } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ error: 'Sujet et message requis' });
    }
    
    if (!emailTransporter) {
      return res.status(500).json({ error: 'Service email non configuré' });
    }
    
    console.log('📧 Envoi newsletter groupé:', subject);
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    if (USE_MONGODB && db) {
      try {
        // Récupérer tous les abonnés actifs
        const subscribers = await db.collection('newsletter')
          .find({ unsubscribed: { $ne: true } })
          .toArray();
        
        if (subscribers.length === 0) {
          return res.status(400).json({ error: 'Aucun abonné trouvé' });
        }
        
        console.log(`📧 Envoi à ${subscribers.length} abonnés...`);
        
        // Préparer le HTML du message
        const emailHtml = htmlMessage || `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
            <div style="background: #000; color: #b8ff57; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">BACK<span style="color: #fff;">ZO</span></h1>
              <p style="margin: 10px 0 0; font-size: 14px; color: #999;">Newsletter</p>
            </div>
            
            <div style="background: #fff; padding: 30px; margin-top: 20px; border-radius: 8px;">
              <h2 style="color: #000; margin-top: 0;">${subject}</h2>
              <div style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</div>
              
              <p style="color: #333; line-height: 1.6; margin-top: 30px;">
                Cordialement,<br/>
                <strong>L'équipe BackZo</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p style="margin: 0;">BackZo — Your Name Your Story</p>
              <p style="margin: 5px 0 0;">www.backzo.eu</p>
              <p style="margin: 10px 0 0;">
                <a href="https://backzo.eu/unsubscribe.html?email={{EMAIL}}" style="color: #999; text-decoration: underline;">Se désinscrire</a>
              </p>
            </div>
          </div>
        `;
        
        // Envoyer les emails (en batch pour éviter de surcharger)
        let sent = 0;
        let failed = 0;
        
        for (const subscriber of subscribers) {
          try {
            const personalizedHtml = emailHtml.replace('{{EMAIL}}', encodeURIComponent(subscriber.email));
            
            await emailTransporter.sendMail({
              from: process.env.EMAIL_FROM || 'team@backzo.eu',
              to: subscriber.email,
              subject: subject,
              html: personalizedHtml
            });
            
            sent++;
            
            // Petit délai pour éviter de surcharger le serveur SMTP
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (emailError) {
            console.error(`❌ Erreur envoi à ${subscriber.email}:`, emailError.message);
            failed++;
          }
        }
        
        console.log(`✓ Newsletter envoyée: ${sent} réussis, ${failed} échecs`);
        
        return res.json({ 
          success: true, 
          message: `Newsletter envoyée à ${sent} abonnés`,
          sent: sent,
          failed: failed,
          total: subscribers.length
        });
        
      } catch (error) {
        console.error('❌ Erreur envoi newsletter:', error.message);
        
        if (process.env.VERCEL) {
          return res.status(500).json({ error: 'Erreur lors de l\'envoi' });
        }
      }
    }
    
    res.status(500).json({ error: 'Service newsletter non disponible' });
    
  } catch (error) {
    console.error('❌ Erreur envoi newsletter:', error.message);
    res.status(500).json({ error: 'Erreur lors de l\'envoi' });
  }
});

// Supprimer un abonné (admin)
app.delete('/api/newsletter/subscribers/:email', authenticateToken, async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    
    console.log('🗑️ Suppression abonné:', email);
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    if (USE_MONGODB && db) {
      try {
        const result = await db.collection('newsletter').deleteOne({ 
          email: email.toLowerCase() 
        });
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Abonné non trouvé' });
        }
        
        console.log('✓ Abonné supprimé');
        return res.json({ 
          success: true, 
          message: 'Abonné supprimé avec succès' 
        });
        
      } catch (error) {
        console.error('❌ Erreur MongoDB suppression:', error.message);
        
        if (process.env.VERCEL) {
          return res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Abonné supprimé' 
    });
    
  } catch (error) {
    console.error('❌ Erreur suppression abonné:', error.message);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// ============================================================
// ROUTES AVIS CLIENTS
// ============================================================

// Récupérer tous les avis (publics approuvés)
app.get('/api/reviews', async (req, res) => {
  try {
    console.log('📝 Récupération des avis publics');
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    if (USE_MONGODB && db) {
      try {
        const reviews = await db.collection('reviews')
          .find({ approved: true })
          .sort({ createdAt: -1 })
          .toArray();
        
        console.log(`✓ ${reviews.length} avis trouvés`);
        return res.json(reviews);
        
      } catch (error) {
        console.error('❌ Erreur MongoDB récupération avis:', error.message);
        
        if (process.env.VERCEL) {
          return res.json([]);
        }
      }
    }
    
    // Mode fichier JSON
    if (process.env.VERCEL) {
      return res.json([]);
    }
    
    try {
      const data = await fs.readFile(REVIEWS_FILE, 'utf8');
      const reviews = JSON.parse(data);
      const approvedReviews = reviews.filter(r => r.approved === true);
      return res.json(approvedReviews);
    } catch (error) {
      console.error('Erreur lecture fichier avis:', error.message);
      return res.json([]);
    }
    
  } catch (error) {
    console.error('❌ Erreur récupération avis:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des avis' });
  }
});

// Récupérer tous les avis (admin - incluant non approuvés)
app.get('/api/admin/reviews', authenticateToken, async (req, res) => {
  try {
    console.log('📝 Récupération de tous les avis (admin)');
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    if (USE_MONGODB && db) {
      try {
        const reviews = await db.collection('reviews')
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        
        console.log(`✓ ${reviews.length} avis trouvés`);
        return res.json(reviews);
        
      } catch (error) {
        console.error('❌ Erreur MongoDB récupération avis:', error.message);
        
        if (process.env.VERCEL) {
          return res.json([]);
        }
      }
    }
    
    // Mode fichier JSON
    if (process.env.VERCEL) {
      return res.json([]);
    }
    
    try {
      const data = await fs.readFile(REVIEWS_FILE, 'utf8');
      const reviews = JSON.parse(data);
      return res.json(reviews);
    } catch (error) {
      console.error('Erreur lecture fichier avis:', error.message);
      return res.json([]);
    }
    
  } catch (error) {
    console.error('❌ Erreur récupération avis:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des avis' });
  }
});

// Soumettre un nouvel avis
app.post('/api/reviews', async (req, res) => {
  try {
    const { orderId, email, rating, comment, customerName } = req.body;
    
    // Validation
    if (!orderId || !email || !rating) {
      return res.status(400).json({ error: 'Données manquantes' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Note invalide (1-5)' });
    }
    
    console.log('📝 Soumission nouvel avis:', { orderId, email, rating });
    
    // Vérifier que la commande existe et appartient à cet email
    let order = null;
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    if (USE_MONGODB && db) {
      try {
        order = await db.collection('orders').findOne({ 
          id: orderId,
          'customer.email': email
        });
      } catch (error) {
        console.error('❌ Erreur MongoDB recherche commande:', error.message);
      }
    } else if (!process.env.VERCEL) {
      // Mode fichier JSON
      try {
        const ordersData = await fs.readFile(ORDERS_FILE, 'utf8');
        const orders = JSON.parse(ordersData);
        order = orders.find(o => o.id === orderId && o.customer.email === email);
      } catch (error) {
        console.error('Erreur lecture fichier commandes:', error.message);
      }
    }
    
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée ou email incorrect' });
    }
    
    // Vérifier si un avis existe déjà pour cette commande
    let existingReview = null;
    
    if (USE_MONGODB && db) {
      try {
        existingReview = await db.collection('reviews').findOne({ orderId: orderId });
      } catch (error) {
        console.error('❌ Erreur MongoDB recherche avis existant:', error.message);
      }
    } else if (!process.env.VERCEL) {
      try {
        const reviewsData = await fs.readFile(REVIEWS_FILE, 'utf8');
        const reviews = JSON.parse(reviewsData);
        existingReview = reviews.find(r => r.orderId === orderId);
      } catch (error) {
        console.error('Erreur lecture fichier avis:', error.message);
      }
    }
    
    if (existingReview) {
      return res.status(400).json({ error: 'Un avis a déjà été soumis pour cette commande' });
    }
    
    // Créer le nouvel avis
    const review = {
      id: 'REV-' + Date.now(),
      orderId: orderId,
      customerName: customerName || order.customer.firstName + ' ' + order.customer.lastName.charAt(0) + '.',
      customerEmail: email,
      rating: parseInt(rating),
      comment: comment || '',
      approved: false, // Par défaut, les avis doivent être approuvés
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Sauvegarder l'avis
    if (USE_MONGODB && db) {
      try {
        await db.collection('reviews').insertOne(review);
        console.log('✓ Avis sauvegardé dans MongoDB');
      } catch (error) {
        console.error('❌ Erreur MongoDB sauvegarde avis:', error.message);
        
        if (process.env.VERCEL) {
          return res.status(500).json({ error: 'Erreur lors de la sauvegarde de l\'avis' });
        }
      }
    }
    
    if (!USE_MONGODB || !db) {
      if (process.env.VERCEL) {
        return res.status(500).json({ error: 'Service non disponible' });
      }
      
      // Mode fichier JSON
      try {
        const reviewsData = await fs.readFile(REVIEWS_FILE, 'utf8');
        const reviews = JSON.parse(reviewsData);
        reviews.push(review);
        await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
        console.log('✓ Avis sauvegardé dans fichier JSON');
      } catch (error) {
        console.error('Erreur sauvegarde fichier avis:', error.message);
        return res.status(500).json({ error: 'Erreur lors de la sauvegarde de l\'avis' });
      }
    }
    
    // Envoyer une notification à l'admin
    if (emailTransporter) {
      try {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_FROM || 'team@backzo.eu',
          to: process.env.EMAIL_TO || 'team@backzo.eu',
          subject: `⭐ Nouvel avis client - ${rating}/5 étoiles`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
              <div style="background: #000; color: #b8ff57; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">BACK<span style="color: #fff;">ZO</span></h1>
                <p style="margin: 10px 0 0; font-size: 14px; color: #999;">Nouvel avis client</p>
              </div>
              
              <div style="background: #fff; padding: 30px; margin-top: 20px; border-radius: 8px;">
                <h2 style="color: #000; margin-top: 0;">⭐ Nouvel avis reçu</h2>
                
                <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #b8ff57;">
                  <p style="margin: 0 0 10px;"><strong>Client :</strong> ${review.customerName}</p>
                  <p style="margin: 0 0 10px;"><strong>Commande :</strong> ${orderId}</p>
                  <p style="margin: 0 0 10px;"><strong>Note :</strong> ${'⭐'.repeat(rating)} (${rating}/5)</p>
                  ${comment ? `<p style="margin: 15px 0 0;"><strong>Commentaire :</strong><br/>${comment}</p>` : ''}
                </div>
                
                <div style="background: #fff9e6; padding: 15px; margin: 20px 0; border-left: 4px solid #ffcc00;">
                  <p style="margin: 0; color: #666; font-size: 14px;">
                    ⚡ <strong>Action requise :</strong> Connectez-vous au panel admin pour approuver ou rejeter cet avis.
                  </p>
                </div>
              </div>
            </div>
          `
        });
        console.log('✓ Notification admin envoyée');
      } catch (emailError) {
        console.warn('⚠️  Erreur envoi notification admin:', emailError.message);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Merci pour votre avis ! Il sera publié après validation.',
      review: review
    });
    
  } catch (error) {
    console.error('❌ Erreur soumission avis:', error.message);
    res.status(500).json({ error: 'Erreur lors de la soumission de l\'avis' });
  }
});

// Approuver un avis (admin)
app.put('/api/admin/reviews/:id/approve', authenticateToken, async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    console.log('✅ Approbation avis:', reviewId);
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    if (USE_MONGODB && db) {
      try {
        const result = await db.collection('reviews').updateOne(
          { id: reviewId },
          { 
            $set: { 
              approved: true,
              updatedAt: new Date()
            }
          }
        );
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Avis non trouvé' });
        }
        
        console.log('✓ Avis approuvé dans MongoDB');
        return res.json({ success: true, message: 'Avis approuvé avec succès' });
        
      } catch (error) {
        console.error('❌ Erreur MongoDB approbation avis:', error.message);
        
        if (process.env.VERCEL) {
          return res.status(500).json({ error: 'Erreur lors de l\'approbation' });
        }
      }
    }
    
    // Mode fichier JSON
    if (process.env.VERCEL) {
      return res.status(500).json({ error: 'Service non disponible' });
    }
    
    try {
      const reviewsData = await fs.readFile(REVIEWS_FILE, 'utf8');
      const reviews = JSON.parse(reviewsData);
      const review = reviews.find(r => r.id === reviewId);
      
      if (!review) {
        return res.status(404).json({ error: 'Avis non trouvé' });
      }
      
      review.approved = true;
      review.updatedAt = new Date();
      
      await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
      console.log('✓ Avis approuvé dans fichier JSON');
      
      return res.json({ success: true, message: 'Avis approuvé avec succès' });
      
    } catch (error) {
      console.error('Erreur approbation fichier avis:', error.message);
      return res.status(500).json({ error: 'Erreur lors de l\'approbation' });
    }
    
  } catch (error) {
    console.error('❌ Erreur approbation avis:', error.message);
    res.status(500).json({ error: 'Erreur lors de l\'approbation' });
  }
});

// Rejeter/supprimer un avis (admin)
app.delete('/api/admin/reviews/:id', authenticateToken, async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    console.log('🗑️ Suppression avis:', reviewId);
    
    // Essayer de se connecter à MongoDB si pas encore fait
    if (USE_MONGODB && !db) {
      await connectMongoDB();
    }
    
    if (USE_MONGODB && db) {
      try {
        const result = await db.collection('reviews').deleteOne({ id: reviewId });
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Avis non trouvé' });
        }
        
        console.log('✓ Avis supprimé de MongoDB');
        return res.json({ success: true, message: 'Avis supprimé avec succès' });
        
      } catch (error) {
        console.error('❌ Erreur MongoDB suppression avis:', error.message);
        
        if (process.env.VERCEL) {
          return res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
      }
    }
    
    // Mode fichier JSON
    if (process.env.VERCEL) {
      return res.status(500).json({ error: 'Service non disponible' });
    }
    
    try {
      const reviewsData = await fs.readFile(REVIEWS_FILE, 'utf8');
      const reviews = JSON.parse(reviewsData);
      const index = reviews.findIndex(r => r.id === reviewId);
      
      if (index === -1) {
        return res.status(404).json({ error: 'Avis non trouvé' });
      }
      
      reviews.splice(index, 1);
      await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
      console.log('✓ Avis supprimé du fichier JSON');
      
      return res.json({ success: true, message: 'Avis supprimé avec succès' });
      
    } catch (error) {
      console.error('Erreur suppression fichier avis:', error.message);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    
  } catch (error) {
    console.error('❌ Erreur suppression avis:', error.message);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Récupérer les paramètres des avis (admin)
app.get('/api/admin/reviews/settings', authenticateToken, async (req, res) => {
  try {
    const settings = await getSettings();
    
    const reviewSettings = {
      autoApprove: settings.reviewAutoApprove || false,
      requireOrder: settings.reviewRequireOrder !== false, // true par défaut
      minRating: settings.reviewMinRating || 1,
      maxReviews: settings.reviewMaxReviews || 50,
      showOnHomepage: settings.reviewShowOnHomepage !== false // true par défaut
    };
    
    res.json(reviewSettings);
    
  } catch (error) {
    console.error('❌ Erreur récupération paramètres avis:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des paramètres' });
  }
});

// Mettre à jour les paramètres des avis (admin)
app.put('/api/admin/reviews/settings', authenticateToken, async (req, res) => {
  try {
    const { autoApprove, requireOrder, minRating, maxReviews, showOnHomepage } = req.body;
    
    const settings = await getSettings();
    
    settings.reviewAutoApprove = autoApprove;
    settings.reviewRequireOrder = requireOrder;
    settings.reviewMinRating = minRating;
    settings.reviewMaxReviews = maxReviews;
    settings.reviewShowOnHomepage = showOnHomepage;
    settings.updatedAt = new Date().toISOString();
    
    await saveSettings(settings);
    
    console.log('✓ Paramètres avis mis à jour');
    
    res.json({ 
      success: true, 
      message: 'Paramètres mis à jour avec succès',
      settings: {
        autoApprove,
        requireOrder,
        minRating,
        maxReviews,
        showOnHomepage
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur mise à jour paramètres avis:', error.message);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des paramètres' });
  }
});

// ============================================================
// ROUTES UTILITAIRES
// ============================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    stripe: !!process.env.STRIPE_SECRET_KEY,
    database: USE_MONGODB ? 'MongoDB' : 'JSON Files',
    mongoConnected: !!db
  });
});

// Initialiser la base de données manuellement
app.post('/api/init-db', async (req, res) => {
  try {
    console.log('🔄 Initialisation manuelle de la base de données...');
    await initDB();
    
    res.json({
      success: true,
      message: 'Base de données initialisée',
      mongoConnected: !!db
    });
  } catch (error) {
    console.error('❌ Erreur initialisation DB:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Stats pour le dashboard
app.get('/api/stats', async (req, res) => {
  try {
    const orders = await readData('orders', ORDERS_FILE);
    const products = await readData('products', PRODUCTS_FILE);
    
    const revenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    
    const stats = {
      totalOrders: orders.length,
      totalRevenue: revenue,
      totalProducts: products.length,
      activeProducts: products.filter(p => p.active).length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      processingOrders: orders.filter(o => o.status === 'processing').length
    };
    
    res.json(stats);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// DÉMARRAGE DU SERVEUR
// ============================================================

// Initialiser la base de données
initDB().then(() => {
  console.log('✓ Base de données initialisée');
}).catch(error => {
  console.error('❌ Erreur initialisation DB:', error.message);
});

// Démarrer le serveur seulement en mode local (pas sur Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 BackZo Backend démarré !');
    console.log('');
    console.log(`📍 Serveur : http://localhost:${PORT}`);
    console.log(`💳 Stripe : ${process.env.STRIPE_SECRET_KEY ? '✓ Configuré' : '✗ Non configuré'}`);
    console.log(`💾 Base de données : ${USE_MONGODB ? '✓ MongoDB' : 'ℹ️  Fichiers JSON'}`);
    console.log('');
    console.log('📚 Endpoints disponibles :');
    console.log('   POST /api/create-payment-intent');
    console.log('   POST /api/confirm-payment');
    console.log('   GET  /api/products');
    console.log('   POST /api/products');
    console.log('   GET  /api/orders');
    console.log('   GET  /api/settings');
    console.log('   POST /api/settings');
    console.log('   GET  /api/stats');
    console.log('');
  });
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('Erreur non gérée:', error);
});

// Export pour Vercel Serverless
module.exports = app;

// Fermer la connexion MongoDB proprement
process.on('SIGINT', async () => {
  if (mongoClient) {
    await mongoClient.close();
    console.log('\n✓ MongoDB déconnecté');
  }
  process.exit(0);
});
