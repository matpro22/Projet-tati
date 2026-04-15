/**
 * Script de test pour le système d'authentification admin
 * Usage: node "Fichier de test/test-auth-system.js"
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('\n🔐 === TEST DU SYSTÈME D\'AUTHENTIFICATION ===\n');

// 1. Vérifier les variables d'environnement
console.log('1️⃣ Variables d\'environnement :');
console.log('   ADMIN_USERNAME:', process.env.ADMIN_USERNAME || '❌ NON DÉFINI');
console.log('   ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '✅ Défini' : '❌ NON DÉFINI');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Défini' : '❌ NON DÉFINI');

// 2. Tester le hash du mot de passe
console.log('\n2️⃣ Test du hash bcrypt :');
const testPassword = process.env.ADMIN_PASSWORD || 'BackZo2024!';
const hash = bcrypt.hashSync(testPassword, 10);
console.log('   Hash généré:', hash.substring(0, 30) + '...');
console.log('   Vérification:', bcrypt.compareSync(testPassword, hash) ? '✅ OK' : '❌ ERREUR');

// 3. Tester la génération de JWT
console.log('\n3️⃣ Test de génération JWT :');
const jwtSecret = process.env.JWT_SECRET || 'test_secret';
try {
  const token = jwt.sign(
    { username: 'admin', role: 'admin' },
    jwtSecret,
    { expiresIn: '24h' }
  );
  console.log('   Token généré:', token.substring(0, 50) + '...');
  
  // 4. Tester la vérification du JWT
  console.log('\n4️⃣ Test de vérification JWT :');
  const decoded = jwt.verify(token, jwtSecret);
  console.log('   Token décodé:', decoded);
  console.log('   Username:', decoded.username);
  console.log('   Role:', decoded.role);
  console.log('   ✅ Vérification réussie');
  
} catch (error) {
  console.log('   ❌ Erreur:', error.message);
}

// 5. Résumé
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 RÉSUMÉ :');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allOk = process.env.ADMIN_USERNAME && 
              process.env.ADMIN_PASSWORD && 
              process.env.JWT_SECRET;

if (allOk) {
  console.log('✅ Toutes les variables sont configurées');
  console.log('✅ Le système d\'authentification est prêt');
  console.log('\n🎉 Vous pouvez démarrer le serveur avec : npm start');
} else {
  console.log('❌ Configuration incomplète');
  console.log('\n📝 Actions requises :');
  if (!process.env.ADMIN_USERNAME) console.log('   - Définir ADMIN_USERNAME dans .env');
  if (!process.env.ADMIN_PASSWORD) console.log('   - Définir ADMIN_PASSWORD dans .env');
  if (!process.env.JWT_SECRET) console.log('   - Définir JWT_SECRET dans .env (utilisez: npm run generate-secret)');
}

console.log('\n');
