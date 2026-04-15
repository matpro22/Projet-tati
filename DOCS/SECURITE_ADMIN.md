# Système d'Authentification Admin Sécurisé

## Vue d'ensemble

Le système d'authentification admin a été complètement revu pour éliminer les mots de passe en clair dans le code et implémenter une authentification sécurisée basée sur JWT (JSON Web Tokens).

## Changements principaux

### 1. Suppression des credentials en clair
- ❌ **Avant** : Le mot de passe était visible dans le code JavaScript (`ADMIN_CREDS = {user:'admin', pass:'BackZo2024!'}`)
- ✅ **Maintenant** : Les credentials sont stockés dans les variables d'environnement et le mot de passe est hashé avec bcrypt

### 2. Authentification JWT
- Utilisation de tokens JWT pour sécuriser les sessions
- Tokens valides pendant 24 heures
- Stockage sécurisé dans localStorage
- Vérification automatique de l'expiration

### 3. Protection des routes API
Toutes les routes admin sont maintenant protégées par le middleware `authenticateToken` :
- `POST /api/products` - Ajouter un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit
- `GET /api/orders` - Récupérer les commandes
- `PUT /api/orders/:id/status` - Mettre à jour le statut
- `DELETE /api/orders/:id` - Supprimer une commande
- `POST /api/settings` - Sauvegarder les paramètres
- `PUT /api/presentations/:type` - Mettre à jour les présentations

## Configuration

### Variables d'environnement (.env)

Ajoutez ces variables dans votre fichier `.env` :

```env
# Authentification Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=VotreMotDePasseSecurise2024!
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire_ici
```

**Important** :
- `ADMIN_PASSWORD` : Choisissez un mot de passe fort (min. 8 caractères)
- `JWT_SECRET` : Générez une chaîne aléatoire longue (32+ caractères recommandés)

### Génération d'un JWT_SECRET sécurisé

Vous pouvez générer un secret aléatoire avec Node.js :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Installation des dépendances

Les nouvelles dépendances ont été ajoutées au `package.json` :

```bash
npm install
```

Dépendances ajoutées :
- `bcryptjs` : Pour hasher les mots de passe
- `jsonwebtoken` : Pour générer et vérifier les tokens JWT

## Utilisation

### Connexion admin

1. Accédez à la page admin (cliquez sur le point dans le footer)
2. Entrez vos identifiants :
   - Identifiant : celui défini dans `ADMIN_USERNAME`
   - Mot de passe : celui défini dans `ADMIN_PASSWORD`
3. Le système génère un token JWT valide 24h
4. Le token est stocké dans localStorage

### Déconnexion

- Cliquez sur le bouton "Déconnexion" dans le panel admin
- Le token est supprimé du localStorage
- Vous êtes redirigé vers la page d'accueil

### Session expirée

Si votre token expire (après 24h) ou devient invalide :
- Vous serez automatiquement déconnecté
- Un message vous invitera à vous reconnecter
- Vous serez redirigé vers la page de login

## API d'authentification

### POST /api/admin/login

Connexion admin et génération du token.

**Request:**
```json
{
  "username": "admin",
  "password": "VotreMotDePasse"
}
```

**Response (succès):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

**Response (erreur):**
```json
{
  "error": "Identifiant ou mot de passe incorrect"
}
```

### GET /api/admin/verify

Vérifier si un token est valide.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (succès):**
```json
{
  "valid": true,
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

### POST /api/admin/change-password

Changer le mot de passe admin (nécessite une mise à jour du .env).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "currentPassword": "AncienMotDePasse",
  "newPassword": "NouveauMotDePasse"
}
```

## Sécurité

### Bonnes pratiques

1. **Mot de passe fort** : Utilisez un mot de passe complexe avec :
   - Au moins 12 caractères
   - Majuscules et minuscules
   - Chiffres et caractères spéciaux

2. **JWT Secret** : 
   - Générez un secret aléatoire unique
   - Ne le partagez jamais
   - Changez-le régulièrement

3. **HTTPS** : 
   - Utilisez toujours HTTPS en production
   - Les tokens sont sensibles et ne doivent pas transiter en clair

4. **Variables d'environnement** :
   - Ne commitez JAMAIS le fichier `.env`
   - Utilisez `.env.example` comme template
   - Sur Vercel, configurez les variables dans le dashboard

### Protection contre les attaques

- **Brute force** : Le système vérifie les credentials côté serveur
- **Token hijacking** : Les tokens expirent après 24h
- **XSS** : Les tokens sont stockés dans localStorage (considérez httpOnly cookies pour plus de sécurité)
- **CSRF** : Les requêtes utilisent des tokens Bearer dans les headers

## Déploiement

### Vercel

1. Configurez les variables d'environnement dans le dashboard Vercel :
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`

2. Redéployez l'application

3. Les variables seront automatiquement utilisées

### Autres plateformes

Assurez-vous que les variables d'environnement sont configurées avant de démarrer le serveur.

## Dépannage

### "Token invalide ou expiré"

- Votre session a expiré, reconnectez-vous
- Le JWT_SECRET a peut-être changé

### "Identifiant ou mot de passe incorrect"

- Vérifiez les variables `ADMIN_USERNAME` et `ADMIN_PASSWORD` dans `.env`
- Redémarrez le serveur après modification du `.env`

### "Session expirée, veuillez vous reconnecter"

- Votre token a expiré (24h)
- Reconnectez-vous pour obtenir un nouveau token

## Migration depuis l'ancien système

Si vous utilisez l'ancien système avec mot de passe en clair :

1. Installez les nouvelles dépendances : `npm install`
2. Ajoutez les variables d'environnement dans `.env`
3. Redémarrez le serveur
4. Le nouveau système sera automatiquement actif
5. Utilisez les mêmes identifiants configurés dans `.env`

## Support

Pour toute question ou problème de sécurité, contactez l'équipe de développement.
