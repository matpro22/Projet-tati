# 🚀 Installation PDF pour Vercel

## ⚠️ Important

Sur Vercel, Puppeteer standard ne fonctionne pas. Il faut utiliser `chrome-aws-lambda` à la place.

## 📦 Installation

Les dépendances ont été mises à jour dans `package.json` :

```json
"dependencies": {
  "chrome-aws-lambda": "^10.1.0",
  "puppeteer-core": "^10.4.0"
}
```

## 🔄 Déploiement sur Vercel

### Étape 1 : Installer les dépendances

```bash
npm install
```

### Étape 2 : Pousser sur Git

```bash
git add .
git commit -m "Ajout génération PDF avec chrome-aws-lambda"
git push
```

### Étape 3 : Vercel redéploie automatiquement

Vercel détectera les changements et redéploiera automatiquement.

## ✅ Vérification

Après le déploiement :

1. Connectez-vous à l'admin
2. Créez un devis de test
3. Envoyez-le par email
4. Vérifiez que la pièce jointe est un PDF

## 📊 Logs Vercel

Pour vérifier que le PDF est généré, consultez les logs Vercel :

```
Génération du PDF avec chrome-aws-lambda...
✓ PDF généré avec succès
✓ Devis envoyé à: client@example.com
```

## 🔧 Dépannage

### Le PDF n'est toujours pas généré

Si vous voyez dans les logs :
```
⚠️ chrome-aws-lambda non disponible, envoi en HTML
```

Cela signifie que les dépendances ne sont pas installées. Vérifiez :

1. Que `package.json` contient bien `chrome-aws-lambda` et `puppeteer-core`
2. Que vous avez fait `npm install`
3. Que vous avez poussé les changements sur Git
4. Que Vercel a bien redéployé

### Erreur de timeout

Si le PDF prend trop de temps à générer, Vercel peut timeout. Dans ce cas :

1. Le système utilisera automatiquement le fallback HTML
2. Le client recevra quand même le devis (en HTML)

### Taille de la fonction

`chrome-aws-lambda` est lourd (~50 MB). Assurez-vous que votre plan Vercel le supporte.

## 💡 Alternative : Désactiver le PDF sur Vercel

Si vous préférez désactiver la génération PDF sur Vercel et garder le HTML :

Commentez l'import dans `server.js` :

```javascript
// let chromium;
// let puppeteer;
// try {
//   chromium = require('chrome-aws-lambda');
//   puppeteer = require('puppeteer-core');
// } catch (error) {
//   console.log('⚠️ chrome-aws-lambda non disponible, génération PDF désactivée');
// }
```

Le système enverra automatiquement les devis en HTML.

## 📚 Documentation

- chrome-aws-lambda : https://github.com/alixaxel/chrome-aws-lambda
- Puppeteer sur Vercel : https://vercel.com/guides/using-puppeteer-with-vercel

## ✅ Résumé

| Environnement | Package | Statut |
|---------------|---------|--------|
| Local | puppeteer | ❌ Retiré |
| Vercel | chrome-aws-lambda | ✅ Installé |
| Vercel | puppeteer-core | ✅ Installé |

---

**Date :** 15 avril 2026  
**Version :** 2.1  
**Statut :** ✅ Configuré pour Vercel
