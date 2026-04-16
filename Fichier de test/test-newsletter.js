// ============================================================
// TEST SYSTÈME NEWSLETTER
// ============================================================

require('dotenv').config();
const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'BackZo2024!';

let adminToken = null;

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Connexion admin
async function loginAdmin() {
  log('\n🔐 Connexion admin...', 'cyan');
  
  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      adminToken = data.token;
      log('✓ Connexion admin réussie', 'green');
      return true;
    } else {
      log('✗ Échec connexion admin: ' + (data.error || 'Erreur inconnue'), 'red');
      return false;
    }
  } catch (error) {
    log('✗ Erreur connexion: ' + error.message, 'red');
    return false;
  }
}

// Test 1: Inscription à la newsletter
async function testSubscribe() {
  log('\n📧 Test 1: Inscription à la newsletter', 'cyan');
  
  const testEmail = `test${Date.now()}@example.com`;
  
  try {
    const response = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        name: 'Test User'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      log(`✓ Inscription réussie: ${testEmail}`, 'green');
      return testEmail;
    } else {
      log('✗ Échec inscription: ' + (data.error || 'Erreur inconnue'), 'red');
      return null;
    }
  } catch (error) {
    log('✗ Erreur inscription: ' + error.message, 'red');
    return null;
  }
}

// Test 2: Inscription avec email déjà existant
async function testDuplicateSubscribe(email) {
  log('\n📧 Test 2: Inscription avec email existant', 'cyan');
  
  try {
    const response = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        name: 'Test User 2'
      })
    });
    
    const data = await response.json();
    
    if (!response.ok && data.error) {
      log('✓ Doublon correctement détecté', 'green');
      return true;
    } else {
      log('✗ Le doublon n\'a pas été détecté', 'red');
      return false;
    }
  } catch (error) {
    log('✗ Erreur test doublon: ' + error.message, 'red');
    return false;
  }
}

// Test 3: Récupérer la liste des abonnés (admin)
async function testGetSubscribers() {
  log('\n📧 Test 3: Récupération des abonnés (admin)', 'cyan');
  
  if (!adminToken) {
    log('✗ Token admin manquant', 'red');
    return [];
  }
  
  try {
    const response = await fetch(`${API_URL}/newsletter/subscribers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok && Array.isArray(data)) {
      log(`✓ ${data.length} abonné(s) trouvé(s)`, 'green');
      
      if (data.length > 0) {
        log('\nDerniers abonnés:', 'yellow');
        data.slice(0, 3).forEach(sub => {
          log(`  - ${sub.email} (${new Date(sub.subscribedAt).toLocaleDateString()})`, 'yellow');
        });
      }
      
      return data;
    } else {
      log('✗ Échec récupération: ' + (data.error || 'Erreur inconnue'), 'red');
      return [];
    }
  } catch (error) {
    log('✗ Erreur récupération: ' + error.message, 'red');
    return [];
  }
}

// Test 4: Désinscription
async function testUnsubscribe(email) {
  log('\n📧 Test 4: Désinscription', 'cyan');
  
  try {
    const response = await fetch(`${API_URL}/newsletter/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      log(`✓ Désinscription réussie: ${email}`, 'green');
      return true;
    } else {
      log('✗ Échec désinscription: ' + (data.error || 'Erreur inconnue'), 'red');
      return false;
    }
  } catch (error) {
    log('✗ Erreur désinscription: ' + error.message, 'red');
    return false;
  }
}

// Test 5: Réabonnement après désinscription
async function testResubscribe(email) {
  log('\n📧 Test 5: Réabonnement après désinscription', 'cyan');
  
  try {
    const response = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        name: 'Test User Resubscribed'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Réabonnement réussi', 'green');
      return true;
    } else {
      log('✗ Échec réabonnement: ' + (data.error || 'Erreur inconnue'), 'red');
      return false;
    }
  } catch (error) {
    log('✗ Erreur réabonnement: ' + error.message, 'red');
    return false;
  }
}

// Test 6: Suppression d'un abonné (admin)
async function testDeleteSubscriber(email) {
  log('\n📧 Test 6: Suppression d\'un abonné (admin)', 'cyan');
  
  if (!adminToken) {
    log('✗ Token admin manquant', 'red');
    return false;
  }
  
  try {
    const response = await fetch(`${API_URL}/newsletter/subscribers/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      log(`✓ Abonné supprimé: ${email}`, 'green');
      return true;
    } else {
      log('✗ Échec suppression: ' + (data.error || 'Erreur inconnue'), 'red');
      return false;
    }
  } catch (error) {
    log('✗ Erreur suppression: ' + error.message, 'red');
    return false;
  }
}

// Test 7: Validation des emails invalides
async function testInvalidEmail() {
  log('\n📧 Test 7: Validation des emails invalides', 'cyan');
  
  const invalidEmails = [
    'invalid',
    'invalid@',
    '@invalid.com',
    'invalid@.com',
    ''
  ];
  
  let allRejected = true;
  
  for (const email of invalidEmails) {
    try {
      const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        log(`✗ Email invalide accepté: ${email}`, 'red');
        allRejected = false;
      }
    } catch (error) {
      // Erreur attendue
    }
  }
  
  if (allRejected) {
    log('✓ Tous les emails invalides ont été rejetés', 'green');
    return true;
  } else {
    log('✗ Certains emails invalides ont été acceptés', 'red');
    return false;
  }
}

// Exécuter tous les tests
async function runAllTests() {
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║   TEST SYSTÈME NEWSLETTER BACKZO      ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');
  
  log(`\nAPI URL: ${API_URL}`, 'yellow');
  
  // Connexion admin
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    log('\n✗ Impossible de continuer sans connexion admin', 'red');
    return;
  }
  
  // Test 1: Inscription
  const testEmail = await testSubscribe();
  if (!testEmail) {
    log('\n✗ Tests interrompus: échec inscription', 'red');
    return;
  }
  
  // Test 2: Doublon
  await testDuplicateSubscribe(testEmail);
  
  // Test 3: Liste des abonnés
  await testGetSubscribers();
  
  // Test 4: Désinscription
  await testUnsubscribe(testEmail);
  
  // Test 5: Réabonnement
  await testResubscribe(testEmail);
  
  // Test 6: Suppression
  await testDeleteSubscriber(testEmail);
  
  // Test 7: Emails invalides
  await testInvalidEmail();
  
  // Résumé
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║         TESTS TERMINÉS                ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');
  
  log('\n✓ Tous les tests ont été exécutés', 'green');
  log('\nConsultez les résultats ci-dessus pour vérifier le bon fonctionnement.', 'yellow');
}

// Lancer les tests
runAllTests().catch(error => {
  log('\n✗ Erreur fatale: ' + error.message, 'red');
  console.error(error);
  process.exit(1);
});
