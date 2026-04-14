# 📦 Gestion des produits dans l'admin

## ✅ Fonctionnalités implémentées

La partie administration des produits est maintenant complètement fonctionnelle avec :

### 1. Affichage des produits
- Liste de tous les produits dans un tableau
- Affichage du nom, catégorie, prix, stock et statut (actif/inactif)
- Utilise les produits depuis MongoDB si disponible, sinon les produits locaux

### 2. Édition de produits
- Bouton "✏️ Éditer" sur chaque produit
- Modal d'édition avec tous les champs :
  - Nom du produit
  - Prix (€)
  - Stock
  - Catégorie (Particuliers / Clubs)
  - Description
  - Statut actif/inactif (toggle)
- Sauvegarde dans MongoDB (ou fichiers JSON en local)
- Mise à jour automatique de l'affichage

### 3. Suppression de produits
- Bouton "🗑️" sur chaque produit
- Confirmation avant suppression
- Suppression dans MongoDB (ou fichiers JSON en local)
- Mise à jour automatique de l'affichage

### 4. Ajout de produits
- Bouton "Ajouter un produit" (déjà existant)
- Modal d'ajout avec tous les champs
- Sauvegarde dans MongoDB

## 🎯 Comment utiliser

### Éditer un produit

1. Allez dans l'admin du site (bouton "Admin" en bas de page)
2. Connectez-vous avec le mot de passe admin
3. Onglet "Produits"
4. Cliquez sur "✏️ Éditer" à côté du produit à modifier
5. Modifiez les champs souhaités :
   - **Nom** : Nom affiché sur le site
   - **Prix** : Prix en euros (ex: 13.00)
   - **Stock** : Quantité disponible
   - **Catégorie** : Particuliers ou Clubs
   - **Description** : Description affichée sur la fiche produit
   - **Actif** : Si désactivé, le produit n'apparaît plus sur le site
6. Cliquez sur "Enregistrer les modifications →"

### Supprimer un produit

1. Dans l'onglet "Produits" de l'admin
2. Cliquez sur "🗑️" à côté du produit à supprimer
3. Confirmez la suppression
4. Le produit est supprimé de MongoDB et n'apparaît plus sur le site

### Ajouter un produit

1. Dans l'onglet "Produits" de l'admin
2. Cliquez sur "Ajouter un produit"
3. Remplissez tous les champs obligatoires (*)
4. Cliquez sur "Ajouter le produit →"

## 🔧 Fonctionnement technique

### Côté frontend (`public/index.html`)

**Fonctions ajoutées** :
- `showEditProductModal(productId)` - Affiche le modal d'édition
- `submitEditProduct(productId)` - Envoie les modifications au serveur
- `deleteProduct(productId)` - Supprime un produit
- `renderProductsTable()` - Mise à jour pour afficher les boutons d'action

### Côté backend (`server.js`)

**Routes améliorées** :
- `PUT /api/products/:id` - Mise à jour directe dans MongoDB
- `DELETE /api/products/:id` - Suppression directe dans MongoDB

**Fonctionnement** :
1. Connexion automatique à MongoDB si nécessaire
2. Mise à jour/suppression dans MongoDB
3. Fallback vers fichiers JSON en mode local
4. Logs détaillés pour le débogage

## 📊 Structure d'un produit

```javascript
{
  id: "patch-s",                    // ID unique
  name: "Flocage Amovible — Taille S", // Nom affiché
  price: 13,                        // Prix en euros
  category: "particuliers",         // particuliers ou clubs
  desc: "Patch 25×6 cm...",        // Description
  stock: 100,                       // Quantité disponible
  active: true,                     // Actif ou non
  createdAt: "2024-04-14T...",     // Date de création
  updatedAt: "2024-04-14T..."      // Dernière modification
}
```

## 🧪 Tester les fonctionnalités

### Test 1 : Éditer un produit

1. Allez dans Admin > Produits
2. Cliquez sur "✏️ Éditer" sur le produit "Flocage Amovible — Taille S"
3. Changez le prix de 13€ à 15€
4. Cliquez sur "Enregistrer"
5. Vérifiez que le prix est mis à jour dans le tableau
6. Allez sur la page Boutique
7. Vérifiez que le nouveau prix s'affiche

### Test 2 : Désactiver un produit

1. Éditez un produit
2. Décochez "Produit actif"
3. Enregistrez
4. Allez sur la page Boutique
5. Le produit ne devrait plus apparaître

### Test 3 : Supprimer un produit

1. Cliquez sur "🗑️" à côté d'un produit
2. Confirmez la suppression
3. Le produit disparaît du tableau
4. Allez sur la page Boutique
5. Le produit n'apparaît plus

## 🔍 Logs de débogage

### Logs serveur (Vercel)

**Édition** :
```
📝 Mise à jour produit: patch-s
✓ Produit mis à jour dans MongoDB
```

**Suppression** :
```
🗑️  Suppression produit: patch-s
✓ Produit supprimé de MongoDB
```

### Logs frontend (Console F12)

**Édition réussie** :
```
✓ Produit modifié avec succès !
```

**Suppression réussie** :
```
✓ Produit supprimé avec succès !
```

## ❌ Erreurs courantes

### Erreur : "MongoDB non disponible"

**Cause** : MongoDB n'est pas connecté sur Vercel

**Solution** :
1. Vérifiez que `MONGODB_URI` est configurée sur Vercel
2. Vérifiez les logs Vercel pour voir l'erreur de connexion
3. Suivez le guide `FIX_MONGODB_SSL_ERROR.md`

### Erreur : "Produit non trouvé"

**Cause** : Le produit n'existe pas dans MongoDB

**Solution** :
1. Rechargez la page admin
2. Vérifiez que le produit existe dans MongoDB Atlas
3. Si nécessaire, ajoutez-le à nouveau

### Erreur : "Mode local - Connectez le backend"

**Cause** : `USE_BACKEND` est à `false` ou le backend n'est pas accessible

**Solution** :
1. Vérifiez que `USE_BACKEND = true` dans `index.html`
2. Vérifiez que `API_URL` pointe vers le bon serveur
3. Vérifiez que le backend est démarré (local) ou déployé (Vercel)

## 📋 Checklist de vérification

- [ ] Les produits s'affichent dans l'admin
- [ ] Le bouton "✏️ Éditer" ouvre le modal d'édition
- [ ] Les champs sont pré-remplis avec les valeurs actuelles
- [ ] La modification est sauvegardée dans MongoDB
- [ ] Le tableau se met à jour après modification
- [ ] Le bouton "🗑️" supprime le produit après confirmation
- [ ] Les modifications sont visibles sur la page Boutique
- [ ] Les produits désactivés n'apparaissent plus sur le site

## 🎉 Résultat

Vous pouvez maintenant gérer complètement vos produits depuis l'interface admin :
- ✅ Modifier les prix
- ✅ Modifier les descriptions
- ✅ Gérer le stock
- ✅ Activer/désactiver des produits
- ✅ Supprimer des produits
- ✅ Ajouter de nouveaux produits

Toutes les modifications sont sauvegardées dans MongoDB et visibles immédiatement sur le site.

---

**Dernière mise à jour** : Implémentation complète de la gestion des produits
