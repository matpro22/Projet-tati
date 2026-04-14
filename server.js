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

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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
    `<li>${item.name} (${item.size}) - ${item.quantity}x - ${item.price}€</li>`
  ).join('');
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'team@backzo.eu',
    to: order.customer.email,
    subject: `Confirmation de commande ${order.id} - BackZo`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5016;">Merci pour votre commande !</h2>
        <p>Bonjour ${order.customer.firstName} ${order.customer.lastName},</p>
        <p>Votre commande a été confirmée et payée avec succès.</p>
        
        <div style="background: #f5f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Détails de la commande</h3>
          <p><strong>Numéro de commande :</strong> ${order.id}</p>
          <p><strong>Date :</strong> ${new Date(order.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Statut :</strong> En cours de traitement</p>
        </div>
        
        <h3>Articles commandés</h3>
        <ul style="list-style: none; padding: 0;">
          ${itemsList}
        </ul>
        
        <div style="background: #f5f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Sous-total :</strong> ${(order.total - order.shipping).toFixed(2)}€</p>
          <p style="margin: 5px 0;"><strong>Livraison :</strong> ${order.shipping.toFixed(2)}€</p>
          <p style="margin: 5px 0; font-size: 1.2em;"><strong>Total :</strong> ${order.total.toFixed(2)}€</p>
        </div>
        
        <h3>Adresse de livraison</h3>
        <p>
          ${order.customer.firstName} ${order.customer.lastName}<br>
          ${order.customer.address}<br>
          ${order.customer.zip} ${order.customer.city}
        </p>
        
        <p style="margin-top: 30px;">Vous recevrez un email de suivi dès que votre commande sera expédiée.</p>
        
        <p style="color: #888; font-size: 0.9em; margin-top: 40px;">
          Si vous avez des questions, contactez-nous à ${process.env.EMAIL_FROM || 'team@backzo.eu'}
        </p>
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
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' 
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
app.post('/api/products', async (req, res) => {
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
app.put('/api/products/:id', async (req, res) => {
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
app.delete('/api/products/:id', async (req, res) => {
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
app.get('/api/orders', async (req, res) => {
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
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    console.log('📝 Mise à jour statut commande:', orderId, '→', status);
    
    // Mise à jour dans MongoDB ou fichier JSON
    if (USE_MONGODB && db) {
      try {
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
        
        if (!result.value) {
          return res.status(404).json({ error: 'Commande non trouvée' });
        }
        
        console.log('✓ Statut mis à jour dans MongoDB');
        return res.json({
          success: true,
          order: result.value
        });
      } catch (error) {
        console.error('❌ Erreur mise à jour MongoDB:', error.message);
        // Fallback vers fichier JSON
      }
    }
    
    // Mode fichier JSON (ou fallback)
    const orders = await readData('orders', ORDERS_FILE);
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    
    await writeData('orders', ORDERS_FILE, orders);
    
    console.log('✓ Statut mis à jour dans fichier JSON');
    res.json({
      success: true,
      order: orders[index]
    });
    
  } catch (error) {
    console.error('❌ Erreur mise à jour statut:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une commande (admin)
app.delete('/api/orders/:id', async (req, res) => {
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
app.post('/api/settings', async (req, res) => {
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
