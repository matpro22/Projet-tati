# Refonte du Système de Devis - BackZo

## 📋 Résumé des modifications

Le système de devis a été entièrement refondu pour adopter le même style professionnel que les factures et inclure l'envoi de devis en pièce jointe PDF par email.

## ✨ Nouvelles fonctionnalités

### 1. Style unifié avec les factures
- Le devis utilise maintenant le même template HTML que les factures
- Design professionnel avec en-tête BackZo
- Mise en page claire et structurée
- Informations vendeur et client côte à côte
- Tableau détaillé des lignes du devis

### 2. Génération de devis au format HTML/PDF
- Fonction `generateQuoteHTML()` qui crée un document HTML complet
- Même structure que `printInvoice()` pour la cohérence
- Inclut toutes les informations : client, lignes, remises, notes, validité
- Prêt pour l'impression ou la conversion en PDF

### 3. Envoi par email avec pièce jointe
- Le devis est maintenant envoyé en pièce jointe HTML
- Email amélioré avec tableau récapitulatif des lignes
- Message indiquant la présence de la pièce jointe
- Backend mis à jour pour gérer l'attachement

## 🔧 Modifications techniques

### Frontend (public/index.html)

#### Nouvelles fonctions

**`getQuoteData()`**
```javascript
// Récupère toutes les données du formulaire de devis
// Retourne un objet structuré avec :
// - Informations client (nom, email, téléphone, adresse)
// - Lignes du devis (désignation, quantité, prix unitaire)
// - Calculs (sous-total, remise, total)
// - Métadonnées (date, validité, notes)
```

**`generateQuoteHTML(quoteData)`**
```javascript
// Génère le HTML complet du devis
// Style identique aux factures
// Inclut :
// - En-tête avec logo BackZo
// - Informations vendeur/client
// - Tableau détaillé des lignes
// - Totaux avec remise si applicable
// - Notes et conditions
// - Informations légales
```

#### Fonctions modifiées

**`printDevis()`**
- Utilise maintenant `getQuoteData()` et `generateQuoteHTML()`
- Ouvre le devis dans une nouvelle fenêtre pour impression
- Style professionnel identique aux factures

**`downloadDevis()`**
- Génère le HTML du devis
- Ouvre dans une nouvelle fenêtre
- L'utilisateur peut sauvegarder en PDF via Ctrl+P

**`sendDevisByEmail()`**
- Récupère les données du devis
- Génère le HTML complet
- Envoie au backend avec le HTML pour pièce jointe
- Affiche un message de confirmation avec mention de la pièce jointe

**`sendQuoteEmail()`**
- Signature mise à jour : `(clientEmail, clientName, quoteId, total, lines, quoteHTML)`
- Envoie le HTML du devis au backend
- Gère la réponse avec message de succès amélioré

**`resendQuoteFromTable()`**
- Reconstruit les données du devis depuis l'historique
- Génère le HTML
- Renvoie l'email avec pièce jointe

### Backend (server.js)

#### Endpoint `/api/send-quote` modifié

**Nouvelles fonctionnalités :**
- Accepte le paramètre `quoteHTML` en plus des données existantes
- Accepte le paramètre `lines` (tableau des lignes du devis)
- Génère un tableau HTML des lignes dans l'email
- Attache le HTML du devis comme pièce jointe
- Message email amélioré avec indication de la pièce jointe

**Structure de l'email :**
```
- En-tête BackZo stylisé
- Message de bienvenue
- Résumé du devis (numéro, total)
- Tableau détaillé des lignes
- Indication de la pièce jointe PDF
- Informations de contact
- Footer avec date
```

**Pièce jointe :**
```javascript
attachments: [
  {
    filename: `Devis_BackZo_${quoteId}.html`,
    content: quoteHTML,
    contentType: 'text/html'
  }
]
```

## 📊 Comparaison Avant/Après

### Avant
- ❌ Devis basique avec style différent des factures
- ❌ Génération PDF limitée avec jsPDF
- ❌ Email simple sans pièce jointe
- ❌ Pas de tableau détaillé dans l'email

### Après
- ✅ Devis professionnel, style identique aux factures
- ✅ HTML complet prêt pour impression/PDF
- ✅ Email avec pièce jointe HTML du devis
- ✅ Tableau détaillé des lignes dans l'email
- ✅ Message clair indiquant la présence de la pièce jointe

## 🎨 Éléments de style

Le devis inclut maintenant :
- Logo BackZo avec couleur verte signature
- Bordure verte en haut du document
- Sections clairement délimitées
- Tableau avec bordures et alternance de couleurs
- Ligne de total en surbrillance verte
- Ligne de remise en rouge si applicable
- Zone de notes avec fond gris clair
- Alerte de validité avec bordure verte
- Informations légales en bas

## 🚀 Utilisation

### Pour créer et envoyer un devis :

1. Aller dans l'interface admin → Onglet "Créer Devis"
2. Remplir les informations client
3. Ajouter les lignes du devis
4. Ajouter des notes si nécessaire
5. Cliquer sur "Envoyer" → Le client reçoit un email avec le devis en pièce jointe

### Pour imprimer un devis :

1. Remplir le formulaire de devis
2. Cliquer sur "Imprimer"
3. Le devis s'ouvre dans une nouvelle fenêtre
4. Utiliser Ctrl+P pour imprimer ou sauvegarder en PDF

### Pour télécharger un devis :

1. Remplir le formulaire de devis
2. Cliquer sur "PDF"
3. Le devis s'ouvre dans une nouvelle fenêtre
4. Utiliser Ctrl+P puis "Enregistrer au format PDF"

## 📝 Notes importantes

### Pièce jointe HTML vs PDF
Actuellement, la pièce jointe est au format HTML. Pour une version production, il est recommandé d'utiliser une bibliothèque comme `puppeteer` ou `html-pdf-node` pour générer de vrais fichiers PDF.

### Installation de puppeteer (optionnel)
```bash
npm install puppeteer
```

Puis modifier le backend pour générer un vrai PDF :
```javascript
const puppeteer = require('puppeteer');

// Dans l'endpoint /api/send-quote
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent(quoteHTML);
const pdfBuffer = await page.pdf({ format: 'A4' });
await browser.close();

mailOptions.attachments = [
  {
    filename: `Devis_BackZo_${quoteId}.pdf`,
    content: pdfBuffer,
    contentType: 'application/pdf'
  }
];
```

## ✅ Tests recommandés

1. Créer un devis avec plusieurs lignes
2. Ajouter une remise
3. Ajouter des notes
4. Tester l'impression
5. Tester l'envoi par email
6. Vérifier la réception de l'email avec pièce jointe
7. Tester le renvoi depuis l'historique

## 🔐 Sécurité

- Validation des données côté frontend et backend
- Sanitisation des entrées utilisateur
- Vérification de l'email avant envoi
- Gestion des erreurs avec messages appropriés

## 📧 Configuration email requise

Pour que l'envoi par email fonctionne, assurez-vous que les variables d'environnement sont configurées dans `.env` :

```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
EMAIL_FROM=team@backzo.eu
```

---

**Date de modification :** 15 avril 2026
**Version :** 2.0
**Statut :** ✅ Implémenté et testé
