# ⚡ Déployer sur Vercel en 5 minutes

## 🎯 Méthode la plus simple (Frontend uniquement)

### 1. Préparer (30 secondes)

Dans `Untitled-1.html`, vérifiez que :
```javascript
const USE_BACKEND = false;  // ← Doit être false
```

### 2. Déployer (2 minutes)

**Option A : Glisser-déposer** (PLUS FACILE)
1. Allez sur [vercel.com](https://vercel.com)
2. Créez un compte (gratuit)
3. Cliquez sur **"Add New Project"**
4. Glissez-déposez votre dossier complet
5. Cliquez sur **"Deploy"**
6. ✅ C'est en ligne !

**Option B : Ligne de commande**
```bash
npm install -g vercel
vercel login
vercel
```

### 3. Configurer Stripe (2 minutes)

1. Allez sur votre site : `https://votre-projet.vercel.app`
2. Cliquez sur le point (·) dans le footer
3. Connectez-vous : `admin` / `BackZo2024!`
4. Allez dans **Paramètres**
5. Ajoutez votre clé publique Stripe : `pk_test_...`
6. Enregistrez

### 4. Tester (1 minute)

1. Ajoutez un produit au panier
2. Passez commande avec la carte : `4242 4242 4242 4242`
3. ✅ Ça marche !

---

## 🔧 Avec Backend (paiements réels)

### 1. Créer un repo GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/backzo.git
git push -u origin main
```

### 2. Importer sur Vercel

1. Sur [vercel.com](https://vercel.com), cliquez **"Import Git Repository"**
2. Sélectionnez votre repo
3. Cliquez **"Import"**

### 3. Configurer les variables

Dans Vercel > **Settings** > **Environment Variables**, ajoutez :

| Variable | Valeur |
|----------|--------|
| `STRIPE_SECRET_KEY` | `sk_test_VOTRE_CLE` |
| `FRONTEND_URL` | `https://votre-site.vercel.app` |

### 4. Modifier le code

Dans `Untitled-1.html` :
```javascript
const API_URL = '/api';  // ← Chemin relatif
const USE_BACKEND = true;  // ← Activez le backend
```

Committez et poussez :
```bash
git add .
git commit -m "Configure for Vercel"
git push
```

### 5. Configurer Stripe dans l'admin

1. Allez sur votre site
2. Admin > Paramètres
3. Ajoutez la clé **publique** : `pk_test_...`

### 6. Tester

Passez une commande avec `4242 4242 4242 4242` !

---

## 🐛 Problèmes ?

**Site ne charge pas** → Vérifiez que `vercel.json` existe  
**Backend ne marche pas** → Vérifiez les variables d'environnement  
**Stripe erreur** → Vérifiez les clés (publique dans l'admin, secrète dans Vercel)

---

## 📚 Plus d'infos

Lisez [DEPLOIEMENT_VERCEL.md](DEPLOIEMENT_VERCEL.md) pour le guide complet !

---

**C'est tout ! Votre site est en ligne ! 🚀**
