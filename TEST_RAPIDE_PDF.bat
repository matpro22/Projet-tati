@echo off
echo ========================================
echo   TEST RAPIDE - Generation PDF
echo ========================================
echo.

echo 1. Verification de Puppeteer...
call npm list puppeteer
echo.

echo 2. Test de generation PDF...
call node test-pdf-generation.js
echo.

echo ========================================
echo   Test termine !
echo ========================================
echo.
echo Pour demarrer le serveur : npm start
echo.
pause
