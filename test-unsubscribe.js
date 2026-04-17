// Script de test pour vérifier la désinscription newsletter
// Usage: node test-unsubscribe.js

const API_URL = 'http://localhost:3000';

console.log('🧪 Test de la désinscription newsletter\n');

// Test 1: Vérifier que la page unsubscribe.html est accessible
async function testUnsubscribePage() {
    console.log('1️⃣ Test GET /unsubscribe (page de désinscription)');
    try {
        const response = await fetch(`${API_URL}/unsubscribe?email=test@example.com`);
        
        if (response.ok) {
            console.log('   ✅ Succès - Statut:', response.status);
            console.log('   📄 Type:', response.headers.get('content-type'));
            const text = await response.text();
            const hasUnsubscribe = text.includes('Désinscription');
            const hasEmail = text.includes('email');
            console.log('   📝 Contenu "Désinscription":', hasUnsubscribe ? '✅' : '❌');
            console.log('   📧 Gestion email:', hasEmail ? '✅' : '❌');
        } else {
            console.log('   ❌ Erreur - Statut:', response.status);
        }
    } catch (error) {
        console.log('   ❌ Erreur de connexion:', error.message);
        console.log('   ⚠️  Le serveur est-il démarré sur', API_URL, '?');
    }
    console.log('');
}

// Test 2: Tester l'API de désinscription
async function testUnsubscribeAPI() {
    console.log('2️⃣ Test POST /api/newsletter/unsubscribe');
    
    const testEmail = 'test-unsubscribe@example.com';
    
    try {
        const response = await fetch(`${API_URL}/api/newsletter/unsubscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: testEmail })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('   ✅ Succès - Statut:', response.status);
            console.log('   📝 Message:', data.message);
            console.log('   ℹ️  Email désinscrit:', testEmail);
        } else {
            console.log('   ⚠️  Réponse - Statut:', response.status);
            console.log('   📝 Message:', data.error || data.message);
        }
    } catch (error) {
        console.log('   ❌ Erreur de connexion:', error.message);
    }
    console.log('');
}

// Test 3: Tester sans email
async function testUnsubscribeNoEmail() {
    console.log('3️⃣ Test POST /api/newsletter/unsubscribe (sans email)');
    
    try {
        const response = await fetch(`${API_URL}/api/newsletter/unsubscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        
        const data = await response.json();
        
        if (response.status === 400) {
            console.log('   ✅ Validation correcte - Statut:', response.status);
            console.log('   📝 Message:', data.error);
        } else {
            console.log('   ⚠️  Statut inattendu:', response.status);
            console.log('   📝 Message:', data.error || data.message);
        }
    } catch (error) {
        console.log('   ❌ Erreur de connexion:', error.message);
    }
    console.log('');
}

// Exécuter tous les tests
async function runAllTests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  TESTS DE DÉSINSCRIPTION NEWSLETTER - BACKZO');
    console.log('═══════════════════════════════════════════════════════\n');
    
    await testUnsubscribePage();
    await testUnsubscribeAPI();
    await testUnsubscribeNoEmail();
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('  TESTS TERMINÉS');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📋 Pour tester manuellement :');
    console.log('   1. Ouvrez http://localhost:3000/unsubscribe?email=test@example.com');
    console.log('   2. Cliquez sur "Confirmer la désinscription"');
    console.log('   3. Vérifiez que le message de confirmation s\'affiche\n');
}

// Lancer les tests
runAllTests().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});
