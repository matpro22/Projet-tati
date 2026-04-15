# 🧪 Test de la connexion admin

## Problème corrigé

L'erreur 404 avec l'URL `/api/api/admin/login` a été corrigée.

## Test en local

### 1. Démarrer le serveur

```bash
npm start
```

### 2. Ouvrir le navigateur

Allez sur http://localhost:3000

### 3. Accéder à l'admin

Cliquez sur le point dans le footer (en bas de page)

### 4. Se connecter

Entrez vos identifiants :
- **Identifiant** : celui défini dans `.env` (ADMIN_USERNAME)
- **Mot de passe** : celui défini dans `.env` (ADMIN_PASSWORD)

### 5. Vérifier dans la console

Ouvrez la console du navigateur (F12) et vérifiez :

**Avant la connexion :**
```
🔐 Tentative de connexion admin: admin
```

**Après la connexion (succès) :**
```
✓ Connexion admin réussie
```

**En cas d'erreur :**
```
❌ Identifiant ou mot de passe incorrect
```

### 6. Vérifier l'URL de la requête

Dans l'onglet "Network" (Réseau) de la console :
- Cherchez la requête `login`
- Vérifiez l'URL : doit être `http://localhost:3000/api/admin/login` ✅
- Statut : doit être `200 OK` ✅

## Test sur Vercel

### 1. Redéployer

Si vous avez déjà déployé sur Vercel, redéployez pour appliquer les corrections :

1. Commitez les changements :
```bash
git add .
git commit -m "Fix: Correction double /api/ dans les URLs d'authentification"
git push
```

2. Vercel redéploiera automatiquement

### 2. Vérifier les variables d'environnement

Dashboard Vercel → Settings → Environment Variables

Vérifiez que ces variables sont configurées :
- ✅ `ADMIN_USERNAME`
- ✅ `ADMIN_PASSWORD`
- ✅ `JWT_SECRET`

### 3. Tester la connexion

1. Allez sur https://projet-tati.vercel.app
2. Cliquez sur le point dans le footer
3. Entrez vos identifiants
4. Vérifiez la connexion

### 4. Vérifier dans la console

Ouvrez la console (F12) et vérifiez :

**URL de la requête :**
```
POST https://projet-tati.vercel.app/api/admin/login
```

**Statut :**
```
200 OK
```

**Réponse :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

## Vérifications supplémentaires

### Token stocké

Console → Application → Local Storage → https://projet-tati.vercel.app

Vous devriez voir :
- ✅ `adminToken` : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- ✅ `adminTokenExpiry` : 1713186925000

### Panel admin accessible

Après connexion, vous devriez voir :
- ✅ Onglet "Commandes"
- ✅ Onglet "Produits"
- ✅ Onglet "Paramètres"
- ✅ Onglet "Présentations"
- ✅ Bouton "Déconnexion"

### Requêtes authentifiées

Testez une action admin (par exemple, voir les commandes) :

Console → Network → Cherchez la requête `orders`

**Headers :**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Statut :**
```
200 OK
```

## Problèmes possibles

### Erreur 404

**Symptôme :**
```
POST 404 /api/api/admin/login
```

**Cause :** Le fichier `admin-auth.js` n'a pas été mis à jour

**Solution :**
1. Vérifiez que `admin-auth.js` contient `${API_URL}/admin/login` (sans `/api/`)
2. Videz le cache du navigateur (Ctrl+Shift+R)
3. Redéployez sur Vercel

### Erreur 401

**Symptôme :**
```
POST 401 /api/admin/login
{"error": "Identifiant ou mot de passe incorrect"}
```

**Cause :** Credentials incorrects

**Solution :**
1. Vérifiez `ADMIN_USERNAME` et `ADMIN_PASSWORD` dans `.env` (local)
2. Vérifiez les variables d'environnement sur Vercel (production)

### Erreur 500

**Symptôme :**
```
POST 500 /api/admin/login
```

**Cause :** Erreur serveur (JWT_SECRET manquant, etc.)

**Solution :**
1. Vérifiez les logs Vercel
2. Vérifiez que `JWT_SECRET` est configuré
3. Vérifiez que `bcryptjs` et `jsonwebtoken` sont installés

## Checklist de test

- [ ] Serveur démarre sans erreur
- [ ] Page admin accessible
- [ ] Formulaire de login s'affiche
- [ ] Pas de mot de passe en clair visible
- [ ] Connexion avec identifiants corrects fonctionne
- [ ] URL de la requête est correcte (pas de double /api/)
- [ ] Statut 200 OK
- [ ] Token reçu et stocké
- [ ] Panel admin s'affiche
- [ ] Onglets accessibles
- [ ] Déconnexion fonctionne

## Résultat attendu

✅ Connexion réussie
✅ Token JWT généré
✅ Panel admin accessible
✅ Toutes les fonctionnalités admin fonctionnent

---

**Date** : 15/04/2026
**Statut** : ✅ Correction appliquée
