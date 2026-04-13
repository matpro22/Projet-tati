# 🔧 Résolution du problème "Clé non configurée"

## ✅ Modifications apportées

J'ai ajouté des outils de débogage pour identifier le problème :

1. **Bouton de test dans l'admin** : "🔍 Tester la configuration Stripe"
2. **Logs détaillés** dans la console pour voir exactement ce qui se passe
3. **Réinitialisation automatique** de Stripe après sauvegarde des paramètres

## 🎯 Comment résoudre le problème

### Étape 1 : Récupérer votre clé publique Stripe

1. Allez sur https://dashboard.stripe.com/apikeys
2. Copiez votre **clé publique** (commence par `pk_test_` ou `pk_live_`)
3. ⚠️ **NE PAS** copier la clé secrète (celle qui commence par `sk_`)

### Étape 2 : Configurer la clé dans MongoDB

#### Option A : Via l'interface admin (RECOMMANDÉ)

1. Allez sur votre site BackZo
2. Cliquez sur "Admin" en bas de page
3. Connectez-vous avec le mot de passe admin
4. Allez dans l'onglet "Paramètres"
5. Collez votre clé publique Stripe dans le champ "Clé publique Stripe (pk_...)"
6. Cliquez sur "Enregistrer les paramètres"
7. Cliquez sur "🔍 Tester la configuration Stripe"
8. Regardez la console (F12) pour voir les résultats

#### Option B : Via les variables d'environnement Vercel

1. Allez sur votre dashboard Vercel
2. Sélectionnez votre projet
3. Allez dans "Settings" > "Environment Variables"
4. Ajoutez ou modifiez `STRIPE_PUBLIC_KEY` avec votre clé publique
5. Redéployez votre application

### Étape 3 : Vérifier la configuration

1. Ouvrez la console du navigateur (F12)
2. Cliquez sur "🔍 Tester la configuration Stripe" dans l'admin
3. Vous devriez voir :

```
🔍 === TEST CONFIGURATION STRIPE ===

1️⃣ Paramètres locaux (state.settings):
   stripeKey: pk_test_xxxxx...

2️⃣ Paramètres sur le serveur:
   stripeKey: pk_test_xxxxx...
   Tous les champs: [..., stripeKey, ...]

3️⃣ Route /api/stripe-config:
   publicKey: pk_test_xxxxx...

4️⃣ État Stripe frontend:
   stripe initialisé: true
   cardElement monté: true

📊 RÉSUMÉ:
✅ Clé Stripe configurée et valide
```

### Étape 4 : Tester un paiement

1. Allez sur la page Boutique (si elle est disponible)
2. Ajoutez un produit au panier
3. Allez au checkout
4. Remplissez le formulaire
5. Utilisez une carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : N'importe quelle date future (ex: 12/25)
   - CVC : N'importe quel 3 chiffres (ex: 123)
6. Cliquez sur "Confirmer & Payer"
7. Regardez les logs dans la console

## 🐛 Problèmes courants

### Problème 1 : "Clé Stripe non configurée sur le serveur"

**Cause** : La clé n'est pas sauvegardée dans MongoDB ou les variables d'environnement

**Solution** :
1. Vérifiez que vous avez bien cliqué sur "Enregistrer les paramètres" dans l'admin
2. Vérifiez que la clé commence bien par `pk_test_` ou `pk_live_`
3. Testez avec le bouton "🔍 Tester la configuration Stripe"

### Problème 2 : "stripeKey: AUCUNE" dans les logs

**Cause** : La clé n'est pas sauvegardée dans MongoDB

**Solution** :
1. Allez dans l'admin > Paramètres
2. Vérifiez que le champ "Clé publique Stripe" contient bien votre clé
3. Si le champ est vide, collez votre clé et cliquez sur "Enregistrer"
4. Rechargez la page et testez à nouveau

### Problème 3 : "stripe initialisé: false"

**Cause** : Stripe n'a pas pu s'initialiser avec la clé fournie

**Solution** :
1. Vérifiez que la clé est valide (commence par `pk_`)
2. Vérifiez que vous n'avez pas copié la clé secrète par erreur
3. Essayez de sauvegarder à nouveau les paramètres (cela réinitialise Stripe)

### Problème 4 : Erreur 500 sur /api/stripe-config

**Cause** : Problème de connexion à MongoDB ou erreur serveur

**Solution** :
1. Vérifiez les logs Vercel (Deployments > Functions > Logs)
2. Vérifiez que MongoDB est bien connecté
3. Vérifiez que la variable `MONGODB_URI` est configurée sur Vercel

## 📋 Checklist finale

- [ ] Clé publique Stripe récupérée depuis dashboard.stripe.com
- [ ] Clé commence par `pk_test_` ou `pk_live_`
- [ ] Clé sauvegardée dans l'admin > Paramètres
- [ ] Bouton "Enregistrer les paramètres" cliqué
- [ ] Test effectué avec le bouton "🔍 Tester la configuration Stripe"
- [ ] Console affiche "✅ Configuration Stripe OK !"
- [ ] Paiement test effectué avec succès

## 🆘 Si le problème persiste

Envoyez-moi les logs complets du test :
1. Ouvrez la console (F12)
2. Cliquez sur "🔍 Tester la configuration Stripe"
3. Copiez tous les logs affichés
4. Envoyez-moi également les logs Vercel si possible

Je pourrai alors identifier précisément le problème !
