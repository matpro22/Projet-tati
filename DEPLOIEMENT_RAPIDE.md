# 🚀 Déploiement Rapide - Frontend/Backend Séparés

## ✅ Problème résolu

L'erreur `POST https://backzo.eu/${API_URL}/api/contact 404` a été corrigée.

**Cause :** L'URL de l'API pointait vers `/api` (chemin relatif) au lieu de `https://projet-tati.vercel.app/api`

**Solution :** Configuration de l'URL complète du backend Vercel

## 📋 Checklist de déploiement

### 1️⃣ Backend sur Vercel (projet-tati.vercel.app)

#### A. Vérifier les fichiers

Assurez-vous que ces fichiers sont à jour sur Vercel :
- ✅ `server.js` (avec les routes email et CORS configuré)
- ✅ `package.json`
- ✅ `vercel.json`

#### B. Configurer les variables d'environnement

Dans Vercel Dashboard > Settings > Environment Variables :

```env
PORT=3000
STRIPE_SECRET_KEY=sk_test_51Lxm7xK8gHuDBE8kFP3zPWUBEknQitU8rXDJggG3Jh7BKX7rMabXO636JJVmC1460Tf4snEZXz6VKROm9qu36h3q00hZ7zwTXd
MONGODB_URI=mongodb+srv://khenaffoumathias_db_user:aXi9eVoHyTuvr6Xs@cluster0.y4gvdra.mongodb.net/cluster0?retryWrites=true&w=majority
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=465
EMAIL_USER=team@backzo.eu
EMAIL_PASS=VOTRE_MOT_DE_PASSE_EMAIL
EMAIL_FROM=team@backzo.eu
EMAIL_TO=team@backzo.eu
```

#### C. Déployer

```bash
# Si vous utilisez Vercel CLI
vercel --prod

# Ou via Git
git add .
git commit -m "Update backend with email endpoints and CORS"
git push
```

#### D. Tester le backend

```bash
node test-backend-connection.js
```

Vous devriez voir :
```
✅ Backend accessible
✅ Endpoint contact fonctionnel
✅ CORS configuré
```

### 2️⃣ Frontend sur OVH (backzo.eu)

#### A. Préparer le fichier

Le fichier `public/index.html` est maintenant configuré avec :
```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : 'https://projet-tati.vercel.app/api';
```

#### B. Uploader sur OVH

1. Connectez-vous à votre espace client OVH
2. Allez dans "Hébergement Web" > "FTP"
3. Uploadez `public/index.html` vers le dossier racine (ou `www/`)
4. Assurez-vous que le fichier est accessible via `https://backzo.eu`

#### C. Vérifier HTTPS

Assurez-vous que votre site utilise HTTPS :
- ✅ `https://backzo.eu` (avec le cadenas)
- ❌ `http://backzo.eu` (rediriger vers HTTPS)

### 3️⃣ Test final

#### A. Ouvrir le site

Allez sur `https://backzo.eu`

#### B. Ouvrir la console du navigateur

Appuyez sur F12 pour ouvrir les DevTools

#### C. Tester le formulaire de contact

1. Allez sur la page "Contact"
2. Remplissez le formulaire
3. Cliquez sur "Envoyer"

#### D. Vérifier dans la console

Vous devriez voir :
```
POST https://projet-tati.vercel.app/api/contact 200 OK
```

Et NON :
```
POST https://backzo.eu/${API_URL}/api/contact 404
```

#### E. Vérifier le message de succès

Vous devriez voir :
```
✓ Message envoyé avec succès. Nous vous répondrons sous 48h.
```

## 🔧 Dépannage

### Erreur : Still seeing `${API_URL}` in URL

**Solution :** Videz le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)

### Erreur CORS

```
Access to fetch at 'https://projet-tati.vercel.app/api/contact' from origin 'https://backzo.eu' 
has been blocked by CORS policy
```

**Solution :** 
1. Vérifiez que `server.js` a bien la configuration CORS mise à jour
2. Redéployez le backend sur Vercel
3. Attendez quelques minutes pour la propagation

### Erreur 404 sur le backend

```
POST https://projet-tati.vercel.app/api/contact 404
```

**Solution :**
1. Vérifiez que `server.js` contient bien la route `/api/contact`
2. Redéployez le backend
3. Testez avec : `node test-backend-connection.js`

### Le formulaire ne fait rien

**Solution :**
1. Ouvrez la console (F12)
2. Cherchez les erreurs JavaScript
3. Vérifiez que `API_URL` est bien défini : tapez `API_URL` dans la console

## 📊 Monitoring

### Logs Vercel

Pour voir les logs du backend :
1. Allez sur Vercel Dashboard
2. Sélectionnez votre projet
3. Cliquez sur "Logs"
4. Filtrez par "api/contact"

### Logs MongoDB

Pour voir les données dans MongoDB :
1. Allez sur MongoDB Atlas
2. Cliquez sur "Browse Collections"
3. Vérifiez les collections `orders`, `products`, etc.

## 🎯 URLs de test

Testez ces URLs directement dans votre navigateur :

1. **Health check** : https://projet-tati.vercel.app/api/health
2. **Products** : https://projet-tati.vercel.app/api/products
3. **Settings** : https://projet-tati.vercel.app/api/settings

Si ces URLs fonctionnent, votre backend est opérationnel !

## 💡 Conseils

1. **Testez en local d'abord** : `node server.js` puis `http://localhost:3000`
2. **Utilisez les scripts de test** : `node test-backend-connection.js`
3. **Vérifiez les logs** : Console navigateur + Logs Vercel
4. **Videz le cache** : Après chaque modification du frontend
5. **Attendez la propagation** : Parfois il faut 1-2 minutes après un déploiement

## ✨ Résultat attendu

Après le déploiement, vous devriez avoir :

- ✅ Frontend sur `https://backzo.eu` fonctionnel
- ✅ Backend sur `https://projet-tati.vercel.app` accessible
- ✅ Formulaire de contact qui envoie des emails
- ✅ Pas d'erreur CORS
- ✅ Pas d'erreur 404
- ✅ Pas d'erreur `${API_URL}` non interpolé

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez `ARCHITECTURE_FRONTEND_BACKEND.md`
2. Exécutez `node test-backend-connection.js`
3. Vérifiez les logs Vercel
4. Testez les endpoints individuellement
