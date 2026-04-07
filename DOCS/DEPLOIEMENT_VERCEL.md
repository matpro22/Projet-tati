# 🚀 Déployer BackZo sur Vercel

Guide complet pour déployer votre site BackZo sur Vercel (frontend + backend).

## 📋 Prérequis

- Un compte Vercel (gratuit) : [vercel.com](https://vercel.com)
- Git installé sur votre ordinateur
- Un compte GitHub (recommandé)

## 🎯 Deux options de déploiement

### Option 1 : Frontend uniquement (FACILE) ⭐
- Déploie juste le site HTML
- Fonctionne en mode local (localStorage)
- Gratuit et instantané

### Option 2 : Frontend + Backend (COMPLET)
- Déploie le site + l'API Node.js
- Paiements Stripe réels
- Nécessite configuration

---

## 🌐 Option 1 : Frontend uniquement

### Étape 1 : Préparer le projet

1. **Renommez le fichier HTML** :
   ```bash
   # Renommez Untitled-1.html en index.html
   mv Untitled-1.html index.html
   ```
   Ou faites-le manuellement dans l'explorateur de fichiers.

2. **Vérifiez la configuration** dans `index.html` :
   ```javascript
   const USE_BACKEND = false;  // ← Doit être false
   ```

### Étape 2 : Créer un fichier vercel.json

Créez un fichier `vercel.json` à la racine :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Étape 3 : Déployer

**Méthode A : Via le site Vercel (FACILE)**

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New Project"**
3. Cliquez sur **"Browse"** et sélectionnez votre dossier
4. Ou glissez-déposez votre dossier
5. Cliquez sur **"Deploy"**
6. Attendez 30 secondes... ✅ C'est en ligne !

**Méthode B : Via la ligne de commande**

1. Installez Vercel CLI :
   ```bash
   npm install -g vercel
   ```

2. Connectez-vous :
   ```bash
   vercel login
   ```

3. Déployez :
   ```bash
   vercel
   ```

4. Suivez les instructions :
   - Set up and deploy? **Y**
   - Which scope? Choisissez votre compte
   - Link to existing project? **N**
   - What's your project's name? **backzo**
   - In which directory is your code located? **.**
   - Want to override the settings? **N**

5. Votre site est en ligne ! 🎉

### Étape 4 : Configurer Stripe (optionnel)

1. Allez sur votre site déployé
2. Accédez à l'admin (cliquez sur le point dans le footer)
3. Connectez-vous : `admin` / `BackZo2024!`
4. Allez dans **Paramètres**
5. Ajoutez votre clé publique Stripe : `pk_test_...`
6. Enregistrez

Maintenant les paiements fonctionnent en mode "demo" !

---

## 🔧 Option 2 : Frontend + Backend

### Étape 1 : Préparer le projet

1. **Renommez le fichier HTML** :
   ```bash
   mv Untitled-1.html index.html
   ```

2. **Créez un dossier `public`** :
   ```bash
   mkdir public
   mv index.html public/
   mv 1.jpg public/
   mv 2.jpg public/
   ```

3. **Créez un fichier `vercel.json`** :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```

4. **Modifiez `server.js`** pour servir les fichiers statiques :

Ajoutez cette ligne après les autres `app.use()` :

```javascript
// Servir les fichiers statiques
app.use(express.static('public'));
```

5. **Mettez à jour `index.html`** :

Changez l'URL de l'API :

```javascript
// Remplacez localhost par votre domaine Vercel
const API_URL = '/api';  // ← Chemin relatif
const USE_BACKEND = true;  // ← Activez le backend
```

### Étape 2 : Initialiser Git

```bash
git init
git add .
git commit -m "Initial commit - BackZo"
```

### Étape 3 : Créer un repo GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur **"New repository"**
3. Nom : **backzo**
4. Cliquez sur **"Create repository"**
5. Suivez les instructions pour pousser votre code :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/backzo.git
git branch -M main
git push -u origin main
```

### Étape 4 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New Project"**
3. Cliquez sur **"Import Git Repository"**
4. Sélectionnez votre repo **backzo**
5. Cliquez sur **"Import"**

### Étape 5 : Configurer les variables d'environnement

1. Dans Vercel, allez dans **Settings** > **Environment Variables**
2. Ajoutez ces variables :

| Name | Value |
|------|-------|
| `STRIPE_SECRET_KEY` | `sk_test_VOTRE_CLE_SECRETE` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (optionnel) |
| `FRONTEND_URL` | `https://votre-site.vercel.app` |

3. Cliquez sur **"Save"**

### Étape 6 : Redéployer

1. Allez dans **Deployments**
2. Cliquez sur les **3 points** de la dernière version
3. Cliquez sur **"Redeploy"**
4. Attendez que le déploiement se termine

### Étape 7 : Configurer Stripe dans l'admin

1. Allez sur votre site : `https://votre-site.vercel.app`
2. Accédez à l'admin
3. Allez dans **Paramètres**
4. Ajoutez votre clé **publique** Stripe : `pk_test_...`
5. Enregistrez

### Étape 8 : Tester

1. Ajoutez un produit au panier
2. Passez commande
3. Utilisez la carte de test : `4242 4242 4242 4242`
4. Vérifiez que la commande apparaît dans l'admin

✅ **Votre site est en ligne avec paiements réels !** 🎉

---

## 📁 Structure finale du projet

```
backzo/
├── public/
│   ├── index.html       # Site (renommé)
│   ├── 1.jpg
│   └── 2.jpg
├── data/                # Créé automatiquement
│   ├── orders.json
│   └── products.json
├── server.js            # Backend
├── package.json
├── vercel.json          # Configuration Vercel
├── .env                 # Local uniquement (pas déployé)
├── .gitignore
└── README.md
```

---

## 🔧 Configuration avancée

### Domaine personnalisé

1. Dans Vercel, allez dans **Settings** > **Domains**
2. Ajoutez votre domaine : `www.backzo.com`
3. Suivez les instructions pour configurer le DNS
4. Mettez à jour `FRONTEND_URL` dans les variables d'environnement

### HTTPS automatique

Vercel active automatiquement HTTPS avec un certificat SSL gratuit ! ✅

### Webhooks Stripe

1. Allez sur [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquez sur **"Add endpoint"**
3. URL : `https://votre-site.vercel.app/api/webhook`
4. Événements : Sélectionnez `payment_intent.succeeded` et `payment_intent.payment_failed`
5. Copiez le **Signing secret** (`whsec_...`)
6. Ajoutez-le dans Vercel : **Settings** > **Environment Variables** > `STRIPE_WEBHOOK_SECRET`
7. Redéployez

### Base de données

Pour une vraie base de données en production :

1. **MongoDB Atlas** (gratuit) :
   - Créez un compte sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Créez un cluster gratuit
   - Récupérez l'URL de connexion
   - Ajoutez `MONGODB_URI` dans les variables d'environnement Vercel

2. **PostgreSQL** (Vercel Postgres) :
   - Dans Vercel, allez dans **Storage**
   - Créez une base Postgres
   - Les variables sont ajoutées automatiquement

---

## 🐛 Dépannage

### Erreur 404 sur les routes

**Problème** : Les pages ne se chargent pas

**Solution** : Vérifiez que `vercel.json` est correct et que les routes sont bien configurées.

### Erreur "Module not found"

**Problème** : Le backend ne trouve pas les dépendances

**Solution** :
```bash
# Vérifiez que package.json est à la racine
npm install
git add package.json package-lock.json
git commit -m "Add dependencies"
git push
```

### Variables d'environnement non prises en compte

**Problème** : Stripe ne fonctionne pas

**Solution** :
1. Vérifiez que les variables sont bien ajoutées dans Vercel
2. Redéployez après avoir ajouté les variables
3. Vérifiez qu'il n'y a pas d'espaces dans les valeurs

### CORS Error

**Problème** : Le frontend ne peut pas appeler l'API

**Solution** : Vérifiez que `FRONTEND_URL` dans les variables d'environnement correspond à votre URL Vercel.

### Fichiers data/ non persistants

**Problème** : Les données disparaissent après redéploiement

**Solution** : C'est normal ! Vercel est "serverless". Les fichiers ne persistent pas. Solutions :
1. Utilisez une vraie base de données (MongoDB, PostgreSQL)
2. Ou utilisez Vercel KV (key-value store)
3. Ou utilisez un service de stockage (AWS S3, Cloudinary)

---

## 💡 Conseils

### Avant de déployer

- [ ] Testez tout en local
- [ ] Changez le mot de passe admin
- [ ] Utilisez les clés Stripe **test** d'abord
- [ ] Vérifiez que `.env` est dans `.gitignore`

### Après le déploiement

- [ ] Testez tous les parcours utilisateur
- [ ] Testez les paiements avec des cartes de test
- [ ] Configurez les webhooks Stripe
- [ ] Ajoutez un domaine personnalisé
- [ ] Activez les analytics Vercel

### Pour la production

- [ ] Utilisez les clés Stripe **live** (`sk_live_...` et `pk_live_...`)
- [ ] Configurez une vraie base de données
- [ ] Ajoutez un système de backup
- [ ] Configurez le monitoring
- [ ] Ajoutez Google Analytics
- [ ] Testez la performance (Lighthouse)

---

## 📊 Commandes utiles

```bash
# Déployer en production
vercel --prod

# Voir les logs
vercel logs

# Lister les déploiements
vercel ls

# Supprimer un déploiement
vercel rm [deployment-url]

# Ouvrir le dashboard
vercel

# Voir les variables d'environnement
vercel env ls

# Ajouter une variable
vercel env add STRIPE_SECRET_KEY
```

---

## 🎯 Checklist de déploiement

### Frontend uniquement

- [ ] Renommer `Untitled-1.html` en `index.html`
- [ ] Vérifier `USE_BACKEND = false`
- [ ] Créer `vercel.json`
- [ ] Déployer sur Vercel
- [ ] Configurer Stripe dans l'admin
- [ ] Tester le site

### Frontend + Backend

- [ ] Renommer `Untitled-1.html` en `index.html`
- [ ] Déplacer les fichiers dans `public/`
- [ ] Créer `vercel.json` avec routes API
- [ ] Modifier `server.js` pour servir les fichiers statiques
- [ ] Changer `API_URL` en chemin relatif
- [ ] Mettre `USE_BACKEND = true`
- [ ] Créer un repo GitHub
- [ ] Pousser le code
- [ ] Importer sur Vercel
- [ ] Configurer les variables d'environnement
- [ ] Redéployer
- [ ] Configurer Stripe dans l'admin
- [ ] Configurer les webhooks
- [ ] Tester les paiements

---

## 🆘 Besoin d'aide ?

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Support Vercel** : [vercel.com/support](https://vercel.com/support)
- **Documentation Stripe** : [stripe.com/docs](https://stripe.com/docs)

---

## 🎉 Félicitations !

Votre site BackZo est maintenant en ligne sur Vercel ! 🚀

**URL de votre site** : `https://votre-projet.vercel.app`

Partagez-le avec le monde ! 🌍

---

**Bon déploiement ! 🚀**
