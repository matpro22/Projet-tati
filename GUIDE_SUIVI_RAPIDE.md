# 🚀 Guide Rapide - Suivi de Livraison

## Pour l'Administrateur

### Marquer une commande comme livrée

1. **Connectez-vous** au panel admin
   ```
   https://votre-site.com → Cliquez sur "Admin"
   ```

2. **Accédez aux commandes**
   ```
   Panel Admin → Onglet "Commandes"
   ```

3. **Changez le statut**
   ```
   Sélectionnez "Livré" dans le menu déroulant de la commande
   ```

4. **Saisissez le numéro de suivi**
   ```
   Une fenêtre s'ouvre automatiquement
   → Entrez le numéro de suivi (ex: 1Z999AA10123456784)
   → Ou laissez vide si vous n'en avez pas
   → Cliquez sur "Confirmer la livraison"
   ```

5. **C'est fait !** ✅
   ```
   Le client reçoit automatiquement un email avec :
   - Confirmation de livraison
   - Numéro de suivi (si fourni)
   - Lien pour laisser un avis
   ```

## Exemple Visuel

```
┌─────────────────────────────────────────────────────────┐
│  PANEL ADMIN - COMMANDES                                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  N° Commande    Client          Statut        Actions   │
│  ───────────────────────────────────────────────────────│
│  BZ-001         Jean D.         [Livré ▼]    👁️ 📧 🗑️  │
│                                                          │
│  Cliquez sur "Livré" ──────────────────┐                │
│                                         │                │
│                                         ▼                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  NUMÉRO DE SUIVI                                 │   │
│  ├──────────────────────────────────────────────────┤   │
│  │                                                  │   │
│  │  📦 La commande BZ-001 va être marquée comme    │   │
│  │  livrée.                                         │   │
│  │                                                  │   │
│  │  Numéro de suivi (optionnel)                    │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │ 1Z999AA10123456784                         │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  │                                                  │   │
│  │  💡 Laissez vide si vous n'avez pas de numéro   │   │
│  │                                                  │   │
│  │  [✓ Confirmer la livraison]  [Annuler]         │   │
│  │                                                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Email Reçu par le Client

```
┌─────────────────────────────────────────────────────────┐
│  De: team@backzo.eu                                     │
│  À: client@example.com                                  │
│  Objet: ✅ Mise à jour de votre commande BZ-001        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  BACKZO                                                  │
│  Mise à jour de commande                                │
│                                                          │
│  Bonjour Jean Dupont,                                   │
│                                                          │
│  Le statut de votre commande a été mis à jour.          │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │  Commande BZ-001                               │     │
│  │  ✅ Livrée                                     │     │
│  │                                                │     │
│  │  Votre commande a été livrée.                 │     │
│  │  Nous espérons que vous en êtes satisfait !   │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │  📦 Numéro de suivi :                          │     │
│  │                                                │     │
│  │  1Z999AA10123456784                            │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │  ⭐ Votre avis compte !                         │     │
│  │                                                │     │
│  │  Partagez votre expérience avec nous !        │     │
│  │                                                │     │
│  │  [⭐ Donner mon avis]                           │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  L'équipe BackZo                                        │
│  www.backzo.eu                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Raccourcis Clavier

- **Entrée** : Valider le numéro de suivi
- **Échap** : Annuler et fermer la fenêtre

## Questions Fréquentes

### Le numéro de suivi est-il obligatoire ?
Non, vous pouvez le laisser vide. L'email sera quand même envoyé sans cette section.

### Quel format pour le numéro de suivi ?
N'importe quel format : lettres, chiffres, tirets, etc.

### Puis-je modifier le numéro de suivi après ?
Oui, changez simplement le statut à nouveau vers "Livré" et saisissez le nouveau numéro.

### Le client peut-il suivre son colis ?
Pour l'instant, le numéro est juste affiché dans l'email. Une intégration avec les API de transporteurs est prévue pour le futur.

## Test

Pour tester la fonctionnalité :

```bash
# Démarrer le serveur
npm start

# Dans un autre terminal, lancer le test
npm run test-tracking
```

## Support

Besoin d'aide ? Contactez team@backzo.eu
