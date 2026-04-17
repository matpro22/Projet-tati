# Système d'Avis Clients - BackZo

## 📋 Vue d'ensemble

Un système complet d'avis clients a été ajouté à BackZo, permettant aux clients de laisser leur retour d'expérience après réception de leur commande.

## ✨ Fonctionnalités

### 1. Email de notification avec lien d'avis
- Lorsqu'une commande passe au statut "Livrée", un email est automatiquement envoyé au client
- L'email contient un bouton "⭐ Donner mon avis" avec un lien personnalisé
- Le lien inclut l'ID de commande et l'email du client pour vérification

### 2. Page de soumission d'avis (`/review.html`)
- Interface élégante avec système d'étoiles interactif (1-5 étoiles)
- Champ optionnel pour le nom du client
- Zone de commentaire (500 caractères max)
- Validation de la commande avant soumission
- Design responsive et accessible

### 3. Affichage sur la page d'accueil
- Section "ILS NOUS FONT CONFIANCE" automatiquement ajoutée avant le footer
- Affichage des avis approuvés uniquement
- Limite de 6 avis maximum
- Design avec cartes animées
- Badge "Achat vérifié" sur chaque avis

### 4. Panel d'administration complet

#### Onglet "Avis clients"
- **Statistiques en temps réel** :
  - Total des avis
  - Avis en attente de modération
  - Avis approuvés
  - Note moyenne

- **Paramètres configurables** :
  - Approbation automatique (oui/non)
  - Affichage sur la page d'accueil (oui/non)
  - Vérification de commande requise (oui/non)
  - Note minimale affichée (1-5 étoiles)
  - Nombre maximum d'avis affichés

- **Gestion des avis** :
  - Liste complète avec filtres
  - Approuver/Rejeter les avis
  - Supprimer les avis
  - Voir les détails (client, note, commentaire, commande, date)

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers
1. `public/review.html` - Page de soumission d'avis
2. `public/reviews-display.js` - Affichage des avis sur la homepage
3. `public/admin-reviews.js` - Gestion admin des avis
4. `data/reviews.json` - Stockage des avis (mode fichier)

### Fichiers modifiés
1. `server.js` - Routes API pour les avis
2. `public/index.html` - Ajout de l'onglet admin et scripts

## 🔌 API Endpoints

### Public
- `GET /api/reviews` - Récupérer les avis approuvés
- `POST /api/reviews` - Soumettre un nouvel avis

### Admin (authentification requise)
- `GET /api/admin/reviews` - Récupérer tous les avis
- `PUT /api/admin/reviews/:id/approve` - Approuver un avis
- `DELETE /api/admin/reviews/:id` - Supprimer un avis
- `GET /api/admin/reviews/settings` - Récupérer les paramètres
- `PUT /api/admin/reviews/settings` - Mettre à jour les paramètres

## 💾 Stockage des données

### MongoDB (production)
Collection `reviews` avec structure :
```javascript
{
  id: 'REV-1234567890',
  orderId: 'BZ-1234567890',
  customerName: 'Jean D.',
  customerEmail: 'jean@example.com',
  rating: 5,
  comment: 'Excellent service !',
  approved: false,
  createdAt: Date,
  updatedAt: Date
}
```

### Fichiers JSON (développement local)
`data/reviews.json` - Même structure en tableau

## 🎨 Design

- Cohérent avec l'identité visuelle BackZo (noir, vert #b8ff57)
- Animations fluides et modernes
- Responsive (mobile, tablette, desktop)
- Accessible (ARIA labels, navigation clavier)

## 🔒 Sécurité

- Validation côté serveur de toutes les données
- Vérification de l'existence de la commande
- Protection contre les doublons (un avis par commande)
- Échappement HTML pour prévenir les injections XSS
- Authentification JWT pour les routes admin

## 📧 Notifications

### Client
- Email de confirmation après soumission d'avis
- Message indiquant que l'avis sera publié après validation

### Admin
- Email de notification lors d'un nouvel avis
- Détails complets (note, commentaire, commande)
- Lien vers le panel admin (à implémenter)

## 🚀 Utilisation

### Pour les clients
1. Recevoir l'email de livraison
2. Cliquer sur "⭐ Donner mon avis"
3. Sélectionner une note (1-5 étoiles)
4. Optionnel : ajouter un commentaire
5. Soumettre l'avis

### Pour l'administrateur
1. Se connecter au panel admin
2. Aller dans l'onglet "Avis clients"
3. Consulter les statistiques
4. Modérer les avis en attente
5. Configurer les paramètres d'affichage

## 🔧 Configuration

### Variables d'environnement
Aucune variable supplémentaire requise. Le système utilise :
- `EMAIL_USER` et `EMAIL_PASS` pour les notifications
- `MONGODB_URI` pour le stockage (optionnel)

### Paramètres par défaut
- Approbation manuelle requise
- Affichage sur homepage activé
- Vérification de commande activée
- Note minimale : 1 étoile
- Maximum 50 avis affichés

## 📱 Responsive

- Mobile : Cartes empilées, boutons pleine largeur
- Tablette : Grille 2 colonnes
- Desktop : Grille 3 colonnes

## ♿ Accessibilité

- Labels ARIA sur tous les contrôles
- Navigation au clavier complète
- Contraste élevé (WCAG AA)
- Taille de police ajustable
- Messages d'erreur clairs

## 🐛 Gestion des erreurs

- Messages d'erreur explicites pour l'utilisateur
- Logs détaillés côté serveur
- Fallback gracieux si MongoDB indisponible
- Validation des données à chaque étape

## 🎯 Prochaines améliorations possibles

1. Réponses de l'admin aux avis
2. Photos dans les avis
3. Filtres par note sur la homepage
4. Export des avis en CSV
5. Statistiques avancées (évolution dans le temps)
6. Intégration avec Google Reviews
7. Système de vote "utile/pas utile"
8. Traduction automatique des avis

## 📞 Support

Pour toute question ou problème :
- Email : team@backzo.eu
- Documentation : Ce fichier README
