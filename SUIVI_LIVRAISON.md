# 📦 Système de Suivi de Livraison

## Fonctionnalité

Lorsqu'une commande est marquée comme **"Livrée"** dans le panel administrateur, le système demande automatiquement un numéro de suivi qui sera ensuite envoyé au client par email.

## Comment ça fonctionne ?

### 1. Dans le Panel Admin

1. Connectez-vous au panel admin
2. Accédez à l'onglet **"Commandes"**
3. Sélectionnez une commande et changez son statut vers **"Livré"**
4. Une modal s'ouvre automatiquement pour demander le numéro de suivi
5. Saisissez le numéro de suivi (optionnel) ou laissez vide
6. Cliquez sur **"Confirmer la livraison"**

### 2. Email au Client

Le client reçoit automatiquement un email contenant :
- ✅ Confirmation que la commande est livrée
- 📦 Le numéro de suivi (si fourni) dans un encadré bien visible
- ⭐ Un lien pour laisser un avis sur la commande

### 3. Détails de Commande

Le numéro de suivi est également visible dans les détails de la commande :
- Dans le panel admin, cliquez sur **"👁️ Détails"** d'une commande
- Le numéro de suivi apparaît sous le statut de la commande

## Exemple d'Email

```
┌─────────────────────────────────────┐
│  BACKZO                             │
│  Mise à jour de commande            │
└─────────────────────────────────────┘

Bonjour Jean Dupont,

Le statut de votre commande a été mis à jour.

┌─────────────────────────────────────┐
│  Commande BZ-20240421-001           │
│  ✅ Livrée                          │
│                                     │
│  Votre commande a été livrée.       │
│  Nous espérons que vous en êtes     │
│  satisfait !                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  📦 Numéro de suivi :               │
│                                     │
│  1Z999AA10123456784                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ⭐ Votre avis compte !              │
│                                     │
│  Nous espérons que vous êtes        │
│  satisfait de votre commande.       │
│  Partagez votre expérience !        │
│                                     │
│  [⭐ Donner mon avis]                │
└─────────────────────────────────────┘
```

## Modifications Techniques

### Backend (server.js)

1. **Route `/api/orders/:id/status`** :
   - Accepte maintenant un paramètre `trackingNumber` optionnel
   - Stocke le numéro de suivi dans la base de données

2. **Fonction `sendOrderStatusUpdateEmail`** :
   - Prend un paramètre `trackingNumber` optionnel
   - Affiche le numéro de suivi dans l'email si fourni

### Frontend (public/index.html)

1. **Fonction `updateOrderStatus`** :
   - Détecte quand le statut passe à "delivered"
   - Ouvre une modal pour saisir le numéro de suivi

2. **Nouvelle modal `showTrackingNumberModal`** :
   - Interface élégante pour saisir le numéro
   - Validation avec la touche Entrée
   - Option d'annulation

3. **Fonction `showOrderDetails`** :
   - Affiche le numéro de suivi dans les détails de commande

## Base de Données

Le numéro de suivi est stocké dans l'objet commande :

```json
{
  "id": "BZ-20240421-001",
  "status": "delivered",
  "trackingNumber": "1Z999AA10123456784",
  "customer": { ... },
  "items": [ ... ],
  ...
}
```

## Compatibilité

- ✅ MongoDB : Le numéro de suivi est stocké dans la collection `orders`
- ✅ Fichiers JSON : Le numéro de suivi est stocké dans `data/orders.json`
- ✅ Mode local : Fonctionne également en mode hors ligne

## Notes

- Le numéro de suivi est **optionnel** - vous pouvez le laisser vide
- Le numéro de suivi peut contenir n'importe quel format (lettres, chiffres, tirets)
- Si aucun numéro n'est fourni, l'email est quand même envoyé sans cette section
- Le numéro de suivi peut être modifié en changeant à nouveau le statut

## Améliorations Futures

- [ ] Intégration avec des API de transporteurs (Colissimo, Chronopost, UPS, etc.)
- [ ] Suivi en temps réel du colis
- [ ] Notifications push quand le colis est en transit
- [ ] Historique des changements de statut avec horodatage
