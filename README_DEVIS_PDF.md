# 📄 Système de Devis PDF - BackZo

## 🎯 Fonctionnalités

✅ Génération de devis professionnels au style identique aux factures  
✅ Conversion automatique HTML → PDF avec Puppeteer  
✅ Envoi par email avec pièce jointe PDF  
✅ Impression haute qualité  
✅ Fallback automatique vers HTML si erreur  

## 🚀 Installation rapide

### 1. Installer Puppeteer

**Windows :**
```
Double-cliquez sur : install-puppeteer.bat
```

**Ligne de commande :**
```bash
npm install puppeteer
```

### 2. Démarrer le serveur

```bash
npm start
```

## 📖 Utilisation

### Créer et envoyer un devis

1. Connectez-vous à l'interface admin
2. Allez dans l'onglet **"Créer Devis"**
3. Remplissez les informations :
   - Nom/Société du client
   - Email du client
   - Téléphone et adresse (optionnel)
   - Date de validité (optionnel)
4. Ajoutez les lignes du devis :
   - Désignation
   - Quantité
   - Prix unitaire
5. Ajoutez une remise si nécessaire
6. Ajoutez des notes/conditions
7. Cliquez sur **"Envoyer"** 📧

→ Le client reçoit un email avec le devis en PDF !

### Imprimer un devis

1. Remplissez le formulaire de devis
2. Cliquez sur **"Imprimer"** 🖨️
3. Le devis s'ouvre dans une nouvelle fenêtre
4. Utilisez Ctrl+P pour imprimer

### Télécharger un devis en PDF

1. Remplissez le formulaire de devis
2. Cliquez sur **"PDF"** 📥
3. Le devis s'ouvre dans une nouvelle fenêtre
4. Utilisez Ctrl+P puis "Enregistrer au format PDF"

### Renvoyer un devis depuis l'historique

1. Allez dans l'onglet **"Historique"**
2. Trouvez le devis à renvoyer
3. Cliquez sur **"📧 Renvoyer"**

## 📋 Exemple de devis généré

Le PDF contient :
- En-tête BackZo avec logo
- Numéro de devis (DEV-XXXX)
- Date d'émission
- Date de validité
- Informations vendeur (BackZo)
- Informations client
- Tableau détaillé des lignes
- Sous-total
- Remise (si applicable)
- Total TTC
- Notes et conditions
- Informations légales

## 🎨 Style

Le devis utilise le même style professionnel que les factures :
- Couleur verte signature (#b8ff57)
- Typographie Barlow Condensed
- Mise en page claire et aérée
- Tableaux avec bordures
- Sections bien délimitées

## ⚙️ Configuration

### Variables d'environnement requises

Dans votre fichier `.env` :

```env
# Configuration email (obligatoire pour l'envoi)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
EMAIL_FROM=team@backzo.eu
```

### Sans configuration email

Le système fonctionne même sans email configuré :
- ✅ Impression : Fonctionne
- ✅ Téléchargement PDF : Fonctionne
- ❌ Envoi email : Désactivé (message d'information)

## 🔧 Dépannage

### Puppeteer ne s'installe pas

**Erreur de permissions :**
```bash
npm install puppeteer --legacy-peer-deps
```

**Sur Linux, installer les dépendances système :**
```bash
sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgbm1 libasound2
```

### Le PDF n'est pas généré

Vérifiez les logs du serveur :
```bash
npm start
```

Vous devriez voir :
```
Génération du PDF avec Puppeteer...
✓ PDF généré avec succès
```

Si vous voyez une erreur, le système utilisera automatiquement le format HTML.

### L'email n'est pas envoyé

1. Vérifiez que les variables d'environnement sont configurées
2. Vérifiez les logs du serveur
3. Testez la configuration email : `npm run test-email`

## 📚 Documentation complète

- **Guide complet :** `DOCS/REFONTE_SYSTEME_DEVIS.md`
- **Installation PDF :** `DOCS/INSTALLATION_PDF_DEVIS.md`
- **Résumé technique :** `DOCS/RESUME_MODIFICATIONS_DEVIS_PDF.md`

## 🌐 Déploiement

### Serveur local / VPS
✅ Fonctionne directement avec Puppeteer

### Vercel
⚠️ Nécessite `chrome-aws-lambda` :
```bash
npm install chrome-aws-lambda puppeteer-core
```

Voir `DOCS/INSTALLATION_PDF_DEVIS.md` pour la configuration Vercel.

## 📊 Taille des fichiers

| Type | Taille moyenne |
|------|----------------|
| PDF généré | ~100 KB |
| Puppeteer (avec Chromium) | ~300 MB |

## 🎯 Prochaines étapes

1. ✅ Installer Puppeteer : `npm install puppeteer`
2. ✅ Configurer les emails dans `.env`
3. ✅ Démarrer le serveur : `npm start`
4. ✅ Tester la création d'un devis
5. ✅ Vérifier la réception de l'email avec PDF

## 💡 Conseils

- **Testez d'abord en local** avant de déployer
- **Gardez une copie** des devis importants
- **Utilisez des emails de test** pour vérifier le rendu
- **Vérifiez les logs** en cas de problème

## 🆘 Besoin d'aide ?

1. Consultez les logs du serveur
2. Lisez la documentation dans `DOCS/`
3. Vérifiez que Puppeteer est installé : `node -e "require('puppeteer')"`

## ✅ Checklist de vérification

- [ ] Puppeteer installé
- [ ] Variables d'environnement configurées
- [ ] Serveur démarré sans erreur
- [ ] Devis de test créé
- [ ] PDF généré correctement
- [ ] Email reçu avec pièce jointe PDF

---

**Version :** 2.0  
**Date :** 15 avril 2026  
**Statut :** ✅ Prêt à l'emploi  

🎉 **Votre système de devis PDF est prêt !**
