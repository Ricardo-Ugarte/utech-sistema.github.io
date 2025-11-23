@echo off
echo Iniciando Sistema de Gestion de Bebidas...
echo.
if exist "SistemaGestionBebidas.exe" (
    echo Ejecutando sistema...
    start "" "SistemaGestionBebidas.exe"
    timeout /t 5 >nul
    echo Abriendo navegador...
    start "" "http://localhost:3000"
    echo.
    echo Sistema listo en: http://localhost:3000
    echo Cierra esta ventana para terminar
) else (
    echo ERROR: No se encuentra SistemaGestionBebidas.exe
)
echo.
pause