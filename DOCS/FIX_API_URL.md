# 🔧 Correction - Double /api/ dans les URLs

## Problème

Erreur 404 lors de la connexion admin :
```
POST 404 projet-tati.vercel.app/api/api/admin/login
```

L'URL contient `/api/api/` au lieu de `/api/`.

## Cause

Dans `public/admin-auth.js`, les routes utilisaient :
```javascript
fetch(`${API_URL}/api/admin/login`)
```

Alors que `API_URL` est défini comme :
```javascript
const API_URL = 'https://projet-tati.vercel.app/api'
```

Résultat : `/api` + `/api/admin/login` = `/api/api/admin/login` ❌

## Solution

Correction dans `public/admin-auth.js` :

### Avant (❌)
```javascript
fetch(`${API_URL}/api/admin/login`)
fetch(`${API_URL}/api/admin/verify`)
```

### Après (✅)
```javascript
fetch(`${API_URL}/admin/login`)
fetch(`${API_URL}/admin/verify`)
```

## Fichiers modifiés

- `public/admin-auth.js`
  - Ligne ~31 : Route de login
  - Ligne ~81 : Route de vérification

## Vérification

Les URLs correctes sont maintenant :
- ✅ `https://projet-tati.vercel.app/api/admin/login`
- ✅ `https://projet-tati.vercel.app/api/admin/verify`

## Test

1. Redéployez sur Vercel
2. Allez sur la page admin
3. Entrez vos identifiants
4. La connexion devrait fonctionner ✅

## Note

Les autres appels API dans `public/index.html` étaient déjà corrects :
```javascript
fetch(`${API_URL}/orders`)      // ✅ Correct
fetch(`${API_URL}/products`)    // ✅ Correct
fetch(`${API_URL}/settings`)    // ✅ Correct
```

Seul `admin-auth.js` avait le problème.

---

**Date** : 15/04/2026
**Statut** : ✅ Corrigé
