# 📧 Système de Désinscription Newsletter - BackZo

## Vue d'ensemble

Le système de désinscription permet aux utilisateurs de se désinscrire facilement de la newsletter BackZo via un lien dans les emails.

## Architecture

- **Frontend** : Hébergé sur `backzo.eu` (fichier `public/unsubscribe.html`)
- **Backend** : Hébergé sur Vercel (`https://projet-tati.vercel.app`)
- **Communication** : La page frontend appelle l'API backend via AJAX

## Fonctionnement

### 1. Lien dans les emails

Tous les emails de newsletter contiennent un lien de désinscription en bas de page :

```html
<a href="https://backzo.eu/unsubscribe?email={{EMAIL}}">Se désinscrire</a>
```

Le `{{EMAIL}}` est automatiquement remplacé par l'email du destinataire.

### 2. Page de désinscription (Frontend)

La page `public/unsubscribe.html` hébergée sur `backzo.eu` :

- Détecte automatiquement l'URL du backend :
  - En local : `http://localhost:3000`
  - En production : `https://projet-tati.vercel.app`
- Affiche clairement l'email concerné
- Demande confirmation avant la désinscription
- Appelle l'API backend pour effectuer la désinscription
- Affiche un message de succès après désinscription
- Permet d'annuler et retourner au site

### 3. API de désinscription (Backend)

L'API `POST /api/newsletter/unsubscribe` sur Vercel gère la désinscription :

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

## Configuration

### Frontend (backzo.eu)

Le fichier `public/unsubscribe.html` contient la logique de détection automatique du backend :

```javascript
const UNSUBSCRIBE_API_URL = typeof API_URL !== 'undefined' 
    ? API_URL.replace('/api', '')
    : (window.location.hostname === 'localhost' 
        ? 'http://localhost:3000'
        : 'https://projet-tati.vercel.app');
```

Cette configuration est identique à celle utilisée dans `review.html`.

### Backend (Vercel)

Le fichier `vercel.json` contient une route spécifique pour servir la page statique :

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
# 1. Démarrer le serveur backend
npm start

# 2. Exécuter les tests automatiques
node test-unsubscribe.js

# 3. Tester manuellement dans le navigateur
# Ouvrir: http://localhost:3000/unsubscribe?email=test@example.com
```

## Test en production

Pour tester en production :

1. Ouvrir : `https://backzo.eu/unsubscribe?email=test@example.com`
2. Vérifier que la page se charge correctement
3. Cliquer sur "Confirmer la désinscription"
4. Vérifier que le message de succès s'affiche

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
- ✅ Communication automatique avec le backend Vercel

## Sécurité

- L'email est passé en paramètre GET (visible dans l'URL)
- Pas d'authentification requise (lien direct depuis l'email)
- Validation de l'email côté serveur
- Protection contre les requêtes malformées
- CORS configuré pour autoriser les requêtes depuis backzo.eu

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

### La page ne s'affiche pas sur backzo.eu

1. Vérifier que `public/unsubscribe.html` est bien déployé sur le serveur frontend
2. Vérifier la configuration du serveur web (Apache/Nginx)
3. Vérifier que la route `/unsubscribe` est accessible

### L'API ne répond pas

1. Vérifier que le backend Vercel est en ligne : `https://projet-tati.vercel.app/api/health`
2. Vérifier les logs Vercel pour les erreurs
3. Vérifier que MongoDB est connecté (si utilisé)
4. Vérifier la configuration CORS dans `server.js`

### Erreur CORS

Si vous voyez une erreur CORS dans la console :

1. Vérifier que `backzo.eu` est dans la liste `allowedOrigins` dans `server.js`
2. Vérifier que le backend accepte les requêtes depuis le frontend
3. Vérifier les headers de la requête

### L'email n'est pas désinscrit

1. Vérifier que l'email existe dans la base MongoDB
2. Vérifier les logs de l'API backend
3. Tester directement l'API avec curl ou Postman

## Fichiers concernés

### Frontend (backzo.eu)
- `/public/unsubscribe.html` - Page de désinscription

### Backend (Vercel)
- `/server.js` - API de désinscription (ligne ~2232)
- `/vercel.json` - Configuration des routes

### Tests et documentation
- `/test-unsubscribe.js` - Tests automatiques
- `/NEWSLETTER_UNSUBSCRIBE.md` - Cette documentation

## Flux de données

```
Email Newsletter
    ↓
Lien: https://backzo.eu/unsubscribe?email=xxx
    ↓
Frontend (backzo.eu)
    ↓ AJAX POST
Backend API (projet-tati.vercel.app/api/newsletter/unsubscribe)
    ↓
MongoDB (mise à jour unsubscribed: true)
    ↓
Réponse JSON
    ↓
Frontend affiche le succès
```
