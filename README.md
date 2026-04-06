# 🎽 BackZo — Flocage Amovible Premium

Site e-commerce complet pour la vente de flocages amovibles pour maillots de sport. Conçu pour les clubs sportifs et les particuliers.

## ✨ Fonctionnalités

### 🛍️ Frontend (Site public)

- **Page d'accueil** avec hero animé et choix club/particulier
- **Boutique** avec filtres par catégorie
- **Configurateur** pour personnaliser les flocages
- **Panier** avec gestion des quantités
- **Paiement Stripe** intégré et sécurisé
- **Générateur de devis** avec export PDF
- **Formulaire de contact**
- **Multilingue** (FR, EN, NL)
- **Accessibilité** (contraste, taille de texte, réduction animations)
- **Responsive** (mobile, tablette, desktop)

### 🔐 Backend (Admin)

- **Dashboard** avec statistiques en temps réel
- **Gestion des commandes** avec changement de statut
- **Gestion des produits** (ajouter, modifier, supprimer)
- **Historique des devis**
- **Paramètres** (Stripe, livraison, site)
- **Export des données** en JSON
- **Activité récente**

### 💳 Paiement Stripe

- **Mode local** : Paiements en mode "demo" (crée un PaymentMethod sans charge)
- **Mode backend** : Paiements réels via API Stripe sécurisée
- **Cartes de test** pour le développement
- **Validation en temps réel** de la carte

### 🎨 Design

- **Style moderne** avec animations fluides
- **Curseur personnalisé**
- **Thème sombre** avec accents verts
- **Typographie** : Bebas Neue + Barlow
- **Animations** : Fade, slide, pulse, shimmer
- **Loader** animé au chargement

## 📁 Structure du projet

```
backzo/
├── Untitled-1.html          # Site complet (HTML + CSS + JS)
├── server.js                # Backend Node.js + Express
├── package.json             # Dépendances Node.js
├── .env.example             # Template de configuration
├── .env                     # Configuration (à créer)
├── .gitignore              # Fichiers à ignorer par Git
├── README.md               # Ce fichier
├── README_BACKEND.md       # Documentation backend (EN)
├── GUIDE_BACKEND.md        # Guide backend (FR)
├── STRIPE_INTEGRATION.md   # Guide Stripe
├── frontend-api.js         # Code de référence pour l'API
├── 1.jpg                   # Image hero page d'accueil
├── 2.jpg                   # Image (optionnelle)
└── data/                   # Données (créé automatiquement)
    ├── orders.json         # Commandes
    └── products.json       # Produits
```

## 🚀 Démarrage rapide

### Option 1 : Mode Local (sans backend)

1. Ouvrez simplement `Untitled-1.html` dans votre navigateur
2. Le site fonctionne immédiatement !
3. Les données sont stockées dans localStorage
4. Les paiements Stripe fonctionnent en mode "demo"

### Option 2 : Mode Backend (avec Node.js)

1. **Installer Node.js** (version 16+) depuis [nodejs.org](https://nodejs.org)

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer Stripe** :
   ```bash
   cp .env.example .env
   ```
   Éditez `.env` et ajoutez votre clé secrète Stripe :
   ```env
   STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE
   ```

4. **Démarrer le serveur** :
   ```bash
   npm start
   ```

5. **Activer le backend dans le HTML** :
   Ouvrez `Untitled-1.html` et changez :
   ```javascript
   const USE_BACKEND = false;
   ```
   en :
   ```javascript
   const USE_BACKEND = true;
   ```

6. **Configurer la clé publique Stripe** :
   - Ouvrez le site dans le navigateur
   - Cliquez sur le point (·) dans le footer
   - Connectez-vous : `admin` / `BackZo2024!`
   - Allez dans Paramètres
   - Ajoutez votre clé publique Stripe (`pk_test_...`)

7. **C'est prêt !** 🎉

## 🔑 Accès Admin

- **URL** : Cliquez sur le petit point (·) dans le footer
- **Utilisateur** : `admin`
- **Mot de passe** : `BackZo2024!`

## 💳 Tester les paiements

Utilisez ces cartes de test Stripe :

| Carte | Résultat |
|-------|----------|
| `4242 4242 4242 4242` | ✅ Paiement réussi |
| `4000 0000 0000 0002` | ❌ Paiement refusé |
| `4000 0027 6000 3184` | 🔐 3D Secure requis |

Date : N'importe quelle date future  
CVV : N'importe quel 3 chiffres

## 📚 Documentation

- **[GUIDE_BACKEND.md](GUIDE_BACKEND.md)** - Guide complet du backend (FR)
- **[README_BACKEND.md](README_BACKEND.md)** - Documentation backend (EN)
- **[STRIPE_INTEGRATION.md](STRIPE_INTEGRATION.md)** - Guide Stripe

## 🛠️ Technologies utilisées

### Frontend
- HTML5 / CSS3 / JavaScript (Vanilla)
- Stripe.js (paiements)
- jsPDF (export PDF)
- SVG (illustrations)

### Backend
- Node.js 16+
- Express.js (serveur web)
- Stripe SDK (paiements)
- CORS (requêtes cross-origin)
- dotenv (variables d'environnement)

## 🎨 Personnalisation

### Couleurs

Les couleurs sont définies dans les variables CSS :

```css
:root {
  --black: #0a0a0a;      /* Fond principal */
  --deep: #111111;       /* Fond secondaire */
  --card: #161616;       /* Cartes */
  --green: #b8ff57;      /* Accent principal */
  --white: #f5f5f0;      /* Texte */
  --gray: #888880;       /* Texte secondaire */
}
```

### Produits

En mode local, les produits sont définis dans le tableau `PRODUCTS` :

```javascript
const PRODUCTS = [
  { 
    id: 'patch-s', 
    name: 'Flocage Amovible — Taille S', 
    price: 12, 
    category: 'particuliers',
    desc: 'Patch 25×6 cm. Idéal pour maillots individuels.',
    stock: 100,
    badge: 'Bestseller'
  },
  // ...
];
```

En mode backend, les produits sont gérés depuis l'admin.

### Paramètres

Modifiez les paramètres dans l'admin :
- Nom du site
- Email et téléphone
- Frais de livraison
- Livraison gratuite à partir de X€
- Clé Stripe
- Mode maintenance

## 🔒 Sécurité

### ✅ Bonnes pratiques implémentées

- Validation des emails
- Validation des cartes Stripe
- Échappement des données utilisateur
- CORS configuré
- Clés Stripe séparées (publique/secrète)

### ⚠️ À faire en production

- [ ] Ajouter HTTPS (obligatoire pour Stripe)
- [ ] Implémenter l'authentification JWT pour l'admin
- [ ] Valider toutes les entrées côté serveur
- [ ] Configurer les webhooks Stripe
- [ ] Ajouter un rate limiting
- [ ] Utiliser une vraie base de données
- [ ] Changer le mot de passe admin
- [ ] Ajouter des logs serveur

## 🚀 Déploiement

### Frontend (HTML)

Le fichier `Untitled-1.html` peut être hébergé sur :
- **Netlify** (gratuit) : Glissez-déposez le fichier
- **Vercel** (gratuit) : `vercel --prod`
- **GitHub Pages** (gratuit) : Push dans un repo
- **N'importe quel hébergeur web**

### Backend (Node.js)

Le serveur peut être déployé sur :

**Heroku** :
```bash
heroku create backzo-api
heroku config:set STRIPE_SECRET_KEY=sk_live_...
git push heroku main
```

**Vercel** :
```bash
vercel
```

**Railway** :
```bash
railway up
```

**Render** :
- Connectez votre repo GitHub
- Configurez les variables d'environnement

N'oubliez pas de :
1. Utiliser les clés Stripe **live** (`sk_live_...` et `pk_live_...`)
2. Configurer HTTPS
3. Mettre à jour `API_URL` dans le HTML avec l'URL de production

## 🐛 Dépannage

### Le site ne s'affiche pas

- Vérifiez que vous ouvrez bien `Untitled-1.html`
- Vérifiez que les images `1.jpg` et `2.jpg` sont présentes
- Ouvrez la console (F12) pour voir les erreurs

### Le backend ne démarre pas

- Vérifiez que Node.js est installé : `node --version`
- Vérifiez que les dépendances sont installées : `npm install`
- Vérifiez que le fichier `.env` existe et contient votre clé Stripe

### Les paiements ne fonctionnent pas

- Vérifiez que la clé publique Stripe est configurée dans l'admin
- Vérifiez que vous utilisez une carte de test valide
- Ouvrez la console (F12) pour voir les erreurs Stripe

### Backend non accessible

- Vérifiez que le serveur est démarré : `npm start`
- Vérifiez que `API_URL` dans le HTML correspond au port du serveur
- Vérifiez que `USE_BACKEND` est à `true` dans le HTML

## 📝 Changelog

### Version actuelle

- ✅ Site e-commerce complet
- ✅ Intégration Stripe (local + backend)
- ✅ Backend Node.js + Express
- ✅ Admin complet avec dashboard
- ✅ Générateur de devis PDF
- ✅ Configurateur de flocages
- ✅ Multilingue (FR, EN, NL)
- ✅ Accessibilité
- ✅ Responsive
- ✅ Animations fluides

## 🤝 Contribution

Ce projet est un site vitrine/e-commerce. Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer.

## 📞 Support

Pour toute question :
- Consultez la documentation dans les fichiers README
- Ouvrez une issue sur GitHub
- Contactez : team@backzo.eu

## 🎯 Roadmap

### Court terme
- [ ] Ajouter plus de produits
- [ ] Améliorer le configurateur
- [ ] Ajouter des images produits réelles
- [ ] Implémenter l'envoi d'emails

### Moyen terme
- [ ] Ajouter une base de données
- [ ] Créer un système de comptes clients
- [ ] Ajouter un suivi de commande
- [ ] Implémenter les webhooks Stripe

### Long terme
- [ ] Application mobile
- [ ] Système de fidélité
- [ ] Programme d'affiliation
- [ ] Marketplace multi-vendeurs

---

Fait avec ❤️ pour BackZo

**Bon développement ! 🚀**
