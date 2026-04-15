# 🚀 Déploiement Complet sur Vercel

## 📋 Checklist Avant Déploiement

### 1. Variables d'Environnement Locales

Vérifiez votre fichier `.env`:

```bash
npm run check-env
```

Assurez-vous que toutes les variables sont correctement configurées:
- ✅ `STRIPE_SECRET_KEY` commence par `sk_`
- ✅ `STRIPE_PUBLIC_KEY` commence par `pk_`
- ✅ `MONGODB_URI` commence par `mongodb+srv://`
- ✅ `EMAIL_USER` = `team@backzo.eu`
- ✅ `EMAIL_PASS` = votre vrai mot de passe OVH
- ✅ `EMAIL_HOST` = `ssl0.ovh.net`
- ✅ `EMAIL_PORT` = `465`

### 2. Test Email Local

```bash
npm run test-email
```

Vous devez voir: `✅ Email envoyé avec succès !`

Si ça échoue, corrigez `EMAIL_PASS` dans `.env` avant de continuer.

## 🌐 Configuration Vercel

### Étape 1: Accéder aux Variables d'Environnement

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `projet-tati`
3. Cliquez sur **Settings** (onglet en haut)
4. Cliquez sur **Environment Variables** (menu gauche)

### Étape 2: Ajouter les Variables

Pour chaque variable ci-dessous, cliquez sur **Add New**:

#### Variables Stripe (REQUISES)

| Name | Value | Environment |
|------|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | Production, Preview, Development |
| `STRIPE_PUBLIC_KEY` | `pk_test_...` | Production, Preview, Development |

#### Variables MongoDB (REQUISES)

| Name | Value | Environment |
|------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Production, Preview, Development |

#### Variables Email (OPTIONNELLES mais recommandées)

| Name | Value | Environment |
|------|-------|-------------|
| `EMAIL_HOST` | `ssl0.ovh.net` | Production, Preview, Development |
| `EMAIL_PORT` | `465` | Production, Preview, Development |
| `EMAIL_USER` | `team@backzo.eu` | Production, Preview, Development |
| `EMAIL_PASS` | `votre_mot_de_passe` | Production, Preview, Development |
| `EMAIL_FROM` | `team@backzo.eu` | Production, Preview, Development |
| `EMAIL_TO` | `team@backzo.eu` | Production, Preview, Development |

⚠️ **IMPORTANT**: 
- Cochez les 3 environnements (Production, Preview, Development)
- Utilisez exactement les mêmes valeurs que dans votre `.env` local
- Ne mettez PAS de guillemets autour des valeurs

### Étape 3: Vérifier les Variables

Une fois toutes les variables ajoutées, vous devriez voir:

```
✅ STRIPE_SECRET_KEY
✅ STRIPE_PUBLIC_KEY
✅ MONGODB_URI
✅ EMAIL_HOST
✅ EMAIL_PORT
✅ EMAIL_USER
✅ EMAIL_PASS
✅ EMAIL_FROM
✅ EMAIL_TO
```

## 🔄 Redéploiement

### Option 1: Depuis l'Interface Vercel

1. Allez dans l'onglet **Deployments**
2. Trouvez le dernier déploiement (en haut)
3. Cliquez sur les 3 points `...` à droite
4. Cliquez sur **Redeploy**
5. Cochez **Use existing Build Cache** (optionnel, plus rapide)
6. Cliquez sur **Redeploy**

### Option 2: Depuis Git

```bash
git add .
git commit -m "Fix: Configuration email et API URL"
git push
```

Vercel redéploiera automatiquement.

### Option 3: Depuis la CLI Vercel

```bash
vercel --prod
```

## ⏱️ Attendre le Déploiement

Le déploiement prend environ 1-2 minutes. Vous verrez:

1. **Building** - Compilation du projet
2. **Deploying** - Déploiement sur les serveurs
3. **Ready** - Déploiement terminé ✅

## 🧪 Tests Post-Déploiement

### Test 1: Vérifier le Backend

Ouvrez dans votre navigateur:
```
https://projet-tati.vercel.app/api/health
```

Vous devriez voir:
```json
{
  "status": "ok",
  "message": "Backend BackZo opérationnel"
}
```

### Test 2: Vérifier la Configuration Stripe

```
https://projet-tati.vercel.app/api/stripe-config
```

Vous devriez voir:
```json
{
  "publicKey": "pk_test_..."
}
```

### Test 3: Tester le Formulaire de Contact

1. Allez sur https://backzo.eu
2. Scrollez jusqu'à la section Contact
3. Remplissez le formulaire:
   - Nom: Test
   - Email: votre@email.com
   - Message: Test de configuration
4. Cliquez sur "Envoyer le message"
5. Vous devriez voir: `✓ Message envoyé avec succès`
6. Vérifiez votre boîte mail `team@backzo.eu`

### Test 4: Vérifier les Logs

1. Retournez sur Vercel Dashboard
2. Cliquez sur **Functions** (menu gauche)
3. Cliquez sur `/api/contact`
4. Vous devriez voir dans les logs:
   ```
   ✓ Email de contact envoyé: votre@email.com
   ```

## 🐛 Debugging

### Si le formulaire ne fonctionne pas:

1. **Ouvrir la Console du Navigateur** (F12)
2. **Onglet Network**
3. Envoyer un message
4. Vérifier la requête vers `/api/contact`:
   - URL: `https://projet-tati.vercel.app/api/contact` ✅
   - Status: `200 OK` ✅
   - Response: `{"success": true, ...}` ✅

### Si l'email n'arrive pas:

1. **Vérifier les Logs Vercel**
   - Functions → `/api/contact`
   - Chercher: `✓ Email de contact envoyé` ou `❌ Erreur`

2. **Vérifier les Variables**
   - Settings → Environment Variables
   - Toutes les variables `EMAIL_*` sont définies?

3. **Vérifier les Spams**
   - L'email peut arriver dans les spams

### Si erreur "Authentication failed":

1. **Vérifier le mot de passe**
   - Connectez-vous au webmail OVH: https://www.ovh.com/fr/mail/
   - Utilisez le même mot de passe sur Vercel

2. **Essayer le port 587**
   - Changez `EMAIL_PORT` de `465` à `587`
   - Redéployez

## 📊 Monitoring

### Vérifier les Logs en Temps Réel

```bash
vercel logs --follow
```

### Vérifier les Fonctions

Sur Vercel Dashboard:
- **Functions** → Liste de toutes les fonctions serverless
- Cliquez sur une fonction pour voir ses logs

### Vérifier les Métriques

- **Analytics** → Voir le trafic et les erreurs
- **Speed Insights** → Performance du site

## ✅ Checklist Finale

- [ ] Toutes les variables d'environnement ajoutées sur Vercel
- [ ] Projet redéployé avec succès
- [ ] Backend accessible sur `projet-tati.vercel.app/api/health`
- [ ] Configuration Stripe récupérée
- [ ] Formulaire de contact testé
- [ ] Email reçu sur `team@backzo.eu`
- [ ] Aucune erreur dans les logs Vercel
- [ ] Console navigateur sans erreurs

## 🎉 Succès !

Si tous les tests passent, votre site est maintenant complètement fonctionnel:

- ✅ Frontend sur `backzo.eu`
- ✅ Backend sur `projet-tati.vercel.app`
- ✅ Paiements Stripe opérationnels
- ✅ Base de données MongoDB connectée
- ✅ Emails OVH configurés
- ✅ Formulaire de contact fonctionnel

## 📞 Support

Si vous rencontrez des problèmes:

1. **Consultez les guides**:
   - `SOLUTION_EMAIL_VERCEL.md`
   - `FIX_EMAIL_VERCEL.md`
   - `CONFIGURATION_EMAIL_VERCEL.md`

2. **Vérifiez les logs**:
   ```bash
   vercel logs
   ```

3. **Testez localement**:
   ```bash
   npm run check-env
   npm run test-email
   npm start
   ```

4. **Contactez le support**:
   - Support Vercel: https://vercel.com/support
   - Support OVH: https://www.ovh.com/fr/support/
   - Support Stripe: https://support.stripe.com/
