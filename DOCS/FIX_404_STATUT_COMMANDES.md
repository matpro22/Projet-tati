# 🔧 Fix Rapide - Erreur 404 Mise à Jour Statut

## ❌ Erreur

```
Failed to load resource: the server responded with a status of 404
Erreur mise à jour statut: Error: Erreur mise à jour statut
```

## ✅ Solution Rapide (5 minutes)

### Étape 1 : Vérifier que le Backend est Déployé

Ouvrez cette URL dans votre navigateur :
```
https://projet-tati.vercel.app/api/health
```

**Si vous voyez :**
```json
{"status":"ok","message":"Backend BackZo opérationnel"}
```
→ Le backend fonctionne, passez à l'étape 2.

**Si vous voyez une erreur 404 :**
→ Le backend n'est pas déployé, suivez l'étape 1.1.

#### Étape 1.1 : Redéployer sur Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `projet-tati`
3. Cliquez sur **Deployments**
4. Cliquez sur les 3 points `...` du dernier déploiement
5. Cliquez sur **Redeploy**
6. Attendez 1-2 minutes
7. Retestez l'URL ci-dessus

### Étape 2 : Vérifier la Route Orders

Ouvrez cette URL :
```
https://projet-tati.vercel.app/api/orders
```

**Si vous voyez :**
```json
[]
```
ou une liste de commandes
→ La route fonctionne, passez à l'étape 3.

**Si vous voyez une erreur 404 :**
→ La route n'existe pas, le backend n'est pas correctement déployé. Redéployez (étape 1.1).

### Étape 3 : Tester la Mise à Jour de Statut

#### Option A : Via la Console du Navigateur

1. Allez sur https://backzo.eu
2. Appuyez sur `F12` pour ouvrir la console
3. Collez ce code (remplacez `BZ-123` par un vrai ID de commande) :

```javascript
// 1. Vérifier l'API_URL
console.log('API_URL:', API_URL);

// 2. Tester la mise à jour (remplacez BZ-123 par un vrai ID)
fetch(`${API_URL}/orders/BZ-1234567890/status`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'processing' })
})
  .then(r => r.json())
  .then(d => console.log('✅ Succès:', d))
  .catch(e => console.error('❌ Erreur:', e));
```

#### Option B : Via Curl

```bash
curl -X PUT https://projet-tati.vercel.app/api/orders/BZ-1234567890/status \
  -H "Content-Type: application/json" \
  -d '{"status":"processing"}'
```

**Si vous voyez :**
```json
{"success":true,"order":{...}}
```
→ La route fonctionne ! Le problème vient d'ailleurs.

**Si vous voyez une erreur 404 :**
→ La route n'est pas accessible. Continuez à l'étape 4.

### Étape 4 : Vérifier vercel.json

Ouvrez le fichier `vercel.json` et vérifiez qu'il contient :

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

Si ce n'est pas le cas, corrigez et redéployez.

### Étape 5 : Vérifier les Logs Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `projet-tati`
3. Cliquez sur **Functions**
4. Cherchez `/api/orders/:id/status`

**Si la fonction n'apparaît pas :**
→ Le backend n'est pas déployé correctement.

**Si la fonction apparaît :**
→ Cliquez dessus et regardez les logs pour voir l'erreur exacte.

## 🎯 Solution Définitive

### Si le Backend n'est pas Déployé

Le problème est que `server.js` n'est pas déployé sur Vercel. Voici comment le corriger :

#### 1. Vérifier package.json

Assurez-vous que `package.json` contient :

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

#### 2. Vérifier vercel.json

Assurez-vous que `vercel.json` contient :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

#### 3. Redéployer

```bash
# Option 1 : Via Git
git add .
git commit -m "Fix: Deploy backend"
git push

# Option 2 : Via Vercel CLI
vercel --prod

# Option 3 : Via l'interface Vercel
# Deployments > ... > Redeploy
```

### Si le Backend est Déployé mais la Route ne Fonctionne pas

Le problème peut venir de :

1. **MongoDB non connecté** → Vérifiez `MONGODB_URI` dans les variables d'environnement Vercel
2. **Variables d'environnement manquantes** → Vérifiez que toutes les variables sont définies
3. **Erreur dans le code** → Vérifiez les logs Vercel

## 🧪 Test Final

Une fois que vous avez appliqué la solution :

1. **Tester le backend**
   ```
   https://projet-tati.vercel.app/api/health
   ```
   → Devrait retourner `{"status":"ok"}`

2. **Tester la route orders**
   ```
   https://projet-tati.vercel.app/api/orders
   ```
   → Devrait retourner `[]` ou une liste de commandes

3. **Tester dans l'interface**
   - Allez sur https://backzo.eu
   - Connectez-vous à l'admin
   - Changez le statut d'une commande
   - Vérifiez qu'il n'y a plus d'erreur 404

## ✅ Résultat Attendu

Après avoir appliqué la solution :

- ✅ Pas d'erreur 404 dans la console
- ✅ Les statuts se mettent à jour correctement
- ✅ Les emails sont envoyés automatiquement
- ✅ Les commandes se chargent correctement

## 📞 Besoin d'Aide ?

Si le problème persiste :

1. **Consultez** `DEBUG_STATUT_COMMANDES.md` pour un diagnostic complet
2. **Vérifiez** les logs Vercel pour voir l'erreur exacte
3. **Testez** les routes avec curl ou Postman
4. **Redéployez** le projet sur Vercel

## 🎉 C'est Résolu !

Une fois que tout fonctionne, vous pourrez :

- Gérer les commandes depuis l'interface admin
- Changer les statuts sans erreur
- Les clients recevront automatiquement des emails de mise à jour
- Tout fonctionne automatiquement !
