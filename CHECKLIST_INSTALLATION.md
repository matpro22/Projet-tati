# ✅ Checklist d'installation - Authentification Admin Sécurisée

## 📋 Avant de commencer

- [ ] Node.js installé (version 16+)
- [ ] npm installé
- [ ] Accès au terminal
- [ ] Éditeur de texte (VS Code, etc.)

## 🚀 Installation

### Étape 1 : Dépendances

- [ ] Exécuté `npm install`
- [ ] Aucune erreur affichée
- [ ] `bcryptjs` installé
- [ ] `jsonwebtoken` installé

**Vérification :**
```bash
npm list bcryptjs jsonwebtoken
```

Vous devriez voir :
```
├── bcryptjs@2.4.3
└── jsonwebtoken@9.0.2
```

### Étape 2 : Configuration

**Option A - Configuration automatique (recommandé)**

- [ ] Exécuté `npm run setup-auth`
- [ ] Entré un nom d'utilisateur
- [ ] Entré un mot de passe (8+ caractères)
- [ ] JWT Secret généré automatiquement
- [ ] Fichier `.env` créé/mis à jour

**Option B - Configuration manuelle**

- [ ] Exécuté `npm run generate-secret`
- [ ] Copié le secret généré
- [ ] Créé le fichier `.env`
- [ ] Ajouté `ADMIN_USERNAME`
- [ ] Ajouté `ADMIN_PASSWORD`
- [ ] Ajouté `JWT_SECRET`

**Vérification du fichier .env :**

Votre fichier `.env` doit contenir :
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=VotreMotDePasseSecurise
JWT_SECRET=un_long_secret_aleatoire
```

### Étape 3 : Tests

- [ ] Exécuté `npm run test-auth`
- [ ] Toutes les variables sont configurées ✅
- [ ] Test du hash bcrypt réussi ✅
- [ ] Test de génération JWT réussi ✅
- [ ] Test de vérification JWT réussi ✅

**Résultat attendu :**
```
✅ Toutes les variables sont configurées
✅ Le système d'authentification est prêt
```

### Étape 4 : Démarrage

- [ ] Exécuté `npm start`
- [ ] Serveur démarre sans erreur
- [ ] Message "✓ Serveur démarré sur le port 3000"
- [ ] Aucune erreur dans la console

**Vérification :**

Ouvrez http://localhost:3000 dans votre navigateur.

### Étape 5 : Connexion

- [ ] Page d'accueil s'affiche
- [ ] Cliqué sur le point dans le footer
- [ ] Page de login admin s'affiche
- [ ] Pas de mot de passe visible en clair ✅
- [ ] Entré l'identifiant
- [ ] Entré le mot de passe
- [ ] Cliqué sur "Se connecter"
- [ ] Connexion réussie ✅
- [ ] Panel admin s'affiche

**Vérification dans la console du navigateur (F12) :**
```
✓ Connexion admin réussie
```

### Étape 6 : Test des fonctionnalités

- [ ] Onglet "Commandes" accessible
- [ ] Onglet "Produits" accessible
- [ ] Onglet "Paramètres" accessible
- [ ] Onglet "Présentations" accessible
- [ ] Bouton "Déconnexion" fonctionne
- [ ] Après déconnexion, retour à la page de login

## 🔒 Vérifications de sécurité

### Code source

- [ ] Ouvert `public/index.html`
- [ ] Recherché "BackZo2024!" → Aucun résultat ✅
- [ ] Recherché "ADMIN_CREDS" → Aucun résultat ✅
- [ ] Pas de mot de passe en clair visible ✅

### Fichier .env

- [ ] Fichier `.env` existe
- [ ] Fichier `.env` dans `.gitignore`
- [ ] Fichier `.env` ne sera pas commité ✅

**Vérification :**
```bash
git status
```

Le fichier `.env` ne doit PAS apparaître dans les fichiers à commiter.

### Token JWT

- [ ] Ouvert les DevTools (F12)
- [ ] Onglet "Application" → "Local Storage"
- [ ] Clé `adminToken` présente
- [ ] Clé `adminTokenExpiry` présente
- [ ] Token commence par "eyJ..." ✅

## 🌐 Déploiement sur Vercel (optionnel)

Si vous déployez sur Vercel :

- [ ] Lu `VERCEL_AUTH_SETUP.md`
- [ ] Dashboard Vercel ouvert
- [ ] Settings → Environment Variables
- [ ] Ajouté `ADMIN_USERNAME`
- [ ] Ajouté `ADMIN_PASSWORD`
- [ ] Ajouté `JWT_SECRET`
- [ ] Coché "Production", "Preview", "Development"
- [ ] Redéployé l'application
- [ ] Testé la connexion en production
- [ ] Connexion réussie ✅

## 📊 Résumé

### ✅ Installation réussie si :

- [x] Dépendances installées
- [x] Fichier `.env` configuré
- [x] Tests passent
- [x] Serveur démarre
- [x] Connexion fonctionne
- [x] Panel admin accessible
- [x] Pas de mot de passe en clair dans le code
- [x] Token JWT généré et stocké

### ❌ Problèmes courants

| Problème | Solution |
|----------|----------|
| "Module not found: bcryptjs" | `npm install` |
| "ADMIN_PASSWORD non défini" | `npm run setup-auth` |
| "Identifiant incorrect" | Vérifier `.env` |
| "Token invalide" | Reconnexion |
| Port 3000 occupé | Changer le port dans `.env` |

## 📚 Documentation

Si vous avez des questions :

1. **Démarrage rapide** : `COMMENCER_ICI.md`
2. **Guide complet** : `SECURITE_ADMIN_GUIDE_RAPIDE.md`
3. **Documentation technique** : `DOCS/SECURITE_ADMIN.md`
4. **Déploiement Vercel** : `VERCEL_AUTH_SETUP.md`
5. **Architecture** : `ARCHITECTURE_AUTH.md`

## 🎉 Félicitations !

Si toutes les cases sont cochées, votre système d'authentification est correctement installé et sécurisé !

---

**Date de vérification** : _______________
**Version** : 2.0.0
**Statut** : [ ] Installation réussie
