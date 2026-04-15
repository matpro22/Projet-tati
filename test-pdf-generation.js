// Test de génération PDF pour les devis
const puppeteer = require('puppeteer');

async function testPDFGeneration() {
  console.log('🧪 Test de génération PDF...\n');
  
  try {
    // HTML de test (similaire à un devis)
    const testHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #b8ff57; background: #000; padding: 20px; text-align: center; }
          .info { margin: 20px 0; padding: 15px; background: #f5f5f5; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
          th { background: #000; color: #b8ff57; }
        </style>
      </head>
      <body>
        <h1>BACKZO - DEVIS TEST</h1>
        <div class="info">
          <p><strong>Client:</strong> Test Client</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          <p><strong>Devis N°:</strong> TEST-001</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Désignation</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Flocage Amovible - Taille S</td>
              <td>2</td>
              <td>13,00 €</td>
              <td>26,00 €</td>
            </tr>
            <tr>
              <td>Flocage Amovible - Taille L</td>
              <td>1</td>
              <td>13,00 €</td>
              <td>13,00 €</td>
            </tr>
          </tbody>
        </table>
        <div class="info">
          <p style="text-align: right; font-size: 20px;"><strong>Total TTC: 39,00 €</strong></p>
        </div>
      </body>
      </html>
    `;
    
    console.log('1️⃣ Lancement de Puppeteer...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('   ✓ Navigateur lancé\n');
    
    console.log('2️⃣ Création de la page...');
    const page = await browser.newPage();
    await page.setContent(testHTML, { waitUntil: 'networkidle0' });
    console.log('   ✓ Contenu HTML chargé\n');
    
    console.log('3️⃣ Génération du PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    console.log('   ✓ PDF généré (' + pdfBuffer.length + ' octets)\n');
    
    await browser.close();
    console.log('4️⃣ Navigateur fermé\n');
    
    console.log('✅ TEST RÉUSSI !');
    console.log('   La génération PDF fonctionne correctement.');
    console.log('   Les devis seront maintenant envoyés en PDF par email.\n');
    
  } catch (error) {
    console.error('❌ ERREUR lors du test:', error.message);
    console.error('\nDétails:', error);
    process.exit(1);
  }
}

testPDFGeneration();
