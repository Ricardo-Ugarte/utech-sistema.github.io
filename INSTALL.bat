@echo off
echo ====================================
echo  INSTALADOR SISTEMA GESTION BEBIDAS
echo ====================================
echo.

echo Instalando Node.js si no esta presente...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no encontrado. Por favor instala Node.js desde:
    echo https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo Instalando dependencias...
npm install

echo.
echo ✅ Instalacion completada!
echo.
echo Para ejecutar el sistema:
echo   npm start
echo.
pause