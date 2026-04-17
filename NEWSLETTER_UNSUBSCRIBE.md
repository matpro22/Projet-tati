# 📧 Système de Désinscription Newsletter - BackZo

## Vue d'ensemble

Le système de désinscription permet aux utilisateurs de se désinscrire facilement de la newsletter BackZo via un lien dans les emails.

## Fonctionnement

### 1. Lien dans les emails

Tous les emails de newsletter contiennent un lien de désinscription en bas de page :

```html
<a href="https://backzo.eu/unsubscribe?email={{EMAIL}}">Se désinscrire</a>
```

Le `{{EMAIL}}` est automatiquement remplacé par l'email du destinataire.

### 2. Page de désinscription

Quand l'utilisateur clique sur le lien, il est redirigé vers `/unsubscribe.html` qui :

- Affiche clairement l'email concerné
- Demande confirmation avant la désinscription
- Affiche un message de succès après désinscription
- Permet d'annuler et retourner au site

### 3. API de désinscription

L'API `POST /api/newsletter/unsubscribe` gère la désinscription :

```javascript
// Requête
{
  "email": "utilisateur@example.com"
}

// Réponse succès
{
  "success": true,
  "message": "Vous avez été désinscrit de notre newsletter."
}

// Réponse erreur
{
  "error": "Email non trouvé"
}
```

## Configuration Vercel

Le fichier `vercel.json` contient une route spécifique pour la page de désinscription :

```json
{
  "src": "/unsubscribe",
  "dest": "/public/unsubscribe.html"
}
```

Cette route doit être placée AVANT la route catch-all `/(.*)`

## Test local

Pour tester le système en local :

```bash
# 1. Démarrer le serveur
npm start

# 2. Exécuter les tests automatiques
node test-unsubscribe.js

# 3. Tester manuellement dans le navigateur
# Ouvrir: http://localhost:3000/unsubscribe?email=test@example.com
```

## Stockage des désinscriptions

### Avec MongoDB

Les désinscriptions sont enregistrées dans la collection `newsletter` :

```javascript
{
  email: "utilisateur@example.com",
  unsubscribed: true,
  unsubscribedAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

### Sans MongoDB (fallback)

Les désinscriptions sont simplement confirmées mais non persistées (mode développement).

## Interface utilisateur

La page de désinscription (`/public/unsubscribe.html`) offre :

- ✅ Design cohérent avec la charte BackZo
- ✅ Message clair de confirmation
- ✅ Affichage de l'email concerné
- ✅ Bouton de confirmation
- ✅ Option d'annulation
- ✅ Message de succès après désinscription
- ✅ Gestion des erreurs (email manquant, erreur serveur)
- ✅ Responsive design

## Sécurité

- L'email est passé en paramètre GET (visible dans l'URL)
- Pas d'authentification requise (lien direct depuis l'email)
- Validation de l'email côté serveur
- Protection contre les requêtes malformées

## Maintenance

### Vérifier les désinscriptions

Les administrateurs peuvent voir les abonnés via l'API :

```bash
GET /api/newsletter/subscribers
Authorization: Bearer <token>
```

### Réinscrire un utilisateur

Pour réinscrire un utilisateur, il faut modifier directement la base de données MongoDB :

```javascript
db.newsletter.updateOne(
  { email: "utilisateur@example.com" },
  { 
    $set: { 
      unsubscribed: false,
      updatedAt: new Date()
    },
    $unset: { unsubscribedAt: "" }
  }
)
```

## Conformité RGPD

Le système respecte les exigences RGPD :

- ✅ Lien de désinscription visible dans tous les emails
- ✅ Désinscription en un clic (après confirmation)
- ✅ Message de confirmation clair
- ✅ Pas de réinscription automatique

## Dépannage

### La page ne s'affiche pas

1. Vérifier que `public/unsubscribe.html` existe
2. Vérifier la configuration dans `vercel.json`
3. Vérifier que la route `/unsubscribe` est avant la route catch-all

### L'API ne fonctionne pas

1. Vérifier que MongoDB est connecté (si utilisé)
2. Vérifier les logs serveur pour les erreurs
3. Tester avec `node test-unsubscribe.js`

### L'email n'est pas désinscrit

1. Vérifier que l'email existe dans la base
2. Vérifier les logs de l'API
3. Vérifier la connexion MongoDB

## Fichiers concernés

- `/public/unsubscribe.html` - Page de désinscription
- `/server.js` - API de désinscription (ligne ~2232)
- `/vercel.json` - Configuration des routes
- `/test-unsubscribe.js` - Tests automatiques
- `/NEWSLETTER_UNSUBSCRIBE.md` - Cette documentation
