# ✅ Vérifier que MongoDB fonctionne

## 🚀 Étape 1 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C si déjà lancé)
# Puis redémarrez :
npm start
```

## 📊 Étape 2 : Vérifier les messages

Vous devriez voir :

```
✓ MongoDB connecté                    ← MongoDB OK !
✓ MongoDB initialisé                  ← Collections créées
✓ Produits par défaut créés dans MongoDB
✓ Paramètres par défaut créés dans MongoDB

🚀 BackZo Backend démarré !

📍 Serveur : http://localhost:3000
💳 Stripe : ✓ Configuré              ← Stripe OK !
💾 Base de données : ✓ MongoDB       ← Confirme MongoDB !
```

### ✅ Si vous voyez ces messages

**Parfait !** MongoDB est connecté et fonctionne.

### ❌ Si vous voyez "MongoDB non configuré"

**Problème** : Le fichier `.env` n'est pas chargé.

**Solution** :
1. Vérifiez que `require('dotenv').config();` est au début de `server.js`
2. Vérifiez que `MONGODB_URI` est dans `.env`
3. Redémarrez le serveur

### ❌ Si vous voyez "Erreur connexion MongoDB"

**Problème** : L'URL MongoDB est incorrecte ou le réseau est bloqué.

**Solutions** :
1. Vérifiez l'URL dans `.env`
2. Vérifiez que votre IP est autorisée dans MongoDB Atlas
3. Vérifiez votre connexion internet

---

## 🧪 Étape 3 : Tester l'API

### Test 1 : Health check

```bash
curl http://localhost:3000/api/health
```

**Résultat attendu** :
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "stripe": true,
  "database": "MongoDB"  ← Doit être "MongoDB" !
}
```

### Test 2 : Récupérer les paramètres

```bash
curl http://localhost:3000/api/settings
```

**Résultat attendu** :
```json
{
  "siteName": "BackZo",
  "email": "team@backzo.eu",
  "shipping": 5.90,
  ...
}
```

### Test 3 : Récupérer les produits

```bash
curl http://localhost:3000/api/products
```

**Résultat attendu** :
```json
[
  {
    "id": "patch-s",
    "name": "Flocage Amovible — Taille S",
    "price": 12,
    ...
  },
  ...
]
```

---

## 🌐 Étape 4 : Vérifier dans MongoDB Atlas

1. Allez sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Connectez-vous
3. Cliquez sur **"Browse Collections"** sur votre cluster
4. Vous devriez voir la base de données **backzo** avec :
   - Collection **settings** (1 document)
   - Collection **products** (4 documents)
   - Collection **orders** (vide pour l'instant)

---

## 🎨 Étape 5 : Tester depuis le site

### Test 1 : Changer un paramètre

1. Ouvrez `public/index.html` dans le navigateur
2. Cliquez sur le point (·) dans le footer
3. Connectez-vous : `admin` / `BackZo2024!`
4. Allez dans **Paramètres**
5. Changez le nom du site : "BackZo" → "Test MongoDB"
6. Cliquez sur **"Enregistrer les paramètres"**
7. ✅ Message : "Paramètres enregistrés pour tous les utilisateurs !"

### Test 2 : Vérifier la persistance

1. **Arrêtez le serveur** (Ctrl+C)
2. **Redémarrez** : `npm start`
3. **Rechargez le site** (F5)
4. ✅ Le nom "Test MongoDB" est toujours là !

### Test 3 : Vérifier dans MongoDB Atlas

1. Allez sur MongoDB Atlas
2. **Browse Collections** > **backzo** > **settings**
3. ✅ Vous devriez voir `siteName: "Test MongoDB"`

---

## 📊 Checklist complète

### Configuration
- [ ] `dotenv` chargé dans `server.js`
- [ ] `MONGODB_URI` dans `.env`
- [ ] URL MongoDB correcte
- [ ] IP autorisée dans MongoDB Atlas

### Démarrage
- [ ] Message "✓ MongoDB connecté"
- [ ] Message "✓ MongoDB initialisé"
- [ ] Message "💾 Base de données : ✓ MongoDB"
- [ ] Pas d'erreur dans les logs

### API
- [ ] `/api/health` retourne `"database": "MongoDB"`
- [ ] `/api/settings` retourne les paramètres
- [ ] `/api/products` retourne les produits

### MongoDB Atlas
- [ ] Base de données `backzo` visible
- [ ] Collection `settings` avec 1 document
- [ ] Collection `products` avec 4 documents

### Site
- [ ] Paramètres se sauvegardent
- [ ] Paramètres persistent après redémarrage
- [ ] Changements visibles dans MongoDB Atlas

---

## ✅ Tout fonctionne !

Si tous les tests passent, MongoDB est parfaitement configuré ! 🎉

### Prochaines étapes

1. **Déployer sur Vercel** :
   - Ajoutez `MONGODB_URI` dans les variables d'environnement
   - Poussez votre code
   - ✅ Les données persistent en production !

2. **Tester en production** :
   - Changez un paramètre
   - Redéployez
   - ✅ Le paramètre est toujours là !

3. **Configurer les backups** :
   - MongoDB Atlas fait des backups automatiques
   - Vérifiez dans Atlas > Backup

---

## 🐛 Problèmes ?

### "MongoDB non configuré"
→ Consultez [PROBLEME_RESOLU.md](PROBLEME_RESOLU.md)

### "Erreur connexion MongoDB"
→ Vérifiez l'URL et les autorisations IP

### "database": "JSON Files"
→ Le `.env` n'est pas chargé, vérifiez `dotenv`

---

**Besoin d'aide ?** Consultez [MONGODB_GUIDE.md](MONGODB_GUIDE.md)
