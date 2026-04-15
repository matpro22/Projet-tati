# 🚀 Configuration de l'authentification admin sur Vercel

## 📋 Prérequis

Avant de déployer sur Vercel, vous devez avoir :
- ✅ Un compte Vercel
- ✅ Votre projet connecté à Vercel
- ✅ Les valeurs pour `ADMIN_USERNAME`, `ADMIN_PASSWORD` et `JWT_SECRET`

## 🔑 Générer les valeurs

### 1. Générer un JWT Secret

Sur votre machine locale :

```bash
npm run generate-secret
```

Copiez la valeur générée (exemple : `a1b2c3d4e5f6...`)

### 2. Choisir un mot de passe

Choisissez un mot de passe fort :
- Minimum 12 caractères
- Majuscules et minuscules
- Chiffres et caractères spéciaux
- Exemple : `MyS3cur3P@ssw0rd!2024`

## 🌐 Configuration sur Vercel

### Méthode 1 : Via le Dashboard Vercel (Recommandé)

1. **Accédez à votre projet**
   - Allez sur [vercel.com](https://vercel.com)
   - Sélectionnez votre projet BackZo

2. **Ouvrez les paramètres**
   - Cliquez sur "Settings" (Paramètres)
   - Dans le menu latéral, cliquez sur "Environment Variables"

3. **Ajoutez les variables**

   Cliquez sur "Add New" pour chaque variable :

   **Variable 1 :**
   - Name: `ADMIN_USERNAME`
   - Value: `admin` (ou votre choix)
   - Environment: Cochez "Production", "Preview", "Development"
   - Cliquez "Save"

   **Variable 2 :**
   - Name: `ADMIN_PASSWORD`
   - Value: Votre mot de passe fort
   - Environment: Cochez "Production", "Preview", "Development"
   - Cliquez "Save"

   **Variable 3 :**
   - Name: `JWT_SECRET`
   - Value: Le secret généré avec `npm run generate-secret`
   - Environment: Cochez "Production", "Preview", "Development"
   - Cliquez "Save"

4. **Redéployez**
   - Allez dans l'onglet "Deployments"
   - Cliquez sur les 3 points (...) du dernier déploiement
   - Cliquez "Redeploy"
   - Attendez que le déploiement soit terminé

### Méthode 2 : Via Vercel CLI

Si vous avez installé Vercel CLI :

```bash
# Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# Se connecter
vercel login

# Ajouter les variables
vercel env add ADMIN_USERNAME
# Entrez: admin

vercel env add ADMIN_PASSWORD
# Entrez: VotreMotDePasseSecurise

vercel env add JWT_SECRET
# Entrez: le_secret_genere

# Redéployer
vercel --prod
```

## ✅ Vérification

### 1. Vérifier que les variables sont configurées

Dans le dashboard Vercel :
- Settings → Environment Variables
- Vous devriez voir 3 variables :
  - ✅ `ADMIN_USERNAME`
  - ✅ `ADMIN_PASSWORD`
  - ✅ `JWT_SECRET`

### 2. Tester la connexion

1. Allez sur votre site : `https://votre-projet.vercel.app`
2. Cliquez sur le point dans le footer pour accéder à l'admin
3. Entrez vos identifiants :
   - Identifiant : celui défini dans `ADMIN_USERNAME`
   - Mot de passe : celui défini dans `ADMIN_PASSWORD`
4. Vous devriez être connecté !

### 3. Vérifier les logs

Si la connexion ne fonctionne pas :

1. Dashboard Vercel → Deployments
2. Cliquez sur le dernier déploiement
3. Cliquez sur "View Function Logs"
4. Cherchez les messages :
   - `✓ Connexion admin réussie` (succès)
   - `❌ Identifiant incorrect` (erreur)
   - `❌ Mot de passe incorrect` (erreur)

## 🔒 Sécurité sur Vercel

### ✅ Bonnes pratiques

1. **Variables d'environnement**
   - ✅ Utilisez toujours les Environment Variables de Vercel
   - ❌ Ne mettez JAMAIS les credentials dans le code

2. **HTTPS**
   - ✅ Vercel utilise automatiquement HTTPS
   - ✅ Les tokens sont protégés en transit

3. **Secrets**
   - ✅ Les variables d'environnement sont chiffrées par Vercel
   - ✅ Elles ne sont pas visibles dans les logs

4. **Rotation des secrets**
   - Changez régulièrement `JWT_SECRET`
   - Changez `ADMIN_PASSWORD` tous les 3-6 mois

### ⚠️ À ne PAS faire

- ❌ Ne commitez JAMAIS le fichier `.env` dans Git
- ❌ Ne partagez JAMAIS vos credentials
- ❌ Ne mettez JAMAIS les credentials dans le code
- ❌ N'utilisez PAS le même mot de passe partout

## 🔄 Changer les credentials

### Changer le mot de passe

1. Dashboard Vercel → Settings → Environment Variables
2. Trouvez `ADMIN_PASSWORD`
3. Cliquez sur les 3 points (...) → Edit
4. Entrez le nouveau mot de passe
5. Cliquez "Save"
6. Redéployez l'application

### Changer le JWT Secret

1. Générez un nouveau secret : `npm run generate-secret`
2. Dashboard Vercel → Settings → Environment Variables
3. Trouvez `JWT_SECRET`
4. Cliquez sur les 3 points (...) → Edit
5. Entrez le nouveau secret
6. Cliquez "Save"
7. Redéployez l'application

⚠️ **Important** : Changer le JWT_SECRET déconnectera tous les utilisateurs actuellement connectés.

## 🐛 Dépannage

### "Identifiant ou mot de passe incorrect"

**Causes possibles :**
1. Les variables ne sont pas configurées sur Vercel
2. Le déploiement n'a pas été fait après l'ajout des variables
3. Faute de frappe dans les credentials

**Solution :**
1. Vérifiez les variables dans Settings → Environment Variables
2. Redéployez l'application
3. Vérifiez les logs de fonction

### "Token invalide ou expiré"

**Causes possibles :**
1. Le JWT_SECRET a changé
2. Le token a expiré (24h)

**Solution :**
1. Reconnectez-vous
2. Si le problème persiste, vérifiez JWT_SECRET

### "Module not found: bcryptjs"

**Cause :**
Les dépendances ne sont pas installées

**Solution :**
1. Vérifiez que `package.json` contient `bcryptjs` et `jsonwebtoken`
2. Commitez et poussez les changements
3. Vercel réinstallera automatiquement les dépendances

## 📊 Monitoring

### Vérifier les tentatives de connexion

Dans les logs Vercel, cherchez :

```
🔐 Tentative de connexion admin: admin
✓ Connexion admin réussie
```

ou

```
🔐 Tentative de connexion admin: admin
❌ Mot de passe incorrect
```

### Alertes

Configurez des alertes Vercel pour :
- Erreurs 401 (non autorisé)
- Erreurs 403 (interdit)
- Erreurs 500 (serveur)

## 🎯 Checklist de déploiement

Avant de déployer en production :

- [ ] `ADMIN_USERNAME` configuré sur Vercel
- [ ] `ADMIN_PASSWORD` configuré sur Vercel (mot de passe fort)
- [ ] `JWT_SECRET` configuré sur Vercel (secret aléatoire)
- [ ] Variables configurées pour "Production"
- [ ] Application redéployée après ajout des variables
- [ ] Test de connexion réussi
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Credentials sauvegardés dans un endroit sûr

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez les logs Vercel
2. Vérifiez la documentation : `DOCS/SECURITE_ADMIN.md`
3. Testez en local d'abord : `npm run test-auth`
4. Contactez l'équipe de développement

## 🎉 Félicitations !

Votre système d'authentification admin est maintenant sécurisé et déployé sur Vercel !

Pour plus d'informations, consultez :
- `README_SECURITE.md` - Vue d'ensemble
- `SECURITE_ADMIN_GUIDE_RAPIDE.md` - Guide rapide
- `DOCS/SECURITE_ADMIN.md` - Documentation complète
