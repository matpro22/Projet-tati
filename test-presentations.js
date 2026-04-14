// Test des présentations produits
// Exécuter avec: node test-presentations.js

require('dotenv').config();
const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

async function testPresentations() {
  console.log('🧪 Test des présentations produits\n');
  
  try {
    // Test 1: Récupérer les présentations
    console.log('1️⃣ Test GET /api/presentations');
    const getResponse = await fetch(`${API_URL}/presentations`);
    const presentations = await getResponse.json();
    
    if (getResponse.ok) {
      console.log('✅ Présentations récupérées avec succès');
      console.log('   - Clubs:', presentations.clubs ? '✓' : '✗');
      console.log('   - Particuliers:', presentations.particuliers ? '✓' : '✗');
    } else {
      console.log('❌ Erreur:', presentations.error);
    }
    
    console.log('\n');
    
    // Test 2: Sauvegarder des présentations
    console.log('2️⃣ Test POST /api/presentations');
    const testData = {
      clubs: {
        text: '<p>Test de présentation Clubs</p>',
        mediaUrl: '1.jpg',
        mediaType: 'image'
      },
      particuliers: {
        text: '<p>Test de présentation Particuliers</p>',
        mediaUrl: '2.jpg',
        mediaType: 'image'
      }
    };
    
    const postResponse = await fetch(`${API_URL}/presentations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const saveResult = await postResponse.json();
    
    if (postResponse.ok) {
      console.log('✅ Présentations sauvegardées avec succès');
      if (saveResult.warning) {
        console.log('⚠️  Avertissement:', saveResult.warning);
      }
    } else {
      console.log('❌ Erreur:', saveResult.error);
    }
    
    console.log('\n');
    
    // Test 3: Vérifier la sauvegarde
    console.log('3️⃣ Vérification de la sauvegarde');
    const verifyResponse = await fetch(`${API_URL}/presentations`);
    const verifyData = await verifyResponse.json();
    
    if (verifyResponse.ok) {
      const clubsMatch = verifyData.clubs.text === testData.clubs.text;
      const particuliersMatch = verifyData.particuliers.text === testData.particuliers.text;
      
      if (clubsMatch && particuliersMatch) {
        console.log('✅ Les données ont été correctement sauvegardées');
      } else {
        console.log('⚠️  Les données ne correspondent pas exactement');
        console.log('   - Clubs:', clubsMatch ? '✓' : '✗');
        console.log('   - Particuliers:', particuliersMatch ? '✓' : '✗');
      }
    } else {
      console.log('❌ Erreur de vérification');
    }
    
    console.log('\n✨ Tests terminés\n');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    console.log('\n💡 Assurez-vous que le serveur est démarré (npm start)\n');
  }
}

// Exécuter les tests
testPresentations();
