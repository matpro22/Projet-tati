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
echo - Remplacement de chrome-aws-lambda par @sparticuz/chromium
echo - Mise a jour de puppeteer-core
echo - Amelioration de la detection d'environnement
echo - Ajout de logs detailles
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
git commit -m "Fix: Generation PDF avec @sparticuz/chromium pour Vercel"

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
echo   - PDF genere avec succes
echo.
pause
