# 🧪 Guide de Test - Emails de Commandes

## 🎯 Objectif

Tester que les emails sont bien envoyés lors des commandes et des changements de statut.

## ✅ Prérequis

Avant de commencer, assurez-vous que :

- [ ] Les variables `EMAIL_*` sont configurées sur Vercel
- [ ] Le test local `npm run test-email` fonctionne
- [ ] Le projet est déployé sur Vercel

## 📋 Tests à Effectuer

### Test 1 : Email de Confirmation de Commande

#### Étapes

1. **Aller sur le site**
   ```
   https://backzo.eu
   ```

2. **Passer une commande de test**
   - Ajoutez un produit au panier
   - Cliquez sur "Commander"
   - Remplissez le formulaire avec un email de test
   - Utilisez une carte de test Stripe :
     ```
     Numéro : 4242 4242 4242 4242
     Date : 12/34
     CVC : 123
     ```

3. **Vérifier les emails**
   - [ ] Email reçu sur l'adresse du client
   - [ ] Email reçu sur `team@backzo.eu` (admin)

#### Email Client - Contenu Attendu

```
Sujet : ✅ Confirmation de commande BZ-XXXXXXXXX - BackZo

Contenu :
- Header BackZo (noir avec logo vert)
- "Merci pour votre commande !"
- Numéro de commande
- Date et statut
- Liste des articles
- Sous-total, livraison, total TTC
- Adresse de livraison
- Message de suivi
```

#### Email Admin - Contenu Attendu

```
Sujet : 🔔 Nouvelle commande BZ-XXXXXXXXX - BackZo

Contenu :
- Header BackZo
- "🎉 Nouvelle commande !"
- Informations client (nom, email, adresse)
- Liste des articles
- Total de la commande
- Rappel d'action
```

### Test 2 : Email de Mise à Jour de Statut

#### Étapes

1. **Se connecter à l'admin**
   ```
   https://backzo.eu
   Cliquez sur "Admin" dans le menu
   ```

2. **Trouver la commande de test**
   - Allez dans la section "Commandes"
   - Trouvez la commande que vous venez de passer

3. **Changer le statut : "En cours de traitement"**
   - Cliquez sur le menu déroulant du statut
   - Sélectionnez "En cours de traitement"
   - Attendez quelques secondes

4. **Vérifier l'email**
   - [ ] Email reçu sur l'adresse du client
   - [ ] Pas d'email reçu par l'admin (normal)

#### Email Attendu

```
Sujet : ⚙️ Mise à jour de votre commande BZ-XXXXXXXXX - BackZo

Contenu :
- Header BackZo
- "Bonjour [Nom du client]"
- Statut : ⚙️ En cours de traitement
- Message : "Votre commande est en cours de préparation."
```

### Test 3 : Email d'Expédition

#### Étapes

1. **Changer le statut : "Expédiée"**
   - Dans l'admin, changez le statut à "Expédiée"

2. **Vérifier l'email**
   - [ ] Email reçu avec le statut "Expédiée"

#### Email Attendu

```
Sujet : 📦 Mise à jour de votre commande BZ-XXXXXXXXX - BackZo

Contenu :
- Statut : 📦 Expédiée
- Message : "Votre commande a été expédiée et est en route vers vous !"
- Encadré bleu : "Suivi de livraison : Votre colis devrait arriver sous 2-3 jours ouvrés."
```

### Test 4 : Email de Livraison

#### Étapes

1. **Changer le statut : "Livrée"**
   - Dans l'admin, changez le statut à "Livrée"

2. **Vérifier l'email**
   - [ ] Email reçu avec le statut "Livrée"

#### Email Attendu

```
Sujet : ✅ Mise à jour de votre commande BZ-XXXXXXXXX - BackZo

Contenu :
- Statut : ✅ Livrée
- Message : "Votre commande a été livrée. Nous espérons que vous en êtes satisfait !"
- Encadré vert : "⭐ Votre avis compte !"
```

## 🔍 Vérification des Logs

### Sur Vercel

1. **Aller sur Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Sélectionner le projet `projet-tati`**

3. **Cliquer sur "Functions"**

4. **Vérifier les logs de `/api/confirm-payment`**
   ```
   Cherchez :
   ✓ Email de confirmation envoyé
   ```

5. **Vérifier les logs de `/api/orders/:id/status`**
   ```
   Cherchez :
   ✓ Email de mise à jour envoyé au client: email@example.com
   ```

### Logs d'Erreur

Si vous voyez :
```
⚠️  Erreur envoi email: [message d'erreur]
```

Consultez `FIX_EMAIL_VERCEL.md` pour résoudre le problème.

## 📊 Checklist Complète

### Configuration
- [ ] Variables `EMAIL_*` configurées sur Vercel
- [ ] Test local `npm run test-email` réussi
- [ ] Projet déployé sur Vercel

### Test Commande
- [ ] Commande passée avec succès
- [ ] Email de confirmation reçu par le client
- [ ] Email de notification reçu par l'admin
- [ ] Contenu des emails correct
- [ ] Design des emails correct

### Test Changement de Statut
- [ ] Statut changé à "En cours de traitement"
- [ ] Email reçu par le client
- [ ] Statut changé à "Expédiée"
- [ ] Email reçu avec message d'expédition
- [ ] Statut changé à "Livrée"
- [ ] Email reçu avec demande d'avis

### Logs
- [ ] Logs Vercel montrent les emails envoyés
- [ ] Aucune erreur dans les logs
- [ ] Temps de réponse acceptable

## 🐛 Problèmes Courants

### Email non reçu

**Vérifications :**
1. Vérifiez les spams
2. Vérifiez que l'email du client est correct
3. Vérifiez les logs Vercel
4. Vérifiez les variables d'environnement

**Solutions :**
- Consultez `FIX_EMAIL_VERCEL.md`
- Exécutez `npm run check-env`
- Vérifiez le mot de passe OVH

### Email reçu mais mal formaté

**Vérifications :**
1. Ouvrez l'email dans un autre client (Gmail, Outlook)
2. Vérifiez le code HTML dans `server.js`

**Solutions :**
- Les emails HTML peuvent s'afficher différemment selon le client
- Testez dans plusieurs clients email

### Erreur dans les logs

**Erreur d'authentification :**
```
❌ Erreur d'authentification email OVH
```
→ Mot de passe incorrect, consultez `FIX_EMAIL_VERCEL.md`

**Erreur de connexion :**
```
Connection timeout
```
→ Port 465 bloqué, essayez le port 587

## 🎯 Résultats Attendus

Si tous les tests passent :

✅ **Confirmation de commande**
- 2 emails envoyés (client + admin)
- Contenu complet et correct
- Design professionnel

✅ **Mise à jour de statut**
- 1 email envoyé au client
- Message adapté au statut
- Couleurs et icônes correctes

✅ **Logs Vercel**
- Tous les emails loggés comme envoyés
- Aucune erreur

✅ **Expérience utilisateur**
- Client informé à chaque étape
- Admin notifié des nouvelles commandes
- Communication professionnelle

## 📞 Support

Si un test échoue :

1. **Consultez la documentation**
   - `SYSTEME_EMAILS_COMMANDES.md` - Vue d'ensemble
   - `FIX_EMAIL_VERCEL.md` - Résolution de problèmes
   - `CONFIGURATION_EMAIL_VERCEL.md` - Configuration détaillée

2. **Vérifiez les logs**
   ```bash
   # En local
   npm run check-env
   npm run test-email
   
   # Sur Vercel
   vercel logs --follow
   ```

3. **Testez étape par étape**
   - Configuration locale d'abord
   - Puis configuration Vercel
   - Puis tests en production

## 🎉 Succès !

Si tous les tests passent, votre système d'emails est opérationnel :

- ✅ Les clients reçoivent une confirmation de commande
- ✅ Vous êtes notifié des nouvelles commandes
- ✅ Les clients sont informés des changements de statut
- ✅ Communication professionnelle et automatique

Vous pouvez maintenant gérer vos commandes en toute sérénité !
