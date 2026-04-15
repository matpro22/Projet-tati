# 🔧 Correction - Erreur 401 sur les routes admin

## Problème

Erreur 401 (Unauthorized) sur plusieurs routes admin :
```
PUT 401 /api/presentations/clubs
PUT 401 /api/products/:id
POST 401 /api/products
```

## Cause

Plusieurs fonctions admin utilisaient `fetch()` au lieu de `adminAuth.authenticatedFetch()`, donc les requêtes n'incluaient pas le token JWT dans les headers.

## Routes concernées

Les routes suivantes sont protégées par le middleware `authenticateToken` et nécessitent un token JWT :

- `PUT /api/presentations/clubs`
- `PUT /api/presentations/particuliers`
- `PUT /api/products/:id`
- `POST /api/products`
- `POST /api/init-db`

## Solution appliquée

### 1. Mise à jour des présentations

**Avant (❌) :**
```javascript
const response = await fetch(`${API_URL}/presentations/clubs`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, description, mediaType, mediaUrl })
});
```

**Après (✅) :**
```javascript
const response = await adminAuth.authenticatedFetch(`${API_URL}/presentations/clubs`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, description, mediaType, mediaUrl })
});
```

### 2. Modification de produit

**Avant (❌) :**
```javascript
const response = await fetch(`${API_URL}/products/${productId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, price, stock, category, desc, active })
});
```

**Après (✅) :**
```javascript
const response = await adminAuth.authenticatedFetch(`${API_URL}/products/${productId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, price, stock, category, desc, active })
});
```

### 3. Création de produits

**Avant (❌) :**
```javascript
const response = await fetch(`${API_URL}/products`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(product)
});
```

**Après (✅) :**
```javascript
const response = await adminAuth.authenticatedFetch(`${API_URL}/products`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(product)
});
```

### 4. Mise à jour des prix

**Avant (❌) :**
```javascript
const response = await fetch(`${API_URL}/products/patch-s`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ price: 13 })
});
```

**Après (✅) :**
```javascript
const response = await adminAuth.authenticatedFetch(`${API_URL}/products/patch-s`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ price: 13 })
});
```

### 5. Initialisation de la base de données

**Avant (❌) :**
```javascript
const response = await fetch(`${API_URL}/init-db`, {
  method: 'POST'
});
```

**Après (✅) :**
```javascript
const response = await adminAuth.authenticatedFetch(`${API_URL}/init-db`, {
  method: 'POST'
});
```

## Fonctions modifiées

1. `savePresentationClubs()` - Ligne ~4283
2. `savePresentationParticuliers()` - Ligne ~4323
3. `saveProductEdit()` - Ligne ~3614
4. `updatePatchPrices()` - Lignes ~3733, ~3740
5. `createDefaultPatches()` - Lignes ~3797, ~3814
6. `initDatabase()` - Ligne ~3703

## Gestion des erreurs

Ajout de la gestion de la déconnexion automatique en cas d'erreur d'authentification :

```javascript
catch (error) {
  console.error('Erreur:', error);
  showToast('Erreur lors de l\'opération', true);
  
  // Si erreur d'authentification, rediriger vers login
  if (error.message && error.message.includes('Session expirée')) {
    adminLogout();
    showPage('admin');
  }
}
```

## Comment adminAuth.authenticatedFetch() fonctionne

La méthode `authenticatedFetch()` de la classe `AdminAuth` :

1. Vérifie que l'utilisateur est authentifié
2. Ajoute automatiquement le header `Authorization: Bearer <token>`
3. Fait la requête
4. Détecte les erreurs 401/403
5. Déconnecte automatiquement si le token est invalide

```javascript
async authenticatedFetch(url, options = {}) {
  if (!this.isAuthenticated()) {
    throw new Error('Non authentifié');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${this.token}`
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Si le token est invalide, déconnecter
  if (response.status === 401 || response.status === 403) {
    this.logout();
    throw new Error('Session expirée, veuillez vous reconnecter');
  }

  return response;
}
```

## Vérification

Après correction, les requêtes incluent maintenant le header :

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Et le serveur répond :
- ✅ 200 OK (au lieu de 401 Unauthorized)

## Test

1. Connectez-vous au panel admin
2. Essayez de modifier une présentation
3. Vérifiez dans la console (F12) → Network :
   - Header `Authorization` présent ✅
   - Statut 200 OK ✅

## Routes déjà correctes

Ces routes utilisaient déjà `adminAuth.authenticatedFetch()` :

- ✅ `POST /api/products` (ajout de produit via modal)
- ✅ `DELETE /api/products/:id`
- ✅ `GET /api/orders`
- ✅ `PUT /api/orders/:id/status`
- ✅ `DELETE /api/orders/:id`
- ✅ `POST /api/settings`

## Checklist de vérification

- [x] Présentations Clubs - Sauvegarde
- [x] Présentations Particuliers - Sauvegarde
- [x] Produits - Modification
- [x] Produits - Création (patchs par défaut)
- [x] Produits - Mise à jour des prix
- [x] Base de données - Initialisation

## Fichiers modifiés

- `public/index.html` - 7 fonctions corrigées

## Déploiement

Après commit et push, Vercel redéploiera automatiquement avec les corrections.

---

**Date** : 15/04/2026
**Statut** : ✅ Corrigé
**Impact** : Toutes les routes admin nécessitent maintenant l'authentification
