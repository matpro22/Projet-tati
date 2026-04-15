// Script de test de connexion au backend
// Usage: node test-backend-connection.js

const BACKEND_URL = 'https://projet-tati.vercel.app';

async function testBackendConnection() {
  console.log('\n🔍 TEST DE CONNEXION AU BACKEND');
  console.log('═'.repeat(60));
  console.log(`Backend URL: ${BACKEND_URL}\n`);

  // Test 1: Health check
  console.log('📡 Test 1: Health Check');
  console.log('─'.repeat(60));
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend accessible');
      console.log('   Réponse:', JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ Erreur HTTP ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }

  // Test 2: Products endpoint
  console.log('\n📦 Test 2: Endpoint /api/products');
  console.log('─'.repeat(60));
  try {
    const response = await fetch(`${BACKEND_URL}/api/products`);
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${data.length} produits trouvés`);
      if (data.length > 0) {
        console.log('   Premier produit:', data[0].name);
      }
    } else {
      console.log(`❌ Erreur HTTP ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }

  // Test 3: Settings endpoint
  console.log('\n⚙️  Test 3: Endpoint /api/settings');
  console.log('─'.repeat(60));
  try {
    const response = await fetch(`${BACKEND_URL}/api/settings`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Paramètres récupérés');
      console.log('   Frais de port:', data.shipping, '€');
      console.log('   Livraison gratuite à partir de:', data.freeShippingFrom, '€');
    } else {
      console.log(`❌ Erreur HTTP ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }

  // Test 4: Contact endpoint (POST)
  console.log('\n📧 Test 4: Endpoint /api/contact (POST)');
  console.log('─'.repeat(60));
  try {
    const response = await fetch(`${BACKEND_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Script',
        email: 'test@example.com',
        subject: 'Test de connexion',
        message: 'Ceci est un test automatique'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Endpoint contact fonctionnel');
      console.log('   Message:', data.message);
    } else {
      const data = await response.json();
      console.log(`❌ Erreur HTTP ${response.status}`);
      console.log('   Erreur:', data.error);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }

  // Test 5: CORS
  console.log('\n🔐 Test 5: Configuration CORS');
  console.log('─'.repeat(60));
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'OPTIONS'
    });
    const corsHeader = response.headers.get('access-control-allow-origin');
    if (corsHeader) {
      console.log('✅ CORS configuré');
      console.log('   Allow-Origin:', corsHeader);
    } else {
      console.log('⚠️  En-tête CORS non trouvé');
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✨ Tests terminés\n');
}

// Test depuis le navigateur
function testFromBrowser() {
  console.log('\n🌐 TEST DEPUIS LE NAVIGATEUR');
  console.log('═'.repeat(60));
  console.log('Copiez-collez ce code dans la console du navigateur sur backzo.eu:\n');
  
  const browserTest = `
// Test de connexion au backend
const API_URL = 'https://projet-tati.vercel.app/api';

fetch(\`\${API_URL}/health\`)
  .then(res => res.json())
  .then(data => console.log('✅ Backend accessible:', data))
  .catch(err => console.error('❌ Erreur:', err));

fetch(\`\${API_URL}/contact\`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Browser',
    email: 'test@example.com',
    message: 'Test depuis le navigateur'
  })
})
  .then(res => res.json())
  .then(data => console.log('✅ Contact endpoint:', data))
  .catch(err => console.error('❌ Erreur:', err));
  `.trim();
  
  console.log(browserTest);
  console.log('\n' + '═'.repeat(60) + '\n');
}

// Exécuter les tests
testBackendConnection().then(() => {
  testFromBrowser();
});
