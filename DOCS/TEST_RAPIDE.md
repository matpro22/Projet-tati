# 🚀 Test Rapide - Système d'Email Backend

## ✅ Corrections effectuées

L'erreur `API_URL has already been declared` a été corrigée. Le système d'envoi d'email fonctionne maintenant entièrement via le backend.

## 🧪 Comment tester

### 1. Démarrer le serveur

```bash
node server.js
```

Vous devriez voir :
```
✓ Stripe initialisé avec clé secrète: sk_test_51Lxm7xK8gHu...
🔄 Connexion à MongoDB...
🚀 BackZo Backend démarré !
📍 Serveur : http://localhost:3000
💳 Stripe : ✓ Configuré
💾 Base de données : ✓ MongoDB
```

### 2. Ouvrir l'application

Ouvrez votre navigateur et allez sur :
```
http://localhost:3000
```

### 3. Vérifier la console du navigateur

Ouvrez la console (F12) et vérifiez qu'il n'y a **AUCUNE** erreur JavaScript, notamment :
- ❌ Plus d'erreur `API_URL has already been declared`
- ❌ Plus d'erreur 404 sur les appels API

### 4. Tester le formulaire de contact

1. Allez sur la page "Contact"
2. Remplissez le formulaire :
   - Nom : Test User
   - Email : test@example.com
   - Message : Test du système d'email
3. Cliquez sur "Envoyer le message"
4. Vous devriez voir : ✓ Message envoyé avec succès

### 5. Vérifier les logs du serveur

Dans le terminal où tourne le serveur, vous devriez voir :
```
✓ Email de contact envoyé: test@example.com
```

OU si l'email n'est pas configuré :
```
Message de contact reçu (email non configuré): { name: 'Test User', email: 'test@example.com', ... }
```

### 6. Tester le CTA Clubs

1. Sur la page d'accueil, section "Clubs"
2. Entrez un email dans le champ
3. Cliquez sur "Envoyer"
4. Vérifiez le message de succès

### 7. Tester l'admin (optionnel)

1. Cliquez sur "Admin" dans le menu
2. Connectez-vous :
   - User : `admin`
   - Pass : `BackZo2024!`
3. Allez dans "Devis"
4. Créez un devis test
5. Cliquez sur "📧 Envoyer par email"
6. Vérifiez que le toast de succès s'affiche

## 🔧 Configuration email (optionnel)

Pour que les emails soient réellement envoyés, modifiez `.env` :

```env
EMAIL_PASS=VOTRE_VRAI_MOT_DE_PASSE_OVH
```

Puis redémarrez le serveur.

## ✨ Ce qui a changé

### Avant (❌ Problèmes)
- `mailto:` ouvrait le client email local
- Erreur `API_URL has already been declared`
- Erreur 404 sur certains appels API
- URL incorrecte avec port `:3000` sur Vercel

### Après (✅ Fonctionnel)
- Tous les emails passent par le backend
- Plus d'erreur JavaScript
- URL adaptative (local vs production)
- Templates HTML professionnels
- Mode dégradé si email non configuré

## 📊 Endpoints disponibles

- `POST /api/contact` - Formulaire de contact
- `POST /api/send-quote` - Envoi de devis
- `POST /api/send-order-notification` - Notifications de commande
- `GET /api/products` - Liste des produits
- `GET /api/orders` - Liste des commandes
- `GET /api/stats` - Statistiques

## 🎯 Prochaines étapes

1. ✅ Tester en local (vous êtes ici)
2. ⏭️ Configurer le mot de passe email dans `.env`
3. ⏭️ Déployer sur Vercel
4. ⏭️ Ajouter les variables d'environnement sur Vercel

## 💡 Besoin d'aide ?

Consultez les fichiers :
- `CONFIGURATION_EMAIL.md` - Guide complet de configuration email
- `CORRECTION_ERREUR_API_URL.md` - Détails de la correction
- `test-email-endpoints.js` - Script de test automatique
