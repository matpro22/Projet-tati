#!/usr/bin/env node

/**
 * Script pour générer un JWT Secret sécurisé
 * Usage: node generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 Génération d\'un JWT Secret sécurisé...\n');

// Générer un secret aléatoire de 64 caractères (32 bytes en hex)
const secret = crypto.randomBytes(32).toString('hex');

console.log('✅ JWT Secret généré avec succès !\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(secret);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📝 Ajoutez cette ligne dans votre fichier .env :\n');
console.log(`JWT_SECRET=${secret}\n`);

console.log('⚠️  Important :');
console.log('   - Ne partagez JAMAIS ce secret');
console.log('   - Ne le commitez JAMAIS dans Git');
console.log('   - Changez-le régulièrement pour plus de sécurité\n');
