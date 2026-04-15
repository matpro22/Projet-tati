# 🏗️ Architecture du Système d'Authentification

## 📊 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                     SYSTÈME D'AUTHENTIFICATION                   │
│                            BackZo Admin                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │ ◄─────► │   Backend    │ ◄─────► │  Variables   │
│  (Browser)   │   JWT   │  (Node.js)   │  Hash   │     .env     │
└──────────────┘         └──────────────┘         └──────────────┘
```

## 🔄 Flux d'authentification

### 1. Connexion (Login)

```
┌─────────┐                                    ┌─────────┐
│ Client  │                                    │ Serveur │
└────┬────┘                                    └────┬────┘
     │                                              │
     │  POST /api/admin/login                      │
     │  { username, password }                     │
     ├─────────────────────────────────────────────►
     │                                              │
     │                                              │ 1. Vérifier username
     │                                              │ 2. Comparer password avec hash
     │                                              │ 3. Générer token JWT
     │                                              │
     │  { success: true, token, expiresIn }        │
     ◄─────────────────────────────────────────────┤
     │                                              │
     │ Stocker token dans localStorage             │
     │                                              │
```

### 2. Requête authentifiée

```
┌─────────┐                                    ┌─────────┐
│ Client  │                                    │ Serveur │
└────┬────┘                                    └────┬────┘
     │                                              │
     │  GET /api/orders                            │
     │  Authorization: Bearer <token>              │
     ├─────────────────────────────────────────────►
     │                                              │
     │                                              │ 1. Extraire token
     │                                              │ 2. Vérifier signature JWT
     │                                              │ 3. Vérifier expiration
     │                                              │ 4. Exécuter requête
     │                                              │
     │  { orders: [...] }                          │
     ◄─────────────────────────────────────────────┤
     │                                              │
```

### 3. Token expiré

```
┌─────────┐                                    ┌─────────┐
│ Client  │                                    │ Serveur │
└────┬────┘                                    └────┬────┘
     │                                              │
     │  GET /api/orders                            │
     │  Authorization: Bearer <expired_token>      │
     ├─────────────────────────────────────────────►
     │                                              │
     │                                              │ 1. Vérifier token
     │                                              │ 2. Token expiré !
     │                                              │
     │  401 Unauthorized                           │
     │  { error: "Token invalide ou expiré" }      │
     ◄─────────────────────────────────────────────┤
     │                                              │
     │ Supprimer token                             │
     │ Rediriger vers login                        │
     │                                              │
```

## 🔐 Composants du système

### Frontend (public/admin-auth.js)

```javascript
class AdminAuth {
  ├── login(username, password)
  │   └── Envoie credentials au serveur
  │       └── Stocke token dans localStorage
  │
  ├── logout()
  │   └── Supprime token de localStorage
  │
  ├── isAuthenticated()
  │   └── Vérifie si token existe et n'est pas expiré
  │
  ├── verifyToken()
  │   └── Vérifie token auprès du serveur
  │
  └── authenticatedFetch(url, options)
      └── Ajoute token aux headers
          └── Gère erreurs d'authentification
}
```

### Backend (server.js)

```javascript
Routes d'authentification
├── POST /api/admin/login
│   ├── Vérifier username
│   ├── Comparer password (bcrypt)
│   └── Générer token JWT
│
├── GET /api/admin/verify
│   └── Vérifier validité du token
│
└── POST /api/admin/change-password
    ├── Vérifier token
    ├── Vérifier ancien password
    └── Informer de la procédure

Middleware
└── authenticateToken(req, res, next)
    ├── Extraire token du header
    ├── Vérifier signature JWT
    ├── Vérifier expiration
    └── Passer au handler ou renvoyer 401/403

Routes protégées
├── POST /api/products
├── PUT /api/products/:id
├── DELETE /api/products/:id
├── GET /api/orders
├── PUT /api/orders/:id/status
├── DELETE /api/orders/:id
├── POST /api/settings
└── PUT /api/presentations/:type
```

## 🔑 Gestion des credentials

### Variables d'environnement (.env)

```
┌─────────────────────────────────────────┐
│           Fichier .env                  │
│         (NON COMMITÉ)                   │
├─────────────────────────────────────────┤
│                                         │
│  ADMIN_USERNAME=admin                   │
│  ADMIN_PASSWORD=SecurePass123!          │
│  JWT_SECRET=a1b2c3d4e5f6...            │
│                                         │
└─────────────────────────────────────────┘
           │
           │ Au démarrage du serveur
           ▼
┌─────────────────────────────────────────┐
│         Serveur Node.js                 │
├─────────────────────────────────────────┤
│                                         │
│  ADMIN_USERNAME (string)                │
│  ADMIN_PASSWORD_HASH (bcrypt)           │
│  JWT_SECRET (string)                    │
│                                         │
└─────────────────────────────────────────┘
```

### Hash du mot de passe

```
Mot de passe en clair
        │
        │ bcrypt.hashSync(password, 10)
        ▼
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
        │
        │ Stocké en mémoire
        ▼
Utilisé pour comparaison lors du login
```

### Token JWT

```
Payload
┌─────────────────────────────────────────┐
│  {                                      │
│    username: "admin",                   │
│    role: "admin",                       │
│    iat: 1234567890,                     │
│    exp: 1234654290                      │
│  }                                      │
└─────────────────────────────────────────┘
           │
           │ jwt.sign(payload, JWT_SECRET)
           ▼
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxMjM0NTY3ODkwLCJleHAiOjEyMzQ2NTQyOTB9.signature
           │
           │ Envoyé au client
           ▼
Stocké dans localStorage
```

## 🛡️ Sécurité en couches

```
┌─────────────────────────────────────────────────────────────┐
│                    Couche 1 : Frontend                      │
│  - Vérification de l'expiration du token                   │
│  - Stockage sécurisé dans localStorage                     │
│  - Déconnexion automatique si expiré                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Couche 2 : Transport                     │
│  - HTTPS en production (chiffrement)                       │
│  - Token dans header Authorization                         │
│  - Pas de credentials dans l'URL                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Couche 3 : Backend                       │
│  - Middleware authenticateToken                            │
│  - Vérification de la signature JWT                        │
│  - Vérification de l'expiration                            │
│  - Protection de toutes les routes admin                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Couche 4 : Données                       │
│  - Hash bcrypt du mot de passe                             │
│  - Variables d'environnement (non commitées)               │
│  - JWT_SECRET unique et aléatoire                          │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Structure des fichiers

```
projet-tati/
│
├── .env                          # Credentials (NON COMMITÉ)
├── .env.example                  # Template
│
├── server.js                     # Backend avec auth
│   ├── Routes d'authentification
│   ├── Middleware authenticateToken
│   └── Routes protégées
│
├── public/
│   ├── admin-auth.js            # Système d'auth frontend
│   └── index.html               # Interface admin
│
├── package.json                  # Dépendances + scripts
│
├── generate-jwt-secret.js       # Générateur de secret
├── setup-admin-auth.js          # Configuration interactive
│
├── Fichier de test/
│   └── test-auth-system.js      # Tests
│
└── DOCS/
    ├── COMMENCER_ICI.md         # Guide de démarrage
    ├── SECURITE_ADMIN.md        # Doc technique
    ├── VERCEL_AUTH_SETUP.md     # Déploiement
    └── ARCHITECTURE_AUTH.md     # Ce fichier
```

## 🔄 Cycle de vie d'une session

```
1. Connexion
   ├── Utilisateur entre credentials
   ├── Serveur vérifie et génère token
   └── Token stocké dans localStorage

2. Utilisation (0-24h)
   ├── Chaque requête admin inclut le token
   ├── Serveur vérifie le token
   └── Requête exécutée si valide

3. Expiration (après 24h)
   ├── Token devient invalide
   ├── Serveur renvoie 401
   ├── Client détecte l'erreur
   └── Déconnexion automatique

4. Déconnexion manuelle
   ├── Utilisateur clique "Déconnexion"
   ├── Token supprimé de localStorage
   └── Redirection vers page d'accueil
```

## 🎯 Points clés

### ✅ Avantages

1. **Pas de mot de passe en clair** dans le code
2. **Hash bcrypt** impossible à inverser
3. **Tokens JWT** avec expiration automatique
4. **Protection API** complète
5. **Déconnexion automatique** si token expiré
6. **Variables d'environnement** non commitées

### 🔒 Sécurité

1. **Authentification** : Vérification côté serveur uniquement
2. **Autorisation** : Middleware sur toutes les routes admin
3. **Chiffrement** : Hash bcrypt + signature JWT
4. **Expiration** : Tokens valides 24h maximum
5. **Transport** : HTTPS en production

### 📊 Performance

1. **Tokens légers** : Pas de requête DB à chaque vérification
2. **Cache** : Token stocké dans localStorage
3. **Stateless** : Pas de session serveur
4. **Scalable** : Fonctionne avec plusieurs instances

## 🚀 Déploiement

### Local

```
.env (fichier local)
    │
    ▼
npm start
    │
    ▼
Serveur démarre avec credentials
```

### Vercel

```
Dashboard Vercel
    │
    ├── ADMIN_USERNAME
    ├── ADMIN_PASSWORD
    └── JWT_SECRET
        │
        ▼
    Déploiement
        │
        ▼
Serveur démarre avec credentials
```

## 📚 Ressources

- **JWT** : https://jwt.io
- **bcrypt** : https://github.com/kelektiv/node.bcrypt.js
- **Vercel Env Vars** : https://vercel.com/docs/environment-variables

---

**Architecture** : Stateless JWT Authentication
**Version** : 2.0.0
**Date** : 2024
