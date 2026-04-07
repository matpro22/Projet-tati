# 🚀 Guide d'utilisation du Backend BackZo

Ce guide explique comment activer et utiliser le backend Node.js pour gérer les paiements Stripe et les produits.

## 📋 Qu'est-ce que le backend ?

Le backend est un serveur Node.js + Express qui permet de :
- **Traiter les paiements Stripe** de manière sécurisée (charges réelles)
- **Gérer les produits** (ajouter, modifier, supprimer depuis l'admin)
- **Stocker les commandes** dans des fichiers JSON
- **Gérer les stocks** en temps réel

## 🔄 Modes de fonctionnement

### Mode Local (par défaut)
- ✅ Aucune installation requise
- ✅ Fonctionne directement dans le navigateur
- ✅ Données stockées dans localStorage
- ⚠️ Paiements Stripe en mode "demo" (pas de charge réelle)
- ⚠️ Produits définis en dur dans le code

### Mode Backend
- ✅ Paiements Stripe réels et sécurisés
- ✅ Gestion complète des produits depuis l'admin
- ✅ Données persistantes dans des fichiers JSON
- ✅ API REST complète
- ⚠️ Nécessite Node.js et configuration

## 🛠️ Installation du Backend

### Étape 1 : Vérifier Node.js

Vérifiez que Node.js est installé (version 16 ou supérieure) :

```bash
node --version
```

Si Node.js n'est pas installé, téléchargez-le sur [nodejs.org](https://nodejs.org)

### Étape 2 : Installer les dépendances

Dans le dossier du projet, exécutez :

```bash
npm install
```

Cela installera :
- `express` - Framework web
- `cors` - Gestion des requêtes cross-origin
- `stripe` - SDK Stripe pour Node.js
- `dotenv` - Gestion des variables d'environnement

### Étape 3 : Configurer Stripe

1. Créez un compte sur [stripe.com](https://stripe.com) si ce n'est pas déjà fait

2. Récupérez vos clés API sur [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)

3. Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

4. Éditez le fichier `.env` et ajoutez votre clé **secrète** Stripe :

```env
PORT=3000
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE_ICI
FRONTEND_URL=http://localhost:8080
```

⚠️ **IMPORTANT** : Utilisez la clé **secrète** (`sk_test_...` ou `sk_live_...`), PAS la clé publique !

### Étape 4 : Démarrer le serveur

**Mode développement** (redémarre automatiquement à chaque modification) :
```bash
npm run dev
```

**Mode production** :
```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

Vous devriez voir :
```
🚀 BackZo Backend démarré !

📍 Serveur : http://localhost:3000
💳 Stripe : ✓ Configuré

📚 Endpoints disponibles :
   POST /api/create-payment-intent
   POST /api/confirm-payment
   GET  /api/products
   POST /api/products
   GET  /api/orders
   GET  /api/stats
```

### Étape 5 : Activer le backend dans le frontend

Ouvrez le fichier `Untitled-1.html` et modifiez la ligne suivante :

```javascript
const USE_BACKEND = false; // Mettre à true pour utiliser le backend
```

Changez-la en :

```javascript
const USE_BACKEND = true; // Backend activé !
```

### Étape 6 : Configurer la clé publique Stripe dans l'admin

1. Ouvrez votre site dans le navigateur
2. Cliquez sur le petit point (·) dans le footer pour accéder à l'admin
3. Connectez-vous avec :
   - Utilisateur : `admin`
   - Mot de passe : `BackZo2024!`
4. Allez dans **Paramètres**
5. Dans la section "Paiement — Stripe", collez votre clé **publique** Stripe (`pk_test_...` ou `pk_live_...`)
6. Cliquez sur "Enregistrer les paramètres"

## ✅ Vérifier que tout fonctionne

### Test 1 : Backend accessible

Ouvrez la console du navigateur (F12) et vérifiez qu'il y a un message :
```
✓ Backend connecté: {status: "ok", timestamp: "...", stripe: true}
```

### Test 2 : Ajouter un produit

1. Dans l'admin, allez dans l'onglet **Produits**
2. Cliquez sur **+ Ajouter**
3. Remplissez le formulaire et validez
4. Le produit devrait apparaître dans la liste et dans la boutique

### Test 3 : Passer une commande

1. Allez dans la **Boutique**
2. Ajoutez un produit au panier
3. Cliquez sur "Passer commande"
4. Remplissez le formulaire avec une carte de test :
   - Numéro : `4242 4242 4242 4242`
   - Date : N'importe quelle date future
   - CVV : N'importe quel 3 chiffres
5. Validez le paiement
6. La commande devrait apparaître dans l'admin

## 📡 Endpoints API disponibles

### Paiements

- `POST /api/create-payment-intent` - Créer un PaymentIntent Stripe
- `POST /api/confirm-payment` - Confirmer un paiement et créer la commande
- `POST /api/webhook` - Webhook Stripe (pour les événements)

### Produits

- `GET /api/products` - Liste des produits actifs
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Ajouter un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Commandes

- `GET /api/orders` - Liste des commandes (admin)
- `GET /api/orders/:id` - Détails d'une commande
- `PATCH /api/orders/:id/status` - Mettre à jour le statut d'une commande

### Utilitaires

- `GET /api/health` - Vérifier l'état du serveur
- `GET /api/stats` - Statistiques pour le dashboard admin

## 🧪 Cartes de test Stripe

Pour tester les paiements sans être débité :

| Carte | Résultat |
|-------|----------|
| `4242 4242 4242 4242` | ✅ Paiement réussi |
| `4000 0000 0000 0002` | ❌ Paiement refusé |
| `4000 0027 6000 3184` | 🔐 Nécessite 3D Secure |

Date : N'importe quelle date future  
CVV : N'importe quel 3 chiffres

## 📁 Structure des données

Les données sont stockées dans le dossier `data/` :

```
data/
├── orders.json    # Commandes
└── products.json  # Produits
```

Ces fichiers sont créés automatiquement au premier démarrage.

## 🔒 Sécurité

### ✅ À faire en production

- [ ] Ajouter une authentification JWT pour les routes admin
- [ ] Valider toutes les entrées utilisateur côté serveur
- [ ] Utiliser HTTPS (obligatoire pour Stripe)
- [ ] Configurer les webhooks Stripe
- [ ] Limiter les requêtes (rate limiting)
- [ ] Utiliser une vraie base de données (PostgreSQL, MongoDB)
- [ ] Ajouter des logs serveur
- [ ] Configurer les variables d'environnement sur le serveur

### ❌ À ne JAMAIS faire

- ❌ Exposer votre clé secrète Stripe dans le code frontend
- ❌ Commiter le fichier `.env` dans Git
- ❌ Faire confiance aux données du frontend sans validation
- ❌ Utiliser les clés de test en production

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

Configurez les variables d'environnement dans le dashboard Vercel.

### Railway

```bash
railway up
```

N'oubliez pas de configurer `STRIPE_SECRET_KEY` dans les variables d'environnement !

## 🐛 Dépannage

### Le serveur ne démarre pas

**Erreur : `node: command not found`**
- Node.js n'est pas installé. Installez-le depuis [nodejs.org](https://nodejs.org)

**Erreur : `Cannot find module 'express'`**
- Les dépendances ne sont pas installées. Exécutez `npm install`

**Erreur : `Port 3000 already in use`**
- Le port 3000 est déjà utilisé. Changez le port dans `.env` :
  ```env
  PORT=3001
  ```
  Et mettez à jour `API_URL` dans le HTML :
  ```javascript
  const API_URL = 'http://localhost:3001/api';
  ```

### Erreur Stripe

**`Invalid API Key provided`**
- Vérifiez que votre clé secrète est correcte dans `.env`
- Vérifiez que vous utilisez `sk_test_...` et non `pk_test_...`

**`No such payment_intent`**
- Le PaymentIntent n'existe pas ou a expiré
- Créez un nouveau paiement

### CORS Error

**`Access-Control-Allow-Origin`**
- Vérifiez que `FRONTEND_URL` est correct dans `.env`
- Le frontend doit faire des requêtes vers `http://localhost:3000`

### Backend non accessible

**Console : `⚠️ Backend non accessible - Mode local activé`**
- Le serveur n'est pas démarré. Lancez `npm start`
- Vérifiez que le serveur tourne sur le bon port
- Vérifiez que `API_URL` dans le HTML correspond au port du serveur

## 💡 Améliorations possibles

- [ ] Ajouter une base de données (PostgreSQL, MongoDB)
- [ ] Implémenter l'authentification JWT
- [ ] Ajouter l'envoi d'emails (SendGrid, Mailgun)
- [ ] Gérer les uploads d'images (Cloudinary, S3)
- [ ] Ajouter des tests unitaires
- [ ] Implémenter un système de logs
- [ ] Ajouter la gestion des stocks en temps réel
- [ ] Créer un dashboard analytics
- [ ] Ajouter la gestion des remises et codes promo
- [ ] Implémenter un système de notifications

## 📞 Support

Pour toute question :
- Consultez la [documentation Stripe](https://stripe.com/docs/api)
- Consultez la [documentation Express](https://expressjs.com/)
- Lisez le fichier `README_BACKEND.md` pour plus de détails

## 📝 Résumé des commandes

```bash
# Installation
npm install

# Configuration
cp .env.example .env
# Éditez .env et ajoutez votre clé Stripe

# Démarrage
npm start              # Production
npm run dev            # Développement (auto-reload)

# Test
curl http://localhost:3000/api/health
```

Bon développement ! 🚀
