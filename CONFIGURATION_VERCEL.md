# 🚀 Configuration Vercel - Système d'Avis

## 📋 Configuration effectuée

Le système d'avis a été configuré pour fonctionner avec ton backend Vercel :
- **URL Backend** : `https://projet-tati.vercel.app`

## ✅ Modifications apportées

### 1. Détection automatique de l'API

Les fichiers suivants détectent automatiquement l'environnement :

**`public/review.html`**
```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://projet-tati.vercel.app';
```

**`public/reviews-display.js`**
- Même logique de détection

**`public/admin-reviews.js`**
- Même logique de détection

### 2. Configuration CORS améliorée

Le fichier `server.js` a été mis à jour pour :
- Autoriser les requêtes depuis `https://projet-tati.vercel.app`
- Autoriser toutes les URLs Vercel (*.vercel.app) pour le développement
- Gérer les requêtes sans origin (apps mobiles, tests)

## 🔧 Comment ça fonctionne

### En développement local
- Frontend : `http://localhost:3000`
- Backend : `http://localhost:3000`
- Les requêtes API vont vers localhost

### En production Vercel
- Frontend : `https://projet-tati.vercel.app`
- Backend : `https://projet-tati.vercel.app`
- Les requêtes API vont vers Vercel

## 📝 Variables d'environnement Vercel

Assure-toi que ces variables sont configurées dans ton projet Vercel :

### Obligatoires
```
MONGODB_URI=mongodb+srv://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
JWT_SECRET=ton_secret_jwt_aleatoire_long
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ton_mot_de_passe_securise
```

### Optionnelles (Email)
```
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=465
EMAIL_USER=team@backzo.eu
EMAIL_PASS=ton_mot_de_passe_email
EMAIL_FROM=team@backzo.eu
EMAIL_TO=team@backzo.eu
```

### Optionnelles (Frontend)
```
FRONTEND_URL=https://backzo.eu
```

## 🚀 Déploiement sur Vercel

### 1. Commit et push des modifications

```bash
git add .
git commit -m "Ajout système d'avis clients avec configuration Vercel"
git push
```

### 2. Vercel déploie automatiquement

Vercel détecte le push et redéploie automatiquement.

### 3. Vérifier le déploiement

Une fois déployé, teste :

**Route API des avis :**
```
https://projet-tati.vercel.app/api/reviews
```
Résultat attendu : `[]` ou liste d'avis

**Page de soumission :**
```
https://projet-tati.vercel.app/review.html?orderId=BZ-TEST&email=test@example.com
```
Résultat attendu : Formulaire d'avis

**Page d'accueil :**
```
https://projet-tati.vercel.app/
```
Résultat attendu : Section "ILS NOUS FONT CONFIANCE" visible

## 🧪 Tests après déploiement

### Test 1 : API publique
```bash
curl https://projet-tati.vercel.app/api/reviews
```

### Test 2 : Soumission d'avis
```bash
curl -X POST https://projet-tati.vercel.app/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "BZ-TEST",
    "email": "test@example.com",
    "rating": 5,
    "comment": "Test",
    "customerName": "Test"
  }'
```

### Test 3 : Page web
Ouvre dans ton navigateur :
```
https://projet-tati.vercel.app/review.html?orderId=BZ-TEST&email=test@example.com
```

## 🔍 Debugging

### Problème : Erreur CORS

**Symptôme** : Erreur dans la console du navigateur
```
Access to fetch at 'https://projet-tati.vercel.app/api/reviews' 
from origin 'https://autre-domaine.com' has been blocked by CORS policy
```

**Solution** :
1. Vérifie que l'origine est dans la liste CORS de `server.js`
2. Redéploie sur Vercel
3. Vide le cache du navigateur

### Problème : 404 sur /api/reviews

**Symptôme** : La route n'existe pas

**Solution** :
1. Vérifie que `server.js` contient bien les routes des avis
2. Vérifie les logs Vercel pour voir les erreurs
3. Redéploie le projet

### Problème : MongoDB non connecté

**Symptôme** : Erreur "MongoDB non disponible"

**Solution** :
1. Vérifie que `MONGODB_URI` est configuré dans Vercel
2. Vérifie que l'IP de Vercel est autorisée dans MongoDB Atlas
3. Le système fonctionne en mode fichiers JSON en fallback (mais limité sur Vercel)

### Problème : Emails non envoyés

**Symptôme** : Pas d'email de notification

**Solution** :
1. Vérifie les variables `EMAIL_*` dans Vercel
2. Vérifie les logs Vercel pour voir les erreurs SMTP
3. Les emails sont optionnels, le système fonctionne sans

## 📊 Monitoring

### Logs Vercel
```bash
vercel logs
```

### Logs en temps réel
```bash
vercel logs --follow
```

### Vérifier les variables d'environnement
```bash
vercel env ls
```

## 🔐 Sécurité

### Points de sécurité implémentés

✅ Validation des données côté serveur
✅ Authentification JWT pour les routes admin
✅ Échappement HTML pour prévenir XSS
✅ Vérification de l'existence des commandes
✅ Protection contre les doublons
✅ CORS configuré correctement

### Recommandations

1. **JWT_SECRET** : Utilise une chaîne aléatoire longue (32+ caractères)
2. **ADMIN_PASSWORD** : Utilise un mot de passe fort
3. **MongoDB** : Active l'authentification et limite les IPs
4. **HTTPS** : Vercel fournit HTTPS automatiquement ✅

## 🌐 URLs importantes

### Production
- Frontend : `https://projet-tati.vercel.app`
- API : `https://projet-tati.vercel.app/api/*`
- Admin : `https://projet-tati.vercel.app` (clic sur le point en bas)

### Développement
- Frontend : `http://localhost:3000`
- API : `http://localhost:3000/api/*`
- Admin : `http://localhost:3000` (clic sur le point en bas)

## 📞 Support

Si tu rencontres des problèmes :

1. Vérifie les logs Vercel
2. Vérifie la console du navigateur (F12)
3. Teste les routes API avec curl
4. Consulte `DEMARRAGE_RAPIDE.md`
5. Contacte : team@backzo.eu

---

**BackZo** — Configuration Vercel du système d'avis
