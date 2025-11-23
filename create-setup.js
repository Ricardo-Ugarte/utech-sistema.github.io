const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏗️ Creando instalador con Inno Setup...');

// 1. Crear archivo de configuración para Inno Setup
const issContent = `
[Setup]
AppName=Sistema Gestión de Bebidas
AppVersion=1.0.0
AppPublisher=Ricardo Ugarte
DefaultDirName={{autopf}}\\SistemaGestionBebidas
DefaultGroupName=Sistema Gestión Bebidas
OutputDir=dist
OutputBaseFilename=InstaladorSistemaBebidas
SetupIconFile=icon.ico
Compression=lzma
SolidCompression=yes
PrivilegesRequired=lowest

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\\Spanish.isl"

[Tasks]
Name: "desktopicon"; Description: "Crear icono en el escritorio"; GroupDescription: "Accesos directos:"

[Files]
Source: "SistemaGestionBebidas.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "server.js"; DestDir: "{app}"; Flags: ignoreversion
Source: "package.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "node_modules\\*"; DestDir: "{app}\\node_modules"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\\Sistema Gestión Bebidas"; Filename: "{app}\\SistemaGestionBebidas.exe"
Name: "{autodesktop}\\Sistema Gestión Bebidas"; Filename: "{app}\\SistemaGestionBebidas.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\\SistemaGestionBebidas.exe"; Description: "Ejecutar Sistema Gestión Bebidas"; Flags: nowait postinstall skipifsilent
`;

fs.writeFileSync('setup.iss', issContent);
console.log('✅ Archivo setup.iss creado');

// 2. Crear archivo batch para compilar
const batchContent = `@echo off
echo Creando instalador con Inno Setup...
echo.
echo Si no tienes Inno Setup instalado, descargalo de:
echo https://jrsoftware.org/isdl.php
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

if exist "C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe" (
    "C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe" setup.iss
) else if exist "C:\\Program Files\\Inno Setup 6\\ISCC.exe" (
    "C:\\Program Files\\Inno Setup 6\\ISCC.exe" setup.iss
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
`;

fs.writeFileSync('crear-instalador.bat', batchContent);
console.log('✅ Archivo crear-instalador.bat creado');

// 3. Crear icono básico (si no existe)
if (!fs.existsSync('icon.ico')) {
    console.log('📝 Creando icono básico...');
    // Podemos crear un icono simple o usar uno por defecto
    const iconMessage = `
⚠️ Necesitas un archivo icon.ico para el instalador.

Puedes:
1. Crear un icono de 64x64 pixels y guardarlo como 'icon.ico'
2. Usar un conversor online de PNG a ICO
3. O eliminar la línea 'SetupIconFile' del archivo setup.iss

Una vez tengas el icono, ejecuta 'crear-instalador.bat'
`;
    fs.writeFileSync('LEER_ICONO.txt', iconMessage);
}

console.log('');
console.log('🎯 INSTRUCCIONES:');
console.log('   1. Descarga Inno Setup de: https://jrsoftware.org/isdl.php');
console.log('   2. Instálalo (es gratuito)');
console.log('   3. Ejecuta: crear-instalador.bat');
console.log('   4. El instalador estará en la carpeta "dist"');