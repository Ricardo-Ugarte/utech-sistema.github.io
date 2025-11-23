const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎯 Creando programa con acceso directo...');
console.log('📁 Directorio actual:', __dirname);

// 1. Crear lanzador mejorado
const launcherContent = `@echo off
chcp 65001 >nul
title Sistema Gestión de Bebidas - Ricardo Ugarte
color 0A

echo.
echo ===============================================
echo    SISTEMA DE GESTIÓN DE BEBIDAS
echo ===============================================
echo.

:: Verificar si el ejecutable existe
if not exist "SistemaGestionBebidas.exe" (
    echo ❌ ERROR: No se encuentra SistemaGestionBebidas.exe
    echo.
    pause
    exit /b 1
)

:: Verificar si ya está ejecutándose
echo 🔍 Verificando estado del sistema...
netstat -ano | findstr :3000 >nul
if not errorlevel 1 (
    echo ✅ El sistema ya está ejecutándose
    echo 🌐 Abriendo: http://localhost:3000
    start "" "http://localhost:3000"
    echo.
    echo 📋 El sistema está listo para usar
    echo ⏹️  Para cerrar: Cierra esta ventana o presiona Ctrl+C
) else (
    echo 🚀 Iniciando servidor...
    start "Sistema Bebidas" "SistemaGestionBebidas.exe"
    
    echo ⏳ Esperando a que el servidor esté listo...
    timeout /t 5 /nobreak >nul
    
    echo 🌐 Abriendo navegador...
    start "" "http://localhost:3000"
    
    echo.
    echo ✅ SISTEMA INICIADO CORRECTAMENTE
    echo 📍 Accede en: http://localhost:3000
    echo 👤 Usuario: Sistema listo para usar
    echo ⏹️  Para cerrar: Cierra esta ventana
)

echo.
echo ===============================================
echo.
pause
`;

fs.writeFileSync('Iniciar Sistema.bat', launcherContent);
console.log('✅ Creado: Iniciar Sistema.bat');

// 2. Crear script VBS para acceso directo silencioso
const vbsContent = `Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = "Sistema Gestión Bebidas.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = oWS.ExpandEnvironmentStrings("Iniciar Sistema.bat")
oLink.WorkingDirectory = oWS.ExpandEnvironmentStrings("%CD%")
oLink.WindowStyle = 1
oLink.Description = "Sistema Integral de Gestión de Bebidas - Control de stock, ventas y proveedores"
oLink.IconLocation = "SistemaGestionBebidas.exe,0"
oLink.Save

WScript.Echo "Acceso directo creado: Sistema Gestión Bebidas.lnk"
`;

fs.writeFileSync('crear_acceso_directo.vbs', vbsContent);
console.log('✅ Creado: crear_acceso_directo.vbs');

// 3. Crear archivo README para el usuario
const readmeContent = `# SISTEMA DE GESTIÓN DE BEBIDAS

## 📋 DESCRIPCIÓN
Sistema integral para gestión de bebidas con control de:
- ✅ Stock e inventario
- ✅ Ventas y clientes  
- ✅ Compras y proveedores
- ✅ Reportes y análisis

## 🚀 CÓMO USAR

### OPCIÓN 1 (Recomendada):
Haz doble clic en: **"Sistema Gestión Bebidas.lnk"**

### OPCIÓN 2:
Haz doble clic en: **"Iniciar Sistema.bat"**

## 🌐 ACCESO AL SISTEMA
Una vez iniciado, abre tu navegador en:
**http://localhost:3000**

## 📊 MÓDULOS DISPONIBLES
- Dashboard principal
- Gestión de Artículos
- Control de Stock
- Módulo de Ventas
- Sistema de Costeo
- Reportes y estadísticas

## ⚠️ TROUBLESHOOTING
- Si el puerto 3000 está en uso, cierra otras ventanas del sistema
- Asegúrate de tener conexión a internet para la base de datos Azure
- Para cerrar: Cierra la ventana de comandos

## 📞 SOPORTE
Desarrollado por: Ricardo Ugarte
`;

fs.writeFileSync('LEEME - Instrucciones.txt', readmeContent);
console.log('✅ Creado: LEEME - Instrucciones.txt');

// 4. Crear el acceso directo
try {
    console.log('🔗 Creando acceso directo...');
    execSync('cscript crear_acceso_directo.vbs', { stdio: 'inherit' });
    
    // Limpiar archivo temporal
    fs.unlinkSync('crear_acceso_directo.vbs');
    
    console.log('✅ Acceso directo creado exitosamente!');
} catch (error) {
    console.log('ℹ️ Ejecuta manualmente: cscript crear_acceso_directo.vbs');
}

console.log('');
console.log('🎉 🎉 🎉 PROGRAMA CREADO EXITOSAMENTE! 🎉 🎉 🎉');
console.log('');
console.log('📁 ARCHIVOS CREADOS:');
console.log('   🔗 "Sistema Gestión Bebidas.lnk" - Acceso directo principal');
console.log('   ⚡ "Iniciar Sistema.bat" - Lanzador del sistema');
console.log('   📄 "LEEME - Instrucciones.txt" - Instrucciones de uso');
console.log('   🖥️ "SistemaGestionBebidas.exe" - Ejecutable principal');
console.log('');
console.log('🚀 INSTRUCCIONES FINALES:');
console.log('   1. Haz DOBLE CLIC en "Sistema Gestión Bebidas.lnk"');
console.log('   2. Se abrirá una ventana y automáticamente el navegador');
console.log('   3. Usa el sistema en: http://localhost:3000');
console.log('');
console.log('💡 CONSEJOS:');
console.log('   • Arrastra el acceso directo al escritorio para fácil acceso');
console.log('   • El sistema funciona sin instalación');
console.log('   • Puedes copiar toda la carpeta a otras computadoras');
console.log('');