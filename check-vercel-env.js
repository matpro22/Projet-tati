// ============================================================
// VÉRIFICATION VARIABLES D'ENVIRONNEMENT
// ============================================================
// Ce script vérifie que toutes les variables nécessaires sont définies
// Usage: node check-vercel-env.js

require('dotenv').config();

console.log('🔍 Vérification des variables d\'environnement\n');

const requiredVars = {
  'STRIPE_SECRET_KEY': {
    value: process.env.STRIPE_SECRET_KEY,
    description: 'Clé secrète Stripe',
    startsWith: 'sk_',
    required: true
  },
  'STRIPE_PUBLIC_KEY': {
    value: process.env.STRIPE_PUBLIC_KEY,
    description: 'Clé publique Stripe',
    startsWith: 'pk_',
    required: true
  },
  'MONGODB_URI': {
    value: process.env.MONGODB_URI,
    description: 'URI MongoDB Atlas',
    startsWith: 'mongodb',
    required: true
  },
  'EMAIL_HOST': {
    value: process.env.EMAIL_HOST,
    description: 'Serveur SMTP OVH',
    expected: 'ssl0.ovh.net',
    required: false
  },
  'EMAIL_PORT': {
    value: process.env.EMAIL_PORT,
    description: 'Port SMTP',
    expected: '465',
    required: false
  },
  'EMAIL_USER': {
    value: process.env.EMAIL_USER,
    description: 'Adresse email OVH',
    contains: '@',
    required: false
  },
  'EMAIL_PASS': {
    value: process.env.EMAIL_PASS,
    description: 'Mot de passe email OVH',
    required: false
  },
  'EMAIL_FROM': {
    value: process.env.EMAIL_FROM,
    description: 'Email expéditeur',
    contains: '@',
    required: false
  },
  'EMAIL_TO': {
    value: process.env.EMAIL_TO,
    description: 'Email destinataire',
    contains: '@',
    required: false
  }
};

let hasErrors = false;
let hasWarnings = false;

Object.entries(requiredVars).forEach(([key, config]) => {
  const value = config.value;
  const isSet = value && value !== '' && !value.includes('VOTRE_');
  
  let status = '✅';
  let message = '';
  
  if (!isSet) {
    if (config.required) {
      status = '❌';
      message = 'NON DÉFINI (REQUIS)';
      hasErrors = true;
    } else {
      status = '⚠️ ';
      message = 'Non défini (optionnel)';
      hasWarnings = true;
    }
  } else {
    // Vérifications supplémentaires
    if (config.startsWith && !value.startsWith(config.startsWith)) {
      status = '❌';
      message = `Doit commencer par "${config.startsWith}"`;
      hasErrors = true;
    } else if (config.expected && value !== config.expected) {
      status = '⚠️ ';
      message = `Valeur attendue: "${config.expected}"`;
      hasWarnings = true;
    } else if (config.contains && !value.includes(config.contains)) {
      status = '❌';
      message = `Doit contenir "${config.contains}"`;
      hasErrors = true;
    } else {
      // Masquer les valeurs sensibles
      if (key.includes('PASS') || key.includes('SECRET')) {
        message = '***' + value.slice(-4);
      } else if (key.includes('KEY')) {
        message = value.substring(0, 20) + '...';
      } else {
        message = value;
      }
    }
  }
  
  console.log(`${status} ${key}`);
  console.log(`   ${config.description}: ${message}`);
  console.log('');
});

console.log('═══════════════════════════════════════════════════════\n');

if (hasErrors) {
  console.log('❌ ERREURS DÉTECTÉES');
  console.log('   Certaines variables requises sont manquantes ou invalides.');
  console.log('   Corrigez le fichier .env avant de déployer sur Vercel.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  AVERTISSEMENTS');
  console.log('   Certaines variables optionnelles ne sont pas configurées.');
  console.log('   Le formulaire de contact ne fonctionnera pas sans EMAIL_*\n');
  process.exit(0);
} else {
  console.log('✅ TOUT EST BON !');
  console.log('   Toutes les variables sont correctement configurées.');
  console.log('   N\'oubliez pas de les ajouter aussi sur Vercel:\n');
  console.log('   1. Allez sur vercel.com > Votre projet > Settings');
  console.log('   2. Cliquez sur Environment Variables');
  console.log('   3. Ajoutez toutes les variables ci-dessus');
  console.log('   4. Redéployez votre projet\n');
  process.exit(0);
}
