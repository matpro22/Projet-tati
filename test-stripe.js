// Script de test pour vérifier la configuration Stripe
require('dotenv').config();

console.log('\n🔍 Test de configuration Stripe\n');
console.log('================================\n');

// Vérifier les variables d'environnement
const secretKey = process.env.STRIPE_SECRET_KEY;
const publicKey = process.env.STRIPE_PUBLIC_KEY;

console.log('1. Variables d\'environnement:');
console.log('   STRIPE_SECRET_KEY:', secretKey ? '✓ Définie' : '❌ Manquante');
if (secretKey) {
  console.log('      Valeur:', secretKey.substring(0, 20) + '...');
  console.log('      Type:', secretKey.startsWith('sk_test_') ? 'Test' : secretKey.startsWith('sk_live_') ? 'Production' : '❌ Invalide');
}

console.log('   STRIPE_PUBLIC_KEY:', publicKey ? '✓ Définie' : '❌ Manquante');
if (publicKey) {
  console.log('      Valeur:', publicKey.substring(0, 20) + '...');
  console.log('      Type:', publicKey.startsWith('pk_test_') ? 'Test' : publicKey.startsWith('pk_live_') ? 'Production' : '❌ Invalide');
}

// Vérifier que les clés correspondent
if (secretKey && publicKey) {
  const secretType = secretKey.startsWith('sk_test_') ? 'test' : 'live';
  const publicType = publicKey.startsWith('pk_test_') ? 'test' : 'live';
  
  if (secretType === publicType) {
    console.log('\n✓ Les clés correspondent (toutes deux en mode', secretType + ')');
  } else {
    console.log('\n❌ ERREUR: Les clés ne correspondent pas !');
    console.log('   Clé secrète:', secretType);
    console.log('   Clé publique:', publicType);
  }
}

// Tester la connexion à Stripe
console.log('\n2. Test de connexion à Stripe:');
if (secretKey && secretKey.startsWith('sk_')) {
  const stripe = require('stripe')(secretKey);
  
  stripe.paymentIntents.list({ limit: 1 })
    .then(() => {
      console.log('   ✓ Connexion réussie à l\'API Stripe');
      console.log('\n✅ Configuration Stripe OK !\n');
    })
    .catch((error) => {
      console.log('   ❌ Erreur de connexion:', error.message);
      console.log('\n⚠️  Vérifiez que votre clé Stripe est valide.\n');
    });
} else {
  console.log('   ❌ Impossible de tester - Clé secrète manquante ou invalide\n');
}
