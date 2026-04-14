# 🔧 Correction erreur SSL MongoDB

## 🐛 Erreur identifiée

```
✗ Erreur connexion MongoDB: C0D85BD7CA7F0000:error:0A000438:SSL routines:ssl3_read_bytes:tlsv1 alert internal error:ssl/record/rec_layer_s3.c:912:SSL alert number 80
```

Cette erreur SSL/TLS indique un problème de connexion sécurisée avec MongoDB Atlas.

## 🔍 Causes possibles

1. **Version de Node.js incompatible** avec MongoDB Atlas
2. **URI MongoDB incorrecte** ou mal formatée
3. **Paramètres de connexion manquants**
4. **Problème de certificat SSL**
5. **Restrictions réseau** sur MongoDB Atlas

## ✅ Solutions

### Solution 1 : Vérifier l'URI MongoDB (PRIORITAIRE)

L'URI doit être au format correct :

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE?retryWrites=true&w=majority
```

**Vérifications** :

1. **Commence par `mongodb+srv://`** (pas `mongodb://`)
2. **Mot de passe encodé** si contient des caractères spéciaux
3. **Nom du cluster correct** (ex: `cluster0.y4gvdra.mongodb.net`)
4. **Paramètres présents** : `retryWrites=true&w=majority`

**Exemple d'URI correcte** :
```
mongodb+srv://khenaffoumathias_db_user:aXi9eVoHyTuvr6Xs@cluster0.y4gvdra.mongodb.net/cluster0?retryWrites=true&w=majority
```

### Solution 2 : Encoder le mot de passe

Si votre mot de passe contient des caractères spéciaux, encodez-le :

| Caractère | Encodé |
|-----------|--------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `[` | `%5B` |
| `]` | `%5D` |
| `%` | `%25` |

**Exemple** :
- Mot de passe : `p@ssw0rd!`
- Encodé : `p%40ssw0rd%21`

**Outil en ligne** : https://www.urlencoder.org/

### Solution 3 : Vérifier la configuration MongoDB Atlas

#### 3.1 Accès réseau

1. Allez sur https://cloud.mongodb.com
2. Cliquez sur votre cluster
3. **Network Access** (menu gauche)
4. Vérifiez qu'une de ces règles existe :
   - `0.0.0.0/0` (autoriser toutes les IPs)
   - OU les IPs de Vercel

**Ajouter une règle** :
1. Cliquez sur "Add IP Address"
2. Cliquez sur "Allow Access from Anywhere"
3. Cliquez sur "Confirm"
4. Attendez 2-3 minutes que la configuration se propage

#### 3.2 Utilisateur de base de données

1. **Database Access** (menu gauche)
2. Vérifiez que votre utilisateur existe
3. Vérifiez les permissions : `readWrite` sur la base `backzo` (ou `Atlas admin`)

**Créer/Modifier un utilisateur** :
1. Cliquez sur "Edit" ou "Add New Database User"
2. Nom d'utilisateur : `khenaffoumathias_db_user`
3. Mot de passe : `aXi9eVoHyTuvr6Xs` (ou générez-en un nouveau)
4. Database User Privileges : `Atlas admin` ou `Read and write to any database`
5. Cliquez sur "Update User" ou "Add User"

### Solution 4 : Obtenir une nouvelle URI

Si l'URI est incorrecte, obtenez-en une nouvelle :

1. Allez sur MongoDB Atlas
2. Cliquez sur votre cluster
3. Cliquez sur "Connect"
4. Choisissez "Connect your application"
5. Driver : `Node.js`
6. Version : `5.5 or later`
7. Copiez l'URI affichée
8. Remplacez `<password>` par votre mot de passe
9. Remplacez `<database>` par `backzo` ou `cluster0`

**Exemple d'URI générée** :
```
mongodb+srv://khenaffoumathias_db_user:<password>@cluster0.y4gvdra.mongodb.net/?retryWrites=true&w=majority
```

**URI finale** (après remplacement) :
```
mongodb+srv://khenaffoumathias_db_user:aXi9eVoHyTuvr6Xs@cluster0.y4gvdra.mongodb.net/backzo?retryWrites=true&w=majority
```

### Solution 5 : Mettre à jour sur Vercel

1. Allez sur Vercel Dashboard
2. Sélectionnez votre projet
3. Settings > Environment Variables
4. Modifiez `MONGODB_URI` avec la nouvelle URI
5. Cliquez sur "Save"
6. Redéployez :
   - Allez dans "Deployments"
   - Cliquez sur les 3 points (...) du dernier déploiement
   - Cliquez sur "Redeploy"

## 🧪 Tester la connexion

### Test 1 : Localement

Créez un fichier `test-mongodb.js` :

```javascript
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
  try {
    console.log('🔄 Test de connexion MongoDB...');
    console.log('URI:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    
    await client.connect();
    console.log('✓ Connexion réussie !');
    
    await client.db('admin').command({ ping: 1 });
    console.log('✓ Ping réussi !');
    
    const db = client.db('backzo');
    const collections = await db.listCollections().toArray();
    console.log('✓ Collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('✓ Test terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  }
}

testConnection();
```

Exécutez :
```bash
node test-mongodb.js
```

### Test 2 : Sur Vercel

Après redéploiement, vérifiez les logs :

1. Vercel Dashboard > Deployments
2. Cliquez sur le dernier déploiement
3. Cliquez sur "Functions" > Sélectionnez une fonction
4. Regardez les logs

**Logs attendus** :
```
🔄 Connexion à MongoDB...
✓ MongoDB connecté
```

**Logs d'erreur** :
```
✗ Erreur connexion MongoDB: [message d'erreur]
```

### Test 3 : Via l'API

```
GET https://projet-tati.vercel.app/api/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "timestamp": "2024-04-14T...",
  "stripe": true,
  "database": "MongoDB"
}
```

## 📋 Checklist de résolution

- [ ] URI MongoDB commence par `mongodb+srv://`
- [ ] Mot de passe encodé si contient des caractères spéciaux
- [ ] Paramètres `retryWrites=true&w=majority` présents
- [ ] Accès réseau configuré sur MongoDB Atlas (`0.0.0.0/0`)
- [ ] Utilisateur MongoDB existe avec permissions `readWrite`
- [ ] URI mise à jour sur Vercel
- [ ] Application redéployée
- [ ] Test local réussi
- [ ] Logs Vercel vérifiés : `✓ MongoDB connecté`
- [ ] API `/api/health` retourne `"database": "MongoDB"`

## 🆘 Si le problème persiste

### Option 1 : Créer un nouveau cluster

Si le cluster actuel a des problèmes :

1. Allez sur MongoDB Atlas
2. Créez un nouveau cluster (gratuit M0)
3. Configurez l'accès réseau (`0.0.0.0/0`)
4. Créez un nouvel utilisateur
5. Obtenez la nouvelle URI
6. Mettez à jour sur Vercel
7. Redéployez

### Option 2 : Utiliser une URI de connexion directe

Au lieu de `mongodb+srv://`, essayez une connexion directe :

1. MongoDB Atlas > Connect > Connect your application
2. Choisissez "I'm not using DNS SRV"
3. Copiez l'URI (commence par `mongodb://`)
4. Mettez à jour sur Vercel

### Option 3 : Contacter le support

Si rien ne fonctionne :

1. Vérifiez le statut de MongoDB Atlas : https://status.mongodb.com/
2. Contactez le support MongoDB Atlas
3. Envoyez-moi les logs complets (Vercel + test local)

---

**Dernière mise à jour** : Guide de résolution erreur SSL MongoDB
