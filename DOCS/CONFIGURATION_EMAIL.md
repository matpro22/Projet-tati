# Configuration du système d'envoi d'email

## ✅ Modifications effectuées

Le système d'envoi d'email fonctionne maintenant **uniquement via le backend**. Toutes les fonctions qui utilisaient `mailto:` (ouverture du client email local) ont été remplacées par des appels API au backend.

### Fonctions modifiées :

1. **Formulaire de contact** (`sendContactForm`)
   - Envoie via `/api/contact`
   - Validation côté serveur
   - Email HTML formaté

2. **CTA Clubs** (`sendClubCTA`)
   - Envoie via `/api/contact`
   - Plus besoin d'ouvrir le client email local

3. **Envoi de devis** (`sendDevisByEmail`)
   - Envoie via `/api/send-quote`
   - Email HTML avec détails du devis

4. **Notifications de commande** (`sendOrderConfirmation`)
   - Envoie via `/api/send-order-notification`
   - Email HTML avec statut de commande

5. **Renvoi de devis depuis le tableau admin** (`resendQuoteFromTable`)
   - Envoie via `/api/send-quote`

## 🔧 Configuration requise

Pour que l'envoi d'email fonctionne, vous devez configurer les variables d'environnement dans le fichier `.env` :

```env
# Configuration Email OVH
EMAIL_HOST=ssl0.ovh.net
EMAIL_PORT=465
EMAIL_USER=team@backzo.eu
EMAIL_PASS=VOTRE_VRAI_MOT_DE_PASSE_ICI
EMAIL_FROM=team@backzo.eu
EMAIL_TO=team@backzo.eu
```

### Comment obtenir le mot de passe email OVH :

1. Connectez-vous à votre espace client OVH
2. Allez dans "Emails" > "Comptes email"
3. Sélectionnez `team@backzo.eu`
4. Cliquez sur "Modifier le mot de passe" si nécessaire
5. Copiez le mot de passe dans `.env`

## 🧪 Test de la configuration

Le serveur vérifie automatiquement la configuration email au démarrage :

```bash
node server.js
```

Vous verrez :
- ✅ `✓ Configuration email vérifiée` si tout est OK
- ⚠️ `⚠️ Configuration email incorrecte` si les identifiants sont invalides
- ℹ️ `ℹ️ Email non configuré` si les variables ne sont pas définies

## 📧 Endpoints API créés

### 1. POST `/api/contact`
Envoie un message de contact

**Body :**
```json
{
  "name": "Nom du contact",
  "email": "email@example.com",
  "subject": "Sujet (optionnel)",
  "message": "Message"
}
```

### 2. POST `/api/send-quote`
Envoie un devis par email

**Body :**
```json
{
  "clientEmail": "client@example.com",
  "clientName": "Nom du client",
  "quoteId": "DEV-0001",
  "total": "150,00 €",
  "items": "HTML des items (optionnel)"
}
```

### 3. POST `/api/send-order-notification`
Envoie une notification de commande

**Body :**
```json
{
  "customerEmail": "client@example.com",
  "customerName": "Prénom",
  "orderId": "CMD-0001",
  "status": "shipped"
}
```

## 🔒 Mode dégradé

Si l'email n'est pas configuré :
- Les formulaires fonctionnent toujours
- Les messages sont loggés dans la console serveur
- L'utilisateur reçoit un message de confirmation
- Aucune erreur n'est affichée

## 🚀 Déploiement sur Vercel

N'oubliez pas d'ajouter les variables d'environnement dans Vercel :

1. Allez dans votre projet Vercel
2. Settings > Environment Variables
3. Ajoutez :
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `EMAIL_FROM`
   - `EMAIL_TO`

## ✨ Avantages de cette approche

- ✅ Pas besoin d'ouvrir le client email local
- ✅ Emails HTML professionnels avec le branding BackZo
- ✅ Logs centralisés côté serveur
- ✅ Validation et sécurité côté serveur
- ✅ Fonctionne même si l'email n'est pas configuré (mode dégradé)
- ✅ Compatible avec tous les navigateurs et appareils
