# 🔐 Guide d'intégration Stripe pour BackZo

## 📋 Étapes d'intégration

### 1. Obtenir votre clé Stripe

1. Créez un compte sur [stripe.com](https://stripe.com)
2. Allez sur [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
3. Copiez votre **clé publique** :
   - **Mode test** : `pk_test_...` (pour les tests)
   - **Mode production** : `pk_live_...` (pour le vrai site)

### 2. Configurer la clé dans BackZo

1. Connectez-vous à l'admin (cliquez sur le point dans le footer)
   - Identifiant : `admin`
   - Mot de passe : `BackZo2024!`

2. Allez dans **Paramètres** (dernier onglet)

3. Dans la section **Paiement — Stripe**, collez votre clé publique

4. Cliquez sur **Enregistrer les paramètres**

### 3. Tester le paiement

1. Ajoutez un produit au panier
2. Cliquez sur **Finaliser la commande**
3. Remplissez les informations
4. Utilisez une carte de test Stripe :
   - **Numéro** : `4242 4242 4242 4242`
   - **Date** : N'importe quelle date future (ex: 12/25)
   - **CVV** : N'importe quel 3 chiffres (ex: 123)

5. Cliquez sur **Confirmer & Payer**

## 🎯 Ce qui fonctionne actuellement

✅ Intégration Stripe Elements (formulaire de carte sécurisé)
✅ Validation des cartes en temps réel
✅ Création de PaymentMethod
✅ Gestion des erreurs de paiement
✅ Interface utilisateur adaptée
✅ Mode test et production

## ⚠️ Ce qu'il faut ajouter pour la production

Pour un site en production, vous devez créer un **backend** (serveur) qui :

1. **Crée un PaymentIntent** côté serveur
2. **Confirme le paiement** de manière sécurisée
3. **Gère les webhooks** Stripe pour les notifications

### Exemple de backend Node.js minimal

```javascript
// server.js
const express = require('express');
const stripe = require('stripe')('sk_test_VOTRE_CLE_SECRETE');
const app = express();

app.use(express.json());

// Créer un PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe utilise les centimes
      currency: currency || 'eur',
      automatic_payment_methods: { enabled: true }
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Serveur sur port 3000'));
```

### Modification du code frontend

Dans `placeOrder()`, remplacez la section de paiement par :

```javascript
// Appeler votre backend pour créer un PaymentIntent
const response = await fetch('https://votre-backend.com/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    amount: finalTotal,
    currency: 'eur'
  })
});

const { clientSecret } = await response.json();

// Confirmer le paiement
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: `${fn} ${ln}`,
      email: email
    }
  }
});

if (error) {
  showToast(error.message, true);
} else if (paymentIntent.status === 'succeeded') {
  // Paiement réussi !
  showToast('✓ Paiement confirmé !');
}
```

## 🔒 Sécurité

- ✅ **Jamais** stocker les numéros de carte
- ✅ **Toujours** utiliser Stripe Elements (formulaire sécurisé)
- ✅ **Jamais** exposer votre clé secrète (`sk_...`) dans le frontend
- ✅ **Toujours** valider les paiements côté serveur

## 📚 Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Cartes de test](https://stripe.com/docs/testing)
- [Webhooks](https://stripe.com/docs/webhooks)

## 💡 Mode actuel (sans backend)

Le site fonctionne actuellement en mode **démo** :
- ✅ Le formulaire Stripe s'affiche
- ✅ Les cartes sont validées
- ✅ Un PaymentMethod est créé
- ⚠️ Le paiement n'est pas réellement débité (il faut un backend)
- ✅ Les commandes sont enregistrées localement

C'est parfait pour tester l'interface et le parcours utilisateur !
