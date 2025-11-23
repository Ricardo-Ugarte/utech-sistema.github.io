const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Construyendo ejecutable para Sistema de Gestión de Bebidas...');
console.log('📁 Directorio:', __dirname);

// Verificar archivos esenciales
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: No se encuentra package.json');
  process.exit(1);
}

if (!fs.existsSync('server.js')) {
  console.error('❌ Error: No se encuentra server.js');
  process.exit(1);
}

console.log('✅ Archivos principales encontrados');

try {
  console.log('📦 Iniciando creación del ejecutable...');
  console.log('⏳ Esto puede tomar 1-2 minutos...');
  
  // Comando simplificado para pkg
  const command = 'npx pkg server.js --target node18-win-x64 --output "SistemaGestionBebidas.exe"';
  console.log('🔧 Ejecutando:', command);
  
  execSync(command, { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  // Verificar si se creó el ejecutable
  if (fs.existsSync('SistemaGestionBebidas.exe')) {
    const stats = fs.statSync('SistemaGestionBebidas.exe');
    const fileSize = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('');
    console.log('🎉 ✅ ✅ ✅ EJECUTABLE CREADO EXITOSAMENTE!');
    console.log('📁 Archivo: SistemaGestionBebidas.exe');
    console.log('📏 Tamaño: ' + fileSize + ' MB');
    console.log('📍 Ubicación: ' + path.join(__dirname, 'SistemaGestionBebidas.exe'));
    console.log('');
    console.log('🚀 INSTRUCCIONES DE USO:');
    console.log('   1. Haz doble clic en "SistemaGestionBebidas.exe"');
    console.log('   2. Espera a que aparezca: "Servidor ejecutándose en http://localhost:3000"');
    console.log('   3. Abre tu navegador en: http://localhost:3000');
    console.log('   4. Para cerrar: Presiona Ctrl + C en la ventana');
    console.log('');
    console.log('💡 CONSEJO: Copia el .exe a tu escritorio para fácil acceso');
    
  } else {
    console.error('❌ El ejecutable no se creó correctamente');
  }
  
} catch (error) {
  console.error('❌ Error durante la construcción:', error.message);
  console.log('🔧 Solución alternativa:');
  console.log('   1. Ejecuta: npm install pkg --save-dev');
  console.log('   2. Luego: npx pkg server.js --target node18-win-x64 --output "SistemaGestionBebidas.exe"');
}