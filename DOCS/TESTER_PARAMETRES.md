# 🧪 Tester les paramètres partagés

## ⚡ Test rapide (2 minutes)

### 1. Démarrer le backend

```bash
npm start
```

Vous devriez voir :
```
✓ Base de données initialisée
🚀 BackZo Backend démarré !
```

### 2. Vérifier que le backend est activé

Ouvrez `public/index.html` et vérifiez (ligne ~1520) :
```javascript
const USE_BACKEND = true;  // ← Doit être true
```

### 3. Ouvrir le site

Ouvrez `public/index.html` dans votre navigateur.

Ouvrez la console (F12) et vérifiez :
```
✓ Backend connecté: {status: "ok", ...}
✓ Paramètres chargés depuis le backend
```

### 4. Changer un paramètre

1. Cliquez sur le point (·) dans le footer
2. Connectez-vous : `admin` / `BackZo2024!`
3. Allez dans **Paramètres**
4. Changez le nom du site : "BackZo" → "Mon Super Site"
5. Cliquez sur **"Enregistrer les paramètres"**
6. ✅ Message : "Paramètres enregistrés pour tous les utilisateurs !"

### 5. Vérifier dans un autre navigateur

1. Ouvrez le site en **navigation privée** (Ctrl+Shift+N)
2. Regardez le header
3. ✅ Il affiche "Mon Super Site" !

## 🎯 Tests détaillés

### Test 1 : Nom du site

**Objectif** : Vérifier que le nom change partout

1. Admin > Paramètres
2. Changez "BackZo" en "TestSite"
3. Enregistrez
4. Vérifiez :
   - ✅ Header : "TestSite"
   - ✅ Footer : "TestSite"
   - ✅ Admin : "TestSite"
   - ✅ Autre navigateur : "TestSite"

### Test 2 : Frais de livraison

**Objectif** : Vérifier que les frais s'appliquent

1. Admin > Paramètres
2. Changez les frais de 5.90€ à 9.90€
3. Enregistrez
4. Ajoutez un produit au panier (autre navigateur)
5. ✅ Frais affichés : 9.90€

### Test 3 : Livraison gratuite

**Objectif** : Vérifier le seuil de livraison gratuite

1. Admin > Paramètres
2. Changez le seuil de 50€ à 30€
3. Enregistrez
4. Ajoutez des produits pour 35€ (autre navigateur)
5. ✅ Livraison : Gratuite

### Test 4 : Mode maintenance

**Objectif** : Vérifier que le site se met en maintenance

1. Admin > Paramètres
2. Activez "Mode maintenance"
3. Enregistrez
4. Ouvrez en navigation privée
5. ✅ Page de maintenance affichée
6. Désactivez le mode maintenance
7. ✅ Site normal

### Test 5 : Clé Stripe

**Objectif** : Vérifier que la clé est partagée

1. Admin > Paramètres
2. Changez la clé Stripe
3. Enregistrez
4. Passez une commande (autre navigateur)
5. ✅ Paiement fonctionne avec la nouvelle clé

### Test 6 : Persistance

**Objectif** : Vérifier que les paramètres persistent

1. Changez plusieurs paramètres
2. Enregistrez
3. Redémarrez le backend : `Ctrl+C` puis `npm start`
4. Rechargez le site
5. ✅ Tous les paramètres sont conservés

## 🔍 Vérifications techniques

### Vérifier le fichier settings.json

```bash
# Afficher le contenu
cat data/settings.json
```

Vous devriez voir :
```json
{
  "siteName": "Mon Super Site",
  "email": "team@backzo.eu",
  "shipping": 9.90,
  ...
  "updatedAt": "2024-..."
}
```

### Tester l'API directement

```bash
# Récupérer les paramètres
curl http://localhost:3000/api/settings

# Sauvegarder des paramètres
curl -X POST http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{"siteName":"Test API","shipping":7.90}'
```

### Vérifier les logs du serveur

Dans le terminal où tourne le backend, vous devriez voir :
```
GET /api/settings 200
POST /api/settings 200
```

## 🐛 Problèmes courants

### "Paramètres enregistrés localement"

**Cause** : Backend non accessible

**Solution** :
1. Vérifiez que le backend est démarré
2. Vérifiez que `USE_BACKEND = true`
3. Vérifiez la console pour les erreurs

### Les changements ne sont pas visibles

**Cause** : Cache du navigateur

**Solution** :
1. Rafraîchissez avec Ctrl+F5
2. Videz le cache
3. Utilisez la navigation privée

### Erreur "Erreur sauvegarde paramètres"

**Cause** : Problème backend

**Solution** :
1. Vérifiez les logs du serveur
2. Vérifiez que le dossier `data/` existe
3. Redémarrez le backend

### Fichier settings.json n'existe pas

**Cause** : Backend pas encore démarré

**Solution** :
```bash
# Démarrer le backend
npm start

# Le fichier est créé automatiquement
ls data/settings.json
```

## 📊 Checklist de test

### Tests fonctionnels
- [ ] Nom du site change partout
- [ ] Frais de livraison s'appliquent
- [ ] Seuil livraison gratuite fonctionne
- [ ] Mode maintenance fonctionne
- [ ] Clé Stripe est partagée
- [ ] Email de contact est partagé
- [ ] Téléphone est partagé

### Tests techniques
- [ ] Fichier `data/settings.json` créé
- [ ] API `/api/settings` répond
- [ ] Paramètres chargés au démarrage
- [ ] Paramètres persistent après redémarrage
- [ ] Logs serveur corrects
- [ ] Pas d'erreur console

### Tests multi-utilisateurs
- [ ] Changements visibles dans autre navigateur
- [ ] Changements visibles en navigation privée
- [ ] Changements visibles sur autre appareil
- [ ] Synchronisation instantanée

## ✅ Résultat attendu

Après tous les tests :
- ✅ Les paramètres sont partagés entre tous les utilisateurs
- ✅ Les changements sont instantanés
- ✅ Les paramètres persistent après redémarrage
- ✅ Aucune erreur dans la console
- ✅ Aucune erreur dans les logs serveur

## 🎉 Ça marche !

Si tous les tests passent, la fonctionnalité est opérationnelle ! 🚀

---

**Problème ?** Consultez [PARAMETRES_PARTAGES.md](PARAMETRES_PARTAGES.md)
