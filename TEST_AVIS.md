# 🧪 Tests du Système d'Avis Clients

## Checklist de tests

### ✅ Tests Backend (API)

#### 1. Récupération des avis publics
```bash
curl http://localhost:3000/api/reviews
```
**Résultat attendu** : Liste des avis approuvés (tableau JSON)

#### 2. Soumission d'un nouvel avis
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "BZ-1234567890",
    "email": "client@example.com",
    "rating": 5,
    "comment": "Excellent service !",
    "customerName": "Jean D."
  }'
```
**Résultat attendu** : Message de succès + avis créé

#### 3. Récupération des avis admin (avec token)
```bash
curl http://localhost:3000/api/admin/reviews \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```
**Résultat attendu** : Liste de tous les avis (approuvés et en attente)

#### 4. Approbation d'un avis
```bash
curl -X PUT http://localhost:3000/api/admin/reviews/REV-1234567890/approve \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```
**Résultat attendu** : Message de succès

#### 5. Suppression d'un avis
```bash
curl -X DELETE http://localhost:3000/api/admin/reviews/REV-1234567890 \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```
**Résultat attendu** : Message de succès

---

### ✅ Tests Frontend

#### 1. Page de soumission d'avis
- [ ] Ouvrir `/review.html?orderId=BZ-TEST&email=test@example.com`
- [ ] Vérifier que le formulaire s'affiche correctement
- [ ] Cliquer sur les étoiles (1 à 5)
- [ ] Vérifier que le label change ("⭐ Décevant" à "⭐⭐⭐⭐⭐ Excellent")
- [ ] Taper un commentaire
- [ ] Vérifier le compteur de caractères (0/500)
- [ ] Soumettre le formulaire
- [ ] Vérifier le message de succès

#### 2. Affichage sur la page d'accueil
- [ ] Ouvrir la page d'accueil
- [ ] Scroller jusqu'à la section "ILS NOUS FONT CONFIANCE"
- [ ] Vérifier que les avis approuvés s'affichent
- [ ] Vérifier le design des cartes
- [ ] Vérifier les étoiles
- [ ] Vérifier le badge "✓ Achat vérifié"
- [ ] Tester le hover sur les cartes

#### 3. Panel d'administration
- [ ] Se connecter au panel admin
- [ ] Cliquer sur l'onglet "⭐ Avis clients"
- [ ] Vérifier les statistiques (Total, En attente, Approuvés, Note moyenne)
- [ ] Vérifier la liste des avis
- [ ] Cliquer sur "Approuver" pour un avis en attente
- [ ] Vérifier que l'avis passe à "Approuvé"
- [ ] Cliquer sur "Supprimer" pour un avis
- [ ] Confirmer la suppression
- [ ] Vérifier que l'avis disparaît

#### 4. Paramètres des avis
- [ ] Aller dans l'onglet "Avis clients"
- [ ] Modifier "Approbation automatique" (activer/désactiver)
- [ ] Modifier "Afficher sur la page d'accueil"
- [ ] Modifier "Note minimale affichée"
- [ ] Modifier "Nombre max d'avis affichés"
- [ ] Cliquer sur "Enregistrer les paramètres"
- [ ] Vérifier le message de succès
- [ ] Recharger la page
- [ ] Vérifier que les paramètres sont sauvegardés

---

### ✅ Tests Email

#### 1. Email de livraison avec lien d'avis
- [ ] Créer une commande de test
- [ ] Passer la commande au statut "Livrée"
- [ ] Vérifier que l'email est envoyé au client
- [ ] Ouvrir l'email
- [ ] Vérifier le bouton "⭐ Donner mon avis"
- [ ] Cliquer sur le bouton
- [ ] Vérifier que le lien contient orderId et email

#### 2. Email de notification admin
- [ ] Soumettre un nouvel avis
- [ ] Vérifier que l'admin reçoit un email
- [ ] Vérifier le contenu (note, commentaire, commande)
- [ ] Vérifier le lien vers le panel admin (si implémenté)

---

### ✅ Tests de sécurité

#### 1. Validation des données
- [ ] Essayer de soumettre un avis sans note
- [ ] Essayer de soumettre un avis avec une note invalide (0, 6, -1)
- [ ] Essayer de soumettre un avis avec un email invalide
- [ ] Essayer de soumettre un avis pour une commande inexistante
- [ ] Essayer de soumettre deux avis pour la même commande

#### 2. Authentification admin
- [ ] Essayer d'accéder à `/api/admin/reviews` sans token
- [ ] Essayer d'approuver un avis sans token
- [ ] Essayer de supprimer un avis sans token
- [ ] Vérifier que les erreurs 401/403 sont retournées

#### 3. Injection XSS
- [ ] Soumettre un avis avec du HTML dans le commentaire
- [ ] Vérifier que le HTML est échappé à l'affichage
- [ ] Soumettre un avis avec du JavaScript
- [ ] Vérifier qu'il n'est pas exécuté

---

### ✅ Tests de performance

#### 1. Chargement des avis
- [ ] Créer 50+ avis de test
- [ ] Charger la page d'accueil
- [ ] Vérifier le temps de chargement (< 2 secondes)
- [ ] Vérifier que seuls 6 avis sont affichés

#### 2. Panel admin
- [ ] Charger l'onglet avis avec 100+ avis
- [ ] Vérifier le temps de chargement (< 3 secondes)
- [ ] Vérifier que le tableau est scrollable
- [ ] Tester l'actualisation

---

### ✅ Tests responsive

#### 1. Mobile (< 768px)
- [ ] Ouvrir `/review.html` sur mobile
- [ ] Vérifier que le formulaire est lisible
- [ ] Vérifier que les étoiles sont cliquables
- [ ] Soumettre un avis
- [ ] Ouvrir la page d'accueil
- [ ] Vérifier que les cartes d'avis s'empilent

#### 2. Tablette (768px - 1024px)
- [ ] Vérifier l'affichage des avis (2 colonnes)
- [ ] Vérifier le panel admin
- [ ] Vérifier que les tableaux sont scrollables

#### 3. Desktop (> 1024px)
- [ ] Vérifier l'affichage des avis (3 colonnes)
- [ ] Vérifier le panel admin
- [ ] Vérifier tous les contrôles

---

### ✅ Tests d'accessibilité

#### 1. Navigation au clavier
- [ ] Naviguer dans le formulaire avec Tab
- [ ] Sélectionner une étoile avec Entrée
- [ ] Soumettre avec Entrée
- [ ] Naviguer dans le panel admin avec Tab

#### 2. Lecteur d'écran
- [ ] Tester avec NVDA/JAWS
- [ ] Vérifier les labels ARIA
- [ ] Vérifier les messages d'erreur
- [ ] Vérifier les boutons

#### 3. Contraste
- [ ] Activer le mode contraste élevé
- [ ] Vérifier la lisibilité
- [ ] Vérifier les couleurs des boutons

---

### ✅ Tests de compatibilité navigateur

#### Chrome
- [ ] Formulaire d'avis
- [ ] Affichage homepage
- [ ] Panel admin

#### Firefox
- [ ] Formulaire d'avis
- [ ] Affichage homepage
- [ ] Panel admin

#### Safari
- [ ] Formulaire d'avis
- [ ] Affichage homepage
- [ ] Panel admin

#### Edge
- [ ] Formulaire d'avis
- [ ] Affichage homepage
- [ ] Panel admin

---

## Scénarios de test complets

### Scénario 1 : Parcours client complet
1. Client passe une commande
2. Admin marque la commande comme "Livrée"
3. Client reçoit l'email de livraison
4. Client clique sur "Donner mon avis"
5. Client remplit le formulaire (5 étoiles + commentaire)
6. Client soumet l'avis
7. Admin reçoit une notification
8. Admin se connecte et approuve l'avis
9. L'avis apparaît sur la page d'accueil

### Scénario 2 : Modération d'avis négatif
1. Client soumet un avis 2 étoiles avec commentaire négatif
2. Admin reçoit la notification
3. Admin lit l'avis
4. Admin décide de le publier (transparence)
5. L'avis apparaît sur la page d'accueil
6. Admin contacte le client pour résoudre le problème

### Scénario 3 : Gestion de spam
1. Quelqu'un essaie de soumettre un avis sans commande
2. Le système rejette la soumission
3. Message d'erreur : "Commande non trouvée"
4. Aucun avis n'est créé

---

## Bugs connus et limitations

### Bugs à corriger
- [ ] Aucun bug connu pour le moment

### Limitations actuelles
- Un seul avis par commande
- Pas de réponse de l'admin aux avis
- Pas de photos dans les avis
- Pas d'export CSV
- Pas de statistiques avancées

### Améliorations futures
- [ ] Système de réponse admin
- [ ] Upload de photos
- [ ] Export des avis
- [ ] Graphiques de statistiques
- [ ] Filtres avancés
- [ ] Traduction automatique

---

## Résultats des tests

### Date : _______________
### Testeur : _______________

| Test | Statut | Notes |
|------|--------|-------|
| API - Récupération avis | ⬜ | |
| API - Soumission avis | ⬜ | |
| API - Approbation | ⬜ | |
| Frontend - Formulaire | ⬜ | |
| Frontend - Homepage | ⬜ | |
| Frontend - Admin | ⬜ | |
| Email - Livraison | ⬜ | |
| Email - Notification | ⬜ | |
| Sécurité - Validation | ⬜ | |
| Sécurité - Auth | ⬜ | |
| Performance | ⬜ | |
| Responsive | ⬜ | |
| Accessibilité | ⬜ | |

**Légende** : ✅ Réussi | ❌ Échoué | ⚠️ Partiel | ⬜ Non testé

---

## Notes de test

```
[Espace pour vos notes]
```

---

**BackZo** — Tests du système d'avis clients
