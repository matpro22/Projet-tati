# Correction de l'erreur "API_URL has already been declared"

## 🐛 Problème

L'erreur `Uncaught SyntaxError: Identifier 'API_URL' has already been declared` se produisait car :

1. `API_URL` était déclaré dans `public/index.html` (ligne ~1723)
2. Le fichier `frontend-api.js` était inclus via `<script src="/frontend-api.js"></script>`
3. `frontend-api.js` déclarait aussi `API_URL`, créant un conflit

## ✅ Solution appliquée

### 1. Suppression du script externe
Retiré la ligne :
```html
<script src="/frontend-api.js"></script>
```

### 2. Correction de l'URL dans le HTML
Remplacé :
```javascript
const API_URL = 'https://projet-tati.vercel.app/api';
```

Par :
```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';
```

Cette approche :
- ✅ Détecte automatiquement l'environnement (local vs production)
- ✅ Utilise `http://localhost:3000/api` en développement
- ✅ Utilise `/api` (chemin relatif) en production sur Vercel
- ✅ Pas besoin de port `:3000` sur Vercel (non supporté)

### 3. Ajout des fonctions manquantes dans le HTML
Ajouté directement dans `public/index.html` :
- `sendQuoteEmail()` - Pour envoyer les devis
- `sendOrderNotification()` - Pour les notifications de commande

### 4. Nettoyage
Supprimé `public/frontend-api.js` pour éviter toute confusion future.

## 🎯 Résultat

Tout le code JavaScript est maintenant dans un seul fichier (`public/index.html`), ce qui :
- ✅ Élimine les conflits de déclaration
- ✅ Simplifie la maintenance
- ✅ Réduit les requêtes HTTP (un fichier au lieu de deux)
- ✅ Fonctionne en local et en production

## 🧪 Pour tester

```bash
# Démarrer le serveur
node server.js

# Ouvrir dans le navigateur
http://localhost:3000
```

Vérifiez la console du navigateur - il ne devrait plus y avoir d'erreur `API_URL has already been declared`.

## 📝 Note importante

Le fichier `frontend-api.js` à la racine du projet est conservé comme référence/documentation, mais n'est plus utilisé par l'application.
