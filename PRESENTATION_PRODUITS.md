# Présentation des Produits - BackZo

## ✅ Fonctionnalité Implémentée

J'ai ajouté une section de présentation de produit sur les pages **Clubs** et **Particuliers** avec gestion complète depuis l'interface admin.

## 🎯 Ce qui a été fait

### 1. Backend (server.js)
- ✅ Nouvelle collection MongoDB `presentations` pour stocker les présentations
- ✅ Route GET `/api/presentations/:type` pour récupérer une présentation (clubs ou particuliers)
- ✅ Route PUT `/api/presentations/:type` pour mettre à jour une présentation
- ✅ Initialisation automatique avec des données par défaut au démarrage
- ✅ Support des images ET des vidéos (YouTube/Vimeo)

### 2. Frontend - Pages Clubs et Particuliers
- ✅ Nouvelle section "Présentation Produit" ajoutée après le hero
- ✅ Affichage du titre, description et média (image ou vidéo)
- ✅ Design cohérent avec le reste du site (style BackZo)
- ✅ Responsive et animations reveal

### 3. Interface Admin
- ✅ Nouvel onglet "Présentations" dans le panneau admin
- ✅ Formulaires séparés pour Clubs et Particuliers
- ✅ Champs modifiables :
  - Titre de la présentation
  - Description (textarea)
  - Type de média (Image ou Vidéo)
  - URL du média
- ✅ Basculement automatique entre champ image et vidéo
- ✅ Sauvegarde en temps réel dans MongoDB
- ✅ Mise à jour instantanée de l'affichage

## 📋 Comment utiliser

### Accéder à l'interface admin
1. Allez sur votre site : `http://localhost:3000` (ou votre URL de production)
2. Cliquez sur "Admin" dans la navigation
3. Connectez-vous avec :
   - Identifiant : `admin`
   - Mot de passe : `BackZo2024!`

### Modifier les présentations
1. Dans l'admin, cliquez sur l'onglet **"Présentations"**
2. Vous verrez deux sections :
   - **Page Clubs**
   - **Page Particuliers**

#### Pour chaque section :
1. **Titre** : Modifiez le titre de la présentation
2. **Description** : Ajoutez ou modifiez le texte descriptif
3. **Type de média** : Choisissez entre :
   - **Image** : Entrez le nom du fichier (ex: `1.jpg`) ou une URL complète
   - **Vidéo** : Entrez l'URL YouTube ou Vimeo (ex: `https://www.youtube.com/watch?v=...`)
4. Cliquez sur **"Enregistrer présentation"**

### Ajouter des images
- Placez vos images dans le dossier `/public/`
- Utilisez le nom du fichier dans le champ URL (ex: `mon-image.jpg`)
- Ou utilisez une URL complète (ex: `https://example.com/image.jpg`)

### Ajouter des vidéos
- Formats supportés : YouTube et Vimeo
- Exemples d'URLs valides :
  - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
  - `https://youtu.be/dQw4w9WgXcQ`
  - `https://vimeo.com/123456789`

## 🗄️ Structure MongoDB

Les présentations sont stockées dans la collection `presentations` avec la structure suivante :

```javascript
{
  _id: 'clubs', // ou 'particuliers'
  title: 'Flocage Amovible pour Clubs',
  description: 'Découvrez notre solution...',
  mediaType: 'image', // ou 'video'
  mediaUrl: '1.jpg', // ou URL YouTube/Vimeo
  updatedAt: ISODate("2026-04-14T...")
}
```

## 🎨 Personnalisation du style

Les sections de présentation utilisent les styles existants du site. Si vous souhaitez personnaliser davantage :

1. Les sections ont l'ID :
   - `#presentation-clubs`
   - `#presentation-particuliers`

2. Les éléments modifiables :
   - `#clubs-pres-title` / `#particuliers-pres-title` : Titre
   - `#clubs-pres-desc` / `#particuliers-pres-desc` : Description
   - `#clubs-pres-media` / `#particuliers-pres-media` : Conteneur média

## 🔧 Configuration MongoDB

Assurez-vous que MongoDB est bien configuré dans votre fichier `.env` :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/backzo?retryWrites=true&w=majority
```

## 📱 Responsive

Les sections de présentation sont entièrement responsive :
- Desktop : Grille 2 colonnes (texte | média)
- Mobile : Empilage vertical automatique

## ✨ Fonctionnalités avancées

### Vidéos YouTube/Vimeo
- Détection automatique du type de vidéo
- Extraction de l'ID de la vidéo
- Intégration iframe responsive
- Support des formats :
  - `youtube.com/watch?v=...`
  - `youtu.be/...`
  - `youtube.com/embed/...`
  - `vimeo.com/...`

### Chargement automatique
- Les présentations se chargent automatiquement au démarrage du site
- Mise à jour en temps réel après modification dans l'admin
- Fallback vers valeurs par défaut si MongoDB n'est pas disponible

## 🚀 Déploiement

Lors du déploiement sur Vercel :
1. Assurez-vous que `MONGODB_URI` est configuré dans les variables d'environnement Vercel
2. Les présentations seront automatiquement initialisées au premier démarrage
3. Les modifications se font uniquement via l'interface admin

## 📝 Notes importantes

- Les images doivent être placées dans `/public/` pour être accessibles
- Les vidéos doivent être hébergées sur YouTube ou Vimeo
- Les modifications sont sauvegardées en temps réel dans MongoDB
- Le style est cohérent avec le reste du site BackZo

## 🎯 Résultat

Vous avez maintenant :
- ✅ Une section de présentation sur la page Clubs
- ✅ Une section de présentation sur la page Particuliers
- ✅ Une interface admin complète pour gérer ces présentations
- ✅ Support des images et vidéos
- ✅ Stockage dans MongoDB
- ✅ Style cohérent avec le site

Tout est prêt à être utilisé ! 🎉
