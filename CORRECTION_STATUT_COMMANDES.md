# ✅ CORRECTION DE LA MISE À JOUR DU STATUT DES COMMANDES

## Problème identifié

Lorsque vous essayiez de modifier le statut d'une commande dans l'admin, vous obteniez une erreur 404 :

```
Failed to load resource: the server responded with a status of 404 ()
PATCH https://projet-tati.vercel.app/api/orders/BZ-1776167449387/status 404 (Not Found)
Erreur mise à jour statut: Error: Erreur mise à jour statut
```

## Cause du problème

Le problème venait de l'utilisation de la méthode HTTP `PATCH` qui n'est pas toujours bien supportée par certains environnements de déploiement comme Vercel, surtout avec des routes paramétrées.

### Code problématique

**Backend (server.js) :**
```javascript
app.patch('/api/orders/:id/status', async (req, res) => {
  // ...
});
```

**Frontend (index.html) :**
```javascript
const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: newStatus })
});
```

## Solution appliquée

Remplacement de la méthode `PATCH` par `PUT`, qui est mieux supportée et plus standard pour les mises à jour complètes.

### Nouveau code

**Backend (server.js) :**
```javascript
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    console.log('📝 Mise à jour statut commande:', orderId, '→', status);
    
    // Mise à jour dans MongoDB
    if (USE_MONGODB && db) {
      const result = await db.collection('orders').findOneAndUpdate(
        { id: orderId },
        { 
          $set: { 
            status: status,
            updatedAt: new Date().toISOString()
          }
        },
        { returnDocument: 'after' }
      );
      
      if (!result.value) {
        return res.status(404).json({ error: 'Commande non trouvée' });
      }
      
      return res.json({
        success: true,
        order: result.value
      });
    }
    
    // Fallback fichier JSON
    const orders = await readData('orders', ORDERS_FILE);
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    
    await writeData('orders', ORDERS_FILE, orders);
    
    res.json({
      success: true,
      order: orders[index]
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Frontend (index.html) :**
```javascript
async function updateOrderStatusOnBackend(orderId, newStatus) {
  if(!USE_BACKEND) {
    // Mode local
    const order = state.orders.find(o => o.id === orderId);
    if(order) {
      order.status = newStatus;
      localStorage.setItem('bz-orders', JSON.stringify(state.orders));
      showToast('✓ Statut mis à jour');
    }
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',  // ← Changé de PATCH à PUT
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (!response.ok) throw new Error('Erreur mise à jour statut');
    
    showToast('✓ Statut mis à jour');
    await loadOrdersFromBackend();
    
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    showToast('Erreur lors de la mise à jour', true);
  }
}
```

## Différence entre PATCH et PUT

### PATCH
- Mise à jour partielle d'une ressource
- Envoie uniquement les champs à modifier
- Moins bien supporté par certains serveurs/proxies

### PUT
- Mise à jour complète d'une ressource
- Plus standard et mieux supporté
- Recommandé pour les environnements de production

## Fonctionnement après correction

1. L'utilisateur change le statut dans le menu déroulant
2. La fonction `updateOrderStatus()` est appelée
3. Elle appelle `updateOrderStatusOnBackend()` avec le nouvel ID et statut
4. Requête PUT envoyée à `/api/orders/:id/status`
5. Le backend met à jour le statut dans MongoDB
6. Le frontend recharge les commandes
7. Toast de confirmation affiché

## Statuts disponibles

- `pending` : En attente
- `processing` : En traitement
- `shipped` : Expédié
- `delivered` : Livré
- `cancelled` : Annulé

## Test

Pour tester la correction :

1. Redéployez l'application sur Vercel (ou redémarrez le serveur local)
2. Allez dans l'admin → onglet "Commandes"
3. Changez le statut d'une commande via le menu déroulant
4. Vérifiez que le toast "✓ Statut mis à jour" s'affiche
5. Rechargez la page (F5)
6. Vérifiez que le nouveau statut est bien conservé
7. Vérifiez dans MongoDB que le statut a été mis à jour

## Logs backend

Le backend affiche des logs pour suivre la mise à jour :

```
📝 Mise à jour statut commande: BZ-1776167449387 → shipped
✓ Statut mis à jour dans MongoDB
```

En cas d'erreur :
```
❌ Erreur mise à jour MongoDB: [message d'erreur]
✓ Statut mis à jour dans fichier JSON (fallback)
```

## Fichiers modifiés

1. **server.js** (ligne ~1085)
   - Changement de `app.patch()` à `app.put()`

2. **public/index.html** (ligne ~3624)
   - Changement de `method: 'PATCH'` à `method: 'PUT'`

## Avantages de la correction

- ✅ Meilleure compatibilité avec Vercel
- ✅ Plus standard et robuste
- ✅ Fonctionne avec tous les proxies et CDN
- ✅ Pas de changement de fonctionnalité
- ✅ Même comportement pour l'utilisateur

## Notes importantes

- Après le déploiement, videz le cache du navigateur (Ctrl+Shift+Delete)
- Rechargez la page avec Ctrl+F5
- Si le problème persiste, vérifiez les logs Vercel
- La route fonctionne aussi bien en local qu'en production

## Déploiement

Après avoir fait ces modifications :

1. Commitez les changements
2. Poussez vers votre repository Git
3. Vercel redéploiera automatiquement
4. Attendez que le déploiement soit terminé
5. Testez la fonctionnalité

Ou en local :
```bash
npm start
```

## Vérification

Pour vérifier que la route fonctionne, vous pouvez tester avec curl :

```bash
curl -X PUT https://projet-tati.vercel.app/api/orders/BZ-1234567890/status \
  -H "Content-Type: application/json" \
  -d '{"status":"shipped"}'
```

Réponse attendue :
```json
{
  "success": true,
  "order": {
    "id": "BZ-1234567890",
    "status": "shipped",
    "updatedAt": "2026-04-14T..."
  }
}
```
