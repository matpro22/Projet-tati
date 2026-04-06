# 📁 Guide des fichiers importants

## 🎯 Fichiers principaux

### Untitled-1.html
**Le site complet** - HTML + CSS + JavaScript
- Contient tout le frontend
- Fonctionne seul sans serveur
- À renommer en `index.html` pour Vercel

**Où modifier** :
- Ligne ~1520 : Configuration API (`USE_BACKEND`, `API_URL`)
- Ligne ~1540 : Paramètres par défaut
- Ligne ~1550 : Produits (mode local)
- Ligne ~2150 : Identifiants admin

### server.js
**Le backend** - API Node.js + Express
- Gère les paiements Stripe
- CRUD des produits
- Gestion des commandes
- Nécessite `npm start` pour fonctionner

**Endpoints** :
- `/api/health` - État du serveur
- `/api/products` - Produits
- `/api/orders` - Commandes
- `/api/create-payment-intent` - Paiements

### package.json
**Dépendances Node.js**
- Liste des packages nécessaires
- Scripts de démarrage
- Métadonnées du projet

**Commandes** :
```bash
npm install    # Installer les dépendances
npm start      # Démarrer en production
npm run dev    # Démarrer en développement
```

---

## ⚙️ Configuration

### .env
**Variables d'environnement** (LOCAL uniquement)
```env
STRIPE_SECRET_KEY=sk_test_...    # Clé secrète Stripe
PORT=3000                         # Port du serveur
FRONTEND_URL=http://localhost:8080
```

⚠️ **NE JAMAIS COMMITER CE FICHIER !**

### .env.example
**Template de configuration**
- Copie de `.env` sans les vraies valeurs
- À partager avec l'équipe
- Sert de documentation

### vercel.json
**Configuration Vercel**
- Définit comment déployer le projet
- Routes API et fichiers statiques
- Variables d'environnement

---

## 📚 Documentation

### README.md ⭐
**Documentation principale**
- Vue d'ensemble du projet
- Installation et démarrage
- Fonctionnalités
- Déploiement

**À lire en premier !**

### DEPLOIEMENT_VERCEL.md 🚀
**Guide complet Vercel**
- Déploiement frontend seul
- Déploiement frontend + backend
- Configuration avancée
- Dépannage

**Pour déployer sur Vercel**

### VERCEL_RAPIDE.md ⚡
**Guide rapide Vercel**
- Version condensée
- Étapes essentielles
- 5 minutes chrono

**Pour déployer vite**

### GUIDE_BACKEND.md 🔧
**Guide backend détaillé**
- Installation Node.js
- Configuration Stripe
- Utilisation de l'API
- Dépannage

**Pour utiliser le backend**

### DEMARRAGE_RAPIDE.md 🎯
**Démarrage rapide**
- Mode local vs backend
- Installation en 5 minutes
- Premiers tests

**Pour commencer rapidement**

### OU_MODIFIER.md 📝
**Où modifier le code**
- Guide ligne par ligne
- Personnalisation
- Ajout de fonctionnalités

**Pour personnaliser le site**

### RESUME_INTEGRATION.md ✅
**Résumé de l'intégration**
- Ce qui a été fait
- Comment ça marche
- Prochaines étapes

**Pour comprendre le projet**

### README_BACKEND.md 🌐
**Documentation backend (EN)**
- Version anglaise
- Installation
- API endpoints

**Documentation technique**

### STRIPE_INTEGRATION.md 💳
**Guide Stripe**
- Configuration Stripe
- Cartes de test
- Webhooks

**Pour les paiements**

### FICHIERS_IMPORTANTS.md 📁
**Ce fichier !**
- Guide des fichiers
- Où trouver quoi

---

## 🗂️ Dossiers

### data/
**Base de données JSON** (créé automatiquement)
```
data/
├── orders.json     # Commandes
└── products.json   # Produits
```

⚠️ **Attention** : Ces fichiers ne persistent pas sur Vercel !  
→ Utilisez une vraie base de données en production

### node_modules/
**Dépendances installées**
- Créé par `npm install`
- Ne pas commiter (dans .gitignore)
- Peut être supprimé et recréé

### .vscode/
**Configuration VS Code** (optionnel)
- Paramètres de l'éditeur
- Extensions recommandées

---

## 🖼️ Images

### 1.jpg
**Image hero page d'accueil**
- Utilisée en arrière-plan
- Avec dégradé overlay

### 2.jpg
**Image secondaire** (optionnelle)
- Peut être utilisée ailleurs
- Actuellement non utilisée

---

## 🔒 Fichiers de sécurité

### .gitignore
**Fichiers à ignorer par Git**
- `.env` (secrets)
- `node_modules/` (dépendances)
- `data/` (données locales)
- Fichiers système

**Ne pas modifier** sauf si vous savez ce que vous faites

### .vercelignore
**Fichiers à ignorer par Vercel**
- Documentation (sauf README)
- Fichiers de dev
- Données locales

---

## 📊 Fichiers générés

Ces fichiers sont créés automatiquement :

### package-lock.json
- Versions exactes des dépendances
- Créé par `npm install`
- À commiter dans Git

### data/orders.json
- Commandes enregistrées
- Créé au premier démarrage du backend

### data/products.json
- Produits enregistrés
- Créé au premier démarrage du backend

---

## 🎯 Fichiers à modifier selon vos besoins

### Pour personnaliser le site
→ `Untitled-1.html`
- Couleurs (ligne ~40)
- Textes (ligne ~900+)
- Produits (ligne ~1550)

### Pour configurer le backend
→ `.env`
- Clé Stripe
- Port du serveur

### Pour déployer
→ `vercel.json`
- Routes
- Configuration

### Pour changer les identifiants admin
→ `Untitled-1.html` (ligne ~2150)
```javascript
const ADMIN_CREDS = {
  user: 'admin',
  pass: 'BackZo2024!'  // ← Changez ici !
};
```

---

## 🚫 Fichiers à NE PAS modifier

- `package.json` (sauf si vous ajoutez des dépendances)
- `package-lock.json` (géré automatiquement)
- `.gitignore` (bien configuré)
- `server.js` (sauf si vous savez ce que vous faites)

---

## 📋 Checklist avant déploiement

- [ ] `.env` est dans `.gitignore` ✅
- [ ] Mot de passe admin changé
- [ ] Clés Stripe configurées
- [ ] Images présentes (1.jpg, 2.jpg)
- [ ] `vercel.json` créé
- [ ] Documentation lue

---

## 🆘 Fichier manquant ?

### Si vous ne trouvez pas un fichier :

**`.env`** → Créez-le à partir de `.env.example`
```bash
cp .env.example .env
```

**`vercel.json`** → Il est déjà créé !

**`data/`** → Créé automatiquement au démarrage du backend

**`node_modules/`** → Installez les dépendances
```bash
npm install
```

---

## 📚 Ordre de lecture recommandé

1. **README.md** - Vue d'ensemble
2. **DEMARRAGE_RAPIDE.md** - Commencer
3. **VERCEL_RAPIDE.md** - Déployer (si besoin)
4. **OU_MODIFIER.md** - Personnaliser (si besoin)
5. **GUIDE_BACKEND.md** - Backend complet (si besoin)

---

## 🎯 Résumé ultra-rapide

**Pour utiliser le site** :
- Ouvrez `Untitled-1.html`

**Pour le backend** :
- Configurez `.env`
- Lancez `npm start`

**Pour déployer** :
- Lisez `VERCEL_RAPIDE.md`
- Glissez-déposez sur Vercel

**Pour personnaliser** :
- Modifiez `Untitled-1.html`
- Lisez `OU_MODIFIER.md`

---

**Besoin d'aide ?** Consultez les fichiers de documentation ! 📚
