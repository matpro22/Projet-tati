# 🔧 Correction - PDF sur Vercel

## ❌ Problème identifié

Vous êtes sur **Vercel**, et Puppeteer standard ne fonctionne pas sur cette plateforme.

L'erreur était :
```
Could not find Chrome (ver. 147.0.7727.56)
```

## ✅ Solution appliquée

J'ai remplacé `puppeteer` par `chrome-aws-lambda` qui est compatible avec Vercel.

## 📦 Modifications effectuées

### 1. package.json
```json
"dependencies": {
  "chrome-aws-lambda": "^10.1.0",
  "puppeteer-core": "^10.4.0"
}
```

### 2. server.js
- Import de `chrome-aws-lambda` au lieu de `puppeteer`
- Configuration adaptée pour Vercel/AWS Lambda
- Fallback automatique vers HTML si erreur

## 🚀 Installation

### Étape 1 : Installer les nouvelles dépendances

**Option A - Script automatique :**
```
Double-cliquez sur : install-pdf-vercel.bat
```

**Option B - Ligne de commande :**
```bash
npm install chrome-aws-lambda puppeteer-core
```

### Étape 2 : Pousser sur Git

```bash
git add .
git commit -m "Fix: Utilisation de chrome-aws-lambda pour Vercel"
git push
```

### Étape 3 : Vercel redéploie automatiquement

Attendez que Vercel termine le déploiement (~2-3 minutes).

## 🧪 Test

Après le déploiement :

1. Connectez-vous à l'admin
2. Créez un devis de test
3. Envoyez-le par email
4. Vérifiez que la pièce jointe est maintenant un **PDF** (et non HTML)

## 📊 Vérification des logs

Dans les logs Vercel, vous devriez maintenant voir :

```
✅ Génération du PDF avec chrome-aws-lambda...
✅ ✓ PDF généré avec succès
✅ ✓ Devis envoyé à: client@example.com
```

Au lieu de :
```
❌ Erreur génération PDF: Could not find Chrome
```

## ⚙️ Fonctionnement

### Avant (avec puppeteer)
```
puppeteer → Cherche Chrome localement → ❌ Erreur sur Vercel
```

### Après (avec chrome-aws-lambda)
```
chrome-aws-lambda → Utilise Chromium embarqué → ✅ Fonctionne sur Vercel
```

## 📋 Différences

| Aspect | puppeteer | chrome-aws-lambda |
|--------|-----------|-------------------|
| Environnement | Local | Vercel/AWS Lambda |
| Taille | ~300 MB | ~50 MB |
| Chrome | Télécharge Chrome | Chromium embarqué |
| Vercel | ❌ Ne fonctionne pas | ✅ Fonctionne |

## 🔄 Fallback automatique

Si la génération PDF échoue pour une raison quelconque, le système envoie automatiquement le devis en HTML. Le client reçoit quand même son devis.

## 💡 Conseils

- **Testez localement** avant de pousser sur Vercel
- **Vérifiez les logs Vercel** après le déploiement
- **Gardez le fallback HTML** pour la fiabilité

## 📚 Documentation

- Guide complet : `INSTALLATION_VERCEL_PDF.md`
- Documentation chrome-aws-lambda : https://github.com/alixaxel/chrome-aws-lambda

## ✅ Checklist

- [x] Remplacé puppeteer par chrome-aws-lambda
- [x] Mis à jour package.json
- [x] Mis à jour server.js
- [x] Créé script d'installation
- [ ] Installer les dépendances : `npm install`
- [ ] Pousser sur Git : `git push`
- [ ] Attendre le redéploiement Vercel
- [ ] Tester la génération PDF

## 🎉 Résultat attendu

Après ces modifications, vos devis seront envoyés en **PDF de haute qualité** directement depuis Vercel !

---

**Date :** 15 avril 2026  
**Version :** 2.1  
**Statut :** ✅ Corrigé pour Vercel
