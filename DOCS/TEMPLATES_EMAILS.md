# 📧 Templates d'Emails - BackZo

## 📋 Vue d'Ensemble

Ce document décrit tous les templates d'emails utilisés par BackZo.

## 🎨 Design Commun

Tous les emails partagent :

- **Header** : Fond noir avec logo BackZo (vert et blanc)
- **Corps** : Fond blanc avec bordures arrondies
- **Footer** : Informations de contact sur fond gris clair
- **Typographie** : Arial, sans-serif
- **Couleurs** :
  - Noir : `#000`
  - Vert BackZo : `#b8ff57`
  - Blanc : `#fff`
  - Gris : `#999`, `#666`, `#333`

## 📧 Template 1 : Confirmation de Commande (Client)

### Déclencheur
Dès qu'une commande est confirmée et payée.

### Destinataire
Email du client.

### Sujet
```
✅ Confirmation de commande {order.id} - BackZo
```

### Structure

```
┌─────────────────────────────────────┐
│ Header BackZo (noir + vert)        │
│ "Confirmation de commande"          │
├─────────────────────────────────────┤
│ Merci pour votre commande !         │
│                                     │
│ Bonjour {firstName} {lastName},     │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Détails de la commande      │   │
│ │ - Numéro : {order.id}       │   │
│ │ - Date : {date}             │   │
│ │ - Statut : En traitement    │   │
│ └─────────────────────────────┘   │
│                                     │
│ Articles commandés                  │
│ • {item.name} - {qty}x - {price}€  │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Sous-total : {subtotal}€    │   │
│ │ Livraison : {shipping}€     │   │
│ │ Total TTC : {total}€        │   │
│ └─────────────────────────────┘   │
│                                     │
│ Adresse de livraison                │
│ {address}                           │
│                                     │
│ 📦 Suivi : Email dès expédition     │
├─────────────────────────────────────┤
│ Footer (contact)                    │
└─────────────────────────────────────┘
```

### Variables

- `{order.id}` : Numéro de commande (ex: BZ-1234567890)
- `{firstName}` : Prénom du client
- `{lastName}` : Nom du client
- `{date}` : Date de la commande
- `{item.name}` : Nom de l'article
- `{item.size}` : Taille (optionnel)
- `{item.quantity}` : Quantité
- `{item.price}` : Prix unitaire
- `{subtotal}` : Sous-total
- `{shipping}` : Frais de livraison
- `{total}` : Total TTC
- `{address}` : Adresse complète

## 📧 Template 2 : Notification de Commande (Admin)

### Déclencheur
Dès qu'une commande est confirmée et payée.

### Destinataire
`team@backzo.eu` (admin).

### Sujet
```
🔔 Nouvelle commande {order.id} - BackZo
```

### Structure

```
┌─────────────────────────────────────┐
│ Header BackZo (noir + vert)        │
│ "Nouvelle commande reçue"           │
├─────────────────────────────────────┤
│ 🎉 Nouvelle commande !              │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Commande {order.id}         │   │
│ │ {total}€                    │   │
│ └─────────────────────────────┘   │
│                                     │
│ Informations client                 │
│ • Nom : {firstName} {lastName}      │
│ • Email : {email}                   │
│ • Adresse : {address}               │
│ • Date : {date}                     │
│                                     │
│ Articles commandés                  │
│ • {item.name} - {qty}x - {price}€  │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Total : {total}€            │   │
│ └─────────────────────────────┘   │
│                                     │
│ ⚡ Action : Préparez la commande    │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

### Variables

Mêmes variables que le template client, plus :
- `{email}` : Email du client

## 📧 Template 3 : Mise à Jour de Statut

### Déclencheur
Chaque fois que le statut d'une commande change.

### Destinataire
Email du client.

### Sujet
```
{icon} Mise à jour de votre commande {order.id} - BackZo
```

### Structure

```
┌─────────────────────────────────────┐
│ Header BackZo (noir + vert)        │
│ "Mise à jour de commande"           │
├─────────────────────────────────────┤
│ Bonjour {firstName} {lastName},     │
│                                     │
│ Le statut a été mis à jour.         │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Commande {order.id}         │   │
│ │ {icon} {statusLabel}        │   │
│ │ {statusMessage}             │   │
│ └─────────────────────────────┘   │
│                                     │
│ {additionalInfo}                    │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

### Variables par Statut

#### ⏳ En attente (pending)
- `{icon}` : ⏳
- `{statusLabel}` : En attente
- `{color}` : #ffcc00 (jaune)
- `{statusMessage}` : Votre commande est en attente de traitement.

#### ⚙️ En cours de traitement (processing)
- `{icon}` : ⚙️
- `{statusLabel}` : En cours de traitement
- `{color}` : #3399ff (bleu)
- `{statusMessage}` : Votre commande est en cours de préparation.

#### 📦 Expédiée (shipped)
- `{icon}` : 📦
- `{statusLabel}` : Expédiée
- `{color}` : #ff9900 (orange)
- `{statusMessage}` : Votre commande a été expédiée et est en route vers vous !
- `{additionalInfo}` : Encadré bleu avec "Suivi : Livraison sous 2-3 jours"

#### ✅ Livrée (delivered)
- `{icon}` : ✅
- `{statusLabel}` : Livrée
- `{color}` : #00cc00 (vert)
- `{statusMessage}` : Votre commande a été livrée. Nous espérons que vous en êtes satisfait !
- `{additionalInfo}` : Encadré vert avec "⭐ Votre avis compte !"

#### ❌ Annulée (cancelled)
- `{icon}` : ❌
- `{statusLabel}` : Annulée
- `{color}` : #ff0000 (rouge)
- `{statusMessage}` : Votre commande a été annulée.

## 🎨 Composants Réutilisables

### Header

```html
<div style="background: #000; color: #b8ff57; padding: 20px; text-align: center;">
  <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">
    BACK<span style="color: #fff;">ZO</span>
  </h1>
  <p style="margin: 10px 0 0; font-size: 14px; color: #999;">
    {subtitle}
  </p>
</div>
```

### Encadré d'Information

```html
<div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #b8ff57; border-radius: 4px;">
  {content}
</div>
```

### Encadré de Statut

```html
<div style="background: {color}15; border-left: 4px solid {color}; padding: 20px; margin: 20px 0; border-radius: 4px;">
  <p style="margin: 0; color: {color}; font-size: 24px; font-weight: bold;">
    {icon} {label}
  </p>
  <p style="margin: 15px 0 0; color: #333;">
    {message}
  </p>
</div>
```

### Tableau de Prix

```html
<div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 4px;">
  <table style="width: 100%;">
    <tr>
      <td style="padding: 5px 0; color: #666;">Sous-total :</td>
      <td style="padding: 5px 0; text-align: right; color: #000;">{subtotal} €</td>
    </tr>
    <tr>
      <td style="padding: 5px 0; color: #666;">Livraison :</td>
      <td style="padding: 5px 0; text-align: right; color: #000;">{shipping} €</td>
    </tr>
    <tr style="border-top: 2px solid #ddd;">
      <td style="padding: 10px 0 5px; font-size: 18px; font-weight: bold;">Total TTC :</td>
      <td style="padding: 10px 0 5px; text-align: right; color: #b8ff57; font-size: 20px; font-weight: bold;">{total} €</td>
    </tr>
  </table>
</div>
```

### Footer

```html
<div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
  <p style="margin: 0;">BackZo — Flocage amovible premium</p>
  <p style="margin: 5px 0 0;">www.backzo.eu</p>
</div>
```

## 🔧 Personnalisation

### Modifier un Template

1. **Ouvrir `server.js`**
2. **Trouver la fonction** :
   - `sendOrderConfirmationEmail()` pour la confirmation
   - `sendOrderStatusUpdateEmail()` pour les mises à jour
3. **Modifier le HTML** dans la propriété `html` de `mailOptions`
4. **Tester localement** : `npm run test-email`
5. **Déployer sur Vercel**

### Ajouter un Nouveau Statut

Dans `sendOrderStatusUpdateEmail()`, ajoutez dans `statusInfo` :

```javascript
nouveauStatut: {
  label: 'Libellé du statut',
  color: '#couleur',
  icon: '🔔',
  message: 'Message pour le client.'
}
```

### Changer les Couleurs

Modifiez les valeurs hexadécimales dans les styles inline :

- Vert BackZo : `#b8ff57`
- Noir : `#000`
- Blanc : `#fff`
- Gris : `#999`, `#666`, `#333`

## 📱 Responsive Design

Les emails sont conçus pour être responsive :

- Largeur maximale : 600px
- Padding adaptatif
- Tableaux avec largeur 100%
- Texte lisible sur mobile

## ✅ Bonnes Pratiques

### HTML Email

- ✅ Utiliser des tableaux pour la mise en page
- ✅ Styles inline uniquement
- ✅ Éviter les CSS complexes
- ✅ Tester dans plusieurs clients email
- ✅ Largeur maximale de 600px
- ✅ Images hébergées (pas d'attachements)

### Contenu

- ✅ Sujet clair et concis
- ✅ Informations essentielles en haut
- ✅ Call-to-action visible
- ✅ Coordonnées de contact
- ✅ Lien de désabonnement (si newsletter)

### Accessibilité

- ✅ Texte alternatif pour les images
- ✅ Contraste suffisant
- ✅ Taille de police lisible (min 14px)
- ✅ Structure sémantique

## 🧪 Tests

### Clients Email à Tester

- Gmail (web + mobile)
- Outlook (web + desktop)
- Apple Mail (macOS + iOS)
- Thunderbird
- Yahoo Mail

### Outils de Test

- [Litmus](https://litmus.com/) - Test multi-clients
- [Email on Acid](https://www.emailonacid.com/) - Test et validation
- [Mail Tester](https://www.mail-tester.com/) - Score spam

## 📊 Métriques

### À Suivre

- Taux d'ouverture
- Taux de clic
- Taux de spam
- Temps de lecture

### Optimisation

- Tester différents sujets
- A/B testing du contenu
- Optimiser les images
- Réduire le poids total

## 📞 Support

Pour modifier les templates :

1. Consultez `SYSTEME_EMAILS_COMMANDES.md`
2. Éditez `server.js`
3. Testez avec `npm run test-email`
4. Déployez sur Vercel

Pour des questions spécifiques :
- Email : team@backzo.eu
- Documentation : Fichiers `*.md` du projet
