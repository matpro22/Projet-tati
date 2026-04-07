# 🚀 BackZo Backend - Guide d'installation

Backend Node.js + Express pour gérer les paiements Stripe et les produits.

## 📋 Prérequis

- Node.js 16+ installé ([nodejs.org](https://nodejs.org))
- Un compte Stripe ([stripe.com](https://stripe.com))
- Votre clé secrète Stripe

## 🔧 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine :

```bash
cp .env.example .env
```

Éditez `.env` et ajoutez votre clé secrète Stripe :

```env
PORT=3000
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE
FRONTEND_URL=http://localhost:8080
```

⚠️ **Important** : Utilisez la clé **secrète** (`sk_test_...` ou `sk_live_...`), PAS la clé publique !

### 3. Démarrer le serveur

**Mode développement** (redémarre automatiquement) :
```bash
npm run dev
```

**Mode production** :
```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 🔌 Connecter le frontend

Dans votre fichier HTML, mettez à jour l'URL de l'API :

```javascript
// Remplacez cette ligne dans le code
const API_URL = 'http://localhost:3000/api';
```

## 📡 Endpoints disponibles

### Paiements

- `POST /api/create-payment-intent` - Créer un PaymentIntent
- `POST /api/confirm-payment` - Confirmer un paiement et créer la commande
- `POST /api/webhook` - Webhook Stripe

### Produits

- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Ajouter un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Commandes

- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détails d'une commande
- `PATCH /api/orders/:id/status` - Mettre à jour le statut

### Utilitaires

- `GET /api/health` - Vérifier l'état du serveur
- `GET /api/stats` - Statistiques du dashboard

## 🧪 Tester les paiements

Utilisez les cartes de test Stripe :

- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0027 6000 3184`

Date : N'importe quelle date future
CVV : N'importe quel 3 chiffres

## 📁 Structure des données

Les données sont stockées dans le dossier `data/` :

- `data/orders.json` - Commandes
- `data/products.json` - Produits

## 🔒 Sécurité

✅ **À faire** :
- Ajouter une authentification pour les routes admin
- Valider toutes les entrées utilisateur
- Utiliser HTTPS en production
- Configurer les webhooks Stripe
- Limiter les requêtes (rate limiting)

❌ **À ne JAMAIS faire** :
- Exposer votre clé secrète Stripe
- Commiter le fichier `.env`
- Faire confiance aux données du frontend

## 🚀 Déploiement

### Heroku

```bash
heroku create backzo-api
heroku config:set STRIPE_SECRET_KEY=sk_live_...
git push heroku main
```

### Vercel

```bash
vercel
```

### Railway

```bash
railway up
```

N'oubliez pas de configurer les variables d'environnement !

## 📚 Documentation

- [Stripe API](https://stripe.com/docs/api)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/docs/)

## 🐛 Dépannage

**Le serveur ne démarre pas**
- Vérifiez que Node.js est installé : `node --version`
- Vérifiez que les dépendances sont installées : `npm install`

**Erreur Stripe**
- Vérifiez que votre clé secrète est correcte dans `.env`
- Vérifiez que vous utilisez `sk_test_...` et non `pk_test_...`

**CORS Error**
- Vérifiez que `FRONTEND_URL` est correct dans `.env`
- Le frontend doit faire des requêtes vers `http://localhost:3000`

## 💡 Améliorations possibles

- [ ] Ajouter une base de données (PostgreSQL, MongoDB)
- [ ] Implémenter l'authentification JWT
- [ ] Ajouter l'envoi d'emails (SendGrid, Mailgun)
- [ ] Gérer les uploads d'images (Cloudinary, S3)
- [ ] Ajouter des tests unitaires
- [ ] Implémenter un système de logs
- [ ] Ajouter la gestion des stocks en temps réel

## 📞 Support

Pour toute question, consultez la documentation Stripe ou ouvrez une issue.
