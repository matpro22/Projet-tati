# 👋 Bienvenue sur BackZo !

## 🎯 Par où commencer ?

### Je veux juste tester le site
→ **Ouvrez `Untitled-1.html` dans votre navigateur**  
C'est tout ! Le site fonctionne immédiatement. ✅

### Je veux déployer sur internet
→ **Lisez [VERCEL_RAPIDE.md](VERCEL_RAPIDE.md)** (5 minutes)  
Glissez-déposez votre dossier sur Vercel, c'est en ligne ! 🚀

### Je veux activer les paiements réels
→ **Lisez [GUIDE_BACKEND.md](GUIDE_BACKEND.md)** (15 minutes)  
Installez Node.js, configurez Stripe, lancez le backend. 💳

### Je veux personnaliser le site
→ **Lisez [OU_MODIFIER.md](OU_MODIFIER.md)**  
Guide ligne par ligne pour modifier couleurs, textes, produits. 🎨

---

## 📚 Tous les guides disponibles

### 🚀 Démarrage
- **[DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)** - Démarrer en 5 minutes
- **[README.md](README.md)** - Documentation complète du projet

### 🌐 Déploiement
- **[VERCEL_RAPIDE.md](VERCEL_RAPIDE.md)** - Déployer en 5 minutes ⚡
- **[DEPLOIEMENT_VERCEL.md](DEPLOIEMENT_VERCEL.md)** - Guide complet Vercel

### 🔧 Backend
- **[GUIDE_BACKEND.md](GUIDE_BACKEND.md)** - Guide backend complet (FR)
- **[README_BACKEND.md](README_BACKEND.md)** - Documentation backend (EN)

### 💳 Paiements
- **[STRIPE_INTEGRATION.md](STRIPE_INTEGRATION.md)** - Guide Stripe

### 🎨 Personnalisation
- **[OU_MODIFIER.md](OU_MODIFIER.md)** - Où modifier le code

### 📁 Référence
- **[FICHIERS_IMPORTANTS.md](FICHIERS_IMPORTANTS.md)** - Guide des fichiers
- **[RESUME_INTEGRATION.md](RESUME_INTEGRATION.md)** - Résumé de l'intégration

---

## ⚡ Actions rapides

### Tester le site localement
```bash
# Ouvrez simplement le fichier
Untitled-1.html
```

### Démarrer le backend
```bash
npm install
cp .env.example .env
# Éditez .env et ajoutez votre clé Stripe
npm start
```

### Déployer sur Vercel
```bash
npm install -g vercel
vercel login
vercel
```

---

## 🎯 Scénarios d'utilisation

### Scénario 1 : "Je veux juste voir le site"
1. Double-cliquez sur `Untitled-1.html`
2. Explorez le site
3. Testez l'admin (cliquez sur le point dans le footer)
   - User: `admin`
   - Pass: `BackZo2024!`

### Scénario 2 : "Je veux le mettre en ligne rapidement"
1. Lisez [VERCEL_RAPIDE.md](VERCEL_RAPIDE.md)
2. Allez sur [vercel.com](https://vercel.com)
3. Glissez-déposez votre dossier
4. Cliquez sur "Deploy"
5. ✅ C'est en ligne !

### Scénario 3 : "Je veux des paiements réels"
1. Lisez [GUIDE_BACKEND.md](GUIDE_BACKEND.md)
2. Installez Node.js
3. Configurez `.env` avec votre clé Stripe
4. Lancez `npm start`
5. Dans `Untitled-1.html`, changez `USE_BACKEND = true`
6. Testez avec la carte `4242 4242 4242 4242`

### Scénario 4 : "Je veux personnaliser"
1. Lisez [OU_MODIFIER.md](OU_MODIFIER.md)
2. Modifiez `Untitled-1.html` selon vos besoins
3. Testez dans le navigateur
4. Déployez sur Vercel

---

## 🔑 Informations importantes

### Accès Admin
- **URL** : Cliquez sur le point (·) dans le footer
- **User** : `admin`
- **Pass** : `BackZo2024!`

⚠️ **Changez le mot de passe avant de déployer !**

### Cartes de test Stripe
- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0027 6000 3184`

Date : N'importe quelle date future  
CVV : N'importe quel 3 chiffres

### Configuration Backend
Dans `Untitled-1.html` (ligne ~1520) :
```javascript
const USE_BACKEND = false;  // true pour activer le backend
const API_URL = 'http://localhost:3000/api';
```

---

## 🆘 Problèmes courants

### Le site ne s'affiche pas
→ Vérifiez que vous avez bien ouvert `Untitled-1.html`

### Le backend ne démarre pas
→ Vérifiez que Node.js est installé : `node --version`  
→ Installez les dépendances : `npm install`

### Stripe ne fonctionne pas
→ Vérifiez votre clé dans `.env` (backend)  
→ Vérifiez votre clé dans l'admin (frontend)

### Backend non accessible
→ Vérifiez que le serveur est démarré : `npm start`  
→ Vérifiez que `USE_BACKEND = true` dans le HTML

---

## 📞 Besoin d'aide ?

1. **Consultez la documentation** dans les fichiers `.md`
2. **Ouvrez la console** du navigateur (F12) pour voir les erreurs
3. **Vérifiez les logs** du serveur si vous utilisez le backend
4. **Lisez les messages d'erreur** attentivement

---

## 🎉 Prêt à commencer ?

### Choix 1 : Test rapide (30 secondes)
```bash
# Ouvrez simplement
Untitled-1.html
```

### Choix 2 : Déploiement rapide (5 minutes)
1. Allez sur [vercel.com](https://vercel.com)
2. Glissez-déposez votre dossier
3. Cliquez sur "Deploy"

### Choix 3 : Installation complète (15 minutes)
```bash
npm install
cp .env.example .env
# Éditez .env
npm start
# Ouvrez Untitled-1.html
```

---

## 📋 Checklist de démarrage

- [ ] J'ai ouvert `Untitled-1.html` et vu le site
- [ ] J'ai testé l'accès admin
- [ ] J'ai lu [DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)
- [ ] J'ai choisi mon mode (local ou backend)
- [ ] J'ai lu le guide de déploiement si besoin
- [ ] J'ai configuré Stripe si besoin
- [ ] J'ai testé un paiement
- [ ] J'ai changé le mot de passe admin
- [ ] Je suis prêt à déployer !

---

## 🚀 Prochaines étapes

1. **Testez le site** localement
2. **Personnalisez** selon vos besoins
3. **Configurez Stripe** pour les paiements
4. **Déployez** sur Vercel
5. **Partagez** avec le monde !

---

**Bon développement ! 🎉**

*Vous avez des questions ? Consultez [README.md](README.md) pour plus d'informations.*
