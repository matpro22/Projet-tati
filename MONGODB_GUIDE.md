# 🍃 Guide MongoDB pour BackZo

## ✅ Implémentation terminée !

Le backend supporte maintenant **MongoDB** avec fallback automatique vers les fichiers JSON si MongoDB n'est pas configuré.

## 🎯 Comment ça marche

### Sans MongoDB (par défaut)
```
Backend démarre
    ↓
MongoDB non configuré
    ↓
✅ Utilise les fichiers JSON (data/*.json)
```

### Avec MongoDB
```
Backend démarre
    ↓
Connexion à MongoDB
    ↓
✅ Utilise MongoDB pour tout
```

## 🚀 Configuration MongoDB

### Option 1 : MongoDB Atlas (Cloud - Gratuit) ⭐ Recommandé

#### 1. Créer un compte

1. Allez sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Cliquez sur **"Try Free"**
3. Créez un compte (Google, GitHub, ou email)

#### 2. Créer un cluster

1. Choisissez **"M0 Sandbox"** (gratuit)
2. Sélectionnez une région proche (ex: Paris, Frankfurt)
3. Nommez votre cluster : **backzo**
4. Cliquez sur **"Create"**
5. Attendez 3-5 minutes ⏳

#### 3. Créer un utilisateur

1. Cliquez sur **"Database Access"** (menu gauche)
2. Cliquez sur **"Add New Database User"**
3. Choisissez **"Password"**
4. Nom d'utilisateur : `backzo_admin`
5. Mot de passe : Générez un mot de passe fort (notez-le !)
6. Rôle : **"Read and write to any database"**
7. Cliquez sur **"Add User"**

#### 4. Autoriser l'accès

1. Cliquez sur **"Network Access"** (menu gauche)
2. Cliquez sur **"Add IP Address"**
3. Cliquez sur **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Cliquez sur **"Confirm"**

⚠️ **En production** : Limitez aux IPs de votre serveur !

#### 5. Récupérer l'URL de connexion

1. Cliquez sur **"Database"** (menu gauche)
2. Cliquez sur **"Connect"** sur votre cluster
3. Choisissez **"Connect your application"**
4. Copiez l'URL de connexion :
   ```
   mongodb+srv://backzo_admin:<password>@backzo.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### 6. Configurer dans .env

Éditez votre fichier `.env` :

```env
MONGODB_URI=mongodb+srv://backzo_admin:VOTRE_MOT_DE_PASSE@backzo.xxxxx.mongodb.net/backzo?retryWrites=true&w=majority
```

⚠️ **Important** : Remplacez `<password>` par votre vrai mot de passe !

#### 7. Redémarrer le backend

```bash
npm start
```

Vous devriez voir :
```
✓ MongoDB connecté
✓ MongoDB initialisé
🚀 BackZo Backend démarré !
💾 Base de données : ✓ MongoDB
```

✅ **C'est fait !** Vos données sont maintenant dans MongoDB !

---

### Option 2 : MongoDB Local

#### 1. Installer MongoDB

**Windows** :
1. Téléchargez depuis [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Installez avec les options par défaut
3. MongoDB démarre automatiquement

**Mac** (avec Homebrew) :
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux** (Ubuntu/Debian) :
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### 2. Configurer dans .env

```env
MONGODB_URI=mongodb://localhost:27017/backzo
```

#### 3. Redémarrer le backend

```bash
npm start
```

---

## 🧪 Tester MongoDB

### 1. Vérifier la connexion

```bash
# Démarrer le backend
npm start

# Vous devriez voir :
✓ MongoDB connecté
✓ MongoDB initialisé
💾 Base de données : ✓ MongoDB
```

### 2. Tester l'API

```bash
# Health check
curl http://localhost:3000/api/health

# Devrait retourner :
{
  "status": "ok",
  "database": "MongoDB"  # ← Confirme MongoDB
}
```

### 3. Ajouter des données

1. Ouvrez le site
2. Admin > Paramètres
3. Changez le nom du site
4. Enregistrez
5. ✅ Sauvegardé dans MongoDB !

### 4. Vérifier dans MongoDB Atlas

1. Allez sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Cliquez sur **"Browse Collections"**
3. Vous devriez voir :
   - Collection `settings` avec vos paramètres
   - Collection `products` avec les produits
   - Collection `orders` avec les commandes

---

## 📊 Structure MongoDB

### Base de données : `backzo`

### Collections :

#### `settings`
```javascript
{
  _id: "global",
  siteName: "BackZo",
  email: "team@backzo.eu",
  shipping: 5.90,
  ...
  updatedAt: ISODate("2024-...")
}
```

#### `products`
```javascript
{
  id: "prod-1234567890",
  name: "Flocage Amovible S",
  price: 12,
  category: "particuliers",
  stock: 100,
  active: true,
  createdAt: ISODate("2024-...")
}
```

#### `orders`
```javascript
{
  id: "BZ-1234567890",
  date: ISODate("2024-..."),
  status: "processing",
  customer: { ... },
  items: [ ... ],
  total: 17.90
}
```

---

## 🔄 Migration des données

### De JSON vers MongoDB

Si vous avez déjà des données dans les fichiers JSON :

```bash
# 1. Sauvegarder vos données JSON
cp -r data data_backup

# 2. Configurer MongoDB dans .env
# MONGODB_URI=mongodb+srv://...

# 3. Redémarrer le backend
npm start

# 4. Les données par défaut sont créées dans MongoDB

# 5. Importer vos anciennes données (optionnel)
# Utilisez MongoDB Compass ou mongoimport
```

### De MongoDB vers JSON

Pour revenir aux fichiers JSON :

```bash
# 1. Commentez MONGODB_URI dans .env
# MONGODB_URI=

# 2. Redémarrer le backend
npm start

# ✅ Utilise à nouveau les fichiers JSON
```

---

## 🚀 Déploiement avec MongoDB

### Sur Vercel

1. **Ajoutez la variable d'environnement** :
   - Vercel Dashboard > Settings > Environment Variables
   - Nom : `MONGODB_URI`
   - Valeur : `mongodb+srv://...`

2. **Redéployez** :
   ```bash
   git push
   ```

3. **Vérifiez** :
   ```bash
   curl https://votre-site.vercel.app/api/health
   # Devrait retourner : "database": "MongoDB"
   ```

### Sur Heroku

```bash
# Ajouter la variable
heroku config:set MONGODB_URI="mongodb+srv://..."

# Redéployer
git push heroku main
```

### Sur Railway

```bash
# Ajouter la variable dans le dashboard
# Ou via CLI :
railway variables set MONGODB_URI="mongodb+srv://..."
```

---

## 🔒 Sécurité

### ✅ Bonnes pratiques

- ✅ Utilisez un mot de passe fort
- ✅ Limitez les IPs autorisées en production
- ✅ Utilisez des utilisateurs avec permissions limitées
- ✅ Activez l'authentification
- ✅ Utilisez SSL/TLS (automatique avec Atlas)
- ✅ Ne commitez JAMAIS le `.env`

### ⚠️ À éviter

- ❌ Mot de passe faible
- ❌ Accès depuis n'importe où (0.0.0.0/0) en production
- ❌ Utilisateur admin pour l'application
- ❌ URL de connexion dans le code
- ❌ Pas de backup

---

## 📈 Avantages MongoDB

### vs Fichiers JSON

| Fonctionnalité | JSON | MongoDB |
|----------------|------|---------|
| Persistance sur Vercel | ❌ | ✅ |
| Performance | ⚠️ Lent | ✅ Rapide |
| Requêtes complexes | ❌ | ✅ |
| Scalabilité | ❌ | ✅ |
| Backup automatique | ❌ | ✅ |
| Transactions | ❌ | ✅ |
| Recherche avancée | ❌ | ✅ |

---

## 🐛 Dépannage

### Erreur "MongoServerError: bad auth"

**Cause** : Mot de passe incorrect

**Solution** :
1. Vérifiez le mot de passe dans `.env`
2. Vérifiez qu'il n'y a pas de caractères spéciaux non encodés
3. Encodez les caractères spéciaux : `@` → `%40`, `#` → `%23`

### Erreur "MongoNetworkError"

**Cause** : IP non autorisée

**Solution** :
1. MongoDB Atlas > Network Access
2. Ajoutez votre IP ou 0.0.0.0/0

### "MongoDB non configuré - Utilisation des fichiers JSON"

**Cause** : `MONGODB_URI` vide ou invalide

**Solution** :
1. Vérifiez que `MONGODB_URI` est dans `.env`
2. Vérifiez le format de l'URL
3. Redémarrez le backend

### Les données ne s'affichent pas

**Cause** : Collections vides

**Solution** :
1. Vérifiez dans MongoDB Atlas > Browse Collections
2. Les collections sont créées automatiquement au premier démarrage
3. Ajoutez des données via l'admin

---

## 📚 Ressources

- **MongoDB Atlas** : [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Documentation MongoDB** : [docs.mongodb.com](https://docs.mongodb.com)
- **MongoDB Compass** (GUI) : [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- **MongoDB University** (gratuit) : [university.mongodb.com](https://university.mongodb.com)

---

## ✅ Checklist

### Configuration
- [ ] Compte MongoDB Atlas créé
- [ ] Cluster créé
- [ ] Utilisateur créé
- [ ] IP autorisée
- [ ] URL de connexion récupérée
- [ ] `MONGODB_URI` ajouté dans `.env`
- [ ] Backend redémarré

### Test
- [ ] Backend démarre sans erreur
- [ ] Message "✓ MongoDB connecté"
- [ ] `/api/health` retourne "MongoDB"
- [ ] Données se sauvegardent
- [ ] Données persistent après redémarrage

### Production
- [ ] `MONGODB_URI` ajouté dans Vercel
- [ ] Site redéployé
- [ ] Données persistent après redéploiement
- [ ] Backup configuré
- [ ] IPs limitées

---

## 🎉 C'est prêt !

Votre backend utilise maintenant MongoDB ! Les données persistent même après redéploiement sur Vercel. 🚀

**Testez maintenant** : Changez un paramètre, redéployez, et vérifiez qu'il est toujours là !

---

**Besoin d'aide ?** Consultez la [documentation MongoDB](https://docs.mongodb.com)
