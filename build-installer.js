const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏗️ Creando instalador profesional...');

// Crear estructura de carpetas
if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}

// Crear archivo app.js si no existe
if (!fs.existsSync('app.js')) {
  const appJsContent = `// [El código de electron que te pasé arriba]`;
  fs.writeFileSync('app.js', appJsContent);
}

// Actualizar package.json para electron
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.main = "app.js";
packageJson.scripts = {
  "start": "electron .",
  "build": "electron-builder",
  "dist": "electron-builder --publish=never"
};
packageJson.devDependencies = {
  ...packageJson.devDependencies,
  "electron": "^22.0.0",
  "electron-builder": "^24.0.0"
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log('📦 Instalando Electron...');
execSync('npm install electron@22 electron-builder@24 --save-dev', { stdio: 'inherit' });

console.log('🔨 Construyendo instalador...');
execSync('npm run dist', { stdio: 'inherit' });

console.log('✅ Instalador creado en carpeta "dist"');