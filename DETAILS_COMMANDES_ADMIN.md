# ✅ DÉTAILS DES COMMANDES ET IMPRESSION DE FACTURES

## Nouvelles fonctionnalités ajoutées

### 1. Bouton "👁️ Détails" dans le tableau des commandes
Un nouveau bouton a été ajouté dans chaque ligne du tableau des commandes pour afficher les détails complets.

### 2. Modal de détails de commande
Une modal complète affiche :
- **Informations générales** : N° commande, date, statut, montant total
- **Informations client** : Nom, email, téléphone, adresse complète
- **Articles commandés** : Tableau détaillé avec :
  - Nom de l'article
  - Options (taille, couleur, noms personnalisés)
  - Quantité
  - Prix unitaire
  - Total par article
- **Récapitulatif** : Sous-total, frais de livraison, total TTC
- **Notes** : Si des notes ont été ajoutées à la commande

### 3. Bouton "🖨️ Imprimer facture"
Un bouton dans la modal permet d'imprimer une facture professionnelle avec :
- En-tête BackZo avec logo
- Informations vendeur et client
- Détail complet des articles
- Totaux (sous-total, livraison, TTC)
- Informations légales
- Design optimisé pour l'impression

## Comment utiliser

### Voir les détails d'une commande
1. Allez dans l'admin (page Admin)
2. Cliquez sur l'onglet "Commandes"
3. Cliquez sur le bouton **"👁️ Détails"** dans la ligne de la commande
4. La modal s'ouvre avec tous les détails

### Imprimer une facture
1. Ouvrez les détails d'une commande (bouton "👁️ Détails")
2. Cliquez sur le bouton **"🖨️ Imprimer facture"** en bas de la modal
3. Une nouvelle fenêtre s'ouvre avec la facture formatée
4. La boîte de dialogue d'impression s'ouvre automatiquement
5. Choisissez votre imprimante ou "Enregistrer au format PDF"

### Autres actions disponibles
- **📧 Email** : Envoyer un email de mise à jour au client
- **🗑 Suppr.** : Supprimer la commande
- **Changer le statut** : Menu déroulant pour modifier le statut de la commande

## Structure de la facture

La facture imprimée contient :

### En-tête
- Logo BackZo
- Numéro de facture
- Date de la commande
- Statut de la commande

### Informations
- **Vendeur** : BackZo, Laurie SEABRA DA SILVA, email, SIRET
- **Client** : Nom, email, téléphone, adresse complète

### Détail des articles
Tableau avec :
- Nom de l'article
- Options (taille, couleur, noms personnalisés)
- Quantité
- Prix unitaire
- Total par ligne

### Totaux
- Sous-total
- Frais de livraison
- Total TTC (en surbrillance verte)

### Pied de page
- Informations légales
- Mention TVA non applicable
- Message de remerciement

## Personnalisation

### Modifier les informations vendeur
Dans la fonction `printInvoice()`, ligne ~2900, modifiez :
```javascript
<div class="info-row">SIRET: [À compléter]</div>
```

### Ajouter des informations légales
Dans la section `company-info`, ajoutez vos informations :
```javascript
<div>BackZo - Laurie SEABRA DA SILVA</div>
<div>Email: team@backzo.eu</div>
<div>SIRET: [Votre SIRET]</div>
<div>TVA non applicable, article 293 B du CGI</div>
```

## Format d'impression

La facture est optimisée pour :
- Format A4
- Impression couleur ou noir et blanc
- Export PDF
- Marges standard

## Notes techniques

### Données affichées
Les détails proviennent de l'objet `order` qui contient :
- `id` : Numéro de commande
- `date` : Date de la commande
- `status` : Statut (pending, processing, shipped, delivered, cancelled)
- `customer` : Informations client (firstName, lastName, email, phone, address, postalCode, city)
- `items` : Tableau des articles avec options
- `subtotal` : Sous-total
- `shipping` : Frais de livraison
- `total` : Total TTC
- `notes` : Notes éventuelles

### Affichage des options
Les options des articles (taille, couleur, noms) sont automatiquement détectées et affichées :
- Taille S ou L
- Couleur du flocage
- Liste des noms personnalisés avec quantités

### Compatibilité
- Fonctionne sur tous les navigateurs modernes
- Compatible avec l'impression PDF
- Design responsive pour l'écran et l'impression

## Exemple de commande

Une commande typique affichera :
```
Article: Flocage Amovible S
Options:
  Taille: S
  Couleur: Blanc
  Noms:
    • DUPONT (x2)
    • MARTIN (x1)
Quantité: 3
Prix unitaire: 13,00 €
Total: 39,00 €
```

## Améliorations futures possibles

- Export PDF automatique
- Envoi de la facture par email
- Numérotation automatique des factures
- Archivage des factures
- Génération de factures en masse
