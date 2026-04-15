# 🚀 Solution Complète - Erreur Email Vercel

## 📋 Résumé du problème

Votre formulaire de contact essayait de contacter `backzo.eu/api/contact` au lieu de `projet-tati.vercel.app/api/contact`.

**✅ CORRIGÉ** : Le frontend utilise maintenant correctement l'URL du backend Vercel.

**❌ NOUVEAU PROBLÈME** : L'authentification email OVH échoue sur Vercel.

## 🔧 Solution en 5 minutes

### 1️⃣ Configurez votre mot de passe email localement

Éditez le fichier `.env` et remplacez:
```env
EMAIL_PASS=VOTRE_MOT_DE_PASSE_EMAIL
```

Par votre vrai mot de passe OVH (celui que vous utilisez pour vous connecter à team@backzo.eu).

### 2️⃣ Testez localement

```bash
npm run test-email
```

Si vous voyez `✅ Email envoyé avec succès !`, passez à l'étape 3.

Si ça échoue, vérifiez vos identifiants sur https://www.ovh.com/fr/mail/

### 3️⃣ Configurez Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `projet-tati`
3. **Settings** → **Environment Variables**
4. Ajoutez ces 6 variables:

```
EMAIL_HOST = ssl0.ovh.net
EMAIL_PORT = 465
EMAIL_USER = team@backzo.eu
EMAIL_PASS = [votre_mot_de_passe_ovh]
EMAIL_FROM = team@backzo.eu
EMAIL_TO = team@backzo.eu
```

⚠️ Copiez-collez exactement le même mot de passe que dans votre `.env` local.

### 4️⃣ Redéployez

1. **Deployments** → Dernier déploiement → `...` → **Redeploy**
2. Attendez 1 minute

### 5️⃣ Testez

1. Allez sur https://backzo.eu
2. Section Contact
3. Envoyez un message de test
4. Vérifiez votre boîte mail `team@backzo.eu`

## 🎯 Commandes utiles

```bash
# Vérifier toutes les variables d'environnement
npm run check-env

# Tester la configuration email
npm run test-email

# Démarrer le serveur en local
npm start
```

## 📊 Vérifier les logs Vercel

Si le problème persiste:

1. Vercel Dashboard → Votre projet
2. **Functions** (menu gauche)
3. Cliquez sur `/api/contact`
4. Regardez les logs d'erreur

Vous devriez voir:
- ✅ `✓ Email de contact envoyé` = Succès
- ❌ `Erreur d'authentification email OVH` = Mot de passe incorrect

## 🆘 Problèmes fréquents

### "Authentication failed"
→ Le mot de passe est incorrect. Vérifiez-le sur le webmail OVH.

### "Connection timeout"
→ Le port 465 est peut-être bloqué. Essayez le port 587:
```env
EMAIL_PORT=587
```

### "Email non configuré"
→ Les variables d'environnement ne sont pas définies sur Vercel.

### L'email n'arrive pas
→ Vérifiez vos spams et que `EMAIL_TO` est correct.

## 📞 Support OVH

Si rien ne fonctionne:
1. Connectez-vous à votre espace client OVH
2. Vérifiez que le compte `team@backzo.eu` est actif
3. Vérifiez que l'accès SMTP est autorisé
4. Contactez le support OVH si nécessaire

## ✅ Checklist finale

- [ ] Fichier `.env` configuré avec le vrai mot de passe
- [ ] Test local réussi (`npm run test-email`)
- [ ] Variables ajoutées sur Vercel
- [ ] Projet redéployé sur Vercel
- [ ] Test du formulaire sur https://backzo.eu
- [ ] Email reçu sur team@backzo.eu

## 🎉 Une fois que ça marche

N'oubliez pas de:
1. Tester avec différents messages
2. Vérifier que les emails arrivent bien
3. Vérifier le formatage des emails
4. Tester depuis différents navigateurs

---

**Besoin d'aide ?** Consultez les fichiers:
- `FIX_EMAIL_VERCEL.md` - Guide détaillé
- `CONFIGURATION_EMAIL_VERCEL.md` - Configuration complète
- `test-email-config.js` - Script de test
