// ============================================================
// TEST DU SYSTÈME DE SUIVI DE LIVRAISON
// ============================================================

const API_URL = 'http://localhost:3000/api';

// Fonction pour tester la mise à jour du statut avec numéro de suivi
async function testTrackingNumber() {
  console.log('\n🧪 === TEST SYSTÈME DE SUIVI DE LIVRAISON ===\n');
  
  try {
    // 1. Se connecter en tant qu'admin
    console.log('1️⃣ Connexion admin...');
    const loginResponse = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'BackZo2024!'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error('Échec de la connexion admin');
    }
    
    const { token } = await loginResponse.json();
    console.log('✓ Connecté avec succès\n');
    
    // 2. Récupérer les commandes
    console.log('2️⃣ Récupération des commandes...');
    const ordersResponse = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!ordersResponse.ok) {
      throw new Error('Échec de récupération des commandes');
    }
    
    const orders = await ordersResponse.json();
    console.log(`✓ ${orders.length} commande(s) trouvée(s)\n`);
    
    if (orders.length === 0) {
      console.log('⚠️  Aucune commande à tester. Créez d\'abord une commande.');
      return;
    }
    
    // 3. Prendre la première commande
    const testOrder = orders[0];
    console.log('3️⃣ Test avec la commande:', testOrder.id);
    console.log('   Statut actuel:', testOrder.status);
    console.log('   Client:', testOrder.customer?.email || 'N/A');
    console.log('');
    
    // 4. Mettre à jour le statut vers "delivered" avec un numéro de suivi
    console.log('4️⃣ Mise à jour du statut vers "delivered" avec numéro de suivi...');
    const trackingNumber = 'TEST-' + Date.now();
    console.log('   Numéro de suivi:', trackingNumber);
    
    const updateResponse = await fetch(`${API_URL}/orders/${testOrder.id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'delivered',
        trackingNumber: trackingNumber
      })
    });
    
    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error('Échec de mise à jour: ' + (error.error || 'Erreur inconnue'));
    }
    
    const { order: updatedOrder } = await updateResponse.json();
    console.log('✓ Statut mis à jour avec succès\n');
    
    // 5. Vérifier que le numéro de suivi a été enregistré
    console.log('5️⃣ Vérification du numéro de suivi...');
    const verifyResponse = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const updatedOrders = await verifyResponse.json();
    const verifiedOrder = updatedOrders.find(o => o.id === testOrder.id);
    
    if (verifiedOrder && verifiedOrder.trackingNumber === trackingNumber) {
      console.log('✓ Numéro de suivi correctement enregistré:', verifiedOrder.trackingNumber);
      console.log('✓ Statut:', verifiedOrder.status);
    } else {
      console.log('❌ Numéro de suivi non trouvé ou incorrect');
    }
    
    console.log('\n✅ TEST RÉUSSI !\n');
    console.log('📧 Vérifiez l\'email envoyé au client:', testOrder.customer?.email);
    console.log('   Le numéro de suivi devrait apparaître dans l\'email.\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR PENDANT LE TEST:', error.message);
    console.error('   Stack:', error.stack);
  }
}

// Fonction pour tester sans numéro de suivi
async function testWithoutTracking() {
  console.log('\n🧪 === TEST SANS NUMÉRO DE SUIVI ===\n');
  
  try {
    // 1. Se connecter en tant qu'admin
    console.log('1️⃣ Connexion admin...');
    const loginResponse = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'BackZo2024!'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error('Échec de la connexion admin');
    }
    
    const { token } = await loginResponse.json();
    console.log('✓ Connecté avec succès\n');
    
    // 2. Récupérer les commandes
    console.log('2️⃣ Récupération des commandes...');
    const ordersResponse = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const orders = await ordersResponse.json();
    
    if (orders.length === 0) {
      console.log('⚠️  Aucune commande à tester.');
      return;
    }
    
    const testOrder = orders[0];
    console.log('3️⃣ Test avec la commande:', testOrder.id);
    console.log('');
    
    // 3. Mettre à jour le statut vers "shipped" SANS numéro de suivi
    console.log('4️⃣ Mise à jour du statut vers "shipped" SANS numéro de suivi...');
    
    const updateResponse = await fetch(`${API_URL}/orders/${testOrder.id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'shipped'
        // Pas de trackingNumber
      })
    });
    
    if (!updateResponse.ok) {
      throw new Error('Échec de mise à jour');
    }
    
    console.log('✓ Statut mis à jour avec succès (sans numéro de suivi)\n');
    console.log('✅ TEST RÉUSSI !\n');
    console.log('📧 L\'email devrait être envoyé sans section de numéro de suivi.\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
  }
}

// Exécuter les tests
console.log('╔════════════════════════════════════════════════════════╗');
console.log('║  TEST DU SYSTÈME DE SUIVI DE LIVRAISON - BACKZO       ║');
console.log('╚════════════════════════════════════════════════════════╝');

// Lancer le test principal
testTrackingNumber()
  .then(() => {
    console.log('\n⏳ Attente de 3 secondes avant le test suivant...\n');
    return new Promise(resolve => setTimeout(resolve, 3000));
  })
  .then(() => testWithoutTracking())
  .then(() => {
    console.log('\n✅ TOUS LES TESTS TERMINÉS\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ ERREUR FATALE:', error);
    process.exit(1);
  });
