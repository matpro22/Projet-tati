# 📧 Système d'Emails pour les Commandes

## ✅ Fonctionnalités Implémentées

Le système d'emails BackZo envoie automatiquement des notifications par email dans les situations suivantes :

### 1. Confirmation de Commande

**Quand ?** Dès qu'un client finalise sa commande et que le paiement est confirmé.

**Qui reçoit ?**
- ✉️ **Le client** : Email de confirmation avec tous les détails
- ✉️ **Vous (admin)** : Notification de nouvelle commande

**Contenu de l'email client :**
- Numéro de commande
- Date et statut
- Liste des articles commandés
- Détail des prix (sous-total, livraison, total TTC)
- Adresse de livraison
- Informations de contact

**Contenu de l'email admin :**
- Notification de nouvelle commande
- Informations du client (nom, email, adresse)
- Liste des articles
- Montant total
- Rappel d'action (préparer la commande)

### 2. Mise à Jour de Statut

**Quand ?** Chaque fois que vous changez le statut d'une commande dans l'interface admin.

**Qui reçoit ?**
- ✉️ **Le client uniquement**

**Statuts disponibles :**
- ⏳ **En attente** (pending) - Commande en attente de traitement
- ⚙️ **En cours de traitement** (processing) - Commande en préparation
- 📦 **Expédiée** (shipped) - Commande expédiée
- ✅ **Livrée** (delivered) - Commande livrée
- ❌ **Annulée** (cancelled) - Commande annulée

**Contenu de l'email :**
- Numéro de commande
- Nouveau statut avec icône et couleur
- Message personnalisé selon le statut
- Informations de suivi (pour les expéditions)
- Demande d'avis (pour les livraisons)

## 🎨 Design des Emails

Tous les emails utilisent le design BackZo avec :
- Header noir avec logo BackZo (vert et blanc)
- Contenu sur fond blanc avec bordures arrondies
- Couleurs de statut distinctives
- Mise en page responsive
- Footer avec informations de contact

## 🔧 Configuration Requise

Pour que les emails fonctionnent, vous devez configurer les variables d'environnement :

### Sur Vercel (Production)

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `projet-tati`
3. **Settings** → **Environment Variables**
4. Ajoutez :

```
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=465
EMAIL_USER=team@backzo.eu
EMAIL_PASS=votre_mot_de_passe_ovh
EMAIL_FROM=team@backzo.eu
EMAIL_TO=team@backzo.eu
```

### En Local (Développement)

Éditez le fichier `.env` :

```env
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=465
EMAIL_USER=team@backzo.eu
EMAIL_PASS=votre_mot_de_passe_ovh
EMAIL_FROM=team@backzo.eu
EMAIL_TO=team@backzo.eu
```

## 🧪 Tester les Emails

### Test 1 : Email de Confirmation de Commande

1. Allez sur votre site https://backzo.eu
2. Ajoutez un produit au panier
3. Passez une commande de test
4. Vérifiez que vous recevez 2 emails :
   - Un sur l'email du client
   - Un sur `team@backzo.eu` (admin)

### Test 2 : Email de Mise à Jour de Statut

1. Connectez-vous à l'interface admin
2. Allez dans la section Commandes
3. Sélectionnez une commande
4. Changez son statut (ex: "En cours de traitement" → "Expédiée")
5. Le client devrait recevoir un email de notification

### Test 3 : Vérification Locale

```bash
# Tester la configuration email
npm run test-email

# Vérifier les variables d'environnement
npm run check-env
```

## 📊 Logs et Debugging

### Vérifier les Logs Vercel

1. Vercel Dashboard → Votre projet
2. **Functions** → `/api/confirm-payment` ou `/api/orders/:id/status`
3. Cherchez dans les logs :

```
✓ Email de confirmation envoyé
✓ Email de mise à jour envoyé au client: email@example.com
```

### Logs d'Erreur

Si l'email échoue, vous verrez :

```
⚠️  Erreur envoi email: [détails de l'erreur]
```

**Note :** Les erreurs d'email ne bloquent pas la commande. La commande est créée même si l'email échoue.

## 🎯 Flux Complet

### Scénario : Commande d'un Client

1. **Client passe commande**
   - Paiement Stripe confirmé
   - Commande créée dans la base de données
   - 📧 Email de confirmation envoyé au client
   - 📧 Email de notification envoyé à l'admin

2. **Admin prépare la commande**
   - Connexion à l'interface admin
   - Changement du statut : "En attente" → "En cours de traitement"
   - 📧 Email envoyé au client : "Votre commande est en préparation"

3. **Admin expédie la commande**
   - Changement du statut : "En cours de traitement" → "Expédiée"
   - 📧 Email envoyé au client : "Votre commande a été expédiée"

4. **Commande livrée**
   - Changement du statut : "Expédiée" → "Livrée"
   - 📧 Email envoyé au client : "Votre commande a été livrée" + demande d'avis

## 🔍 Détails Techniques

### Fonction `sendOrderConfirmationEmail(order)`

**Fichier :** `server.js` (lignes ~76-350)

**Paramètres :**
- `order` : Objet commande avec customer, items, total, etc.

**Comportement :**
- Envoie 2 emails (client + admin)
- Utilise des templates HTML responsive
- Gère les erreurs sans bloquer la commande

### Fonction `sendOrderStatusUpdateEmail(order, newStatus, oldStatus)`

**Fichier :** `server.js` (lignes ~352-450)

**Paramètres :**
- `order` : Objet commande
- `newStatus` : Nouveau statut
- `oldStatus` : Ancien statut (pour éviter les doublons)

**Comportement :**
- Envoie 1 email au client uniquement
- Adapte le message selon le statut
- Utilise des couleurs et icônes différentes par statut

### Route `/api/confirm-payment`

**Fichier :** `server.js` (ligne ~893)

**Comportement :**
1. Vérifie le paiement Stripe
2. Crée la commande dans MongoDB
3. Appelle `sendOrderConfirmationEmail(order)`
4. Retourne la commande au frontend

### Route `/api/orders/:id/status` (PUT)

**Fichier :** `server.js` (ligne ~1524)

**Comportement :**
1. Met à jour le statut dans MongoDB
2. Récupère l'ancien statut
3. Appelle `sendOrderStatusUpdateEmail(order, newStatus, oldStatus)`
4. Retourne la commande mise à jour

## ⚠️ Gestion des Erreurs

### Si l'email ne peut pas être envoyé

Le système est conçu pour être résilient :

- ✅ La commande est créée même si l'email échoue
- ✅ Le statut est mis à jour même si l'email échoue
- ⚠️ Un warning est loggé dans les logs Vercel
- ℹ️ L'admin peut voir dans les logs si l'email a été envoyé ou non

### Causes d'échec possibles

1. **Variables d'environnement manquantes**
   - Solution : Configurer `EMAIL_*` sur Vercel

2. **Mot de passe incorrect**
   - Solution : Vérifier le mot de passe OVH

3. **Serveur SMTP inaccessible**
   - Solution : Vérifier que le port 465 n'est pas bloqué

4. **Email client invalide**
   - Solution : Valider l'email lors de la commande

## 📝 Personnalisation

### Modifier les Templates d'Email

Les templates sont dans `server.js`. Pour les modifier :

1. Cherchez `sendOrderConfirmationEmail` ou `sendOrderStatusUpdateEmail`
2. Modifiez le HTML dans la propriété `html` de `mailOptions`
3. Testez localement avec `npm run test-email`
4. Déployez sur Vercel

### Ajouter de Nouveaux Statuts

1. Ajoutez le statut dans `statusInfo` (fonction `sendOrderStatusUpdateEmail`)
2. Définissez : label, color, icon, message
3. Le système l'utilisera automatiquement

### Changer l'Expéditeur

Modifiez les variables d'environnement :

```env
EMAIL_FROM=contact@backzo.eu
EMAIL_TO=admin@backzo.eu
```

## 🎉 Avantages

- ✅ **Automatique** : Aucune action manuelle requise
- ✅ **Professionnel** : Design cohérent avec la marque BackZo
- ✅ **Informatif** : Tous les détails importants inclus
- ✅ **Résilient** : Les erreurs d'email ne bloquent pas les commandes
- ✅ **Traçable** : Logs détaillés dans Vercel
- ✅ **Personnalisé** : Messages adaptés à chaque statut

## 📞 Support

Si les emails ne fonctionnent pas :

1. Consultez `FIX_EMAIL_VERCEL.md`
2. Exécutez `npm run check-env`
3. Vérifiez les logs Vercel
4. Testez localement avec `npm run test-email`
5. Contactez le support OVH si nécessaire
