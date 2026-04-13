# ⚡ Solution rapide - Configurer Stripe sur Vercel

## 🎯 Problème identifié

L'erreur 500 sur `/api/stripe-config` indique que le serveur a un problème pour récupérer la clé Stripe depuis MongoDB. La solution la plus simple est de configurer la clé directement dans les variables d'environnement Vercel.

## ✅ Solution en 3 étapes

### Étape 1 : Récupérer vos clés Stripe

1. Allez sur https://dashboard.stripe.com/apikeys
2. Copiez ces deux clés :
   - **Clé publique** (commence par `pk_test_` ou `pk_live_`)
   - **Clé secrète** (commence par `sk_test_` ou `sk_live_`)

⚠️ **Important** : Les deux clés doivent être du même type (test ou live)

### Étape 2 : Configurer sur Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet "projet-tati"
3. Cliquez sur "Settings" (en haut)
4. Cliquez sur "Environment Variables" (menu de gauche)
5. Ajoutez ou modifiez ces variables :

| Name | Value | Environment |
|------|-------|-------------|
| `STRIPE_PUBLIC_KEY` | `pk_test_xxxxx...` (votre clé publique) | Production, Preview, Development |
| `STRIPE_SECRET_KEY` | `sk_test_xxxxx...` (votre clé secrète) | Production, Preview, Development |

6. Cliquez sur "Save" pour chaque variable

### Étape 3 : Redéployer

1. Allez dans l'onglet "Deployments"
2. Cliquez sur les 3 points (...) du dernier déploiement
3. Cliquez sur "Redeploy"
4. Attendez que le déploiement soit terminé (environ 1-2 minutes)

## 🧪 Tester la configuration

1. Allez sur votre site : https://projet-tati.vercel.app
2. Ouvrez la console (F12)
3. Allez sur la page Checkout (ajoutez un produit au panier)
4. Vous devriez voir dans la console :
   ```
   Clé Stripe reçue: pk_test_xxxxx...
   Initialisation de Stripe...
   ✓ Stripe initialisé avec succès
   ```

## 🎉 C'est tout !

Votre configuration Stripe devrait maintenant fonctionner. Vous pouvez tester un paiement avec une carte de test :

- **Numéro** : `4242 4242 4242 4242`
- **Date** : N'importe quelle date future (ex: 12/25)
- **CVC** : N'importe quel 3 chiffres (ex: 123)

---

## 🔄 Alternative : Configurer via MongoDB

Si vous préférez utiliser MongoDB (pour pouvoir changer la clé sans redéployer) :

1. Assurez-vous que `MONGODB_URI` est bien configuré sur Vercel
2. Allez sur votre site > Admin > Paramètres
3. Collez votre clé publique dans le champ "Clé publique Stripe"
4. Cliquez sur "Enregistrer les paramètres"
5. Testez avec le bouton "🔍 Tester la configuration Stripe"

**Note** : Avec cette méthode, vous devez quand même configurer `STRIPE_SECRET_KEY` sur Vercel (la clé secrète ne doit jamais être dans MongoDB pour des raisons de sécurité).

---

## ❓ Questions fréquentes

### Q : Quelle est la différence entre clé test et clé live ?

- **Test** (`pk_test_` / `sk_test_`) : Pour les tests, aucun vrai paiement n'est effectué
- **Live** (`pk_live_` / `sk_live_`) : Pour la production, les vrais paiements sont effectués

### Q : Puis-je voir mes clés actuelles sur Vercel ?

Non, Vercel ne montre jamais les valeurs des variables d'environnement pour des raisons de sécurité. Vous pouvez seulement les modifier ou les supprimer.

### Q : Dois-je redéployer après chaque modification ?

Oui, les modifications des variables d'environnement nécessitent un redéploiement pour être prises en compte.

### Q : Comment savoir si ma clé est valide ?

Une clé Stripe valide :
- Commence par `pk_test_`, `pk_live_`, `sk_test_`, ou `sk_live_`
- Fait environ 100 caractères
- Ne contient que des lettres et chiffres (pas d'espaces)

---

## 🆘 Besoin d'aide ?

Si vous avez toujours des problèmes après avoir suivi ces étapes, envoyez-moi :
1. Une capture d'écran de vos variables d'environnement Vercel (masquez les valeurs)
2. Les logs de la console (F12) quand vous essayez d'accéder au checkout
3. Les logs Vercel (Deployments > Functions > Logs)
