# 🔧 Correction de l'erreur 500 sur Vercel

## 🐛 Problème identifié

L'erreur "FUNCTION_INVOCATION_FAILED" sur Vercel était causée par :

1. **`app.listen()` appelé sur Vercel Serverless** - Sur Vercel, on ne doit PAS appeler `app.listen()`, seulement exporter l'app
2. **Stripe initialisé sans vérification** - Si `STRIPE_SECRET_KEY` n'est pas définie, `require('stripe')(undefined)` plante
3. **`initDB()` bloquant** - L'initialisation de la DB bloquait le démarrage

## ✅ Corrections apportées

### 1. Démarrage conditionnel du serveur

```javascript
// Démarrer le serveur seulement en mode local (pas sur Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    // ...
  });
}
```

Sur Vercel, l'app est simplement exportée sans appeler `listen()`.

### 2. Initialisation sécurisée de Stripe

```javascript
// Initialiser Stripe seulement si la clé est configurée
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
  console.error('❌ STRIPE_SECRET_KEY manquante');
}
```

Stripe n'est initialisé que si la clé est valide.

### 3. Initialisation asynchrone de la DB

```javascript
// Initialiser la base de données
initDB().then(() => {
  console.log('✓ Base de données initialisée');
}).catch(error => {
  console.error('❌ Erreur initialisation DB:', error.message);
});
```

L'initialisation ne bloque plus le démarrage.

## 🚀 Déploiement

### Étape 1 : Configurer les variables d'environnement sur Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet "projet-tati"
3. Settings > Environment Variables
4. Ajoutez ces variables :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `STRIPE_SECRET_KEY` | `sk_test_xxxxx...` | Production, Preview, Development |
| `STRIPE_PUBLIC_KEY` | `pk_test_xxxxx...` | Production, Preview, Development |
| `MONGODB_URI` | `mongodb+srv://...` | Production, Preview, Development |

⚠️ **Important** : Les deux clés Stripe doivent être du même type (test ou live)

### Étape 2 : Redéployer

Deux options :

#### Option A : Via Git (recommandé)

```bash
git add .
git commit -m "Fix Vercel serverless deployment"
git push
```

Vercel redéploiera automatiquement.

#### Option B : Via le dashboard Vercel

1. Allez dans "Deployments"
2. Cliquez sur les 3 points (...) du dernier déploiement
3. Cliquez sur "Redeploy"

### Étape 3 : Vérifier le déploiement

1. Attendez que le déploiement soit terminé (1-2 minutes)
2. Allez sur https://projet-tati.vercel.app
3. Ouvrez la console (F12)
4. Vous ne devriez plus voir d'erreur 500

## 🧪 Tester la configuration

### Test 1 : Route de santé

Ouvrez dans votre navigateur :
```
https://projet-tati.vercel.app/api/health
```

Vous devriez voir :
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "stripe": true,
  "database": "MongoDB"
}
```

### Test 2 : Configuration Stripe

Ouvrez dans votre navigateur :
```
https://projet-tati.vercel.app/api/stripe-config
```

Vous devriez voir :
```json
{
  "publicKey": "pk_test_xxxxx..."
}
```

### Test 3 : Interface admin

1. Allez sur https://projet-tati.vercel.app
2. Cliquez sur "Admin" en bas de page
3. Allez dans "Paramètres"
4. Cliquez sur "🔍 Tester la configuration Stripe"
5. Regardez les logs dans la console (F12)

Vous devriez voir :
```
✅ Configuration Stripe OK !
```

## 📊 Logs Vercel

Pour voir les logs en temps réel :

1. Allez sur Vercel Dashboard
2. Sélectionnez votre projet
3. Cliquez sur "Deployments"
4. Cliquez sur le dernier déploiement
5. Cliquez sur "Functions" > Sélectionnez une fonction
6. Vous verrez les logs en temps réel

Logs attendus :
```
✓ Stripe initialisé avec clé secrète: sk_test_xxxxx...
✓ MongoDB connecté
✓ Base de données initialisée
```

## ❌ Erreurs courantes

### Erreur : "STRIPE_SECRET_KEY manquante"

**Cause** : La variable d'environnement n'est pas configurée sur Vercel

**Solution** :
1. Vérifiez Settings > Environment Variables
2. Ajoutez `STRIPE_SECRET_KEY` avec votre clé secrète
3. Redéployez

### Erreur : "MongoDB connection failed"

**Cause** : `MONGODB_URI` invalide ou MongoDB Atlas non accessible

**Solution** :
1. Vérifiez que `MONGODB_URI` est bien configurée
2. Vérifiez que votre IP est autorisée sur MongoDB Atlas (ou autorisez 0.0.0.0/0)
3. Vérifiez que l'utilisateur MongoDB a les bonnes permissions

### Erreur : "Function timeout"

**Cause** : La fonction prend trop de temps à s'exécuter

**Solution** :
1. Vérifiez que MongoDB répond rapidement
2. Optimisez les requêtes lentes
3. Augmentez le timeout dans `vercel.json` (max 60s sur le plan gratuit)

## 🎉 Résultat attendu

Après ces corrections, votre site devrait :
- ✅ Se charger sans erreur 500
- ✅ Afficher la configuration Stripe correctement
- ✅ Permettre les paiements avec Stripe
- ✅ Sauvegarder les commandes dans MongoDB
- ✅ Fonctionner en mode serverless sur Vercel

## 🆘 Support

Si vous avez toujours des erreurs :

1. Vérifiez les logs Vercel (Deployments > Functions > Logs)
2. Vérifiez la console navigateur (F12)
3. Testez les routes `/api/health` et `/api/stripe-config`
4. Envoyez-moi les logs complets

---

**Dernière mise à jour** : Corrections pour Vercel Serverless
