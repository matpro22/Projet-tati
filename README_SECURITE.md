# 🔐 Système d'Authentification Admin Sécurisé - BackZo

## 🎯 Objectif

Remplacer le système d'authentification avec mot de passe en clair par un système sécurisé utilisant JWT et bcrypt.

## ✅ Ce qui a été implémenté

### 1. Backend (server.js)

- ✅ Ajout de bcrypt pour hasher les mots de passe
- ✅ Ajout de JWT pour gérer les sessions
- ✅ Route `/api/admin/login` pour l'authentification
- ✅ Route `/api/admin/verify` pour vérifier les tokens
- ✅ Route `/api/admin/change-password` pour changer le mot de passe
- ✅ Middleware `authenticateToken` pour protéger les routes
- ✅ Protection de toutes les routes admin :
  - `POST/PUT/DELETE /api/products`
  - `GET/PUT/DELETE /api/orders`
  - `POST /api/settings`
  - `PUT /api/presentations`

### 2. Frontend (public/)

- ✅ Nouveau fichier `admin-auth.js` avec classe `AdminAuth`
- ✅ Gestion des tokens JWT dans localStorage
- ✅ Vérification automatique de l'expiration
- ✅ Modification de toutes les fonctions admin pour utiliser les tokens
- ✅ Suppression du mot de passe en clair dans le HTML
- ✅ Gestion automatique de la déconnexion en cas d'expiration

### 3. Configuration

- ✅ Ajout des variables d'environnement dans `.env.example`
- ✅ Ajout des dépendances dans `package.json`
- ✅ Scripts npm pour faciliter la configuration

### 4. Documentation

- ✅ `DOCS/SECURITE_ADMIN.md` - Documentation complète
- ✅ `SECURITE_ADMIN_GUIDE_RAPIDE.md` - Guide de démarrage rapide
- ✅ `README_SECURITE.md` - Ce fichier

### 5. Outils

- ✅ `generate-jwt-secret.js` - Générer un secret JWT
- ✅ `setup-admin-auth.js` - Configuration interactive
- ✅ `Fichier de test/test-auth-system.js` - Tester le système

## 🚀 Installation en 3 étapes

### Étape 1 : Installer les dépendances

```bash
npm install
```

### Étape 2 : Configurer l'authentification

**Option A - Configuration automatique (recommandé) :**

```bash
npm run setup-auth
```

Suivez les instructions interactives.

**Option B - Configuration manuelle :**

1. Générez un JWT secret :
```bash
npm run generate-secret
```

2. Éditez `.env` et ajoutez :
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=VotreMotDePasseSecurise2024!
JWT_SECRET=le_secret_genere
```

### Étape 3 : Tester et démarrer

```bash
# Tester la configuration
npm run test-auth

# Démarrer le serveur
npm start
```

## 📋 Scripts npm disponibles

| Script | Description |
|--------|-------------|
| `npm start` | Démarrer le serveur |
| `npm run dev` | Démarrer en mode développement |
| `npm run setup-auth` | Configuration interactive de l'authentification |
| `npm run generate-secret` | Générer un JWT secret |
| `npm run test-auth` | Tester le système d'authentification |

## 🔒 Sécurité

### Avant (❌ Non sécurisé)

```javascript
// Mot de passe visible dans le code !
const ADMIN_CREDS = {user:'admin', pass:'BackZo2024!'};

if(u === ADMIN_CREDS.user && p === ADMIN_CREDS.pass) {
  // Connexion réussie
}
```

### Après (✅ Sécurisé)

```javascript
// Backend : Hash bcrypt + JWT
const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

// Frontend : Token dans localStorage
const result = await adminAuth.login(username, password);
const response = await adminAuth.authenticatedFetch('/api/orders');
```

## 🛡️ Fonctionnalités de sécurité

1. **Hash bcrypt** : Le mot de passe est hashé avec bcrypt (10 rounds)
2. **JWT** : Tokens signés avec un secret unique
3. **Expiration** : Les tokens expirent après 24h
4. **Protection API** : Toutes les routes admin nécessitent un token valide
5. **Déconnexion auto** : Si le token expire ou est invalide
6. **Variables d'environnement** : Credentials stockés dans .env (non commité)

## 📁 Fichiers modifiés/créés

### Modifiés
- `server.js` - Routes d'authentification + middleware
- `public/index.html` - Intégration du nouveau système
- `package.json` - Nouvelles dépendances et scripts
- `.env.example` - Variables d'authentification

### Créés
- `public/admin-auth.js` - Système d'authentification frontend
- `generate-jwt-secret.js` - Générateur de secret
- `setup-admin-auth.js` - Configuration interactive
- `Fichier de test/test-auth-system.js` - Tests
- `DOCS/SECURITE_ADMIN.md` - Documentation complète
- `SECURITE_ADMIN_GUIDE_RAPIDE.md` - Guide rapide
- `README_SECURITE.md` - Ce fichier

## 🌐 Déploiement

### Vercel

1. Dashboard Vercel → Settings → Environment Variables
2. Ajoutez :
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
3. Redéployez

### Autres plateformes

Assurez-vous que les variables d'environnement sont configurées avant le démarrage.

## 🔧 Utilisation

### Se connecter

1. Allez sur `/admin` (ou cliquez sur le point dans le footer)
2. Entrez vos identifiants
3. Vous êtes connecté pour 24h

### API

Toutes les requêtes admin doivent inclure le header :

```javascript
Authorization: Bearer <token>
```

Le système `adminAuth.authenticatedFetch()` gère cela automatiquement.

## ❓ Dépannage

### "Identifiant ou mot de passe incorrect"

➡️ Vérifiez `ADMIN_USERNAME` et `ADMIN_PASSWORD` dans `.env`

### "Token invalide ou expiré"

➡️ Reconnectez-vous (session expirée après 24h)

### "Module not found: bcryptjs"

➡️ Exécutez `npm install`

### "JWT_SECRET non défini"

➡️ Exécutez `npm run setup-auth` ou `npm run generate-secret`

## 📚 Documentation

- **Guide rapide** : `SECURITE_ADMIN_GUIDE_RAPIDE.md`
- **Documentation complète** : `DOCS/SECURITE_ADMIN.md`

## ✨ Avantages

- ✅ Pas de mot de passe en clair dans le code
- ✅ Hash bcrypt impossible à inverser
- ✅ Sessions sécurisées avec JWT
- ✅ Expiration automatique des tokens
- ✅ Protection de toutes les routes admin
- ✅ Facile à configurer et déployer
- ✅ Compatible avec Vercel et autres plateformes

## 🎉 Conclusion

Le système d'authentification est maintenant complètement sécurisé. Plus de mot de passe visible dans le code source !

Pour toute question, consultez la documentation ou contactez l'équipe de développement.
