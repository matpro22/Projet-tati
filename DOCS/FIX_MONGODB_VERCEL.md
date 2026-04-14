# 🔧 Correction MongoDB sur Vercel

## 🐛 Problème identifié

Les erreurs `ENOENT: no such file or directory, open '/var/task/data/orders.json'` indiquent que :

1. **MongoDB n'est pas connecté** sur Vercel
2. Le système essaie d'utiliser les **fichiers JSON en fallback**
3. Le système de fichiers Vercel est **en lecture seule** (pas de dossier `/var/task/data/`)

## ✅ Corrections apportées

### 1. Connexion MongoDB lazy (à la demande)

Au lieu de se connecter au démarrage, MongoDB se connecte maintenant **à la première requête** :

```javascript
// Connexion avec cache
async function connectMongoDB() {
  // Si déjà connecté, retourner true
  if (db) return true;
  
  // Si une connexion est en cours, attendre
  if (isConnecting && connectionPromise) {
    return await connectionPromise;
  }
  
  // Connexion...
}
```

### 2. Connexion automatique dans toutes les fonctions

Toutes les fonctions qui accèdent à MongoDB se connectent automatiquement :

- `readData()` - Se connecte avant de lire
- `writeData()` - Se connecte avant d'écrire
- `getSettings()` - Se connecte avant de lire les paramètres
- `saveSettings()` - Se connecte avant de sauvegarder
- Route `/api/confirm-payment` - Se connecte avant de sauvegarder la commande

### 3. Pas de fallback fichiers sur Vercel

Sur Vercel, si MongoDB échoue, on retourne une erreur au lieu d'essayer les fichiers :

```javascript
if (process.env.VERCEL) {
  console.warn('⚠️  MongoDB non disponible sur Vercel, retour tableau vide');
  return [];
}
```

### 4. Valeurs par défaut pour les paramètres

Si MongoDB n'est pas disponible, `getSettings()` retourne des valeurs par défaut au lieu de planter.

## 🚀 Configuration requise sur Vercel

### Variables d'environnement obligatoires

| Variable | Valeur | Description |
|----------|--------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | URI de connexion MongoDB Atlas |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Clé secrète Stripe |
| `STRIPE_PUBLIC_KEY` | `pk_test_...` | Clé publique Stripe |

⚠️ **IMPORTANT** : Sans `MONGODB_URI`, l'application ne fonctionnera pas sur Vercel !

### Vérifier la configuration MongoDB

1. **Allez sur MongoDB Atlas** : https://cloud.mongodb.com
2. **Vérifiez l'accès réseau** :
   - Database Access > Network Access
   - Ajoutez `0.0.0.0/0` pour autoriser toutes les IPs (ou les IPs de Vercel)
3. **Vérifiez l'utilisateur** :
   - Database Access > Database Users
   - L'utilisateur doit avoir les permissions `readWrite` sur la base `backzo`

### Vérifier la configuration Vercel

1. **Allez sur Vercel** : https://vercel.com/dashboard
2. **Settings > Environment Variables**
3. **Vérifiez que `MONGODB_URI` est bien configurée**
4. **Redéployez** après toute modification

## 🧪 Tester la connexion MongoDB

### Test 1 : Route health

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

### Test 2 : Logs Vercel

Allez sur Vercel > Deployments > Functions > Logs

Logs attendus :
```
🔄 Connexion à MongoDB...
✓ MongoDB connecté
```

Logs d'erreur possibles :
```
✗ Erreur connexion MongoDB: connection timeout
→ Vérifiez que l'IP est autorisée sur MongoDB Atlas

✗ Erreur connexion MongoDB: authentication failed
→ Vérifiez le nom d'utilisateur et mot de passe

✗ Erreur connexion MongoDB: ENOTFOUND
→ Vérifiez l'URI MongoDB
```

### Test 3 : Créer une commande

1. Testez un paiement sur votre site
2. Vérifiez les logs Vercel :
   ```
   🔄 Connexion à MongoDB...
   ✓ MongoDB connecté
   💾 Sauvegarde de la commande: BZ-xxxxx
   ✓ Commande sauvegardée dans MongoDB
   ```
3. Vérifiez dans MongoDB Atlas > Browse Collections > `orders`

## 📊 Logs attendus (succès)

```
🔄 Connexion à MongoDB...
✓ MongoDB connecté
📡 Requête /api/stripe-config reçue
✓ Clé Stripe depuis variables d'environnement: pk_test_xxxxx...
📝 Création PaymentIntent - Montant: 33 eur
✓ PaymentIntent créé: pi_xxxxx
📝 Confirmation paiement: pi_xxxxx
📊 Statut paiement: succeeded
💾 Sauvegarde de la commande: BZ-1776115234567
✓ Commande sauvegardée dans MongoDB
✓ Email de confirmation envoyé
```

## ❌ Erreurs courantes

### Erreur : "ENOENT: no such file or directory"

**Cause** : MongoDB n'est pas connecté, le système essaie d'utiliser les fichiers

**Solution** :
1. Vérifiez que `MONGODB_URI` est configurée sur Vercel
2. Vérifiez que l'URI est valide
3. Vérifiez que l'IP est autorisée sur MongoDB Atlas
4. Redéployez

### Erreur : "connection timeout"

**Cause** : MongoDB Atlas n'est pas accessible depuis Vercel

**Solution** :
1. Allez sur MongoDB Atlas > Network Access
2. Ajoutez `0.0.0.0/0` (autoriser toutes les IPs)
3. Attendez 2-3 minutes que la configuration se propage
4. Testez à nouveau

### Erreur : "authentication failed"

**Cause** : Nom d'utilisateur ou mot de passe incorrect

**Solution** :
1. Vérifiez l'URI MongoDB dans les variables d'environnement
2. Vérifiez que le mot de passe ne contient pas de caractères spéciaux non encodés
3. Si le mot de passe contient `@`, `#`, etc., encodez-le en URL
4. Exemple : `p@ssw0rd` → `p%40ssw0rd`

### Erreur : "MongoDB non disponible sur Vercel"

**Cause** : MongoDB n'a pas pu se connecter après plusieurs tentatives

**Solution** :
1. Vérifiez tous les points ci-dessus
2. Testez la connexion localement avec la même URI
3. Vérifiez les logs Vercel pour plus de détails

## 🎯 Checklist de déploiement

Avant de déployer, vérifiez :

- [ ] `MONGODB_URI` configurée sur Vercel
- [ ] URI MongoDB valide (commence par `mongodb+srv://`)
- [ ] Utilisateur MongoDB créé avec permissions `readWrite`
- [ ] IP `0.0.0.0/0` autorisée sur MongoDB Atlas (ou IPs de Vercel)
- [ ] `STRIPE_SECRET_KEY` configurée sur Vercel
- [ ] `STRIPE_PUBLIC_KEY` configurée sur Vercel
- [ ] Modifications poussées sur Git
- [ ] Déploiement Vercel terminé
- [ ] Logs Vercel vérifiés : `✓ MongoDB connecté`
- [ ] Test de paiement effectué avec succès

---

**Dernière mise à jour** : Connexion MongoDB lazy pour Vercel Serverless
