# ✅ CORRECTION DE LA COULEUR DU PATCH

## Problème identifié

Lorsque vous sélectionniez une couleur de patch (par exemple Jaune) dans la page Particuliers, la facture affichait toujours "BackZo Green" au lieu de la couleur réellement sélectionnée.

## Cause du problème

La fonction `selectBg()` mettait à jour uniquement le code couleur hexadécimal (`state.config.bg`) mais pas le nom de la couleur (`state.config.bgName`). 

Résultat : `state.config.bgName` restait toujours à sa valeur par défaut "BackZo Green".

## Solution appliquée

Ajout d'un mapping complet de toutes les couleurs de patch avec leurs noms dans la fonction `selectBg()` :

```javascript
function selectBg(hex, el) {
  // Mapping des couleurs de patch avec leurs noms
  const bgColorNames = {
    '#b8ff57': 'BackZo Green',
    '#ffffff': 'Blanc',
    '#0a0a0a': 'Noir',
    '#f5d000': 'Jaune',
    '#c0152a': 'Rouge',
    // ... toutes les autres couleurs
  };
  
  state.config.bg = hex;
  state.config.bgName = bgColorNames[hex] || hex;  // ← AJOUTÉ
  // ... reste du code
}
```

## Résultat

Maintenant, quand vous sélectionnez une couleur de patch :
1. Le code couleur est enregistré dans `state.config.bg`
2. Le nom de la couleur est enregistré dans `state.config.bgName`
3. Les deux informations sont ajoutées au panier
4. La facture affiche le bon nom de couleur

## Couleurs de patch disponibles

Voici toutes les couleurs de patch avec leurs noms :

### Couleurs de base
- BackZo Green (par défaut)
- Blanc
- Noir
- Argent
- Gris clair
- Gris foncé
- Noir foncé

### Rouges et roses
- Rouge foncé
- Bordeaux
- Rouge
- Rouge vif
- Rouge carmin
- Rouge bordeaux
- Rouge sombre
- Rose

### Oranges et jaunes
- Orange vif
- Orange
- Orange terre
- Or foncé
- Or
- Or clair
- Jaune
- Jaune citron
- Jaune vif

### Verts
- Vert foncé
- Vert forêt
- Vert émeraude
- Vert teal
- Vert olive
- Vert olive clair
- Vert sombre
- Kaki
- Gris vert

### Bleus
- Bleu ciel
- Bleu clair
- Bleu
- Bleu pastel
- Bleu roi
- Bleu azur
- Bleu lavande
- Bleu marine
- Bleu nuit
- Turquoise

### Autres
- Beige
- Marron clair
- Violet sombre

## Test

Pour vérifier que la correction fonctionne :

1. Allez sur la page "Particuliers"
2. Sélectionnez une couleur de patch (par exemple : Jaune)
3. Configurez le reste (taille, couleur de flocage, noms)
4. Ajoutez au panier
5. Passez la commande
6. Dans l'admin, cliquez sur "👁️ Détails"
7. Vérifiez que "Couleur du patch: Jaune" est affiché
8. Imprimez la facture
9. Vérifiez que "Couleur du patch: Jaune" apparaît dans la facture

## Fichier modifié

- **public/index.html** (ligne ~2364)
  - Fonction `selectBg()` mise à jour avec le mapping complet des couleurs

## Notes

- Si une couleur n'est pas dans le mapping, le code hexadécimal sera affiché (ex: #f5d000)
- Toutes les 47 couleurs de patch disponibles sont maintenant mappées
- La correction s'applique immédiatement aux nouvelles commandes
- Les anciennes commandes dans le panier peuvent encore avoir l'ancienne valeur (videz le panier si nécessaire)
