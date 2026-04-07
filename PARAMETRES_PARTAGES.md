# 🔧 Paramètres partagés entre tous les utilisateurs

## ✅ Fonctionnalité ajoutée !

Les paramètres admin sont maintenant **sauvegardés côté serveur** et partagés entre tous les utilisateurs !

## 🎯 Comment ça marche

### Avant (localStorage)
```
Admin change les paramètres
    ↓
Sauvegarde dans le navigateur de l'admin
    ↓
❌ Autres utilisateurs ne voient pas les changements
```

### Maintenant (Backend)
```
Admin change les paramètres
    ↓
Sauvegarde sur le serveur (data/settings.json)
    ↓
✅ Tous les utilisateurs voient les changements !
```

## 📁 Fichier créé

Les paramètres sont stockés dans :
```
data/settings.json
```

Contenu :
```json
{
  "siteName": "BackZo",
  "email": "team@backzo.eu",
  "phone": "+33 6 00 00 00 00",
  "currency": "EUR",
  "shipping": 5.90,
  "freeShippingFrom": 50,
  "stripeKey": "pk_test_...",
  "maintenance": false,
  "notifications": true,
  "autoBackup": false,
  "updatedAt": "2024-..."
}
```

## 🔧 Modifications apportées

### Backend (server.js)

**Ajouté** :
- ✅ Route `GET /api/settings` - Récupérer les paramètres
- ✅ Route `POST /api/settings` - Sauvegarder les paramètres
- ✅ Fichier `data/settings.json` créé automatiquement
- ✅ Paramètres par défaut au premier démarrage

### Frontend (public/index.html)

**Ajouté** :
- ✅ Fonction `loadSettingsFromBackend()` - Charge les paramètres au démarrage
- ✅ Fonction `saveSettingsToBackend()` - Sauvegarde sur le serveur
- ✅ Fonction `saveSettings()` mise à jour pour utiliser le backend
- ✅ Chargement automatique des paramètres au démarrage

## 🚀 Utilisation

### 1. Démarrer le backend

```bash
npm start
```

### 2. Activer le backend dans le HTML

Dans `public/index.html` (ligne ~1520) :
```javascript
const USE_BACKEND = true;  // ← Doit être true
```

### 3. Modifier les paramètres

1. Connectez-vous à l'admin
2. Allez dans **Paramètres**
3. Modifiez ce que vous voulez
4. Cliquez sur **"Enregistrer les paramètres"**
5. ✅ Message : "Paramètres enregistrés pour tous les utilisateurs !"

### 4. Vérifier

1. Ouvrez le site dans un autre navigateur (ou en navigation privée)
2. Les nouveaux paramètres sont appliqués ! ✅

## 📊 Paramètres partagés

Tous ces paramètres sont maintenant partagés :

| Paramètre | Description | Visible par tous |
|-----------|-------------|------------------|
| Nom du site | Affiché dans le header | ✅ |
| Email | Email de contact | ✅ |
| Téléphone | Numéro de téléphone | ✅ |
| Devise | EUR, USD, GBP | ✅ |
| Frais de livraison | Montant en € | ✅ |
| Livraison gratuite dès | Seuil en € | ✅ |
| Clé Stripe | Clé publique | ✅ |
| Mode maintenance | Active/désactive le site | ✅ |
| Notifications | Emails admin | ❌ (admin uniquement) |

## 🔄 Synchronisation

### Chargement des paramètres

Les paramètres sont chargés automatiquement :
- ✅ Au démarrage du site
- ✅ À la connexion admin
- ✅ Après sauvegarde

### Fallback en mode local

Si le backend n'est pas disponible :
- ⚠️ Les paramètres sont sauvegardés dans localStorage
- ⚠️ Chaque utilisateur a ses propres paramètres
- ⚠️ Message : "Paramètres enregistrés localement"

## 🧪 Tester

### Test 1 : Changer le nom du site

1. Admin > Paramètres
2. Changez "BackZo" en "Mon Site"
3. Enregistrez
4. Ouvrez en navigation privée
5. ✅ Le header affiche "Mon Site"

### Test 2 : Changer les frais de livraison

1. Admin > Paramètres
2. Changez les frais de 5.90€ à 7.90€
3. Enregistrez
4. Ajoutez un produit au panier (autre navigateur)
5. ✅ Les frais affichent 7.90€

### Test 3 : Mode maintenance

1. Admin > Paramètres
2. Activez "Mode maintenance"
3. Enregistrez
4. Ouvrez en navigation privée
5. ✅ Page de maintenance affichée

## 📝 API Endpoints

### Récupérer les paramètres

```bash
GET /api/settings
```

Réponse :
```json
{
  "siteName": "BackZo",
  "email": "team@backzo.eu",
  "shipping": 5.90,
  ...
}
```

### Sauvegarder les paramètres

```bash
POST /api/settings
Content-Type: application/json

{
  "siteName": "Mon Site",
  "email": "contact@monsite.com",
  "shipping": 7.90,
  ...
}
```

Réponse :
```json
{
  "success": true,
  "settings": {
    "siteName": "Mon Site",
    ...
    "updatedAt": "2024-..."
  }
}
```

## 🔒 Sécurité

### ⚠️ Important

Les paramètres sont **publics** (accessibles via `/api/settings`).

**Ne stockez JAMAIS** :
- ❌ Clé secrète Stripe (utilisez les variables d'environnement)
- ❌ Mots de passe
- ❌ Tokens d'API
- ❌ Informations sensibles

**OK à stocker** :
- ✅ Clé publique Stripe (`pk_test_...`)
- ✅ Nom du site
- ✅ Email de contact
- ✅ Frais de livraison
- ✅ Paramètres d'affichage

### Protection admin

Pour protéger la route de sauvegarde en production :
1. Ajoutez une authentification JWT
2. Vérifiez le token admin avant de sauvegarder
3. Limitez les requêtes (rate limiting)

## 🚀 Déploiement

### Sur Vercel

Les paramètres sont sauvegardés dans `data/settings.json`.

⚠️ **Attention** : Sur Vercel, les fichiers ne persistent pas entre les déploiements !

**Solutions** :
1. **Utiliser une base de données** (MongoDB, PostgreSQL)
2. **Utiliser Vercel KV** (key-value store)
3. **Utiliser un service externe** (Firebase, Supabase)

### Migration vers une vraie DB

Pour migrer vers MongoDB par exemple :

```javascript
// Au lieu de writeJSON
await db.collection('settings').updateOne(
  { _id: 'global' },
  { $set: settings },
  { upsert: true }
);

// Au lieu de readJSON
const settings = await db.collection('settings').findOne({ _id: 'global' });
```

## 📊 Avantages

### Avant (localStorage)
- ❌ Paramètres par navigateur
- ❌ Pas de synchronisation
- ❌ Perte si cache vidé
- ❌ Admin doit reconfigurer sur chaque appareil

### Maintenant (Backend)
- ✅ Paramètres centralisés
- ✅ Synchronisation automatique
- ✅ Persistance garantie
- ✅ Configuration unique

## 🎯 Prochaines étapes

### Court terme
- [ ] Tester en production
- [ ] Vérifier la synchronisation
- [ ] Documenter pour l'équipe

### Moyen terme
- [ ] Ajouter authentification JWT
- [ ] Migrer vers une vraie base de données
- [ ] Ajouter un historique des modifications
- [ ] Ajouter des validations côté serveur

### Long terme
- [ ] Interface de gestion avancée
- [ ] Rôles et permissions
- [ ] Audit trail
- [ ] Backup automatique

## 🆘 Dépannage

### Les paramètres ne se sauvegardent pas

**Vérifiez** :
1. Le backend est démarré : `npm start`
2. `USE_BACKEND = true` dans le HTML
3. Pas d'erreur dans la console (F12)
4. Le fichier `data/settings.json` existe

### Les changements ne sont pas visibles

**Solutions** :
1. Rafraîchissez la page (Ctrl+F5)
2. Videz le cache du navigateur
3. Vérifiez que le backend est accessible
4. Vérifiez les logs du serveur

### Erreur "Erreur sauvegarde paramètres"

**Causes possibles** :
1. Backend non démarré
2. Permissions fichier manquantes
3. Dossier `data/` n'existe pas

**Solution** :
```bash
# Créer le dossier data
mkdir data

# Redémarrer le backend
npm start
```

## ✅ Checklist

- [x] Backend mis à jour avec routes `/api/settings`
- [x] Frontend mis à jour avec fonctions de chargement/sauvegarde
- [x] Fichier `data/settings.json` créé automatiquement
- [x] Paramètres chargés au démarrage
- [x] Message de confirmation après sauvegarde
- [x] Fallback en mode local
- [ ] Testé en production
- [ ] Documenté pour l'équipe

## 🎉 C'est prêt !

Les paramètres sont maintenant **partagés entre tous les utilisateurs** !

Testez en changeant le nom du site dans l'admin, puis ouvrez le site dans un autre navigateur. 🚀

---

**Besoin d'aide ?** Consultez [GUIDE_BACKEND.md](GUIDE_BACKEND.md)
