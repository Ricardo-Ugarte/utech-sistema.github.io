# Sistema de Gestión de Bebidas

Sistema integral de gestión para bebidas con control de compras, ventas, stock, proveedores y reportes. Desarrollado con tecnologías modernas y diseño responsive.

## 🚀 Características

### Módulos Principales
- **🔐 Sistema de Login**: Autenticación segura con persistencia de sesión
- **📊 Dashboard**: Vista general con estadísticas en tiempo real
- **📦 Gestión de Artículos**: CRUD completo con conexión a SharePoint
- **💰 Costeo de Bebidas**: Cálculos automáticos con validación en tiempo real
- **📈 Registro de Ventas**: Control de márgenes y análisis de rentabilidad
- **🚚 Gestión de Proveedores**: Administración completa de relaciones comerciales
- **📋 Control de Stock**: Movimientos de inventario y alertas automáticas
- **📊 Reportes**: Análisis detallado con gráficos interactivos

### Características Técnicas
- **Frontend**: HTML5, CSS3, JavaScript ES6+, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Gráficos**: Plotly.js para visualizaciones interactivas
- **Animaciones**: Anime.js para efectos suaves
- **Diseño**: Microsoft Fluent UI con diseño moderno y responsive
- **Base de Datos**: Almacenamiento en memoria (simulado)

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

## 🛠️ Instalación

### Opción 1: Instalación Automática (Recomendada)

#### Windows
1. Ejecutar el archivo `INSTALL.bat` como administrador
2. Seguir las instrucciones en pantalla
3. El sistema se iniciará automáticamente

#### Linux/Mac
1. Abrir una terminal en la carpeta del proyecto
2. Ejecutar: `./install.sh`
3. Seguir las instrucciones en pantalla
4. El sistema se iniciará automáticamente

### Opción 2: Instalación Manual

1. **Clonar o descargar el proyecto**
```bash
git clone [URL_DEL_REPOSITORIO]
cd sistema-gestion-bebidas
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

4. **Crear directorios necesarios**
```bash
mkdir -p logs backups uploads
```

5. **Iniciar el servidor backend**
```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

6. **Abrir el sistema en el navegador**
```
http://localhost:3000
```

### Opción 3: Docker (Próximamente)
```bash
docker-compose up -d
```

## 📋 Requisitos del Sistema

### Mínimos
- **Sistema Operativo**: Windows 10, macOS 10.14, o Linux Ubuntu 18.04
- **Node.js**: v14.0.0 o superior
- **RAM**: 2GB
- **Espacio en Disco**: 500MB
- **Navegador**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### Recomendados
- **Sistema Operativo**: Windows 11, macOS 12, o Linux Ubuntu 20.04
- **Node.js**: v16.0.0 o superior
- **RAM**: 4GB
- **Espacio en Disco**: 1GB
- **Navegador**: Chrome 90+, Firefox 85+, Safari 14+, Edge 90+

## 🔧 Configuración Inicial

### Archivo de Configuración (.env)

El archivo `.env` contiene todas las configuraciones del sistema. Las opciones más importantes:

```env
# Puerto del servidor
PORT=3000

# Conexión a base de datos
DB_TYPE=memory

# Configuración de SharePoint
SHAREPOINT_ENABLED=true
SHAREPOINT_SIMULATION_MODE=true

# JWT Secret (cambiar en producción)
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
```

### Configuración de Base de Datos

Por defecto, el sistema usa una base de datos en memoria. Para conectar a una base de datos real:

#### MongoDB
```env
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/sistema-bebidas
```

#### MySQL
```env
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=sistema_bebidas
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña
```

#### PostgreSQL
```env
DB_TYPE=postgresql
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=sistema_bebidas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_contraseña
```

### Configuración de SharePoint

Para conectar con SharePoint real:

1. Registrar aplicación en Azure AD
2. Obtener credenciales
3. Configurar en `.env`:

```env
SHAREPOINT_SIMULATION_MODE=false
SHAREPOINT_CLIENT_ID=tu_client_id
SHAREPOINT_CLIENT_SECRET=tu_client_secret
SHAREPOINT_TENANT_ID=tu_tenant_id
```

## 🚀 Comandos de Uso

### Iniciar el Sistema
```bash
npm start
```

### Modo Desarrollo (con auto-reload)
```bash
npm run dev
```

### Verificar Salud del Sistema
```bash
npm run health
```

### Generar Documentación
```bash
npm run docs
```

### Ejecutar Tests
```bash
npm test
```

### Backup de Datos
```bash
npm run backup
```

## 🔐 Seguridad

### Configuración Básica
1. **Cambiar credenciales por defecto**
2. **Configurar HTTPS en producción**
3. **Usar JWT_SECRET fuerte**
4. **Configurar CORS apropiadamente**

### Buenas Prácticas
- No exponer credenciales en el código
- Usar variables de entorno para configuraciones sensibles
- Implementar rate limiting
- Validar y sanitizar todos los datos de entrada
- Mantener dependencias actualizadas

## 📊 Monitoreo y Mantenimiento

### Logs
- Los logs se guardan en `logs/sistema.log`
- Rotación automática de logs
- Niveles: error, warn, info, debug

### Backup
- Backup automático cada 24 horas
- Se guardan en `backups/`
- Configurable en `.env`

### Performance
- Monitor de uso de memoria
- Tiempo de respuesta de API
- Conexiones a base de datos

## 🐛 Solución de Problemas

### Errores Comunes

#### "Cannot connect to server"
1. Verificar que el servidor esté ejecutándose
2. Comprobar el puerto en `.env`
3. Verificar firewall

#### "Database connection failed"
1. Verificar configuración de base de datos en `.env`
2. Asegurar que el servicio de BD esté ejecutándose
3. Verificar credenciales

#### "SharePoint connection failed"
1. Verificar modo de simulación en `.env`
2. Para conexión real, verificar credenciales OAuth2
3. Verificar permisos en Azure AD

#### "CORS error"
1. Verificar configuración de CORS en `.env`
2. Asegurar que las URLs coincidan
3. Verificar headers de solicitud

### Depuración

#### Habilitar modo debug
```bash
DEBUG=sistema-gestion:* npm start
```

#### Ver logs en tiempo real
```bash
tail -f logs/sistema.log
```

#### Verificar conexión a base de datos
```bash
npm run db:test
```

## 📱 Uso en Dispositivos Móviles

### Configuración de PWA
El sistema está preparado para funcionar como Progressive Web App:

1. Agregar a pantalla de inicio
2. Funcionar sin conexión (con limitaciones)
3. Notificaciones push (próximamente)

### Responsive Design
- Optimizado para pantallas táctiles
- Menús adaptativos
- Formularios optimizados para mobile

## 🤝 Contribuciones

### Cómo Contribuir
1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Guía de Estilo
- Usar ESLint para linting
- Seguir estándares de código del proyecto
- Documentar nuevas funciones
- Incluir tests para nuevas funcionalidades

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [Node.js](https://nodejs.org/) - Runtime de JavaScript
- [Express.js](https://expressjs.com/) - Framework web
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Plotly.js](https://plotly.com/javascript/) - Gráficos interactivos
- [Anime.js](https://animejs.com/) - Animaciones
- [Font Awesome](https://fontawesome.com/) - Iconos
- [Google Fonts](https://fonts.google.com/) - Tipografías

## 📞 Soporte

Para soporte técnico:
- 📧 Email: soporte@sistemabebidas.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/sistema-gestion-bebidas/issues)
- 📖 Wiki: [Documentación](https://github.com/tu-usuario/sistema-gestion-bebidas/wiki)
- 💬 Discord: [Comunidad](https://discord.gg/sistema-bebidas)

---

**Desarrollado con ❤️ para la gestión eficiente de bebidas**

© 2024 Sistema de Gestión de Bebidas. Todos los derechos reservados.

## 🔑 Credenciales de Acceso

**Usuario de prueba:**
- Username: `admin`
- Password: `admin123`

## 📁 Estructura del Proyecto

```
sistema-gestion-bebidas/
├── index.html              # Página de login
├── dashboard.html          # Dashboard principal
├── articulos.html          # Gestión de artículos
├── costeo.html             # Costeo de bebidas
├── ventas.html             # Registro de ventas
├── proveedores.html        # Gestión de proveedores
├── stock.html              # Control de stock
├── reportes.html           # Reportes y analytics
├── server.js               # Servidor backend
├── package.json            # Dependencias del proyecto
├── js/
│   └── api-client.js       # Cliente API para comunicación
└── README.md               # Este archivo
```

## 🎯 Uso del Sistema

### 1. Login
- Ingresar con las credenciales proporcionadas
- El sistema mantiene la sesión activa

### 2. Dashboard
- Vista general del negocio con estadísticas clave
- Acceso rápido a todos los módulos

### 3. Gestión de Artículos
- **Conexión SharePoint**: Sincronización con lista de SharePoint
- **CRUD Completo**: Crear, leer, actualizar y eliminar artículos
- **Búsqueda Avanzada**: Filtros por código, descripción, proveedor
- **Control de Estado**: OK, FALTA, REVISAR

### 4. Costeo de Bebidas
- **Cálculos Automáticos**: Impuestos, gastos de envío, márgenes
- **Validación en Tiempo Real**: Verificación de datos mientras se ingresan
- **Distribución de Costos**: Proporcional a los artículos
- **Exportación**: Generación de reportes de costos

### 5. Registro de Ventas
- **Control de Stock**: Validación de disponibilidad
- **Cálculo de Márgenes**: Automático en tiempo real
- **Gestión de Clientes**: Registro y seguimiento
- **Análisis de Rentabilidad**: Por producto y período

### 6. Gestión de Proveedores
- **Información Completa**: Datos de contacto, condiciones de pago
- **Estados**: ACTIVO, INACTIVO, PENDIENTE
- **Historial**: Seguimiento de transacciones
- **Evaluación**: Rendimiento y cumplimiento

### 7. Control de Stock
- **Movimientos**: Entradas, salidas y ajustes
- **Alertas Automáticas**: Stock bajo y sin stock
- **Valorización**: Cálculo del valor total del inventario
- **Análisis de Rotación**: Productos más y menos vendidos

### 8. Reportes
- **Ventas por Período**: Diarias, semanales, mensuales
- **Análisis de Márgenes**: Por producto y categoría
- **Top Productos**: Ranking de productos más vendidos
- **Alertas de Stock**: Productos que requieren atención
- **Exportación**: Datos en formato CSV

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Artículos
- `GET /api/articles` - Obtener todos los artículos
- `GET /api/articles/:id` - Obtener artículo por ID
- `POST /api/articles` - Crear nuevo artículo
- `PUT /api/articles/:id` - Actualizar artículo
- `DELETE /api/articles/:id` - Eliminar artículo

### Proveedores
- `GET /api/providers` - Obtener todos los proveedores
- `GET /api/providers/:id` - Obtener proveedor por ID
- `POST /api/providers` - Crear nuevo proveedor
- `PUT /api/providers/:id` - Actualizar proveedor
- `DELETE /api/providers/:id` - Eliminar proveedor

### Ventas
- `GET /api/sales` - Obtener todas las ventas
- `POST /api/sales` - Crear nueva venta
- `DELETE /api/sales/:id` - Eliminar venta

### Stock
- `GET /api/stock` - Obtener stock actual
- `GET /api/stock/movements` - Obtener movimientos de stock
- `POST /api/stock/movements` - Crear movimiento de stock

### Reportes
- `GET /api/reports/sales` - Obtener reporte de ventas
- `GET /api/dashboard/stats` - Estadísticas del dashboard

## 🎨 Personalización

### Colores y Temas
El sistema utiliza Tailwind CSS para el diseño. Puedes personalizar los colores modificando las clases en los archivos HTML.

### Nuevos Módulos
Para agregar nuevos módulos:
1. Crear el archivo HTML correspondiente
2. Agregar la ruta en el servidor
3. Actualizar el menú de navegación

### Integración con SharePoint Real
Para conectar con SharePoint real:
1. Configurar autenticación OAuth2
2. Implementar llamadas a la API de Graph
3. Manejar tokens de acceso

## 🔒 Seguridad

- Autenticación basada en tokens
- Validación de datos en backend
- CORS configurado para seguridad
- Sesiones persistentes en localStorage

## 📱 Responsive Design

El sistema es completamente responsive y funciona en:
- Desktop (1920x1080 y superior)
- Tablet (768x1024)
- Mobile (375x667 y superior)

## 🚀 Performance

- Carga asíncrona de datos
- Animaciones optimizadas
- Compresión de recursos
- Caché de datos en cliente

## 🐛 Solución de Problemas

### Error de conexión
1. Verificar que el servidor esté ejecutándose
2. Comprobar la URL del API en `js/api-client.js`
3. Revisar la configuración de CORS

### Datos no se cargan
1. Verificar la autenticación
2. Comprobar la conexión de red
3. Revisar la consola del navegador

### Problemas de visualización
1. Limpiar caché del navegador
2. Verificar compatibilidad del navegador
3. Desactivar extensiones que puedan interferir

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork del proyecto
2. Crear una rama para tu feature
3. Commit de tus cambios
4. Push a la rama
5. Crear un Pull Request

## 📞 Soporte

Para soporte técnico o consultas:
- Documentación en línea
- Issues en el repositorio
- Contacto con el equipo de desarrollo

---

**Desarrollado con ❤️ para la gestión eficiente de bebidas**