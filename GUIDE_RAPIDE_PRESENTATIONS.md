# 🎯 Guide Rapide - Présentations Produits

## Comment ajouter/modifier les présentations ?

### Étape 1 : Accéder à l'admin
1. Allez sur votre site
2. Cliquez sur **"Admin"** dans le menu
3. Connectez-vous :
   - Identifiant : `admin`
   - Mot de passe : `BackZo2024!`

### Étape 2 : Ouvrir l'onglet Présentations
1. Dans l'admin, cliquez sur l'onglet **"Présentations"** (icône écran)
2. Vous verrez deux sections : **Clubs** et **Particuliers**

### Étape 3 : Modifier le contenu

#### Pour la page Clubs :
1. **Texte de présentation** : Écrivez votre texte (HTML autorisé)
   ```html
   <p>Votre texte ici...</p>
   <p>Vous pouvez ajouter plusieurs paragraphes.</p>
   ```

2. **URL du média** : 
   - Image locale : `1.jpg` (fichier dans le dossier public/)
   - Image en ligne : `https://example.com/image.jpg`
   - Vidéo YouTube : `https://youtube.com/watch?v=...`

3. **Type de média** : Choisissez "Image" ou "Vidéo"

4. Cliquez sur **"💾 Enregistrer Clubs"**

#### Pour la page Particuliers :
Même processus, mais dans la section "Particuliers"

### Étape 4 : Vérifier le résultat
1. Allez sur la page **"Clubs"** ou **"Particuliers"**
2. La nouvelle section apparaît juste après le hero
3. Vérifiez que tout s'affiche correctement

## 📸 Conseils pour les médias

### Images
- **Format recommandé** : JPG ou PNG
- **Taille recommandée** : 800x600px minimum
- **Poids** : Moins de 500 Ko pour un chargement rapide

### Vidéos YouTube
1. Allez sur YouTube
2. Ouvrez votre vidéo
3. Copiez l'URL complète (ex: `https://youtube.com/watch?v=ABC123`)
4. Collez-la dans le champ "URL du média"
5. Sélectionnez "Vidéo" comme type

## ✍️ Conseils pour le texte

### Balises HTML autorisées
- `<p>` : Paragraphe
- `<strong>` : Texte en gras
- `<em>` : Texte en italique
- `<br>` : Saut de ligne

### Exemple complet
```html
<p>BackZo révolutionne le <strong>flocage sportif</strong> avec sa technologie amovible unique.</p>
<p>Parfait pour les clubs qui veulent <em>optimiser leur budget</em> tout en offrant une identification professionnelle à chaque joueur.</p>
```

## 🎨 Où apparaissent les présentations ?

### Page Clubs
```
Hero (titre + boutons)
    ↓
[PRÉSENTATION PRODUIT] ← Votre contenu ici
    ↓
Comment ça marche
    ↓
Avantages
    ↓
...
```

### Page Particuliers
```
Hero (titre + boutons)
    ↓
[PRÉSENTATION PRODUIT] ← Votre contenu ici
    ↓
Configurateur
    ↓
...
```

## 🔄 Mise à jour en temps réel

Dès que vous enregistrez :
- Les modifications sont sauvegardées dans la base de données
- Les pages sont mises à jour automatiquement
- Tous les visiteurs voient le nouveau contenu

## ❓ Questions fréquentes

### Mon image ne s'affiche pas
- Vérifiez que le fichier est bien dans le dossier `public/`
- Vérifiez l'orthographe du nom de fichier
- Si c'est une URL externe, vérifiez qu'elle est accessible

### Ma vidéo YouTube ne fonctionne pas
- Vérifiez que la vidéo n'est pas privée
- Utilisez le lien complet de la vidéo
- Testez le lien dans votre navigateur

### Je veux supprimer la présentation
- Laissez les champs vides
- Ou mettez un texte minimal comme `<p>-</p>`

### Je veux la même présentation pour Clubs et Particuliers
- Copiez le texte de l'une vers l'autre
- Utilisez la même image/vidéo
- Enregistrez les deux

## 💡 Idées de contenu

### Pour Clubs
- Avantages du système amovible
- Économies réalisées
- Processus de commande
- Témoignages de clubs

### Pour Particuliers
- Facilité de personnalisation
- Qualité du produit
- Livraison rapide
- Garantie satisfaction

## 🚀 Prêt à commencer !

1. Connectez-vous à l'admin
2. Cliquez sur "Présentations"
3. Modifiez le contenu
4. Enregistrez
5. Admirez le résultat !

---

**Besoin d'aide ?** Consultez le fichier `PRESENTATIONS_PRODUITS.md` pour plus de détails techniques.
