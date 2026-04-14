# 🔍 Guide de débogage Stripe - MISE À JOUR

## ✅ NOUVEAU : Outil de test intégré

J'ai ajouté un bouton de test dans l'interface admin pour diagnostiquer rapidement les problèmes Stripe.

### Comment l'utiliser :

1. Connectez-vous à l'admin (bouton "Admin" en bas de page)
2. Allez dans l'onglet "Paramètres"
3. Cliquez sur le bouton "🔍 Tester la configuration Stripe"
4. Ouvrez la console (F12) pour voir les résultats détaillés

Le test vérifie automatiquement :
- ✓ Les paramètres locaux (frontend)
- ✓ Les paramètres sur le serveur (MongoDB)
- ✓ La route `/api/stripe-config`
- ✓ L'état d'initialisation de Stripe

---

## Problème actuel
Erreur "Clé Stripe non configurée" alors que la clé est configurée dans MongoDB ou Vercel.

## ✅ Modifications apportées

### 1. Logs ajoutés côté serveur (`server.js`)
- ✓ Logs dans `/api/create-payment-intent` pour voir la création du PaymentIntent
- ✓ Logs dans `/api/confirm-payment` pour voir la confirmation
- ✓ Vérification que Stripe est bien initialisé avant chaque opération

### 2. Logs ajoutés côté frontend (`public/index.html`)
- ✓ Logs au début de `placeOrder()` pour voir l'état de Stripe
- ✓ Logs à chaque étape du processus de paiement (création, confirmation, enregistrement)
- ✓ Logs d'erreur détaillés avec le message exact

## 🔧 Comment déboguer

### Étape 0: Tester la configuration Stripe localement (optionnel)
Si vous testez en local, vous pouvez vérifier rapidement votre configuration:

```bash
node test-stripe.js
```

Ce script va:
- Vérifier que les clés Stripe sont bien définies
- Vérifier qu'elles sont valides (commencent par `sk_` et `pk_`)
- Vérifier qu'elles correspondent (test/test ou live/live)
- Tester la connexion à l'API Stripe

### Étape 1: Vérifier la configuration Stripe sur Vercel
1. Allez sur votre dashboard Vercel
2. Sélectionnez votre projet
3. Allez dans "Settings" > "Environment Variables"
4. Vérifiez que ces variables sont bien configurées:
   - `STRIPE_SECRET_KEY` = `sk_test_51Lxm7xK8gHuDBE8k...` (commence par `sk_test_` ou `sk_live_`)
   - `STRIPE_PUBLIC_KEY` = `pk_test_51Lxm7xK8gHuDBE8k...` (commence par `pk_test_` ou `pk_live_`)

⚠️ **IMPORTANT**: La clé publique dans votre `.env` local est invalide (contient "YvYvYv..."). Vous devez:
- Soit la corriger dans `.env` pour les tests locaux
- Soit la configurer correctement sur Vercel pour la production

### Étape 2: Vérifier la configuration dans MongoDB
1. Connectez-vous à l'admin du site (bouton "Admin" en bas de page)
2. Allez dans "Paramètres"
3. Vérifiez que la clé Stripe est bien configurée
4. Si elle est vide ou invalide, collez votre vraie clé publique Stripe

### Étape 3: Tester le paiement et consulter les logs

#### Sur le navigateur (Console F12):
1. Ouvrez la console (F12)
2. Allez sur la page Checkout
3. Remplissez le formulaire
4. Cliquez sur "Confirmer & Payer"
5. Regardez les logs dans la console:

```
💳 Début du processus de paiement - Total: XX.XX €
🔍 État Stripe: { USE_BACKEND: true, stripeInitialized: true, cardElementMounted: true }
📡 Étape 1: Création du PaymentIntent...
✓ PaymentIntent créé: pi_xxxxx
💳 Étape 2: Confirmation du paiement avec Stripe...
✓ Paiement confirmé: succeeded
📦 Étape 3: Enregistrement de la commande...
```

Si vous voyez une erreur, notez le message exact.

#### Sur Vercel (Logs serveur):
1. Allez sur votre dashboard Vercel
2. Sélectionnez votre projet
3. Allez dans "Deployments" > Cliquez sur le dernier déploiement
4. Cliquez sur "Functions" > Sélectionnez une fonction
5. Regardez les logs en temps réel

Vous devriez voir:
```
📝 Création PaymentIntent - Montant: XX.XX eur
✓ PaymentIntent créé: pi_xxxxx
📝 Confirmation paiement: pi_xxxxx
📊 Statut paiement: succeeded
```

### Étape 4: Erreurs courantes et solutions

#### Erreur: "Configuration Stripe manquante"
**Cause**: La clé secrète Stripe n'est pas configurée sur le serveur
**Solution**: Configurez `STRIPE_SECRET_KEY` dans les variables d'environnement Vercel

#### Erreur: "Stripe non configuré sur le serveur"
**Cause**: La clé publique Stripe n'est pas configurée
**Solution**: 
1. Configurez la clé dans MongoDB (Admin > Paramètres)
2. OU configurez `STRIPE_PUBLIC_KEY` dans les variables d'environnement Vercel

#### Erreur: "No such payment_intent: 'pi_xxxxx'"
**Cause**: Ancien PaymentIntent en cache ou clé Stripe incorrecte
**Solution**: 
1. Videz le cache du navigateur (Ctrl+Shift+Delete)
2. Vérifiez que vous utilisez la bonne clé Stripe (test vs live)
3. Vérifiez que la clé secrète et la clé publique correspondent au même compte Stripe

#### Erreur: "Your card was declined"
**Cause**: Carte de test invalide
**Solution**: Utilisez une carte de test Stripe valide:
- Numéro: `4242 4242 4242 4242`
- Date: N'importe quelle date future (ex: 12/25)
- CVC: N'importe quel 3 chiffres (ex: 123)

## 📋 Checklist de vérification

- [ ] Clé secrète Stripe configurée sur Vercel (`STRIPE_SECRET_KEY`)
- [ ] Clé publique Stripe configurée (MongoDB ou Vercel)
- [ ] Les deux clés proviennent du même compte Stripe
- [ ] Les deux clés sont du même type (test ou live)
- [ ] Cache navigateur vidé
- [ ] Carte de test valide utilisée
- [ ] Logs console vérifiés (F12)
- [ ] Logs Vercel vérifiés

## 🆘 Si le problème persiste

Envoyez-moi:
1. Les logs de la console navigateur (F12) lors de la tentative de paiement
2. Les logs Vercel lors de la tentative de paiement
3. Une capture d'écran de vos variables d'environnement Vercel (masquez les valeurs sensibles)

Je pourrai alors identifier précisément le problème !
