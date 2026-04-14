// ============================================================
// TEST CONFIGURATION EMAIL OVH
// ============================================================
// Ce script teste la configuration email OVH
// Usage: node test-email-config.js

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Test de la configuration email OVH\n');

// Afficher la configuration (sans le mot de passe)
console.log('Configuration détectée:');
console.log('  EMAIL_HOST:', process.env.EMAIL_HOST || 'NON DÉFINI');
console.log('  EMAIL_PORT:', process.env.EMAIL_PORT || 'NON DÉFINI');
console.log('  EMAIL_USER:', process.env.EMAIL_USER || 'NON DÉFINI');
console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NON DÉFINI');
console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || 'NON DÉFINI');
console.log('  EMAIL_TO:', process.env.EMAIL_TO || 'NON DÉFINI');
console.log('');

// Vérifier que les variables sont définies
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ EMAIL_USER ou EMAIL_PASS non défini dans le fichier .env');
  console.log('\nAssurez-vous que votre fichier .env contient:');
  console.log('  EMAIL_HOST=ssl0.ovh.net');
  console.log('  EMAIL_PORT=465');
  console.log('  EMAIL_USER=team@backzo.eu');
  console.log('  EMAIL_PASS=votre_mot_de_passe_ovh');
  console.log('  EMAIL_FROM=team@backzo.eu');
  console.log('  EMAIL_TO=team@backzo.eu');
  process.exit(1);
}

// Créer le transporteur
console.log('📧 Création du transporteur email...');
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'ssl0.ovh.net',
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true, // Activer le mode debug
  logger: true // Activer les logs
});

// Test 1: Vérifier la connexion
console.log('\n🔐 Test 1: Vérification de la connexion SMTP...');
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Échec de la connexion:', error.message);
    console.error('\nCauses possibles:');
    console.error('  1. Mot de passe incorrect');
    console.error('  2. Compte email désactivé ou suspendu');
    console.error('  3. Accès SMTP bloqué par OVH');
    console.error('  4. Mauvais serveur SMTP (vérifiez ssl0.ovh.net)');
    console.error('\nSolutions:');
    console.error('  - Vérifiez vos identifiants sur https://www.ovh.com/fr/mail/');
    console.error('  - Contactez le support OVH si le problème persiste');
    process.exit(1);
  } else {
    console.log('✅ Connexion SMTP réussie !');
    
    // Test 2: Envoyer un email de test
    console.log('\n📨 Test 2: Envoi d\'un email de test...');
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: '[TEST] Configuration email BackZo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #b8ff57;">✅ Test réussi !</h2>
          <p>Votre configuration email OVH fonctionne correctement.</p>
          <p><strong>Serveur:</strong> ${process.env.EMAIL_HOST}</p>
          <p><strong>Port:</strong> ${process.env.EMAIL_PORT}</p>
          <p><strong>Utilisateur:</strong> ${process.env.EMAIL_USER}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Ce message a été envoyé par le script de test test-email-config.js
          </p>
        </div>
      `,
      text: `
TEST CONFIGURATION EMAIL BACKZO
================================

✅ Votre configuration email OVH fonctionne correctement.

Serveur: ${process.env.EMAIL_HOST}
Port: ${process.env.EMAIL_PORT}
Utilisateur: ${process.env.EMAIL_USER}
Date: ${new Date().toLocaleString('fr-FR')}

---
Ce message a été envoyé par le script de test test-email-config.js
      `
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error('❌ Échec de l\'envoi:', error.message);
        process.exit(1);
      } else {
        console.log('✅ Email envoyé avec succès !');
        console.log('   Message ID:', info.messageId);
        console.log('   Destinataire:', process.env.EMAIL_TO || process.env.EMAIL_USER);
        console.log('\n🎉 Configuration email validée ! Vous pouvez maintenant utiliser le formulaire de contact.');
        process.exit(0);
      }
    });
  }
});
