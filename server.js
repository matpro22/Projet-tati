// ============================================================
// BACKZO BACKEND - Node.js + Express + Stripe
// ============================================================

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Base de données simple (fichiers JSON)
const DB_PATH = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DB_PATH, 'orders.json');
const PRODUCTS_FILE = path.join(DB_PATH, 'products.json');

// Créer le dossier data s'il n'existe pas
async function initDB() {
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
          price: 12,
          category: 'particuliers',
          desc: 'Patch 25×6 cm. Idéal pour maillots individuels.',
          stock: 100,
          active: true
        },
        {
          id: 'patch-l',
          name: 'Flocage Amovible — Taille L',
          price: 14,
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
    
    console.log('✓ Base de données initialisée');
  } catch (error) {
    console.error('Erreur initialisation DB:', error);
  }
}

// Fonctions helper pour lire/écrire les données
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lecture fichier:', error);
    return [];
  }
}

async function writeJSON(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur écriture fichier:', error);
    return false;
  }
}

// ============================================================
// ROUTES STRIPE - PAIEMENTS
// ============================================================

// Créer un PaymentIntent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;
    
    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant invalide' });
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
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
    
  } catch (error) {
    console.error('Erreur création PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirmer un paiement et créer la commande
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, orderData } = req.body;
    
    // Récupérer le PaymentIntent pour vérifier son statut
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
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
    
    // Sauvegarder la commande
    const orders = await readJSON(ORDERS_FILE);
    orders.push(order);
    await writeJSON(ORDERS_FILE, orders);
    
    // Envoyer un email de confirmation (optionnel - nécessite un service d'email)
    // await sendOrderConfirmationEmail(order);
    
    res.json({
      success: true,
      order: order
    });
    
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({ error: error.message });
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
    const products = await readJSON(PRODUCTS_FILE);
    const activeProducts = products.filter(p => p.active !== false);
    res.json(activeProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer un produit par ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const products = await readJSON(PRODUCTS_FILE);
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
    
    const products = await readJSON(PRODUCTS_FILE);
    
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
    await writeJSON(PRODUCTS_FILE, products);
    
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
    const products = await readJSON(PRODUCTS_FILE);
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Mettre à jour le produit
    products[index] = {
      ...products[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await writeJSON(PRODUCTS_FILE, products);
    
    res.json({
      success: true,
      product: products[index]
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un produit (admin)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const products = await readJSON(PRODUCTS_FILE);
    const filteredProducts = products.filter(p => p.id !== req.params.id);
    
    if (products.length === filteredProducts.length) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    await writeJSON(PRODUCTS_FILE, filteredProducts);
    
    res.json({ success: true });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROUTES COMMANDES
// ============================================================

// Récupérer toutes les commandes (admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await readJSON(ORDERS_FILE);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer une commande par ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const orders = await readJSON(ORDERS_FILE);
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
    const orders = await readJSON(ORDERS_FILE);
    const index = orders.findIndex(o => o.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    
    await writeJSON(ORDERS_FILE, orders);
    
    res.json({
      success: true,
      order: orders[index]
    });
    
  } catch (error) {
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
    stripe: !!process.env.STRIPE_SECRET_KEY
  });
});

// Stats pour le dashboard
app.get('/api/stats', async (req, res) => {
  try {
    const orders = await readJSON(ORDERS_FILE);
    const products = await readJSON(PRODUCTS_FILE);
    
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

initDB().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 BackZo Backend démarré !');
    console.log('');
    console.log(`📍 Serveur : http://localhost:${PORT}`);
    console.log(`💳 Stripe : ${process.env.STRIPE_SECRET_KEY ? '✓ Configuré' : '✗ Non configuré'}`);
    console.log('');
    console.log('📚 Endpoints disponibles :');
    console.log('   POST /api/create-payment-intent');
    console.log('   POST /api/confirm-payment');
    console.log('   GET  /api/products');
    console.log('   POST /api/products');
    console.log('   GET  /api/orders');
    console.log('   GET  /api/stats');
    console.log('');
  });
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('Erreur non gérée:', error);
});
