# 🚀 Guide Rapide - Envoi de Devis en PDF

## ✅ Problème résolu !

Vos devis sont maintenant envoyés en **PDF professionnel** par email au lieu de HTML.

## 📋 Ce qui a été fait

1. ✅ Installation de Puppeteer pour la génération PDF
2. ✅ Correction du code serveur pour supporter PDF en local et en production
3. ✅ Test de génération PDF réussi
4. ✅ Système de fallback automatique en HTML si erreur

## 🎯 Comment utiliser

### Créer et envoyer un devis

1. Allez sur votre site BackZo
2. Accédez à la section "Créer un devis"
3. Remplissez les informations client :
   - Nom/Société
   - Email
   - Téléphone
   - Date de validité
4. Ajoutez les lignes du devis
5. Cliquez sur le bouton **"Envoyer"** 📧

→ Le client recevra un email avec le devis en **pièce jointe PDF** !

## 📧 Format de l'email

Le client recevra :
- Un email HTML professionnel avec le logo BackZo
- Un résumé du devis dans l'email
- Une **pièce jointe PDF** : `Devis_BackZo_[numéro].pdf`

## 🧪 Tester la génération PDF

Pour vérifier que tout fonctionne :

```bash
node test-pdf-generation.js
```

Vous devriez voir :
```
✅ TEST RÉUSSI !
   La génération PDF fonctionne correctement.
```

## 🚀 Démarrer le serveur

```bash
npm start
```

Vous verrez dans les logs :
```
✓ puppeteer chargé pour développement local
🚀 BackZo Backend démarré !
```

## 🔧 Configuration email requise

Pour que l'envoi d'emails fonctionne, assurez-vous que votre fichier `.env` contient :

```env
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=465
EMAIL_USER=votre-email@backzo.eu
EMAIL_PASS=votre-mot-de-passe
EMAIL_FROM=team@backzo.eu
EMAIL_TO=team@backzo.eu
```

## 📦 Déploiement sur Vercel

Le système fonctionne automatiquement sur Vercel :
- En local : utilise Puppeteer standard
- Sur Vercel : utilise chrome-aws-lambda (optimisé)

Aucune configuration supplémentaire nécessaire !

## ⚠️ Dépannage

### Le PDF n'est pas généré

1. Vérifiez que Puppeteer est installé :
   ```bash
   npm list puppeteer
   ```

2. Réinstallez si nécessaire :
   ```bash
   npm install puppeteer
   ```

3. Testez la génération :
   ```bash
   node test-pdf-generation.js
   ```

### L'email n'est pas envoyé

1. Vérifiez votre configuration email dans `.env`
2. Testez la connexion email :
   ```bash
   npm run test-email
   ```

### Fallback en HTML

Si la génération PDF échoue, le système envoie automatiquement le devis en HTML. Le client reçoit quand même son devis !

## 📚 Documentation complète

- `CORRECTION_PDF_DEVIS.md` - Détails techniques de la correction
- `test-pdf-generation.js` - Script de test

## 💡 Conseils

- Le premier lancement de Puppeteer peut prendre quelques secondes (téléchargement de Chrome)
- Les PDF générés sont optimisés pour l'impression (format A4)
- Le style des devis PDF est identique aux factures (professionnel)

---

**Tout est prêt !** Vous pouvez maintenant envoyer vos devis en PDF. 🎉
