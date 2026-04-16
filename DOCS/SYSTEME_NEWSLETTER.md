# 📧 Système de Newsletter BackZo

## Vue d'ensemble

Le système de newsletter permet de collecter des emails d'abonnés et d'envoyer des campagnes d'emailing groupées depuis le panel admin.

## Fonctionnalités

### 1. Inscription à la newsletter

**Frontend (Site public)**
- Formulaire d'inscription dans le footer de toutes les pages
- Validation de l'email en temps réel
- Messages de confirmation/erreur
- Email de bienvenue automatique

**Endpoint API**
```
POST /api/newsletter/subscribe
Body: { email: string, name?: string }
```

### 2. Panel Admin - Onglet Newsletter

**Statistiques**
- Nombre total d'abonnés actifs
- Nouveaux abonnés (7 derniers jours)
- Taux d'engagement estimé

**Liste des abonnés**
- Affichage de tous les abonnés avec :
  - Email
  - Nom (optionnel)
  - Date d'inscription
  - Source (website, import, etc.)
- Actions : Supprimer un abonné

**Envoi groupé**
- Formulaire de composition :
  - Sujet de l'email
  - Message (texte)
- Prévisualisation avant envoi
- Envoi à tous les abonnés actifs
- Template HTML automatique avec branding BackZo

### 3. Gestion des abonnés

**Désinscription**
```
POST /api/newsletter/unsubscribe
Body: { email: string }
```

**Suppression (Admin)**
```
DELETE /api/newsletter/subscribers/:email
```

**Liste des abonnés (Admin)**
```
GET /api/newsletter/subscribers
Headers: Authorization: Bearer <token>
```

## Structure MongoDB

### Collection: `newsletter`

```javascript
{
  email: String,           // Email de l'abonné (unique, lowercase)
  name: String,            // Nom optionnel
  subscribedAt: Date,      // Date d'inscription
  unsubscribed: Boolean,   // Statut de désinscription
  unsubscribedAt: Date,    // Date de désinscription (si applicable)
  resubscribedAt: Date,    // Date de réabonnement (si applicable)
  source: String,          // Source d'inscription (website, import, etc.)
  updatedAt: Date          // Dernière mise à jour
}
```

## Template Email

Les emails envoyés utilisent un template HTML responsive avec :
- Header BackZo avec logo
- Contenu personnalisé
- Footer avec lien de désinscription
- Design cohérent avec l'identité visuelle

## Configuration Email

Le système utilise Nodemailer avec les paramètres suivants (fichier `.env`) :

```env
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=465
EMAIL_USER=team@backzo.eu
EMAIL_PASS=votre_mot_de_passe
EMAIL_FROM=team@backzo.eu
```

## Utilisation

### Inscription depuis le site

1. L'utilisateur entre son email dans le formulaire du footer
2. Clic sur "S'inscrire"
3. Validation de l'email
4. Enregistrement dans MongoDB
5. Email de bienvenue automatique
6. Message de confirmation affiché

### Envoi d'une newsletter (Admin)

1. Se connecter au panel admin
2. Aller dans l'onglet "Newsletter"
3. Remplir le sujet et le message
4. (Optionnel) Cliquer sur "Aperçu" pour prévisualiser
5. Cliquer sur "Envoyer à tous les abonnés"
6. Confirmer l'envoi
7. Le système envoie l'email à tous les abonnés actifs
8. Affichage du nombre d'emails envoyés

### Gestion des abonnés (Admin)

1. Onglet "Newsletter" > Liste des abonnés
2. Voir tous les abonnés avec leurs informations
3. Cliquer sur "Actualiser" pour recharger la liste
4. Cliquer sur "Supprimer" pour retirer un abonné

## Sécurité

- Authentification JWT requise pour toutes les routes admin
- Validation des emails côté serveur
- Protection contre les inscriptions multiples
- Gestion des désinscriptions conforme RGPD
- Emails en lowercase pour éviter les doublons

## Améliorations futures

- [ ] Import/Export CSV des abonnés
- [ ] Segmentation des abonnés (par date, source, etc.)
- [ ] Templates d'emails personnalisables
- [ ] Statistiques d'ouverture et de clics
- [ ] Planification d'envois différés
- [ ] A/B testing des campagnes
- [ ] Double opt-in pour confirmer l'inscription
- [ ] Historique des campagnes envoyées
- [ ] Gestion des bounces et désabonnements automatiques

## Dépannage

### Les emails ne sont pas envoyés

1. Vérifier la configuration SMTP dans `.env`
2. Tester la connexion email : `node test-email-config.js`
3. Vérifier les logs du serveur pour les erreurs
4. S'assurer que le port 465 n'est pas bloqué

### Les abonnés ne s'affichent pas

1. Vérifier la connexion MongoDB
2. S'assurer que la collection `newsletter` existe
3. Vérifier l'authentification admin (token JWT valide)
4. Consulter les logs du navigateur (F12)

### Email de bienvenue non reçu

1. Vérifier les spams
2. Vérifier la configuration EMAIL_FROM
3. Tester l'envoi manuel depuis le panel admin
4. Vérifier les logs du serveur

## Support

Pour toute question ou problème, consultez :
- Documentation complète : `/DOCS/`
- Logs serveur : Console Node.js
- Logs frontend : Console navigateur (F12)
