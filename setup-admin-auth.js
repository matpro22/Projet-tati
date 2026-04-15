#!/usr/bin/env node

/**
 * Script interactif pour configurer l'authentification admin
 * Usage: node setup-admin-auth.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

console.log('\n🔐 === CONFIGURATION DE L\'AUTHENTIFICATION ADMIN ===\n');

// Fonction pour poser une question
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  try {
    // Vérifier si .env existe
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log('✅ Fichier .env trouvé\n');
    } else {
      console.log('ℹ️  Fichier .env non trouvé, création...\n');
      // Copier depuis .env.example
      const examplePath = path.join(__dirname, '.env.example');
      if (fs.existsSync(examplePath)) {
        envContent = fs.readFileSync(examplePath, 'utf8');
      }
    }

    // Demander le nom d'utilisateur
    const username = await question('👤 Nom d\'utilisateur admin (défaut: admin) : ') || 'admin';

    // Demander le mot de passe
    console.log('\n🔒 Mot de passe admin :');
    console.log('   (minimum 8 caractères, utilisez majuscules, chiffres et caractères spéciaux)');
    const password = await question('   Entrez le mot de passe : ');

    if (!password || password.length < 8) {
      console.log('\n❌ Le mot de passe doit contenir au moins 8 caractères');
      rl.close();
      return;
    }

    // Générer le JWT secret
    console.log('\n🔑 Génération du JWT Secret...');
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    console.log('   ✅ Secret généré');

    // Mettre à jour ou ajouter les variables
    const lines = envContent.split('\n');
    const newLines = [];
    let foundAuth = false;

    for (const line of lines) {
      if (line.startsWith('ADMIN_USERNAME=')) {
        newLines.push(`ADMIN_USERNAME=${username}`);
        foundAuth = true;
      } else if (line.startsWith('ADMIN_PASSWORD=')) {
        newLines.push(`ADMIN_PASSWORD=${password}`);
      } else if (line.startsWith('JWT_SECRET=')) {
        newLines.push(`JWT_SECRET=${jwtSecret}`);
      } else {
        newLines.push(line);
      }
    }

    // Si les variables n'existent pas, les ajouter
    if (!foundAuth) {
      newLines.push('');
      newLines.push('# Authentification Admin');
      newLines.push(`ADMIN_USERNAME=${username}`);
      newLines.push(`ADMIN_PASSWORD=${password}`);
      newLines.push(`JWT_SECRET=${jwtSecret}`);
    }

    // Écrire le fichier .env
    fs.writeFileSync(envPath, newLines.join('\n'));

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Configuration terminée avec succès !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Fichier .env mis à jour avec :');
    console.log(`   - ADMIN_USERNAME: ${username}`);
    console.log(`   - ADMIN_PASSWORD: ${password.replace(/./g, '*')}`);
    console.log(`   - JWT_SECRET: ${jwtSecret.substring(0, 20)}...`);
    console.log('\n⚠️  Important :');
    console.log('   - Ne partagez JAMAIS ces informations');
    console.log('   - Ne commitez JAMAIS le fichier .env dans Git');
    console.log('   - Sauvegardez ces informations dans un endroit sûr');
    console.log('\n🚀 Prochaines étapes :');
    console.log('   1. Installez les dépendances : npm install');
    console.log('   2. Testez la configuration : npm run test-auth');
    console.log('   3. Démarrez le serveur : npm start');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
  } finally {
    rl.close();
  }
}

setup();
