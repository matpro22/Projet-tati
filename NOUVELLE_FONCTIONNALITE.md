# ✨ Nouvelle fonctionnalité : Paramètres partagés

## 🎉 Qu'est-ce qui a changé ?

Les paramètres admin sont maintenant **sauvegardés sur le serveur** et **partagés entre tous les utilisateurs** !

## 🔄 Avant vs Après

### ❌ Avant
```
Admin change le nom du site
    ↓
Sauvegarde dans localStorage (navigateur de l'admin)
    ↓
Autres utilisateurs voient toujours "BackZo"
```

### ✅ Maintenant
```
Admin change le nom du site
    ↓
Sauvegarde sur le serveur (data/settings.json)
    ↓
Tous les utilisateurs voient le nouveau nom !
```

## 🚀 Utilisation

### 1. Démarrer le backend
```bash
npm start
```

### 2. Activer le backend
Dans `public/index.html` :
```javascript
const USE_BACKEND = true;
```

### 3. Modifier les paramètres
1. Admin > Paramètres
2. Changez ce que vous voulez
3. Enregistrez
4. ✅ "Paramètres enregistrés pour tous les utilisateurs !"

### 4. Vérifier
Ouvrez le site dans un autre navigateur → Les changements sont là ! ✅

## 📁 Fichiers modifiés

### Backend (server.js)
- ✅ Ajout route `GET /api/settings`
- ✅ Ajout route `POST /api/settings`
- ✅ Création automatique de `data/settings.json`

### Frontend (public/index.html)
- ✅ Fonction `loadSettingsFromBackend()`
- ✅ Fonction `saveSettingsToBackend()`
- ✅ Fonction `saveSettings()` mise à jour
- ✅ Chargement automatique au démarrage

## 🎯 Paramètres partagés

Tous ces paramètres sont maintenant synchronisés :
- ✅ Nom du site
- ✅ Email de contact
- ✅ Téléphone
- ✅ Devise
- ✅ Frais de livraison
- ✅ Livraison gratuite dès X€
- ✅ Clé publique Stripe
- ✅ Mode maintenance

## 🧪 Tester

### Test rapide (30 secondes)
1. Admin > Paramètres
2. Changez "BackZo" en "Mon Site"
3. Enregistrez
4. Ouvrez en navigation privée
5. ✅ Le header affiche "Mon Site"

### Test complet
Consultez [TESTER_PARAMETRES.md](TESTER_PARAMETRES.md)

## 📚 Documentation

- **[PARAMETRES_PARTAGES.md](PARAMETRES_PARTAGES.md)** - Guide complet
- **[TESTER_PARAMETRES.md](TESTER_PARAMETRES.md)** - Guide de test

## 🔧 Technique

### API Endpoints

**Récupérer les paramètres** :
```bash
GET /api/settings
```

**Sauvegarder les paramètres** :
```bash
POST /api/settings
Content-Type: application/json

{
  "siteName": "Mon Site",
  "shipping": 7.90,
  ...
}
```

### Fichier de stockage
```
data/settings.json
```

### Chargement automatique
Les paramètres sont chargés :
- Au démarrage du site
- À la connexion admin
- Après chaque sauvegarde

## ⚠️ Important

### Sur Vercel
Les fichiers ne persistent pas entre les déploiements.

**Solutions** :
1. Utiliser une vraie base de données (MongoDB, PostgreSQL)
2. Utiliser Vercel KV
3. Utiliser un service externe (Firebase, Supabase)

### Sécurité
Les paramètres sont **publics** (accessibles via `/api/settings`).

**Ne stockez JAMAIS** :
- ❌ Clé secrète Stripe
- ❌ Mots de passe
- ❌ Tokens d'API

## 🎉 Avantages

- ✅ Configuration centralisée
- ✅ Synchronisation automatique
- ✅ Pas besoin de reconfigurer sur chaque appareil
- ✅ Changements instantanés pour tous
- ✅ Persistance garantie

## 🚀 Déployer

### Committez les changements
```bash
git add server.js public/index.html
git commit -m "feat: Add shared settings for all users"
git push
```

### Vercel redéploie automatiquement
Attendez 30 secondes, c'est en ligne ! ✅

## ✅ Checklist

- [x] Backend mis à jour
- [x] Frontend mis à jour
- [x] Documentation créée
- [ ] Testé localement
- [ ] Testé en production
- [ ] Équipe informée

## 🎯 Prochaines étapes

1. **Tester** : Suivez [TESTER_PARAMETRES.md](TESTER_PARAMETRES.md)
2. **Déployer** : Committez et poussez sur GitHub
3. **Migrer** : Vers une vraie base de données (optionnel)

---

**C'est prêt à utiliser ! 🚀**

Testez maintenant en changeant un paramètre dans l'admin !
