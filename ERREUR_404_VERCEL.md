# 🔧 Résoudre l'erreur 404 sur Vercel

## ❌ Erreur rencontrée
```
404: NOT_FOUND
Code: NOT_FOUND
```

## ✅ Solution

L'erreur vient du fait que `vercel.json` cherchait le fichier au mauvais endroit.

### Ce qui a été corrigé

**Avant** (❌ ne fonctionnait pas) :
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/Untitled-1.html"  // ← Fichier introuvable
    }
  ]
}
```

**Après** (✅ fonctionne) :
```json
{
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*\\.(jpg|jpeg|png|gif|svg|css|js|ico|json))",
      "dest": "/public/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/public/index.html"  // ← Bon chemin !
    }
  ]
}
```

## 🚀 Redéployer

### Si vous avez déployé via GitHub

1. **Committez les changements** :
   ```bash
   git add vercel.json
   git commit -m "Fix: Update vercel.json for public folder"
   git push
   ```

2. **Vercel redéploie automatiquement** ✅

### Si vous avez déployé via CLI

1. **Redéployez** :
   ```bash
   vercel --prod
   ```

### Si vous avez glissé-déposé

1. **Supprimez le déploiement actuel** :
   - Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
   - Cliquez sur votre projet
   - Settings > Delete Project

2. **Redéployez** :
   - Glissez-déposez à nouveau votre dossier
   - Ou utilisez `vercel` en ligne de commande

## 📁 Structure correcte du projet

Votre projet doit avoir cette structure :

```
backzo/
├── public/              ← Dossier pour les fichiers statiques
│   ├── index.html      ← Votre site (renommé depuis Untitled-1.html)
│   ├── 1.jpg
│   └── 2.jpg
├── data/
│   ├── orders.json
│   └── products.json
├── server.js           ← Backend Node.js
├── package.json
├── vercel.json         ← Configuration Vercel (corrigée)
├── .env
└── .gitignore
```

## ✅ Vérifications

Après redéploiement, vérifiez que :

- [ ] Le site s'affiche : `https://votre-projet.vercel.app`
- [ ] Les images se chargent
- [ ] L'API fonctionne : `https://votre-projet.vercel.app/api/health`
- [ ] Le backend répond correctement

## 🧪 Tester l'API

```bash
# Tester le health check
curl https://votre-projet.vercel.app/api/health

# Devrait retourner :
{
  "status": "ok",
  "timestamp": "...",
  "stripe": true
}
```

## 🐛 Autres erreurs possibles

### Erreur : "Module not found"

**Cause** : Les dépendances ne sont pas installées

**Solution** :
```bash
npm install
git add package.json package-lock.json
git commit -m "Add dependencies"
git push
```

### Erreur : "CORS Error"

**Cause** : `FRONTEND_URL` mal configuré

**Solution** :
1. Allez dans Vercel > Settings > Environment Variables
2. Vérifiez que `FRONTEND_URL` = `https://votre-projet.vercel.app`
3. Redéployez

### Erreur : "Stripe Invalid API Key"

**Cause** : Clé Stripe non configurée

**Solution** :
1. Allez dans Vercel > Settings > Environment Variables
2. Ajoutez `STRIPE_SECRET_KEY` = `sk_test_...`
3. Redéployez

### Les données ne persistent pas

**Cause** : Vercel est serverless, les fichiers ne persistent pas

**Solution** :
- Utilisez une vraie base de données (MongoDB, PostgreSQL)
- Ou utilisez Vercel KV pour le stockage
- Ou utilisez un service externe (AWS S3, etc.)

## 📝 Checklist de déploiement

- [x] `vercel.json` corrigé
- [ ] Fichiers dans le dossier `public/`
- [ ] `server.js` sert les fichiers statiques
- [ ] Variables d'environnement configurées
- [ ] Code committé et pushé
- [ ] Redéployé sur Vercel
- [ ] Site testé et fonctionnel

## 🎉 Ça marche !

Une fois redéployé avec le `vercel.json` corrigé, votre site devrait fonctionner parfaitement !

**URL de votre site** : `https://votre-projet.vercel.app`

---

**Besoin d'aide ?** Consultez [DEPLOIEMENT_VERCEL.md](DEPLOIEMENT_VERCEL.md) pour plus de détails.
