@echo off
echo ========================================
echo   DEPLOIEMENT VERCEL - Generation PDF
echo ========================================
echo.

echo Verification des modifications...
git status
echo.

echo ========================================
echo.
echo Voulez-vous deployer sur Vercel ?
echo.
echo Les modifications suivantes seront deployees :
echo - Downgrade @sparticuz/chromium vers 119.x (stable)
echo - Downgrade puppeteer-core vers 21.x (compatible)
echo - Arguments de lancement optimises pour Vercel
echo - Configuration Chromium pour serverless
echo - Correction erreur libnss3.so
echo.
set /p confirm="Continuer ? (O/N) : "

if /i "%confirm%" NEQ "O" (
    echo.
    echo Deploiement annule.
    pause
    exit /b
)

echo.
echo ========================================
echo   Ajout des fichiers...
echo ========================================
git add .

echo.
echo ========================================
echo   Commit...
echo ========================================
git commit -m "Fix: Downgrade @sparticuz/chromium 119.x pour compatibilite Vercel"

echo.
echo ========================================
echo   Push vers Git...
echo ========================================
git push

echo.
echo ========================================
echo   DEPLOIEMENT TERMINE !
echo ========================================
echo.
echo Vercel va maintenant redeployer automatiquement.
echo Attendez 2-3 minutes puis verifiez :
echo.
echo 1. Allez sur vercel.com
echo 2. Selectionnez votre projet
echo 3. Onglet "Deployments"
echo 4. Verifiez les logs du dernier deploiement
echo.
echo Logs attendus :
echo   - @sparticuz/chromium charge pour production
echo   - PDF genere avec succes (50000 octets)
echo   - Devis envoye a: client@example.com
echo.
echo Testez ensuite :
echo   1. Creez un devis sur votre site
echo   2. Envoyez par email
echo   3. Verifiez le PDF recu
echo.
pause
