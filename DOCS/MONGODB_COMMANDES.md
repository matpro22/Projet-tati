# 💾 Enregistrement des commandes dans MongoDB

## ✅ Configuration actuelle

Les commandes sont maintenant correctement enregistrées dans MongoDB avec les améliorations suivantes :

### 1. Sauvegarde des commandes

**Route** : `POST /api/confirm-payment`

**Fonctionnement** :
- Après confirmation du paiement Stripe, la commande est créée
- Sauvegarde directe dans MongoDB avec `insertOne()` (pas de suppression/réinsertion)
- Fallback automatique vers fichier JSON si MongoDB échoue
- Email de confirmation envoyé automatiquement (si configuré)

**Logs** :
```
📝 Confirmation paiement: pi_xxxxx
📊 Statut paiement: succeeded
💾 Sauvegarde de la commande: BZ-1234567890
✓ Commande sauvegardée dans MongoDB
✓ Email de confirmation envoyé
```

### 2. Lecture des commandes

**Route** : `GET /api/orders`

**Fonctionnement** :
- Lit toutes les commandes depuis MongoDB (collection `orders`)
- Fallback automatique vers fichier JSON si MongoDB non disponible
- Utilisé par l'interface admin pour afficher les commandes

### 3. Mise à jour du statut

**Route** : `PATCH /api/orders/:id/status`

**Fonctionnement** :
- Mise à jour directe dans MongoDB avec `findOneAndUpdate()`
- Pas de suppression/réinsertion de toutes les commandes
- Fallback automatique vers fichier JSON si MongoDB échoue
- Ajoute automatiquement un champ `updatedAt`

**Exemple** :
```javascript
PATCH /api/orders/BZ-1234567890/status
Body: { "status": "shipped" }
```

### 4. Email de confirmation

**Fonction** : `sendOrderConfirmationEmail(order)`

**Contenu de l'email** :
- Numéro de commande
- Date et statut
- Liste des articles commandés
- Détails de facturation (sous-total, livraison, total)
- Adresse de livraison
- Informations de contact

**Configuration requise** :
- Variables d'environnement email configurées (voir `.env`)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`

## 📊 Structure d'une commande dans MongoDB

```javascript
{
  id: "BZ-1776115234567",           // ID unique
  date: "2024-04-14T10:30:00.000Z", // Date ISO
  status: "processing",              // pending, processing, shipped, delivered, cancelled
  paymentIntentId: "pi_xxxxx",      // ID Stripe
  customer: {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean@example.com",
    address: "123 Rue Example",
    city: "Paris",
    zip: "75001"
  },
  items: [
    {
      id: "patch-s",
      name: "Patch BackZo",
      size: "S",
      price: 13,
      quantity: 2
    }
  ],
  total: 33,                         // Total TTC
  shipping: 7,                       // Frais de livraison
  updatedAt: "2024-04-14T11:00:00.000Z" // Dernière mise à jour (optionnel)
}
```

## 🔧 Configuration MongoDB

### Variables d'environnement

Dans `.env` ou sur Vercel :
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/backzo?retryWrites=true&w=majority
```

### Collections utilisées

- `orders` : Toutes les commandes
- `products` : Catalogue de produits
- `settings` : Paramètres du site (incluant la clé Stripe)

### Connexion

- Timeout de 5 secondes pour éviter les blocages
- Fallback automatique vers fichiers JSON si échec
- Logs détaillés pour le débogage

## 🧪 Tester l'enregistrement

### Test 1 : Créer une commande

1. Allez sur votre site
2. Ajoutez un produit au panier
3. Allez au checkout
4. Remplissez le formulaire
5. Utilisez une carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/25`
   - CVC : `123`
6. Confirmez le paiement

### Test 2 : Vérifier dans MongoDB

1. Allez sur MongoDB Atlas : https://cloud.mongodb.com
2. Connectez-vous à votre cluster
3. Cliquez sur "Browse Collections"
4. Sélectionnez la base `backzo` > collection `orders`
5. Vous devriez voir votre commande

### Test 3 : Vérifier dans l'admin

1. Allez sur votre site > Admin
2. Connectez-vous
3. Onglet "Commandes"
4. Vous devriez voir toutes les commandes

### Test 4 : Mettre à jour le statut

1. Dans l'admin, cliquez sur une commande
2. Changez le statut (ex: "En cours" → "Expédiée")
3. Vérifiez dans MongoDB que le statut a été mis à jour

## 📧 Configuration email (optionnel)

Pour recevoir des emails de confirmation :

### Sur OVH

```env
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=465
EMAIL_USER=team@backzo.eu
EMAIL_PASS=votre_mot_de_passe
EMAIL_FROM=team@backzo.eu
EMAIL_TO=team@backzo.eu
```

### Sur Gmail

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre.email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application
EMAIL_FROM=votre.email@gmail.com
EMAIL_TO=votre.email@gmail.com
```

⚠️ **Note** : Pour Gmail, vous devez créer un "mot de passe d'application" dans les paramètres de sécurité.

## 🔍 Logs de débogage

### Logs serveur (Vercel)

```
📝 Confirmation paiement: pi_xxxxx
📊 Statut paiement: succeeded
💾 Sauvegarde de la commande: BZ-1234567890
✓ Commande sauvegardée dans MongoDB
✓ Email de confirmation envoyé
```

### Logs en cas d'erreur

```
❌ Erreur sauvegarde MongoDB: connection timeout
✓ Commande sauvegardée dans fichier JSON (fallback)
⚠️  Erreur envoi email: Invalid credentials
```

## ✅ Avantages de cette implémentation

1. **Fiabilité** : Fallback automatique vers fichiers JSON si MongoDB échoue
2. **Performance** : Insertion directe sans suppression/réinsertion
3. **Traçabilité** : Logs détaillés à chaque étape
4. **Scalabilité** : MongoDB peut gérer des milliers de commandes
5. **Sécurité** : Données sauvegardées dans le cloud (MongoDB Atlas)
6. **Confirmation** : Email automatique au client

## 🆘 Problèmes courants

### Problème : Les commandes ne s'enregistrent pas

**Vérifications** :
1. MongoDB est-il connecté ? Vérifiez les logs : `✓ MongoDB connecté`
2. La variable `MONGODB_URI` est-elle configurée sur Vercel ?
3. L'utilisateur MongoDB a-t-il les permissions d'écriture ?

### Problème : Les commandes sont en double

**Cause** : L'ancienne méthode `writeData` supprimait et réinsérait toutes les commandes

**Solution** : Utilisez la nouvelle version qui utilise `insertOne()` directement

### Problème : Email non envoyé

**Vérifications** :
1. Les variables email sont-elles configurées ?
2. Le mot de passe est-il correct ?
3. Le serveur SMTP est-il accessible depuis Vercel ?

---

**Dernière mise à jour** : Amélioration de l'enregistrement des commandes dans MongoDB
