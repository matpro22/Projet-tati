# Installation du système PDF pour les devis

## 📦 Installation de Puppeteer

Pour que les devis soient envoyés en pièce jointe PDF (et non HTML), vous devez installer Puppeteer.

### Méthode 1 : Script automatique (Windows)

Double-cliquez sur le fichier `install-puppeteer.bat` à la racine du projet.

### Méthode 2 : Installation manuelle

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install puppeteer
```

### Méthode 3 : Installation complète

Si vous n'avez pas encore installé les dépendances :

```bash
npm install
```

Cela installera toutes les dépendances, y compris puppeteer.

## ⚙️ Configuration

Aucune configuration supplémentaire n'est nécessaire. Le système détecte automatiquement si Puppeteer est installé.

### Comportement

- **Avec Puppeteer installé** : Les devis sont envoyés en PDF de haute qualité
- **Sans Puppeteer** : Les devis sont envoyés en HTML (fallback automatique)

## 🚀 Fonctionnement

Lorsqu'un devis est envoyé par email :

1. Le frontend génère le HTML complet du devis
2. Le backend reçoit le HTML
3. Puppeteer lance un navigateur headless
4. Le HTML est converti en PDF format A4
5. Le PDF est attaché à l'email
6. Le client reçoit un email avec le PDF en pièce jointe

## 📋 Caractéristiques du PDF généré

- **Format** : A4
- **Marges** : 20px de chaque côté
- **Arrière-plans** : Conservés (couleurs, bordures)
- **Qualité** : Haute résolution
- **Nom du fichier** : `Devis_BackZo_DEV-XXXX.pdf`

## 🔧 Dépannage

### Erreur lors de l'installation de Puppeteer

Si vous rencontrez des erreurs lors de l'installation :

**Windows :**
```bash
npm install puppeteer --legacy-peer-deps
```

**Linux/Mac :**
```bash
sudo npm install puppeteer
```

### Puppeteer ne se lance pas

Si Puppeteer est installé mais ne fonctionne pas :

1. Vérifiez que Chrome/Chromium est installé sur le système
2. Sur Linux, installez les dépendances système :
   ```bash
   sudo apt-get install -y \
     libnss3 \
     libatk-bridge2.0-0 \
     libdrm2 \
     libxkbcommon0 \
     libgbm1 \
     libasound2
   ```

### Le PDF n'est pas généré

Si le PDF n'est pas généré, vérifiez les logs du serveur :

```bash
npm start
```

Vous devriez voir :
- `Génération du PDF avec Puppeteer...`
- `✓ PDF généré avec succès`

Si vous voyez une erreur, le système utilisera automatiquement le fallback HTML.

## 🌐 Déploiement sur Vercel

Puppeteer peut être lourd pour Vercel. Deux options :

### Option 1 : Utiliser chrome-aws-lambda (recommandé pour Vercel)

```bash
npm install chrome-aws-lambda puppeteer-core
```

Puis modifiez `server.js` :

```javascript
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

// Dans l'endpoint /api/send-quote
const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});
```

### Option 2 : Désactiver Puppeteer sur Vercel

Le système fonctionne automatiquement en mode fallback (HTML) si Puppeteer échoue.

## 📊 Comparaison HTML vs PDF

| Caractéristique | HTML | PDF |
|----------------|------|-----|
| Taille fichier | ~50 KB | ~100 KB |
| Compatibilité | Tous navigateurs | Tous lecteurs PDF |
| Impression | Bonne | Excellente |
| Professionnel | Bon | Excellent |
| Éditable | Oui | Non |

## ✅ Test de fonctionnement

Pour tester que le PDF fonctionne :

1. Démarrez le serveur : `npm start`
2. Connectez-vous à l'admin
3. Allez dans "Créer Devis"
4. Remplissez un devis de test
5. Cliquez sur "Envoyer"
6. Vérifiez l'email reçu
7. Ouvrez la pièce jointe → doit être un PDF

## 🔐 Sécurité

Puppeteer est lancé en mode sandbox désactivé pour la compatibilité :
```javascript
args: ['--no-sandbox', '--disable-setuid-sandbox']
```

Ceci est sûr dans un environnement contrôlé (votre serveur).

## 💡 Alternatives

Si Puppeteer pose problème, vous pouvez utiliser :

- **html-pdf-node** : Plus léger mais moins de fonctionnalités
- **pdfkit** : Génération programmatique (pas de HTML)
- **wkhtmltopdf** : Outil externe à installer

## 📞 Support

En cas de problème :
1. Vérifiez les logs du serveur
2. Testez l'installation : `node -e "require('puppeteer')"`
3. Consultez la documentation Puppeteer : https://pptr.dev/

---

**Date :** 15 avril 2026
**Version :** 1.0
