// Script de test de connexion MongoDB
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
  console.log('\n🔍 === TEST DE CONNEXION MONGODB ===\n');
  
  // Vérifier que l'URI est définie
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI non définie dans .env');
    return;
  }
  
  // Afficher l'URI (masquer le mot de passe)
  const maskedUri = process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@');
  console.log('📡 URI:', maskedUri);
  console.log('');
  
  try {
    console.log('🔄 Connexion en cours...');
    
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    
    await client.connect();
    console.log('✅ Connexion réussie !');
    console.log('');
    
    // Test ping
    console.log('🔄 Test ping...');
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Ping réussi !');
    console.log('');
    
    // Lister les bases de données
    console.log('🔄 Liste des bases de données...');
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    console.log('✅ Bases de données:');
    dbs.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    console.log('');
    
    // Lister les collections de la base backzo
    console.log('🔄 Collections dans la base "backzo"...');
    const db = client.db('backzo');
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('⚠️  Aucune collection trouvée (base vide)');
    } else {
      console.log('✅ Collections:');
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`   - ${col.name} (${count} documents)`);
      }
    }
    console.log('');
    
    // Test d'écriture
    console.log('🔄 Test d\'écriture...');
    const testCollection = db.collection('_test');
    const testDoc = { 
      test: true, 
      timestamp: new Date(),
      message: 'Test de connexion'
    };
    await testCollection.insertOne(testDoc);
    console.log('✅ Écriture réussie !');
    
    // Test de lecture
    console.log('🔄 Test de lecture...');
    const doc = await testCollection.findOne({ test: true });
    console.log('✅ Lecture réussie:', doc.message);
    
    // Nettoyage
    console.log('🔄 Nettoyage...');
    await testCollection.deleteOne({ test: true });
    console.log('✅ Nettoyage terminé !');
    console.log('');
    
    await client.close();
    console.log('✅ Connexion fermée');
    console.log('');
    console.log('🎉 === TOUS LES TESTS RÉUSSIS ===\n');
    
  } catch (error) {
    console.error('\n❌ === ERREUR ===\n');
    console.error('Message:', error.message);
    console.error('');
    
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('💡 Suggestions pour erreur SSL/TLS:');
      console.error('   1. Vérifiez que l\'URI commence par mongodb+srv://');
      console.error('   2. Vérifiez que le mot de passe est correctement encodé');
      console.error('   3. Vérifiez l\'accès réseau sur MongoDB Atlas (0.0.0.0/0)');
      console.error('   4. Essayez de générer une nouvelle URI depuis MongoDB Atlas');
    } else if (error.message.includes('authentication')) {
      console.error('💡 Suggestions pour erreur d\'authentification:');
      console.error('   1. Vérifiez le nom d\'utilisateur et le mot de passe');
      console.error('   2. Vérifiez que l\'utilisateur existe sur MongoDB Atlas');
      console.error('   3. Vérifiez les permissions de l\'utilisateur (readWrite)');
    } else if (error.message.includes('timeout') || error.message.includes('ENOTFOUND')) {
      console.error('💡 Suggestions pour erreur de connexion:');
      console.error('   1. Vérifiez votre connexion internet');
      console.error('   2. Vérifiez que l\'URI est correcte');
      console.error('   3. Vérifiez l\'accès réseau sur MongoDB Atlas');
      console.error('   4. Vérifiez que le cluster est actif');
    }
    
    console.error('');
    console.error('Stack complète:');
    console.error(error.stack);
    console.error('');
  }
}

testConnection();
