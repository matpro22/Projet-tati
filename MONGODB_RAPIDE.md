# ⚡ MongoDB en 5 minutes

## 🎯 Configuration ultra-rapide

### 1. Créer un compte MongoDB Atlas (2 min)

1. Allez sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Cliquez sur **"Try Free"**
3. Créez un compte avec Google ou GitHub

### 2. Créer un cluster (1 min)

1. Choisissez **"M0 Sandbox"** (gratuit)
2. Région : **Paris** ou **Frankfurt**
3. Nom : **backzo**
4. Cliquez sur **"Create"**
5. Attendez 3 minutes ⏳

### 3. Créer un utilisateur (30 sec)

1. **Database Access** > **Add New Database User**
2. User : `backzo_admin`
3. Password : Générez un mot de passe (notez-le !)
4. Rôle : **Read and write to any database**
5. **Add User**

### 4. Autoriser l'accès (30 sec)

1. **Network Access** > **Add IP Address**
2. **Allow Access from Anywhere** (0.0.0.0/0)
3. **Confirm**

### 5. Récupérer l'URL (30 sec)

1. **Database** > **Connect** > **Connect your application**
2. Copiez l'URL :
   ```
   mongodb+srv://backzo_admin:<password>@backzo.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Configurer (30 sec)

Éditez `.env` :

```env
MONGODB_URI=mongodb+srv://backzo_admin:VOTRE_MOT_DE_PASSE@backzo.xxxxx.mongodb.net/backzo?retryWrites=true&w=majority
```

⚠️ Remplacez `<password>` par votre vrai mot de passe !

### 7. Démarrer (10 sec)

```bash
npm start
```

Vous devriez voir :
```
✓ MongoDB connecté
✓ MongoDB initialisé
💾 Base de données : ✓ MongoDB
```

## ✅ C'est fait !

Vos données sont maintenant dans MongoDB et persistent même après redéploiement ! 🎉

---

## 🚀 Déployer sur Vercel

```bash
# 1. Ajouter la variable dans Vercel
# Dashboard > Settings > Environment Variables
# MONGODB_URI = mongodb+srv://...

# 2. Redéployer
git add .
git commit -m "feat: Add MongoDB support"
git push

# 3. Vérifier
curl https://votre-site.vercel.app/api/health
# Devrait retourner : "database": "MongoDB"
```

---

## 🧪 Tester

```bash
# 1. Changer un paramètre dans l'admin
# Admin > Paramètres > Changez le nom > Enregistrez

# 2. Vérifier dans MongoDB Atlas
# Database > Browse Collections > settings

# 3. Redémarrer le backend
# Ctrl+C puis npm start

# 4. Vérifier que les données sont toujours là
# ✅ Elles persistent !
```

---

**Guide complet** : [MONGODB_GUIDE.md](MONGODB_GUIDE.md)
