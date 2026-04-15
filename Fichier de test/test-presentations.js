// ============================================================
// TEST DES PRÉSENTATIONS PRODUITS - BackZo
// ============================================================

const API_URL = 'http://localhost:3000/api';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test 1 : Récupérer la présentation Clubs
async function testGetClubsPresentation() {
  log('\n📋 Test 1 : Récupération présentation Clubs', 'blue');
  
  try {
    const response = await fetch(`${API_URL}/presentations/clubs`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    log('✅ Présentation Clubs récupérée avec succès', 'green');
    log(`   Titre : ${data.title}`);
    log(`   Description : ${data.description.substring(0, 50)}...`);
    log(`   Type média : ${data.mediaType}`);
    log(`   URL média : ${data.mediaUrl}`);
    
    return true;
  } catch (error) {
    log(`❌ Erreur : ${error.message}`, 'red');
    return false;
  }
}

// Test 2 : Récupérer la présentation Particuliers
async function testGetParticuliersPresentation() {
  log('\n📋 Test 2 : Récupération présentation Particuliers', 'blue');
  
  try {
    const response = await fetch(`${API_URL}/presentations/particuliers`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    log('✅ Présentation Particuliers récupérée avec succès', 'green');
    log(`   Titre : ${data.title}`);
    log(`   Description : ${data.description.substring(0, 50)}...`);
    log(`   Type média : ${data.mediaType}`);
    log(`   URL média : ${data.mediaUrl}`);
    
    return true;
  } catch (error) {
    log(`❌ Erreur : ${error.message}`, 'red');
    return false;
  }
}

// Test 3 : Mettre à jour la présentation Clubs
async function testUpdateClubsPresentation() {
  log('\n📝 Test 3 : Mise à jour présentation Clubs', 'blue');
  
  const testData = {
    title: 'Test - Flocage Clubs',
    description: 'Ceci est un test de mise à jour de la présentation Clubs.',
    mediaType: 'image',
    mediaUrl: '1.jpg'
  };
  
  try {
    const response = await fetch(`${API_URL}/presentations/clubs`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    log('✅ Présentation Clubs mise à jour avec succès', 'green');
    log(`   Titre : ${data.presentation.title}`);
    
    return true;
  } catch (error) {
    log(`❌ Erreur : ${error.message}`, 'red');
    return false;
  }
}

// Test 4 : Mettre à jour la présentation Particuliers
async function testUpdateParticuliersPresentation() {
  log('\n📝 Test 4 : Mise à jour présentation Particuliers', 'blue');
  
  const testData = {
    title: 'Test - Flocage Particuliers',
    description: 'Ceci est un test de mise à jour de la présentation Particuliers.',
    mediaType: 'image',
    mediaUrl: '2.jpg'
  };
  
  try {
    const response = await fetch(`${API_URL}/presentations/particuliers`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    log('✅ Présentation Particuliers mise à jour avec succès', 'green');
    log(`   Titre : ${data.presentation.title}`);
    
    return true;
  } catch (error) {
    log(`❌ Erreur : ${error.message}`, 'red');
    return false;
  }
}

// Test 5 : Test avec vidéo YouTube
async function testUpdateWithVideo() {
  log('\n🎥 Test 5 : Mise à jour avec vidéo YouTube', 'blue');
  
  const testData = {
    title: 'Test - Vidéo YouTube',
    description: 'Test d\'intégration d\'une vidéo YouTube.',
    mediaType: 'video',
    mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  };
  
  try {
    const response = await fetch(`${API_URL}/presentations/clubs`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    log('✅ Vidéo YouTube intégrée avec succès', 'green');
    log(`   URL : ${data.presentation.mediaUrl}`);
    
    return true;
  } catch (error) {
    log(`❌ Erreur : ${error.message}`, 'red');
    return false;
  }
}

// Test 6 : Restaurer les valeurs par défaut
async function testRestoreDefaults() {
  log('\n🔄 Test 6 : Restauration des valeurs par défaut', 'blue');
  
  const clubsDefault = {
    title: 'Flocage Amovible pour Clubs',
    description: 'Découvrez notre solution de flocage amovible spécialement conçue pour les clubs sportifs. Personnalisez vos maillots avec facilité et professionnalisme.',
    mediaType: 'image',
    mediaUrl: '1.jpg'
  };
  
  const particuliersDefault = {
    title: 'Flocage Personnalisé pour Particuliers',
    description: 'Créez votre flocage sur-mesure en quelques clics. Choisissez votre taille, vos couleurs et personnalisez votre maillot comme vous le souhaitez.',
    mediaType: 'image',
    mediaUrl: '2.jpg'
  };
  
  try {
    // Restaurer Clubs
    const clubsRes = await fetch(`${API_URL}/presentations/clubs`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clubsDefault)
    });
    
    if (!clubsRes.ok) throw new Error('Erreur restauration Clubs');
    
    // Restaurer Particuliers
    const particuliersRes = await fetch(`${API_URL}/presentations/particuliers`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(particuliersDefault)
    });
    
    if (!particuliersRes.ok) throw new Error('Erreur restauration Particuliers');
    
    log('✅ Valeurs par défaut restaurées avec succès', 'green');
    
    return true;
  } catch (error) {
    log(`❌ Erreur : ${error.message}`, 'red');
    return false;
  }
}

// Exécuter tous les tests
async function runAllTests() {
  log('\n╔════════════════════════════════════════════════╗', 'yellow');
  log('║   TEST DES PRÉSENTATIONS PRODUITS - BackZo    ║', 'yellow');
  log('╚════════════════════════════════════════════════╝', 'yellow');
  
  log('\n⚠️  Assurez-vous que le serveur est démarré sur http://localhost:3000', 'yellow');
  log('⚠️  Assurez-vous que MongoDB est configuré et accessible\n', 'yellow');
  
  const results = [];
  
  // Exécuter les tests
  results.push(await testGetClubsPresentation());
  results.push(await testGetParticuliersPresentation());
  results.push(await testUpdateClubsPresentation());
  results.push(await testUpdateParticuliersPresentation());
  results.push(await testUpdateWithVideo());
  results.push(await testRestoreDefaults());
  
  // Résumé
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  log('\n╔════════════════════════════════════════════════╗', 'yellow');
  log('║                   RÉSUMÉ                       ║', 'yellow');
  log('╚════════════════════════════════════════════════╝', 'yellow');
  
  if (passed === total) {
    log(`\n✅ Tous les tests sont passés ! (${passed}/${total})`, 'green');
    log('\n🎉 Les présentations produits fonctionnent parfaitement !', 'green');
  } else {
    log(`\n⚠️  ${passed}/${total} tests passés`, 'yellow');
    log(`❌ ${total - passed} test(s) échoué(s)`, 'red');
  }
  
  log('\n');
}

// Lancer les tests
runAllTests().catch(error => {
  log(`\n❌ Erreur fatale : ${error.message}`, 'red');
  process.exit(1);
});
