# ⚡ Démarrage Rapide BackZo

Guide ultra-rapide pour démarrer avec BackZo en 5 minutes.

## 🎯 Choix du mode

### Mode 1 : Site uniquement (FACILE) ⭐ Recommandé pour débuter

**Avantages** :
- ✅ Aucune installation
- ✅ Fonctionne immédiatement
- ✅ Parfait pour tester

**Inconvénients** :
- ⚠️ Paiements en mode "demo"
- ⚠️ Données dans le navigateur uniquement

**Comment faire** :
1. Double-cliquez sur `Untitled-1.html`
2. C'est tout ! 🎉

### Mode 2 : Site + Backend (COMPLET)

**Avantages** :
- ✅ Paiements Stripe réels
- ✅ Gestion complète des produits
- ✅ Données persistantes

**Inconvénients** :
- ⚠️ Nécessite Node.js
- ⚠️ Configuration Stripe requise

**Comment faire** :
1. Installez Node.js depuis [nodejs.org](https://nodejs.org)
2. Ouvrez un terminal dans le dossier du projet
3. Exécutez :
   ```bash
   npm install
   cp .env.example .env
   ```
4. Éditez `.env` et ajoutez votre clé Stripe :
   ```env
   STRIPE_SECRET_KEY=sk_test_VOTRE_CLE
   ```
5. Démarrez le serveur :
   ```bash
   npm start
   ```
6. Ouvrez `Untitled-1.html` et changez :
   ```javascript
   const USE_BACKEND = true;
   ```
7. Ouvrez le site et configurez la clé publique Stripe dans l'admin

## 🔑 Accès Admin

1. Cliquez sur le petit point (·) dans le footer du site
2. Connectez-vous :
   - **Utilisateur** : `admin`
   - **Mot de passe** : `BackZo2024!`

## 💳 Tester un paiement

1. Ajoutez un produit au panier
2. Cliquez sur "Passer commande"
3. Remplissez le formulaire
4. Utilisez cette carte de test :
   - **Numéro** : `4242 4242 4242 4242`
   - **Date** : N'importe quelle date future (ex: 12/25)
   - **CVV** : N'importe quel 3 chiffres (ex: 123)
5. Validez !

## 📚 Besoin d'aide ?

- **Guide complet** : Lisez [README.md](README.md)
- **Backend** : Lisez [GUIDE_BACKEND.md](GUIDE_BACKEND.md)
- **Stripe** : Lisez [STRIPE_INTEGRATION.md](STRIPE_INTEGRATION.md)

## 🎨 Personnaliser

### Changer les couleurs

Ouvrez `Untitled-1.html` et modifiez les variables CSS :

```css
:root {
  --green: #b8ff57;  /* Changez cette couleur */
}
```

### Ajouter des produits (mode local)

Cherchez `const PRODUCTS = [` dans `Untitled-1.html` et ajoutez :

```javascript
{
  id: 'mon-produit',
  name: 'Mon Produit',
  price: 20,
  category: 'particuliers',
  desc: 'Description',
  stock: 100,
  badge: 'Nouveau'
}
```

### Ajouter des produits (mode backend)

1. Connectez-vous à l'admin
2. Allez dans **Produits**
3. Cliquez sur **+ Ajouter**
4. Remplissez le formulaire

## ⚠️ Problèmes courants

### "Le site ne s'affiche pas"
- Vérifiez que vous avez bien ouvert `Untitled-1.html`
- Vérifiez que les images `1.jpg` et `2.jpg` sont présentes

### "Backend non accessible"
- Vérifiez que le serveur est démarré : `npm start`
- Vérifiez que `USE_BACKEND = true` dans le HTML

### "Erreur Stripe"
- Vérifiez que votre clé est correcte dans `.env`
- Vérifiez que vous avez configuré la clé publique dans l'admin

## 🚀 Prêt pour la production ?

1. **Obtenez vos clés Stripe live** sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Changez le mot de passe admin** dans le code
3. **Activez HTTPS** (obligatoire pour Stripe)
4. **Déployez** sur Heroku, Vercel, ou Railway

---

**Besoin d'aide ?** Consultez [README.md](README.md) pour plus de détails !
