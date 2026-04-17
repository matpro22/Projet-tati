// Script de test rapide pour vérifier les routes API des avis
// Usage: node test-reviews-api.js

const API_URL = 'http://localhost:3000';

console.log('🧪 Test des routes API des avis\n');

// Test 1: Récupérer les avis publics
async function testGetReviews() {
    console.log('1️⃣ Test GET /api/reviews (avis publics)');
    try {
        const response = await fetch(`${API_URL}/api/reviews`);
        const data = await response.json();
        
        if (response.ok) {
            console.log('   ✅ Succès - Statut:', response.status);
            console.log('   📊 Nombre d\'avis:', data.length);
            console.log('   📝 Données:', JSON.stringify(data, null, 2).substring(0, 200));
        } else {
            console.log('   ❌ Erreur - Statut:', response.status);
            console.log('   📝 Message:', data.error || data.message);
        }
    } catch (error) {
        console.log('   ❌ Erreur de connexion:', error.message);
        console.log('   ⚠️  Le serveur est-il démarré sur', API_URL, '?');
    }
    console.log('');
}

// Test 2: Soumettre un avis de test
async function testSubmitReview() {
    console.log('2️⃣ Test POST /api/reviews (soumettre un avis)');
    
    const testReview = {
        orderId: 'BZ-TEST-' + Date.now(),
        email: 'test@example.com',
        rating: 5,
        comment: 'Test automatique - Excellent service !',
        customerName: 'Test User'
    };
    
    try {
        const response = await fetch(`${API_URL}/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testReview)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('   ✅ Succès - Statut:', response.status);
            console.log('   📝 Message:', data.message);
            console.log('   🆔 ID avis:', data.review?.id);
        } else {
            console.log('   ⚠️  Erreur attendue - Statut:', response.status);
            console.log('   📝 Message:', data.error);
            console.log('   ℹ️  Normal si la commande n\'existe pas');
        }
    } catch (error) {
        console.log('   ❌ Erreur de connexion:', error.message);
    }
    console.log('');
}

// Test 3: Vérifier la page de soumission
async function testReviewPage() {
    console.log('3️⃣ Test GET /review.html (page de soumission)');
    try {
        const response = await fetch(`${API_URL}/review.html`);
        
        if (response.ok) {
            console.log('   ✅ Succès - Statut:', response.status);
            console.log('   📄 Type:', response.headers.get('content-type'));
            const text = await response.text();
            const hasForm = text.includes('reviewForm');
            const hasStars = text.includes('star');
            console.log('   🎨 Formulaire présent:', hasForm ? '✅' : '❌');
            console.log('   ⭐ Étoiles présentes:', hasStars ? '✅' : '❌');
        } else {
            console.log('   ❌ Erreur - Statut:', response.status);
        }
    } catch (error) {
        console.log('   ❌ Erreur de connexion:', error.message);
    }
    console.log('');
}

// Test 4: Vérifier les scripts
async function testScripts() {
    console.log('4️⃣ Test des scripts JavaScript');
    
    const scripts = [
        '/reviews-display.js',
        '/admin-reviews.js'
    ];
    
    for (const script of scripts) {
        try {
            const response = await fetch(`${API_URL}${script}`);
            if (response.ok) {
                console.log(`   ✅ ${script} - Disponible`);
            } else {
                console.log(`   ❌ ${script} - Statut: ${response.status}`);
            }
        } catch (error) {
            console.log(`   ❌ ${script} - Erreur:`, error.message);
        }
    }
    console.log('');
}

// Exécuter tous les tests
async function runAllTests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  TESTS DU SYSTÈME D\'AVIS CLIENTS - BACKZO');
    console.log('═══════════════════════════════════════════════════════\n');
    
    await testGetReviews();
    await testSubmitReview();
    await testReviewPage();
    await testScripts();
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('  TESTS TERMINÉS');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📋 Prochaines étapes :');
    console.log('   1. Si des tests ont échoué, redémarrez le serveur');
    console.log('   2. Ouvrez http://localhost:3000/review.html dans votre navigateur');
    console.log('   3. Testez le panel admin (onglet Avis clients)');
    console.log('   4. Consultez DEMARRAGE_RAPIDE.md pour plus d\'infos\n');
}

// Lancer les tests
runAllTests().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});
