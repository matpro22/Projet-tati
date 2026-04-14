# 🔧 Correction Erreur Email Vercel

## Problème actuel
```
Error: Invalid login: 535 5.7.1 Authentication failed
```

Cette erreur signifie que Vercel ne peut pas se connecter à votre serveur email OVH.

## ✅ Solution en 3 étapes

### Étape 1: Tester localement

1. Ouvrez le fichier `.env`
2. Remplacez `VOTRE_MOT_DE_PASSE_EMAIL` par votre vrai mot de passe OVH
3. Testez la configuration:
   ```bash
   node test-email-config.js
   ```

Si le test échoue, vérifiez vos identifiants OVH sur https://www.ovh.com/fr/mail/

### Étape 2: Configurer Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `projet-tati`
3. Cliquez sur **Settings** (en haut)
4. Cliquez sur **Environment Variables** (menu gauche)
5. Ajoutez ces variables (cliquez sur "Add New" pour chaque):

| Name | Value |
|------|-------|
| `EMAIL_HOST` | `ssl0.ovh.net` |
| `EMAIL_PORT` | `465` |
| `EMAIL_USER` | `team@backzo.eu` |
| `EMAIL_PASS` | `votre_mot_de_passe_ovh` |
| `EMAIL_FROM` | `team@backzo.eu` |
| `EMAIL_TO` | `team@backzo.eu` |

⚠️ **IMPORTANT**: Utilisez le VRAI mot de passe de votre compte email OVH

### Étape 3: Redéployer

1. Allez dans l'onglet **Deployments**
2. Trouvez le dernier déploiement
3. Cliquez sur les 3 points `...` à droite
4. Cliquez sur **Redeploy**
5. Attendez que le déploiement soit terminé (environ 1 minute)

## 🧪 Tester

Une fois redéployé:
1. Allez sur votre site https://backzo.eu
2. Allez dans la section Contact
3. Remplissez le formulaire et envoyez
4. Vous devriez recevoir l'email sur `team@backzo.eu`

## 🔍 Vérifier les logs

Si le problème persiste:
1. Sur Vercel, allez dans **Functions** ou **Logs**
2. Cherchez les messages d'erreur
3. Vérifiez que les variables d'environnement sont bien définies

## 🆘 Problèmes courants

### Le mot de passe ne fonctionne pas
- Vérifiez que vous utilisez le mot de passe du compte email, pas celui de votre compte OVH
- Essayez de vous connecter au webmail: https://www.ovh.com/fr/mail/
- Si vous ne pouvez pas vous connecter, réinitialisez le mot de passe depuis l'espace client OVH

### L'email n'arrive pas
- Vérifiez vos spams
- Vérifiez que `EMAIL_TO` est correct
- Regardez les logs Vercel pour voir si l'email a été envoyé

### Erreur "SMTP not configured"
- Vérifiez que toutes les variables d'environnement sont définies sur Vercel
- Redéployez après avoir ajouté les variables

## 📞 Support

Si le problème persiste après avoir suivi ces étapes:
1. Contactez le support OVH pour vérifier que l'accès SMTP est autorisé
2. Vérifiez que votre compte email n'est pas suspendu
3. Essayez avec le port 587 au lieu de 465

## 🎯 Configuration alternative (port 587)

Si le port 465 ne fonctionne pas, essayez:

```
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=587
EMAIL_USER=team@backzo.eu
EMAIL_PASS=votre_mot_de_passe
```

Puis redéployez sur Vercel.
