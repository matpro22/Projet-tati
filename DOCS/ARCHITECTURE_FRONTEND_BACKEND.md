# Architecture Frontend/Backend Séparés

## 🏗️ Architecture actuelle

Votre application utilise une architecture séparée :

```
┌─────────────────────────────────────┐
│  FRONTEND (OVH)                     │
│  https://backzo.eu                  │
│  - Fichiers statiques (HTML/CSS/JS)│
│  - Interface utilisateur            │
└──────────────┬──────────────────────┘
               │
               │ API Calls (HTTPS)
               │
┌──────────────▼──────────────────────┐
│  BACKEND (Vercel)                   │
│  https://projet-tati.vercel.app     │
│  - API REST (/api/*)                │
│  - MongoDB                          │
│  - Stripe                           │
│  - Envoi d'emails                   │
└─────────────────────────────────────┘
```

## ✅ Corrections appliquées

### 1. Configuration de l'URL du backend dans `public/index.html`

```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : 'https://projet-tati.vercel.app/api';
```

Cette configuration :
- ✅ En local : pointe vers `http://localhost:3000/api`
- ✅ En production : pointe vers `https://projet-tati.vercel.app/api`

### 2. Configuration CORS dans `server.js`

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://backzo.eu',
    'https://www.backzo.eu',
    'https://projet-tati.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

Cette configuration autorise les requêtes depuis :
- ✅ `backzo.eu` (votre frontend OVH)
- ✅ `www.backzo.eu` (avec www)
- ✅ `projet-tati.vercel.app` (backend Vercel)
- ✅ `localhost` (développement local)

## 🚀 Déploiement

### Frontend sur OVH (backzo.eu)

1. Uploadez le fichier `public/index.html` sur votre serveur OVH
2. Assurez-vous que le fichier est accessible via `https://backzo.eu`

### Backend sur Vercel (projet-tati.vercel.app)

1. Le backend est déjà déployé sur Vercel
2. Vérifiez que les variables d'environnement sont configurées :

```env
PORT=3000
STRIPE_SECRET_KEY=sk_test_...
MONGODB_URI=mongodb+srv://...
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=465
EMAIL_USER=team@backzo.eu
EMAIL_PASS=votre_mot_de_passe
EMAIL_FROM=team@backzo.eu
EMAIL_TO=team@backzo.eu
```

## 🧪 Test de la configuration

### 1. Tester en local

```bash
# Démarrer le backend
node server.js

# Ouvrir le frontend
http://localhost:3000
```

### 2. Tester en production

1. Ouvrez `https://backzo.eu` dans votre navigateur
2. Ouvrez la console (F12)
3. Testez le formulaire de contact
4. Vérifiez qu'il n'y a pas d'erreur CORS ou 404

### 3. Vérifier les appels API

Dans la console du navigateur, vous devriez voir :
```
POST https://projet-tati.vercel.app/api/contact 200 OK
```

Et NON :
```
POST https://backzo.eu/${API_URL}/api/contact 404 (Not Found)
```

## 🔧 Dépannage

### Erreur : `${API_URL}` non interpolé

**Symptôme :** L'URL contient littéralement `${API_URL}` au lieu de l'URL réelle

**Cause :** Utilisation de guillemets simples `'...'` au lieu de backticks `` `...` ``

**Solution :** Vérifiez que tous les appels `fetch()` utilisent des backticks :
```javascript
// ❌ Incorrect
fetch('${API_URL}/contact', ...)

// ✅ Correct
fetch(`${API_URL}/contact`, ...)
```

### Erreur CORS

**Symptôme :** 
```
Access to fetch at 'https://projet-tati.vercel.app/api/contact' from origin 'https://backzo.eu' 
has been blocked by CORS policy
```

**Solution :** Vérifiez que `backzo.eu` est dans la liste `corsOptions.origin` dans `server.js`

### Erreur 404

**Symptôme :** `POST https://projet-tati.vercel.app/api/contact 404`

**Causes possibles :**
1. Le backend n'est pas déployé sur Vercel
2. La route `/api/contact` n'existe pas
3. Le fichier `server.js` n'est pas à jour sur Vercel

**Solution :** Redéployez le backend sur Vercel

## 📝 Checklist de déploiement

### Backend (Vercel)
- [ ] `server.js` est à jour avec les routes email
- [ ] Variables d'environnement configurées
- [ ] CORS configuré pour autoriser `backzo.eu`
- [ ] MongoDB connecté
- [ ] Stripe configuré

### Frontend (OVH)
- [ ] `public/index.html` uploadé
- [ ] `API_URL` pointe vers `https://projet-tati.vercel.app/api`
- [ ] Fichiers statiques accessibles
- [ ] HTTPS activé

## 🎯 URLs importantes

- **Frontend** : https://backzo.eu
- **Backend** : https://projet-tati.vercel.app
- **API** : https://projet-tati.vercel.app/api
- **Health check** : https://projet-tati.vercel.app/api/health

## 💡 Recommandations

1. **Utilisez HTTPS partout** : Assurez-vous que `backzo.eu` utilise HTTPS
2. **Configurez les variables d'environnement** : Ne committez jamais les secrets dans Git
3. **Testez les endpoints** : Utilisez `test-email-endpoints.js` pour vérifier
4. **Surveillez les logs** : Vérifiez les logs Vercel pour les erreurs backend
5. **Backup MongoDB** : Configurez des backups réguliers de votre base de données

## 🔐 Sécurité

- ✅ CORS configuré avec liste blanche d'origines
- ✅ Variables d'environnement pour les secrets
- ✅ HTTPS obligatoire en production
- ✅ Validation des données côté serveur
- ⚠️ Pensez à ajouter un rate limiting pour les API
- ⚠️ Configurez un webhook secret pour Stripe
