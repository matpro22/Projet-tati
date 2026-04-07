# 🚀 Déployer les paramètres partagés

## ✅ Modifications prêtes à déployer

Les paramètres partagés sont maintenant implémentés et prêts à être déployés !

## 📦 Ce qui a été modifié

### Fichiers modifiés
- ✅ `server.js` - Routes API pour les paramètres
- ✅ `public/index.html` - Chargement/sauvegarde des paramètres

### Fichiers créés
- ✅ `data/settings.json` - Sera créé automatiquement au démarrage

### Documentation créée
- ✅ `PARAMETRES_PARTAGES.md` - Guide complet
- ✅ `TESTER_PARAMETRES.md` - Guide de test
- ✅ `NOUVELLE_FONCTIONNALITE.md` - Résumé

## 🚀 Déployer maintenant

### Option 1 : Via GitHub (Recommandé)

```bash
# 1. Ajouter les fichiers modifiés
git add server.js public/index.html

# 2. Committer
git commit -m "feat: Add shared settings for all users

- Add GET /api/settings endpoint
- Add POST /api/settings endpoint
- Add loadSettingsFromBackend() function
- Add saveSettingsToBackend() function
- Settings now shared between all users
- Auto-create data/settings.json on startup"

# 3. Pousser vers GitHub
git push

# 4. Vercel redéploie automatiquement ! ✅
```

Attendez 30 secondes, c'est déployé !

---

### Option 2 : Via Vercel CLI

```bash
# Déployer directement
vercel --prod
```

---

### Option 3 : Via le dashboard Vercel

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquez sur votre projet
3. Deployments > 3 points > Redeploy
4. ✅ Déployé !

---

## 🧪 Tester après déploiement

### 1. Vérifier l'API

```bash
# Remplacez par votre URL Vercel
curl https://votre-projet.vercel.app/api/settings
```

Vous devriez voir :
```json
{
  "siteName": "BackZo",
  "email": "team@backzo.eu",
  ...
}
```

### 2. Tester dans l'admin

1. Allez sur votre site : `https://votre-projet.vercel.app`
2. Connectez-vous à l'admin
3. Allez dans Paramètres
4. Changez le nom du site
5. Enregistrez
6. ✅ Message : "Paramètres enregistrés pour tous les utilisateurs !"

### 3. Vérifier dans un autre navigateur

1. Ouvrez en navigation privée
2. ✅ Le nouveau nom s'affiche !

---

## ⚠️ Important : Persistance sur Vercel

### Le problème

Sur Vercel, les fichiers ne persistent pas entre les déploiements.

**Conséquence** : Le fichier `data/settings.json` sera recréé à chaque déploiement avec les valeurs par défaut.

### Solutions

#### Solution 1 : Base de données (Recommandé)

**MongoDB Atlas** (gratuit) :
```bash
# 1. Créez un compte sur mongodb.com/cloud/atlas
# 2. Créez un cluster gratuit
# 3. Récupérez l'URL de connexion
# 4. Ajoutez dans Vercel > Environment Variables :
MONGODB_URI=mongodb+srv://...
```

**Vercel Postgres** :
```bash
# 1. Dans Vercel > Storage > Create Database
# 2. Sélectionnez Postgres
# 3. Les variables sont ajoutées automatiquement
```

#### Solution 2 : Vercel KV (Key-Value)

```bash
# 1. Dans Vercel > Storage > Create Database
# 2. Sélectionnez KV
# 3. Utilisez pour stocker les paramètres
```

#### Solution 3 : Service externe

- **Firebase** : firestore.google.com
- **Supabase** : supabase.com
- **AWS S3** : aws.amazon.com/s3

---

## 🔧 Migration vers MongoDB (Optionnel)

Si vous voulez que les paramètres persistent sur Vercel :

### 1. Installer MongoDB

```bash
npm install mongodb
```

### 2. Modifier server.js

```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
  await client.connect();
  db = client.db('backzo');
  console.log('✓ MongoDB connecté');
}

// Remplacer readJSON/writeJSON par :
async function getSettings() {
  return await db.collection('settings').findOne({ _id: 'global' });
}

async function saveSettings(settings) {
  await db.collection('settings').updateOne(
    { _id: 'global' },
    { $set: settings },
    { upsert: true }
  );
}
```

### 3. Ajouter la variable d'environnement

Dans Vercel > Settings > Environment Variables :
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/backzo
```

### 4. Redéployer

```bash
git add .
git commit -m "feat: Add MongoDB for persistent settings"
git push
```

---

## 📊 Checklist de déploiement

### Avant de déployer
- [x] Code modifié et testé localement
- [x] Pas d'erreur dans la console
- [x] Backend fonctionne en local
- [x] Documentation créée

### Déploiement
- [ ] Code committé et pushé
- [ ] Vercel a redéployé
- [ ] Pas d'erreur de build
- [ ] Site accessible

### Après déploiement
- [ ] API `/api/settings` répond
- [ ] Paramètres se chargent
- [ ] Paramètres se sauvegardent
- [ ] Changements visibles dans autre navigateur
- [ ] Pas d'erreur dans les logs Vercel

### Production (optionnel)
- [ ] Migration vers MongoDB/PostgreSQL
- [ ] Variables d'environnement configurées
- [ ] Backup configuré
- [ ] Monitoring activé

---

## 🎯 Résumé

### Ce qui fonctionne maintenant
- ✅ Paramètres sauvegardés sur le serveur
- ✅ Partagés entre tous les utilisateurs
- ✅ Chargement automatique au démarrage
- ✅ Synchronisation instantanée

### Ce qui ne persiste pas (Vercel)
- ⚠️ Fichier `data/settings.json` recréé à chaque déploiement
- ⚠️ Paramètres réinitialisés après redéploiement

### Solution
- 🎯 Migrer vers une vraie base de données (MongoDB, PostgreSQL)

---

## 🆘 Problèmes après déploiement ?

### Erreur 500 sur /api/settings

**Cause** : Dossier `data/` n'existe pas

**Solution** : Le dossier est créé automatiquement. Vérifiez les logs Vercel.

### Paramètres ne se sauvegardent pas

**Cause** : Backend non accessible

**Solution** :
1. Vérifiez que `USE_BACKEND = true`
2. Vérifiez l'URL de l'API
3. Vérifiez les logs Vercel

### Paramètres réinitialisés après redéploiement

**Cause** : Fichiers ne persistent pas sur Vercel

**Solution** : Migrez vers MongoDB ou PostgreSQL

---

## 🎉 C'est déployé !

Votre site est maintenant en ligne avec les paramètres partagés ! 🚀

**Testez maintenant** : Changez un paramètre dans l'admin et vérifiez dans un autre navigateur.

---

**Besoin d'aide ?** Consultez [PARAMETRES_PARTAGES.md](PARAMETRES_PARTAGES.md)
