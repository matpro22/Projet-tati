# 🚀 Déployer maintenant sur Vercel

## ⚡ Guide ultra-rapide (5 minutes)

### Étape 1 : Configurer les variables d'environnement (2 min)

1. **Allez sur Vercel** : https://vercel.com/dashboard
2. **Sélectionnez** votre projet "projet-tati"
3. **Cliquez** sur "Settings" (en haut)
4. **Cliquez** sur "Environment Variables" (menu gauche)
5. **Ajoutez** ces 3 variables :

```
STRIPE_SECRET_KEY = sk_test_51Lxm7xK8gHuDBE8kFP3zPWUBEknQitU8rXDJggG3Jh7BKX7rMabXO636JJVmC1460Tf4snEZXz6VKROm9qu36h3q00hZ7zwTXd
STRIPE_PUBLIC_KEY = [VOTRE_CLE_PUBLIQUE_ICI]
MONGODB_URI = mongodb+srv://khenaffoumathias_db_user:aXi9eVoHyTuvr6Xs@cluster0.y4gvdra.mongodb.net/cluster0?retryWrites=true&w=majority
```

⚠️ **Remplacez `[VOTRE_CLE_PUBLIQUE_ICI]`** par votre vraie clé publique Stripe (commence par `pk_test_`)

6. **Sélectionnez** "Production, Preview, Development" pour chaque variable
7. **Cliquez** sur "Save" pour chaque variable

### Étape 2 : Redéployer (1 min)

#### Option A : Via Git (si vous utilisez Git)

```bash
git add .
git commit -m "Fix Vercel deployment"
git push
```

#### Option B : Via le dashboard Vercel

1. **Allez** dans l'onglet "Deployments"
2. **Cliquez** sur les 3 points (...) à droite du dernier déploiement
3. **Cliquez** sur "Redeploy"
4. **Attendez** 1-2 minutes

### Étape 3 : Vérifier (2 min)

1. **Ouvrez** https://projet-tati.vercel.app/api/health
2. **Vous devriez voir** :
   ```json
   {
     "status": "ok",
     "stripe": true,
     "database": "MongoDB"
   }
   ```

3. **Ouvrez** https://projet-tati.vercel.app
4. **Ouvrez** la console (F12)
5. **Vous ne devriez plus voir** d'erreur 500

## ✅ C'est fait !

Votre site est maintenant déployé et fonctionnel sur Vercel.

## 🧪 Tester les paiements

1. **Allez** sur votre site
2. **Ajoutez** un produit au panier (si la boutique est disponible)
3. **Allez** au checkout
4. **Utilisez** une carte de test :
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/25`
   - CVC : `123`
5. **Confirmez** le paiement

## 🔍 Déboguer si nécessaire

Si vous avez encore des erreurs :

1. **Vérifiez** les logs Vercel :
   - Dashboard > Deployments > Cliquez sur le déploiement > Functions > Logs

2. **Vérifiez** la console navigateur (F12)

3. **Testez** la configuration Stripe :
   - Admin > Paramètres > "🔍 Tester la configuration Stripe"

4. **Envoyez-moi** les logs si le problème persiste

---

**Temps total** : ~5 minutes
**Difficulté** : Facile
**Prérequis** : Compte Vercel + Clés Stripe
