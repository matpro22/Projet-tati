# 🚀 Guide de Déploiement - Système de Suivi

## ✅ Checklist Avant Déploiement

### 1. Vérifications Locales

```bash
# Tester en local
npm start

# Dans un autre terminal
npm run test-tracking
```

### 2. Vérifications des Fichiers

- [x] `server.js` modifié
- [x] `public/index.html` modifié
- [x] `package.json` mis à jour
- [x] Documentation créée

### 3. Tests Manuels

- [ ] Connexion au panel admin
- [ ] Changement de statut vers "Livré"
- [ ] Modal s'ouvre correctement
- [ ] Saisie du numéro de suivi
- [ ] Email reçu par le client
- [ ] Numéro visible dans les détails de commande

## 📦 Déploiement sur Vercel

### Étape 1 : Commit et Push

```bash
git add .
git commit -m "feat: Ajout système de suivi de livraison"
git push origin main
```

### Étape 2 : Vérifier les Variables d'Environnement

Sur Vercel, assurez-vous que ces variables sont configurées :

```env
# Email (requis pour l'envoi du numéro de suivi)
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=465
EMAIL_USER=team@backzo.eu
EMAIL_PASS=votre_mot_de_passe
EMAIL_FROM=team@backzo.eu
EMAIL_TO=team@backzo.eu

# MongoDB (optionnel)
MONGODB_URI=mongodb+srv://...

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=VotreMotDePasse
JWT_SECRET=votre_secret_jwt

# Stripe
STRIPE_SECRET_KEY=sk_live_...
```

### Étape 3 : Déploiement Automatique

Vercel déploie automatiquement après le push. Surveillez :
- https://vercel.com/votre-projet/deployments

### Étape 4 : Tests en Production

1. Accédez à votre site en production
2. Connectez-vous au panel admin
3. Testez le changement de statut
4. Vérifiez l'email reçu

## 🔍 Vérifications Post-Déploiement

### Backend

```bash
# Tester l'API
curl https://votre-site.com/api/health
```

### Email

- [ ] Email de confirmation reçu
- [ ] Numéro de suivi visible
- [ ] Lien vers avis fonctionnel
- [ ] Design correct

### Base de Données

- [ ] Numéro de suivi enregistré
- [ ] Statut mis à jour
- [ ] Pas d'erreur dans les logs

## 🐛 Dépannage

### Le numéro de suivi n'apparaît pas dans l'email

1. Vérifiez les logs Vercel
2. Vérifiez que `EMAIL_USER` et `EMAIL_PASS` sont configurés
3. Testez l'envoi d'email avec `npm run test-email`

### La modal ne s'ouvre pas

1. Vérifiez la console du navigateur (F12)
2. Videz le cache du navigateur
3. Vérifiez que `public/index.html` est bien déployé

### Le numéro n'est pas enregistré

1. Vérifiez les logs backend
2. Vérifiez la connexion MongoDB
3. Vérifiez les permissions d'écriture sur `data/orders.json`

## 📊 Monitoring

### Logs Vercel

```bash
vercel logs votre-projet --follow
```

### Métriques à Surveiller

- Taux d'envoi d'emails réussis
- Temps de réponse de l'API
- Erreurs 500
- Utilisation de la base de données

## 🔄 Rollback

Si problème critique :

```bash
# Revenir à la version précédente
git revert HEAD
git push origin main
```

Ou sur Vercel :
1. Allez dans "Deployments"
2. Sélectionnez le déploiement précédent
3. Cliquez sur "Promote to Production"

## 📝 Notes de Version

Communiquez à vos utilisateurs :

```
🎉 Nouvelle fonctionnalité !

Nous avons ajouté un système de suivi de livraison.
Vous recevrez désormais le numéro de suivi par email
lorsque votre commande est livrée.

L'équipe BackZo
```

## 🎯 Prochaines Étapes

1. Monitorer les premiers jours
2. Collecter les retours utilisateurs
3. Ajuster si nécessaire
4. Planifier les améliorations futures

## 📞 Support

En cas de problème :
- Email : team@backzo.eu
- Logs Vercel : https://vercel.com/votre-projet/logs
- Documentation : `SUIVI_LIVRAISON.md`

---

**Bonne chance pour le déploiement ! 🚀**
