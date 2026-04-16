# 📧 Guide de démarrage - Newsletter BackZo

## Installation et configuration

### 1. Prérequis

Le système de newsletter est déjà intégré ! Aucune installation supplémentaire n'est nécessaire.

Assurez-vous simplement que :
- ✅ MongoDB est configuré (variable `MONGODB_URI` dans `.env`)
- ✅ Le serveur email est configuré (variables `EMAIL_*` dans `.env`)
- ✅ Le backend Node.js est démarré (`npm start`)

### 2. Configuration email

Ajoutez ces variables dans votre fichier `.env` :

```env
# Configuration email (OVH)
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=465
EMAIL_USER=team@backzo.eu
EMAIL_PASS=votre_mot_de_passe_email
EMAIL_FROM=team@backzo.eu
EMAIL_TO=team@backzo.eu
```

### 3. Vérifier que tout fonctionne

Testez le système avec :

```bash
node "Fichier de test/test-newsletter.js"
```

## Utilisation

### Pour les visiteurs du site

1. Allez sur n'importe quelle page du site
2. Descendez jusqu'au footer
3. Entrez votre email dans le champ "Newsletter"
4. Cliquez sur "S'inscrire"
5. Vous recevrez un email de bienvenue

### Pour l'administrateur

#### Accéder au panel Newsletter

1. Connectez-vous au panel admin : `/admin` ou cliquez sur "Admin" dans le menu
2. Identifiants par défaut :
   - Username: `admin`
   - Password: `BackZo2024!`
3. Cliquez sur l'onglet "Newsletter" 📧

#### Voir les abonnés

Dans l'onglet Newsletter, vous verrez :
- **Statistiques** : Nombre d'abonnés, nouveaux abonnés (7j), taux d'engagement
- **Liste complète** : Tous les abonnés avec email, nom, date d'inscription
- **Bouton Actualiser** : Pour recharger la liste

#### Envoyer une newsletter

1. Dans l'onglet Newsletter, remplissez le formulaire :
   - **Sujet** : Le titre de votre email (ex: "Nouveautés BackZo - Janvier 2024")
   - **Message** : Le contenu de votre newsletter

2. (Optionnel) Cliquez sur **"Aperçu"** pour voir le rendu final

3. Cliquez sur **"Envoyer à tous les abonnés"**

4. Confirmez l'envoi

5. Le système envoie l'email à tous vos abonnés actifs

6. Un message de confirmation s'affiche avec le nombre d'emails envoyés

#### Gérer les abonnés

**Supprimer un abonné :**
1. Dans la liste des abonnés
2. Cliquez sur le bouton "🗑️ Supprimer" à côté de l'email
3. Confirmez la suppression

**Actualiser la liste :**
- Cliquez sur le bouton "Actualiser" en haut à droite

## Template d'email

Les emails envoyés utilisent automatiquement un template professionnel avec :
- ✅ Logo BackZo
- ✅ Design responsive (mobile-friendly)
- ✅ Couleurs de la marque (noir, vert BackZo)
- ✅ Lien de désinscription automatique
- ✅ Footer avec informations de contact

Vous n'avez qu'à écrire le contenu, le reste est géré automatiquement !

## Exemples de newsletters

### Newsletter de bienvenue (automatique)

Envoyée automatiquement lors de l'inscription :
- Message de remerciement
- Présentation de BackZo
- Confirmation de l'inscription

### Newsletter promotionnelle

```
Sujet: 🎉 Offre spéciale - 15% sur tous les packs clubs

Message:
Bonjour,

Nous sommes ravis de vous annoncer une offre exceptionnelle !

Du 15 au 31 janvier, profitez de 15% de réduction sur tous nos packs clubs :
- Pack 10 flocages : 84,15€ au lieu de 99€
- Pack 25 flocages : 194,65€ au lieu de 229€

Utilisez le code promo : CLUB15

Cette offre est valable uniquement pour nos abonnés newsletter !

À très bientôt,
L'équipe BackZo
```

### Newsletter nouveautés

```
Sujet: 🆕 Nouvelles couleurs disponibles !

Message:
Bonjour,

Nous avons le plaisir de vous présenter nos nouvelles couleurs de flocage :

✨ Bleu électrique
✨ Rouge passion
✨ Or métallisé
✨ Argent brillant

Toutes ces couleurs sont maintenant disponibles sur notre configurateur en ligne.

Personnalisez vos maillots dès maintenant sur backzo.eu

Sportivement,
L'équipe BackZo
```

## Bonnes pratiques

### Fréquence d'envoi

- ✅ 1 à 2 newsletters par mois maximum
- ❌ Éviter d'envoyer trop souvent (spam)
- ✅ Envoyer à des moments stratégiques (nouveautés, promotions, événements)

### Contenu

- ✅ Soyez concis et direct
- ✅ Utilisez un ton amical et professionnel
- ✅ Incluez un appel à l'action clair
- ✅ Personnalisez le message
- ❌ Évitez les textes trop longs

### Objet de l'email

- ✅ Court et accrocheur (max 50 caractères)
- ✅ Utilisez des emojis avec modération (1-2 max)
- ✅ Soyez clair sur le contenu
- ❌ Évitez les mots "spam" (gratuit, urgent, etc.)

### Conformité RGPD

- ✅ Lien de désinscription présent (automatique)
- ✅ Consentement explicite à l'inscription
- ✅ Possibilité de supprimer les données
- ✅ Informations de contact visibles

## Dépannage

### Les emails ne sont pas envoyés

**Vérifiez :**
1. Configuration SMTP dans `.env`
2. Connexion au serveur email : `node test-email-config.js`
3. Logs du serveur Node.js
4. Que le port 465 n'est pas bloqué par votre firewall

### Les abonnés ne s'affichent pas

**Vérifiez :**
1. Connexion MongoDB active
2. Token d'authentification admin valide
3. Console du navigateur (F12) pour les erreurs
4. Que vous êtes bien connecté en tant qu'admin

### Email de bienvenue non reçu

**Vérifiez :**
1. Dossier spam/courrier indésirable
2. Configuration `EMAIL_FROM` dans `.env`
3. Logs du serveur pour les erreurs d'envoi

## Support

Pour toute question :
- 📚 Documentation complète : `/DOCS/SYSTEME_NEWSLETTER.md`
- 🧪 Tests : `node "Fichier de test/test-newsletter.js"`
- 📧 Email : team@backzo.eu

## Statistiques et métriques

Le système affiche automatiquement :
- **Abonnés actifs** : Nombre total d'inscrits
- **Nouveaux (7j)** : Abonnés des 7 derniers jours
- **Taux d'engagement** : Estimation basée sur les standards du secteur

Pour des statistiques plus avancées (taux d'ouverture, clics), des outils externes comme Mailchimp ou SendGrid peuvent être intégrés.

## Prochaines étapes

Une fois le système maîtrisé, vous pouvez :
1. Créer des segments d'abonnés (par date, source, etc.)
2. Planifier des envois automatiques
3. Créer des templates personnalisés
4. Intégrer des statistiques avancées
5. Mettre en place un double opt-in

---

**Félicitations ! Votre système de newsletter est prêt à l'emploi ! 🎉**
