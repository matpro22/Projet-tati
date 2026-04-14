# ✅ Checklist - Activation des Emails de Commandes

## 📋 Étapes à Suivre

### 1️⃣ Configuration Locale (5 minutes)

- [ ] Ouvrir le fichier `.env`
- [ ] Remplacer `VOTRE_MOT_DE_PASSE_EMAIL` par votre vrai mot de passe OVH
- [ ] Sauvegarder le fichier
- [ ] Tester : `npm run test-email`
- [ ] Vérifier que vous recevez un email de test sur `team@backzo.eu`

**Si le test échoue :**
- Vérifiez votre mot de passe sur https://www.ovh.com/fr/mail/
- Consultez `FIX_EMAIL_VERCEL.md`

### 2️⃣ Configuration Vercel (10 minutes)

- [ ] Aller sur https://vercel.com/dashboard
- [ ] Sélectionner le projet `projet-tati`
- [ ] Cliquer sur **Settings**
- [ ] Cliquer sur **Environment Variables**
- [ ] Ajouter les 6 variables suivantes :

#### Variables à Ajouter

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `EMAIL_HOST` | `ssl0.ovh.net` | ✅ Production ✅ Preview ✅ Development |
| `EMAIL_PORT` | `465` | ✅ Production ✅ Preview ✅ Development |
| `EMAIL_USER` | `team@backzo.eu` | ✅ Production ✅ Preview ✅ Development |
| `EMAIL_PASS` | `votre_mot_de_passe` | ✅ Production ✅ Preview ✅ Development |
| `EMAIL_FROM` | `team@backzo.eu` | ✅ Production ✅ Preview ✅ Development |
| `EMAIL_TO` | `team@backzo.eu` | ✅ Production ✅ Preview ✅ Development |

⚠️ **Important :** Cochez les 3 environnements pour chaque variable !

### 3️⃣ Redéploiement (2 minutes)

- [ ] Aller dans l'onglet **Deployments**
- [ ] Trouver le dernier déploiement (en haut de la liste)
- [ ] Cliquer sur les 3 points `...` à droite
- [ ] Cliquer sur **Redeploy**
- [ ] Attendre que le déploiement soit terminé (environ 1-2 minutes)
- [ ] Vérifier que le statut est "Ready" ✅

### 4️⃣ Test en Production (5 minutes)

#### Test 1 : Commande

- [ ] Aller sur https://backzo.eu
- [ ] Ajouter un produit au panier
- [ ] Passer une commande de test avec :
  - Votre email personnel (pour recevoir l'email client)
  - Carte de test Stripe : `4242 4242 4242 4242`
  - Date : `12/34`, CVC : `123`
- [ ] Vérifier que vous recevez 2 emails :
  - [ ] Email de confirmation sur votre email personnel
  - [ ] Email de notification sur `team@backzo.eu`

#### Test 2 : Changement de Statut

- [ ] Se connecter à l'admin sur https://backzo.eu
- [ ] Aller dans la section "Commandes"
- [ ] Trouver la commande de test
- [ ] Changer le statut à "En cours de traitement"
- [ ] Vérifier que vous recevez un email sur votre email personnel

#### Test 3 : Expédition

- [ ] Changer le statut à "Expédiée"
- [ ] Vérifier que vous recevez un email avec le message d'expédition

### 5️⃣ Vérification des Logs (2 minutes)

- [ ] Aller sur Vercel Dashboard
- [ ] Cliquer sur **Functions**
- [ ] Cliquer sur `/api/confirm-payment`
- [ ] Vérifier que vous voyez : `✓ Email de confirmation envoyé`
- [ ] Cliquer sur `/api/orders/:id/status`
- [ ] Vérifier que vous voyez : `✓ Email de mise à jour envoyé au client`

## 🎯 Résultat Attendu

Si tous les tests passent :

✅ **Email de confirmation de commande**
- Reçu par le client
- Reçu par l'admin
- Contenu complet et correct
- Design professionnel

✅ **Email de mise à jour de statut**
- Reçu par le client
- Message adapté au statut
- Couleurs et icônes correctes

✅ **Logs Vercel**
- Emails loggés comme envoyés
- Aucune erreur

## ⚠️ Si un Test Échoue

### Email non reçu

1. **Vérifiez les spams**
2. **Vérifiez les logs Vercel**
   - Cherchez des erreurs d'email
3. **Vérifiez les variables d'environnement**
   - Settings → Environment Variables
   - Toutes les variables `EMAIL_*` sont définies ?
4. **Consultez la documentation**
   - `FIX_EMAIL_VERCEL.md`

### Erreur d'authentification

```
❌ Erreur d'authentification email OVH
```

**Solution :**
1. Vérifiez le mot de passe OVH
2. Connectez-vous au webmail : https://www.ovh.com/fr/mail/
3. Utilisez le même mot de passe sur Vercel
4. Redéployez

### Erreur de connexion

```
Connection timeout
```

**Solution :**
1. Essayez le port 587 au lieu de 465
2. Changez `EMAIL_PORT` à `587`
3. Redéployez

## 📊 Checklist Complète

### Configuration
- [ ] Variables `EMAIL_*` dans `.env` (local)
- [ ] Test local réussi (`npm run test-email`)
- [ ] Variables `EMAIL_*` sur Vercel
- [ ] Projet redéployé sur Vercel

### Tests
- [ ] Commande passée avec succès
- [ ] Email de confirmation reçu (client)
- [ ] Email de notification reçu (admin)
- [ ] Statut changé à "En cours de traitement"
- [ ] Email de mise à jour reçu (client)
- [ ] Statut changé à "Expédiée"
- [ ] Email d'expédition reçu (client)

### Vérifications
- [ ] Logs Vercel sans erreur
- [ ] Emails bien formatés
- [ ] Design professionnel
- [ ] Tous les détails présents

## 🎉 Félicitations !

Si toutes les cases sont cochées, votre système d'emails est opérationnel !

Vous pouvez maintenant :
- ✅ Recevoir des notifications pour chaque nouvelle commande
- ✅ Vos clients reçoivent une confirmation automatique
- ✅ Vos clients sont informés à chaque changement de statut
- ✅ Communication professionnelle et automatique

## 📞 Besoin d'Aide ?

### Documentation

- `RESUME_EMAILS_IMPLEMENTATION.md` - Résumé de l'implémentation
- `SYSTEME_EMAILS_COMMANDES.md` - Vue d'ensemble complète
- `TEST_EMAILS_COMMANDES.md` - Guide de test détaillé
- `FIX_EMAIL_VERCEL.md` - Résolution de problèmes
- `CONFIGURATION_EMAIL_VERCEL.md` - Configuration détaillée

### Commandes Utiles

```bash
# Vérifier la configuration
npm run check-env

# Tester l'email localement
npm run test-email

# Voir les logs Vercel en temps réel
vercel logs --follow
```

### Support

1. Consultez la documentation ci-dessus
2. Vérifiez les logs Vercel
3. Testez localement
4. Contactez le support OVH si nécessaire

## 🚀 Prochaines Étapes

Une fois le système opérationnel :

1. **Testez avec de vraies commandes**
   - Surveillez les emails
   - Vérifiez que tout fonctionne bien

2. **Personnalisez si nécessaire**
   - Modifiez les templates dans `server.js`
   - Ajoutez des informations supplémentaires

3. **Profitez !**
   - Le système fonctionne automatiquement
   - Concentrez-vous sur votre business

---

**Temps total estimé : 25 minutes**

**Difficulté : Facile** ⭐⭐☆☆☆
