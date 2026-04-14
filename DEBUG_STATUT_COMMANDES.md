# 🐛 Debug - Erreur Mise à Jour Statut Commandes

## ❌ Erreur Rencontrée

```
Failed to load resource: the server responded with a status of 404 ()
Erreur mise à jour statut: Error: Erreur mise à jour statut
```

## 🔍 Diagnostic

### Problème Identifié

L'erreur 404 signifie que la route `/api/orders/:id/status` n'est pas trouvée. Cela peut avoir plusieurs causes :

1. **Backend non déployé sur Vercel**
2. **URL incorrecte**
3. **Route non accessible**
4. **Problème de routage Vercel**

## ✅ Solutions

### Solution 1 : Vérifier l'URL de l'API

#### Étape 1 : Ouvrir la Console du Navigateur

1. Appuyez sur `F12` pour ouvrir les DevTools
2. Allez dans l'onglet **Console**
3. Tapez :
   ```javascript
   console.log('API_URL:', API_URL);
   console.log('USE_BACKEND:', USE_BACKEND);
   ```

#### Étape 2 : Vérifier les Valeurs

Vous devriez voir :
```
API_URL: https://projet-tati.vercel.app/api
USE_BACKEND: true
```

Si vous voyez autre chose, il y a un problème de configuration.

### Solution 2 : Tester la Route Directement

#### Test 1 : Vérifier que le Backend est Accessible

Ouvrez dans votre navigateur :
```
https://projet-tati.vercel.app/api/health
```

Vous devriez voir :
```json
{
  "status": "ok",
  "message": "Backend BackZo opérationnel"
}
```

Si vous voyez une erreur 404, le backend n'est pas déployé correctement.

#### Test 2 : Vérifier la Route Orders

Ouvrez dans votre navigateur :
```
https://projet-tati.vercel.app/api/orders
```

Vous devriez voir une liste de commandes (ou un tableau vide `[]`).

Si vous voyez une erreur 404, la route n'existe pas.

### Solution 3 : Vérifier le Déploiement Vercel

#### Étape 1 : Aller sur Vercel Dashboard

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `projet-tati`
3. Vérifiez que le dernier déploiement est "Ready" ✅

#### Étape 2 : Vérifier les Logs

1. Cliquez sur **Functions**
2. Cherchez `/api/orders/:id/status`
3. Si la fonction n'apparaît pas, le backend n'est pas déployé

#### Étape 3 : Redéployer

1. Allez dans **Deployments**
2. Cliquez sur les 3 points `...` du dernier déploiement
3. Cliquez sur **Redeploy**
4. Attendez que le déploiement soit terminé

### Solution 4 : Vérifier le Code

#### Dans `public/index.html`

Vérifiez que la fonction utilise bien `API_URL` :

```javascript
async function updateOrderStatusOnBackend(orderId, newStatus) {
  // ...
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  // ...
}
```

#### Dans `server.js`

Vérifiez que la route existe :

```javascript
app.put('/api/orders/:id/status', async (req, res) => {
  // ...
});
```

## 🧪 Tests de Diagnostic

### Test 1 : Console du Navigateur

```javascript
// Ouvrir la console (F12) et taper :

// 1. Vérifier l'URL de l'API
console.log('API_URL:', API_URL);

// 2. Tester la connexion au backend
fetch(`${API_URL}/health`)
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.error('Erreur:', e));

// 3. Tester la route orders
fetch(`${API_URL}/orders`)
  .then(r => r.json())
  .then(d => console.log('Orders:', d))
  .catch(e => console.error('Erreur:', e));

// 4. Tester la mise à jour de statut (remplacez BZ-123 par un vrai ID)
fetch(`${API_URL}/orders/BZ-123/status`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'processing' })
})
  .then(r => r.json())
  .then(d => console.log('Update:', d))
  .catch(e => console.error('Erreur:', e));
```

### Test 2 : Curl (Terminal)

```bash
# 1. Tester le backend
curl https://projet-tati.vercel.app/api/health

# 2. Tester la route orders
curl https://projet-tati.vercel.app/api/orders

# 3. Tester la mise à jour de statut
curl -X PUT https://projet-tati.vercel.app/api/orders/BZ-123/status \
  -H "Content-Type: application/json" \
  -d '{"status":"processing"}'
```

## 🔧 Corrections Possibles

### Correction 1 : Ajouter une Route Health

Si la route `/api/health` n'existe pas, ajoutez-la dans `server.js` :

```javascript
// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend BackZo opérationnel',
    timestamp: new Date().toISOString()
  });
});
```

### Correction 2 : Vérifier vercel.json

Assurez-vous que `vercel.json` contient :

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### Correction 3 : Ajouter des Logs

Dans `server.js`, ajoutez des logs pour déboguer :

```javascript
app.put('/api/orders/:id/status', async (req, res) => {
  console.log('📝 Route appelée:', req.params.id, req.body);
  // ... reste du code
});
```

Puis vérifiez les logs Vercel :
```bash
vercel logs --follow
```

## 📊 Checklist de Vérification

- [ ] Backend déployé sur Vercel
- [ ] Dernier déploiement "Ready" ✅
- [ ] Route `/api/health` accessible
- [ ] Route `/api/orders` accessible
- [ ] `API_URL` pointe vers `https://projet-tati.vercel.app/api`
- [ ] `USE_BACKEND` est `true`
- [ ] Fonction `updateOrderStatusOnBackend` utilise `${API_URL}`
- [ ] Route `app.put('/api/orders/:id/status')` existe dans `server.js`
- [ ] `vercel.json` configure correctement les routes API

## 🎯 Solution Rapide

Si vous êtes pressé, voici la solution la plus rapide :

### 1. Redéployer sur Vercel

```bash
# Option 1 : Via l'interface Vercel
# Deployments > ... > Redeploy

# Option 2 : Via Git
git add .
git commit -m "Fix: Routes API"
git push

# Option 3 : Via CLI
vercel --prod
```

### 2. Vérifier que ça fonctionne

```bash
# Tester le backend
curl https://projet-tati.vercel.app/api/health

# Devrait retourner :
# {"status":"ok","message":"Backend BackZo opérationnel"}
```

### 3. Tester dans l'interface

1. Allez sur https://backzo.eu
2. Connectez-vous à l'admin
3. Allez dans "Commandes"
4. Changez le statut d'une commande
5. Vérifiez qu'il n'y a plus d'erreur 404

## 🆘 Si Rien ne Fonctionne

### Option 1 : Mode Local Temporaire

En attendant de résoudre le problème, vous pouvez utiliser le mode local :

Dans `public/index.html`, changez :
```javascript
const USE_BACKEND = false; // Désactiver temporairement le backend
```

Les commandes seront stockées dans `localStorage` au lieu de MongoDB.

### Option 2 : Vérifier MongoDB

Le problème peut aussi venir de MongoDB. Vérifiez :

```bash
# Tester la connexion MongoDB
node test-mongodb.js
```

### Option 3 : Consulter les Logs Vercel

```bash
# Voir les logs en temps réel
vercel logs --follow

# Ou sur l'interface Vercel
# Dashboard > Projet > Functions > Logs
```

## 📞 Support

Si le problème persiste :

1. **Vérifiez les logs Vercel** pour voir l'erreur exacte
2. **Testez les routes** avec curl ou Postman
3. **Redéployez** le projet sur Vercel
4. **Consultez** `DEPLOIEMENT_VERCEL_COMPLET.md`

## 🎉 Une Fois Résolu

Une fois que le problème est résolu :

- ✅ Les commandes se chargent correctement
- ✅ Les statuts se mettent à jour sans erreur
- ✅ Les emails sont envoyés automatiquement
- ✅ Aucune erreur 404 dans la console

Vous pourrez alors gérer vos commandes normalement depuis l'interface admin !
