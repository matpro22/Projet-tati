// Script de test pour les endpoints email
// Usage: node test-email-endpoints.js

const API_URL = 'http://localhost:3000/api';

async function testContactEndpoint() {
  console.log('\n📧 Test 1: Endpoint /api/contact');
  console.log('─'.repeat(50));
  
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test depuis script',
        message: 'Ceci est un message de test'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Succès:', data.message);
    } else {
      console.log('❌ Erreur:', data.error);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
}

async function testQuoteEndpoint() {
  console.log('\n📄 Test 2: Endpoint /api/send-quote');
  console.log('─'.repeat(50));
  
  try {
    const response = await fetch(`${API_URL}/send-quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientEmail: 'client@example.com',
        clientName: 'Jean Dupont',
        quoteId: 'DEV-0001',
        total: '150,00 €',
        items: '<p>Pack Club 30 patchs</p>'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Succès:', data.message);
    } else {
      console.log('❌ Erreur:', data.error);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
}

async function testOrderNotificationEndpoint() {
  console.log('\n📦 Test 3: Endpoint /api/send-order-notification');
  console.log('─'.repeat(50));
  
  try {
    const response = await fetch(`${API_URL}/send-order-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerEmail: 'customer@example.com',
        customerName: 'Marie Martin',
        orderId: 'CMD-0001',
        status: 'shipped'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Succès:', data.message);
    } else {
      console.log('❌ Erreur:', data.error);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
}

async function runTests() {
  console.log('\n🧪 TEST DES ENDPOINTS EMAIL');
  console.log('═'.repeat(50));
  console.log('⚠️  Assurez-vous que le serveur tourne sur le port 3000');
  console.log('   Commande: node server.js\n');
  
  await testContactEndpoint();
  await testQuoteEndpoint();
  await testOrderNotificationEndpoint();
  
  console.log('\n' + '═'.repeat(50));
  console.log('✨ Tests terminés\n');
  console.log('💡 Note: Si l\'email n\'est pas configuré dans .env,');
  console.log('   les endpoints fonctionneront quand même en mode dégradé');
  console.log('   (pas d\'email envoyé mais pas d\'erreur non plus)\n');
}

runTests();
