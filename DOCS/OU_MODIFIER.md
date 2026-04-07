# 📝 Où modifier le code dans Untitled-1.html

Guide pour savoir où modifier le code selon ce que vous voulez changer.

## 🎨 Apparence et Style

### Couleurs

**Ligne ~40** - Variables CSS dans `:root`
```css
:root {
  --black: #0a0a0a;
  --green: #b8ff57;  /* ← Changez cette couleur */
  --white: #f5f5f0;
  /* ... */
}
```

### Polices

**Ligne ~15** - Import Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow..." />
```

**Ligne ~50** - Utilisation des polices
```css
body {
  font-family: 'Barlow', sans-serif;  /* ← Changez la police */
}
```

### Animations

**Ligne ~800-850** - Keyframes d'animations
```css
@keyframes fadeUp { /* ... */ }
@keyframes pulse { /* ... */ }
/* Ajoutez vos animations ici */
```

## 🛒 Produits

### Mode Local

**Ligne ~1550** - Tableau des produits
```javascript
const PRODUCTS = [
  {
    id: 'patch-s',
    name: 'Flocage Amovible — Taille S',
    price: 12,
    category: 'particuliers',
    desc: 'Patch 25×6 cm...',
    stock: 100,
    badge: 'Bestseller'
  },
  // Ajoutez vos produits ici
];
```

### Mode Backend

Les produits sont gérés depuis l'admin, pas besoin de modifier le code !

## ⚙️ Configuration

### Backend

**Ligne ~1520** - Configuration API
```javascript
const API_URL = 'http://localhost:3000/api';  // ← URL du backend
const USE_BACKEND = false;  // ← true pour activer le backend
```

### Paramètres par défaut

**Ligne ~1540** - Settings
```javascript
settings: {
  siteName: 'BackZo',  // ← Nom du site
  email: 'team@backzo.eu',  // ← Email de contact
  phone: '+33 6 00 00 00 00',  // ← Téléphone
  shipping: 5.90,  // ← Frais de livraison
  freeShippingFrom: 50,  // ← Livraison gratuite dès X€
  stripeKey: 'pk_test_...',  // ← Clé publique Stripe
}
```

## 🔐 Admin

### Identifiants

**Ligne ~2150** - Credentials admin
```javascript
const ADMIN_CREDS = {
  user: 'admin',  // ← Changez le nom d'utilisateur
  pass: 'BackZo2024!'  // ← CHANGEZ LE MOT DE PASSE !
};
```

⚠️ **IMPORTANT** : Changez le mot de passe avant de mettre en production !

## 📄 Contenu

### Textes de la page d'accueil

**Ligne ~900** - Hero section
```html
<div class="acc-title">
  FLOCAGE <span class="ac">AMOVIBLE</span>
  <div class="ol">PREMIUM</div>
</div>
```

**Ligne ~920** - Sous-titre
```html
<p class="acc-sub">
  Personnalisez vos maillots avec notre technologie...
</p>
```

### Textes des cards "Je suis..."

**Ligne ~950** - Card Club
```html
<div class="choice-tit">JE SUIS UN CLUB</div>
<p class="choice-desc">
  Solutions sur-mesure pour équiper votre équipe...
</p>
```

**Ligne ~980** - Card Particulier
```html
<div class="choice-tit">JE SUIS UN PARTICULIER</div>
<p class="choice-desc">
  Personnalisez votre maillot en quelques clics...
</p>
```

### Footer

**Ligne ~1450** - Footer
```html
<div class="foot-logo">BACK<span>ZO</span></div>
<div class="foot-tagline">Flocage amovible premium</div>
```

## 🎯 Fonctionnalités

### Ajouter une nouvelle page

1. **Ajoutez le lien dans la navigation** (ligne ~100)
```html
<a href="#" id="nl-mapage" onclick="showPage('mapage')">Ma Page</a>
```

2. **Créez la section page** (ligne ~1100)
```html
<div class="page" id="page-mapage">
  <section>
    <h1>Ma Nouvelle Page</h1>
    <p>Contenu de ma page...</p>
  </section>
</div>
```

### Modifier le configurateur

**Ligne ~1700** - Tailles disponibles
```javascript
function selectSize(size, btn) {
  // Ajoutez vos tailles ici
}
```

**Ligne ~1720** - Couleurs disponibles
```html
<div id="colorSwatches" class="color-swatches">
  <div class="p-swatch" style="background:#b8ff57" onclick="selectColor('#b8ff57',this)"></div>
  <!-- Ajoutez vos couleurs ici -->
</div>
```

### Modifier les emails

**Ligne ~2100** - Template email commande
```javascript
const body = encodeURIComponent(`
  Bonjour ${fn},
  
  Votre commande ${order.id} a été confirmée.
  
  Modifiez ce texte ici !
`);
```

## 💳 Stripe

### Clé publique

**Ligne ~1540** - Dans les settings
```javascript
stripeKey: 'pk_test_VOTRE_CLE_ICI'
```

Ou configurez-la dans l'admin : Paramètres > Paiement Stripe

### Initialisation Stripe

**Ligne ~1850** - Fonction initStripe
```javascript
function initStripe() {
  const stripeKey = state.settings.stripeKey;
  // Configuration Stripe ici
}
```

## 🌍 Traductions

### Ajouter une langue

**Ligne ~2400** - Dictionnaire de traductions
```javascript
const LANGS = {
  fr: { 'nav.home': 'Accueil', /* ... */ },
  en: { 'nav.home': 'Home', /* ... */ },
  nl: { 'nav.home': 'Home', /* ... */ },
  es: { 'nav.home': 'Inicio', /* ... */ }  // ← Ajoutez votre langue
};
```

**Ligne ~1400** - Sélecteur de langue
```html
<select class="bz-sel" onchange="setLangFromSelect(this.value)">
  <option value="fr">FR</option>
  <option value="en">EN</option>
  <option value="nl">NL</option>
  <option value="es">ES</option>  <!-- Ajoutez votre langue -->
</select>
```

## 📊 Dashboard Admin

### Statistiques

**Ligne ~2050** - Calcul des stats
```javascript
function renderAdminDashboard() {
  const rev = state.orders.reduce((s,o) => s + o.total, 0);
  // Ajoutez vos calculs ici
}
```

### Tableau de commandes

**Ligne ~2080** - Rendu du tableau
```javascript
function renderOrdersTable(tbodyId, limit) {
  // Modifiez l'affichage ici
}
```

## 🎨 Personnalisation avancée

### Curseur personnalisé

**Ligne ~1580** - Animation du curseur
```javascript
const cur = document.getElementById('cur');
const ring = document.getElementById('ring');
// Modifiez le comportement ici
```

### Loader

**Ligne ~1600** - Textes du loader
```javascript
const loadTxts = [
  'Chargement…',
  'Préparation…',
  'Presque prêt…'
  // Ajoutez vos textes ici
];
```

### Animations au scroll

**Ligne ~1650** - Intersection Observer
```javascript
function initReveals() {
  const obs = new IntersectionObserver((entries) => {
    // Modifiez le comportement ici
  });
}
```

## 🔧 Fonctions utiles

### Toast (notifications)

**Ligne ~2380** - Afficher un toast
```javascript
showToast('Mon message');  // Succès
showToast('Erreur !', true);  // Erreur
```

### Modal

**Ligne ~2350** - Ouvrir/fermer une modal
```javascript
openModal('mon-modal');
closeModal('mon-modal');
```

### Navigation

**Ligne ~1680** - Changer de page
```javascript
showPage('accueil');  // Affiche la page d'accueil
showPage('shop');     // Affiche la boutique
```

## 📱 Responsive

### Media queries

**Ligne ~850** - Breakpoints
```css
@media(max-width: 1024px) {
  /* Tablette */
}

@media(max-width: 600px) {
  /* Mobile */
}
```

## 🎯 Conseils

### Avant de modifier

1. **Faites une sauvegarde** du fichier
2. **Testez dans le navigateur** après chaque modification
3. **Utilisez la console** (F12) pour voir les erreurs
4. **Commentez votre code** pour vous y retrouver

### Recherche rapide

Utilisez `Ctrl+F` (ou `Cmd+F` sur Mac) pour chercher :
- `function nomDeLaFonction` - Trouver une fonction
- `id="monId"` - Trouver un élément HTML
- `.maClasse` - Trouver un style CSS
- `// SECTION` - Trouver une section (les commentaires sont en majuscules)

### Structure du fichier

```
Untitled-1.html
├── HEAD (lignes 1-40)
│   ├── Meta tags
│   ├── Fonts
│   └── Stripe script
├── STYLE (lignes 40-900)
│   ├── Variables CSS
│   ├── Composants
│   └── Responsive
├── BODY (lignes 900-1500)
│   ├── Navigation
│   ├── Pages
│   └── Modals
└── SCRIPT (lignes 1500-2800)
    ├── Configuration
    ├── State
    ├── Fonctions
    └── Event listeners
```

## 🆘 Besoin d'aide ?

Si vous ne trouvez pas ce que vous cherchez :
1. Utilisez `Ctrl+F` pour chercher un mot-clé
2. Regardez les commentaires `// ===== SECTION =====`
3. Consultez [README.md](README.md) pour plus d'infos
4. Ouvrez la console (F12) pour voir les erreurs

---

**Bon développement ! 🚀**
