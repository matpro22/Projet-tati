# 🚀 Démarrage Rapide - Système d'Avis

## ⚠️ IMPORTANT : Redémarrer le serveur

Après l'installation du système d'avis, vous DEVEZ redémarrer le serveur Node.js pour que les nouvelles routes API soient actives.

## 📋 Étapes de démarrage

### 1. Arrêter le serveur actuel

Si le serveur est en cours d'exécution, arrêtez-le :
- **Windows** : Appuyez sur `Ctrl + C` dans le terminal
- **Mac/Linux** : Appuyez sur `Ctrl + C` dans le terminal

### 2. Redémarrer le serveur

```bash
npm start
```

Ou en mode développement avec auto-reload :
```bash
npm run dev
```

### 3. Vérifier que le serveur démarre correctement

Vous devriez voir dans la console :
```
✓ Base de données initialisée
✓ Fichier reviews.json créé
🚀 BackZo Backend démarré !
📍 Serveur : http://localhost:3000
```

### 4. Tester les routes API

Ouvrez votre navigateur et testez :

**Route publique (avis approuvés) :**
```
http://localhost:3000/api/reviews
```
Résultat attendu : `[]` (tableau vide si aucun avis)

**Page de soumission d'avis :**
```
http://localhost:3000/review.html?orderId=BZ-TEST&email=test@example.com
```
Résultat attendu : Formulaire d'avis affiché

**Page d'accueil avec section avis :**
```
http://localhost:3000/
```
Résultat attendu : Section "ILS NOUS FONT CONFIANCE" visible (peut être vide)

## 🔧 Résolution des problèmes

### Erreur 404 sur /api/reviews ou /api/admin/reviews

**Cause** : Le serveur n'a pas été redémarré après les modifications

**Solution** :
1. Arrêter le serveur (`Ctrl + C`)
2. Redémarrer avec `npm start`
3. Attendre que le message "🚀 BackZo Backend démarré !" apparaisse

### Erreur "Cannot find module"

**Cause** : Dépendances manquantes

**Solution** :
```bash
npm install
```

### Port 3000 déjà utilisé

**Cause** : Une autre instance du serveur est en cours

**Solution** :
1. Trouver le processus : `netstat -ano | findstr :3000` (Windows)
2. Tuer le processus : `taskkill /PID <PID> /F` (Windows)
3. Ou changer le port dans `.env` : `PORT=3001`

### MongoDB non disponible

**Cause** : Variable MONGODB_URI non configurée

**Solution** :
- Le système fonctionne en mode fichiers JSON automatiquement
- Aucune action requise pour le développement local
- Pour la production, configurez MONGODB_URI dans `.env`

## ✅ Checklist de vérification

Après le redémarrage, vérifiez que :

- [ ] Le serveur démarre sans erreur
- [ ] Le message "✓ Fichier reviews.json créé" apparaît (première fois)
- [ ] La route `/api/reviews` retourne `[]` ou une liste d'avis
- [ ] La page `/review.html` s'affiche correctement
- [ ] La page d'accueil affiche la section avis
- [ ] Le panel admin affiche l'onglet "⭐ Avis clients"

## 🎯 Prochaines étapes

Une fois le serveur redémarré :

1. **Tester la soumission d'avis** :
   - Ouvrir `/review.html?orderId=BZ-TEST&email=test@example.com`
   - Remplir le formulaire
   - Soumettre

2. **Modérer les avis** :
   - Se connecter au panel admin
   - Aller dans "Avis clients"
   - Approuver l'avis de test

3. **Vérifier l'affichage** :
   - Retourner sur la page d'accueil
   - Scroller jusqu'à "ILS NOUS FONT CONFIANCE"
   - L'avis devrait être visible

## 📞 Support

Si le problème persiste après le redémarrage :

1. Vérifiez les logs du serveur dans la console
2. Vérifiez que tous les fichiers ont été créés :
   - `public/review.html`
   - `public/reviews-display.js`
   - `public/admin-reviews.js`
   - `data/reviews.json`
3. Consultez `TEST_AVIS.md` pour les tests détaillés
4. Contactez : team@backzo.eu

---

**BackZo** — Système d'avis clients
