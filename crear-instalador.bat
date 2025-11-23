@echo off
echo Creando instalador con Inno Setup...
echo.
echo Si no tienes Inno Setup instalado, descargalo de:
echo https://jrsoftware.org/isdl.php
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

if exist "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" (
    "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" setup.iss
) else if exist "C:\Program Files\Inno Setup 6\ISCC.exe" (
    "C:\Program Files\Inno Setup 6\ISCC.exe" setup.iss
) else (
    echo.
    echo ❌ Inno Setup no encontrado.
    echo 📥 Descarga e instala Inno Setup desde:
    echo    https://jrsoftware.org/isdl.php
    echo.
    echo Luego ejecuta este script nuevamente.
)

echo.
echo Si el instalador se creo correctamente, lo encontraras en la carpeta 'dist'
pause
