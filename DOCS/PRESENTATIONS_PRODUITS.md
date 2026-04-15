# Présentations Produits - Guide d'utilisation

## 📋 Vue d'ensemble

Une nouvelle section "Présentation Produit" a été ajoutée aux pages **Clubs** et **Particuliers**. Cette section permet d'afficher un texte de présentation accompagné d'une image ou d'une vidéo, entièrement modifiable depuis l'interface admin.

## 🎯 Fonctionnalités

### Affichage sur les pages

- **Page Clubs** : Section affichée juste après le hero et avant "Comment ça marche"
- **Page Particuliers** : Section affichée juste après le hero et avant le configurateur

Chaque section comprend :
- Un texte de présentation (HTML supporté)
- Un média (image ou vidéo YouTube)
- Un design responsive et cohérent avec le reste du site

### Interface Admin

Un nouvel onglet **"Présentations"** a été ajouté dans l'admin avec :

#### Pour chaque page (Clubs et Particuliers) :
1. **Texte de présentation**
   - Éditeur de texte avec support HTML
   - Balises supportées : `<p>`, `<strong>`, `<em>`, `<br>`
   - Mise en forme automatique

2. **URL du média**
   - Images locales (ex: `1.jpg`, `2.jpg`)
   - URLs complètes (ex: `https://example.com/image.jpg`)
   - Vidéos YouTube (coller le lien complet)

3. **Type de média**
   - Image : affichage responsive
   - Vidéo : intégration YouTube automatique

## 🚀 Utilisation

### Accéder à l'interface

1. Connectez-vous à l'admin (identifiant: `admin`, mot de passe: `BackZo2024!`)
2. Cliquez sur l'onglet **"Présentations"**
3. Modifiez le contenu pour Clubs et/ou Particuliers
4. Cliquez sur **"Enregistrer"**

### Exemples de contenu

#### Texte simple
```html
<p>Découvrez notre technologie révolutionnaire de flocage amovible.</p>
```

#### Texte avec mise en forme
```html
<p>BackZo révolutionne le flocage sportif avec sa <strong>technologie amovible unique</strong>.</p>
<p>Parfait pour les clubs qui veulent <em>optimiser leur budget</em> tout en offrant une identification professionnelle.</p>
```

#### Images
- Image locale : `1.jpg` ou `2.jpg`
- Image externe : `https://example.com/mon-image.jpg`

#### Vidéos YouTube
- Lien complet : `https://www.youtube.com/watch?v=VIDEO_ID`
- Lien court : `https://youtu.be/VIDEO_ID`
- Lien embed : `https://www.youtube.com/embed/VIDEO_ID`

## 💾 Stockage des données

### Avec MongoDB (Production)
Les présentations sont stockées dans la collection `presentations` avec l'ID `global`.

### Sans MongoDB (Local)
Les présentations sont stockées dans `localStorage` du navigateur.

## 🔧 API

### Récupérer les présentations
```
GET /api/presentations
```

Réponse :
```json
{
  "clubs": {
    "text": "<p>Texte de présentation...</p>",
    "mediaUrl": "1.jpg",
    "mediaType": "image"
  },
  "particuliers": {
    "text": "<p>Texte de présentation...</p>",
    "mediaUrl": "2.jpg",
    "mediaType": "image"
  }
}
```

### Sauvegarder les présentations
```
POST /api/presentations
Content-Type: application/json

{
  "clubs": {
    "text": "<p>Nouveau texte...</p>",
    "mediaUrl": "nouvelle-image.jpg",
    "mediaType": "image"
  },
  "particuliers": {
    "text": "<p>Nouveau texte...</p>",
    "mediaUrl": "https://youtube.com/watch?v=...",
    "mediaType": "video"
  }
}
```

## 📱 Responsive

La section s'adapte automatiquement :
- **Desktop** : Grille 2 colonnes (texte | média)
- **Tablet** : Grille 2 colonnes réduite
- **Mobile** : Colonne unique (texte au-dessus, média en dessous)

## 🎨 Personnalisation

### Modifier le style
Le style de la section peut être personnalisé dans le fichier `public/index.html` :
- Recherchez `#presentation-clubs` et `#presentation-particuliers`
- Modifiez les styles inline ou ajoutez des classes CSS

### Modifier la position
Pour déplacer la section, recherchez dans `public/index.html` :
- `<!-- PRÉSENTATION PRODUIT CLUBS -->`
- `<!-- PRÉSENTATION PRODUIT PARTICULIERS -->`

## ✅ Conseils

1. **Images** : Utilisez des images de 800x600px minimum pour une bonne qualité
2. **Texte** : Restez concis (2-3 paragraphes maximum)
3. **Vidéos** : Privilégiez YouTube pour la compatibilité
4. **Test** : Vérifiez l'affichage sur mobile après chaque modification

## 🐛 Dépannage

### Les présentations ne s'affichent pas
- Vérifiez que le backend est démarré
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que MongoDB est connecté (si utilisé)

### L'image ne s'affiche pas
- Vérifiez que le fichier existe dans le dossier `public/`
- Vérifiez l'URL si c'est une image externe
- Vérifiez les permissions du fichier

### La vidéo YouTube ne fonctionne pas
- Vérifiez que le lien est correct
- Assurez-vous que la vidéo n'est pas privée
- Testez le lien dans un navigateur

## 📞 Support

Pour toute question ou problème, consultez les autres fichiers de documentation dans le dossier `DOCS/`.
