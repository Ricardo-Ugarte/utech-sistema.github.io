// ===============================
//  Servidor API - Sistema Bebidas
//  Gestión Completa de Stock y Ventas
// ===============================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------
// Middlewares
// -------------------------
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(__dirname));

// -------------------------
// Servir archivos HTML para el ejecutable
// -------------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/articulos', (req, res) => {
  res.sendFile(path.join(__dirname, 'articulos.html'));
});

app.get('/proveedores', (req, res) => {
  res.sendFile(path.join(__dirname, 'proveedores.html'));
});

app.get('/stock', (req, res) => {
  res.sendFile(path.join(__dirname, 'stock.html'));
});

app.get('/ventas', (req, res) => {
  res.sendFile(path.join(__dirname, 'ventas.html'));
});

app.get('/costeo', (req, res) => {
  res.sendFile(path.join(__dirname, 'costeo.html'));
});

app.get('/reportes', (req, res) => {
  res.sendFile(path.join(__dirname, 'reportes.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// -------------------------
// Configuración Azure SQL
// -------------------------
const sqlConfig = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  database: process.env.AZURE_SQL_DATABASE,
  server: process.env.AZURE_SQL_HOST,
  port: parseInt(process.env.AZURE_SQL_PORT || '1433', 10),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
    connectionTimeout: 30000
  }
};

// Conexión global
let pool;
const initDB = async () => {
  try {
    pool = await sql.connect(sqlConfig);
    console.log('✅ Conectado a Azure SQL');
    
    // Crear tablas si no existen
    await createTablesIfNotExist();
    return pool;
  } catch (err) {
    console.error('❌ Error conectando a SQL:', err.message);
    process.exit(1);
  }
};

// Función para crear tablas si no existen
async function createTablesIfNotExist() {
  try {
    // Tabla de proveedores
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DIM_Proveedor' AND xtype='U')
      CREATE TABLE DIM_Proveedor (
        ProveedorKey INT IDENTITY(1,1) PRIMARY KEY,
        idProveedor NVARCHAR(50) NOT NULL,
        nombreProveedor NVARCHAR(255) NOT NULL,
        CategoriaProveedor NVARCHAR(100),
        FechaCreacion DATETIME DEFAULT GETDATE()
      )
    `);

    // Tabla de artículos
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DIM_Articulo' AND xtype='U')
      CREATE TABLE DIM_Articulo (
        ArticuloKey INT IDENTITY(1,1) PRIMARY KEY,
        idArticulos NVARCHAR(50) NOT NULL,
        descripcionArticulos NVARCHAR(255) NOT NULL,
        UM NVARCHAR(10) DEFAULT 'UN',
        impuestoInterno DECIMAL(5,2) DEFAULT 0,
        undxCaja INT DEFAULT 1,
        ml DECIMAL(10,2) DEFAULT 0,
        Categoria NVARCHAR(100),
        Subcategoria NVARCHAR(100),
        TipoProducto NVARCHAR(100),
        FechaCreacion DATETIME DEFAULT GETDATE()
      )
    `);

    // Tabla de clientes
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DIM_Cliente' AND xtype='U')
      CREATE TABLE DIM_Cliente (
        ClienteKey INT IDENTITY(1,1) PRIMARY KEY,
        idCliente NVARCHAR(50) NOT NULL,
        Cliente NVARCHAR(255) NOT NULL,
        Titulo NVARCHAR(100),
        TipoCliente NVARCHAR(100),
        FechaCreacion DATETIME DEFAULT GETDATE()
      )
    `);

    // Tabla de sociedades
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DIM_Sociedad' AND xtype='U')
      CREATE TABLE DIM_Sociedad (
        SociedadKey INT IDENTITY(1,1) PRIMARY KEY,
        idSociedades NVARCHAR(50) NOT NULL,
        denominacionSociedad NVARCHAR(255) NOT NULL,
        TipoSociedad NVARCHAR(100),
        FechaCreacion DATETIME DEFAULT GETDATE()
      )
    `);

    // Tabla de compras
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='FACT_Compras' AND xtype='U')
      CREATE TABLE FACT_Compras (
        ComprasKey INT IDENTITY(1,1) PRIMARY KEY,
        ArticuloKey INT NOT NULL,
        ProveedorKey INT NOT NULL,
        SociedadKey INT NOT NULL,
        cantidad DECIMAL(18,3) DEFAULT 0,
        importeNeto DECIMAL(18,2) DEFAULT 0,
        gastosEnvio DECIMAL(18,2) DEFAULT 0,
        impuestosInternos DECIMAL(18,2) DEFAULT 0,
        percepcionIVA DECIMAL(18,2) DEFAULT 0,
        percepcionIIBB DECIMAL(18,2) DEFAULT 0,
        netoImpuesto DECIMAL(18,2) DEFAULT 0,
        subTotal DECIMAL(18,2) DEFAULT 0,
        costoTotal DECIMAL(18,2) DEFAULT 0,
        PU DECIMAL(18,2) DEFAULT 0,
        factura NVARCHAR(50),
        FechaFactura DATE,
        FechaRecepcion DATE,
        FechaCreacion DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (ArticuloKey) REFERENCES DIM_Articulo(ArticuloKey),
        FOREIGN KEY (ProveedorKey) REFERENCES DIM_Proveedor(ProveedorKey),
        FOREIGN KEY (SociedadKey) REFERENCES DIM_Sociedad(SociedadKey)
      )
    `);

    // Tabla de lotes
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DIM_Lote' AND xtype='U')
      CREATE TABLE DIM_Lote (
        LoteKey INT IDENTITY(1,1) PRIMARY KEY,
        ArticuloKey INT NOT NULL,
        ProveedorKey INT,
        Proveedor NVARCHAR(255),
        NumeroFacturaProveedor NVARCHAR(50),
        FechaFactura DATE,
        CantidadInicial DECIMAL(18,3) DEFAULT 0,
        CantidadDisponible DECIMAL(18,3) DEFAULT 0,
        CostoUnitario DECIMAL(18,2) DEFAULT 0,
        SociedadKey INT DEFAULT 1,
        ComprasKey INT,
        NumeroLote NVARCHAR(50),
        FechaCreacion DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (ArticuloKey) REFERENCES DIM_Articulo(ArticuloKey),
        FOREIGN KEY (ProveedorKey) REFERENCES DIM_Proveedor(ProveedorKey)
      )
    `);

    // Tabla de ventas
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='FACT_Ventas' AND xtype='U')
      CREATE TABLE FACT_Ventas (
        VentaKey INT IDENTITY(1,1) PRIMARY KEY,
        Fecha DATE NOT NULL,
        ClienteKey INT NOT NULL,
        SociedadKey INT DEFAULT 1,
        TotalVenta DECIMAL(18,2) DEFAULT 0,
        TotalCosto DECIMAL(18,2) DEFAULT 0,
        TotalMargen DECIMAL(18,2) DEFAULT 0,
        FechaCreacion DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (ClienteKey) REFERENCES DIM_Cliente(ClienteKey)
      )
    `);

    // Tabla de líneas de venta
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='FACT_Ventas_Linea' AND xtype='U')
      CREATE TABLE FACT_Ventas_Linea (
        LineaKey INT IDENTITY(1,1) PRIMARY KEY,
        VentaKey INT NOT NULL,
        ArticuloKey INT NOT NULL,
        LoteKey INT,
        CantidadUnidades DECIMAL(18,3) DEFAULT 0,
        CantidadCajas DECIMAL(18,3) DEFAULT 0,
        PrecioCaja DECIMAL(18,2) DEFAULT 0,
        PrecioUnidad DECIMAL(18,2) DEFAULT 0,
        VentaTotal DECIMAL(18,2) DEFAULT 0,
        CostoUnitario DECIMAL(18,2) DEFAULT 0,
        CostoTotal DECIMAL(18,2) DEFAULT 0,
        MargenTotal DECIMAL(18,2) DEFAULT 0,
        FechaCreacion DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (VentaKey) REFERENCES FACT_Ventas(VentaKey),
        FOREIGN KEY (ArticuloKey) REFERENCES DIM_Articulo(ArticuloKey)
      )
    `);

    // Insertar datos de ejemplo si las tablas están vacías
    await insertSampleData();
    
    console.log('✅ Tablas verificadas/creadas correctamente');
  } catch (err) {
    console.error('❌ Error creando tablas:', err.message);
  }
}

// Insertar datos de ejemplo
async function insertSampleData() {
  try {
    // Verificar si ya hay datos
    const articulosCount = await pool.request().query('SELECT COUNT(*) as count FROM DIM_Articulo');
    if (articulosCount.recordset[0].count > 0) return;

    console.log('📝 Insertando datos de ejemplo...');

    // Insertar proveedores de ejemplo
    await pool.request().query(`
      INSERT INTO DIM_Proveedor (idProveedor, nombreProveedor, CategoriaProveedor) VALUES
      ('PROV001', 'CERVECERÍA QUILMES', 'CERVEZAS'),
      ('PROV002', 'BODEGA SAN RAFAEL', 'VINOS'),
      ('PROV003', 'CAMPARI ARGENTINA', 'APERITIVOS'),
      ('PROV004', 'DISTRIBUIDORA WHISKY', 'DESTILADOS'),
      ('PROV005', 'EMBOTELLADORA COCA-COLA', 'GASEOSAS'),
      ('PROV006', 'AGUAS PURIFICADAS S.A.', 'AGUAS')
    `);

    // Insertar artículos de ejemplo
    await pool.request().query(`
      INSERT INTO DIM_Articulo (idArticulos, descripcionArticulos, UM, undxCaja, Categoria) VALUES
      ('CERV001', 'CERVEZA ANDES ORIGEN 730ML', 'UN', 12, 'CERVEZAS'),
      ('CERV002', 'CERVEZA QUILMES 1L', 'UN', 12, 'CERVEZAS'),
      ('VINO001', 'VINO MALBEC RESERVA 750ML', 'UN', 6, 'VINOS'),
      ('VINO002', 'VINO CABERNET SAUVIGNON 750ML', 'UN', 6, 'VINOS'),
      ('APER001', 'APERITIVO CAMPARI 750ML', 'UN', 12, 'APERITIVOS'),
      ('WHIS001', 'WHISKY JOHNNIE WALKER RED 750ML', 'UN', 6, 'WHISKY'),
      ('GASE001', 'GASEOSA COCA COLA 2.25L', 'UN', 6, 'GASEOSAS'),
      ('AGUA001', 'AGUA MINERAL 2L', 'UN', 12, 'AGUAS')
    `);

    // Insertar clientes de ejemplo
    await pool.request().query(`
      INSERT INTO DIM_Cliente (idCliente, Cliente, TipoCliente) VALUES
      ('CLI001', 'SUPERMERCADO LA ANÓNIMA', 'SUPERMERCADO'),
      ('CLI002', 'HIPERMERCADO CARREFOUR', 'HIPERMERCADO'),
      ('CLI003', 'ALMACÉN DON JOSÉ', 'ALMACÉN'),
      ('CLI004', 'RESTAURANT EL NOBLE', 'RESTAURANT'),
      ('CLI005', 'WHISKY BAR', 'BAR')
    `);

    // Insertar sociedades de ejemplo
    await pool.request().query(`
      INSERT INTO DIM_Sociedad (idSociedades, denominacionSociedad, TipoSociedad) VALUES
      ('SOC001', 'BEBIDAS ARGENTINAS S.A.', 'SOCIEDAD ANÓNIMA'),
      ('SOC002', 'DISTRIBUIDORA DEL SUR S.R.L.', 'SOCIEDAD DE RESPONSABILIDAD LIMITADA')
    `);

    // Insertar lotes de ejemplo con stock
    await pool.request().query(`
      INSERT INTO DIM_Lote (ArticuloKey, ProveedorKey, Proveedor, NumeroFacturaProveedor, FechaFactura, CantidadInicial, CantidadDisponible, CostoUnitario, NumeroLote) VALUES
      (1, 1, 'CERVECERÍA QUILMES', 'FAC-001', '2024-01-15', 240, 240, 2.50, 'LOTE-CERV001-001'),
      (2, 1, 'CERVECERÍA QUILMES', 'FAC-001', '2024-01-15', 120, 120, 2.80, 'LOTE-CERV002-001'),
      (3, 2, 'BODEGA SAN RAFAEL', 'FAC-002', '2024-02-01', 60, 60, 8.00, 'LOTE-VINO001-001'),
      (4, 2, 'BODEGA SAN RAFAEL', 'FAC-003', '2024-02-10', 48, 48, 12.50, 'LOTE-VINO002-001'),
      (5, 3, 'CAMPARI ARGENTINA', 'FAC-004', '2024-03-05', 120, 120, 15.00, 'LOTE-APER001-001'),
      (6, 4, 'DISTRIBUIDORA WHISKY', 'FAC-005', '2024-03-15', 36, 36, 25.00, 'LOTE-WHIS001-001'),
      (7, 5, 'EMBOTELLADORA COCA-COLA', 'FAC-006', '2024-04-01', 72, 72, 3.50, 'LOTE-GASE001-001'),
      (8, 6, 'AGUAS PURIFICADAS S.A.', 'FAC-007', '2024-04-10', 144, 144, 1.20, 'LOTE-AGUA001-001')
    `);

    console.log('✅ Datos de ejemplo insertados correctamente');
  } catch (err) {
    console.error('❌ Error insertando datos de ejemplo:', err.message);
  }
}

// Helper para consultas
async function queryDB(query, setParams) {
  if (!pool) {
    throw new Error('Pool de base de datos no inicializado');
  }

  const request = pool.request();
  
  if (typeof setParams === 'function') {
    setParams(request);
  }
  
  return request.query(query);
}

// Inicializar base de datos al arrancar
initDB();

// ========================================
// ENDPOINTS PRINCIPALES
// ========================================

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await queryDB('SELECT 1 as test');
    res.json({
      success: true,
      message: 'Servidor y base de datos funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      message: 'Error de conexión a base de datos',
      timestamp: new Date().toISOString()
    });
  }
});

// ARTÍCULOS
app.get('/api/articles', async (req, res) => {
  try {
    const result = await queryDB(`
      SELECT 
        ArticuloKey,
        idArticulos,
        descripcionArticulos,
        UM,
        impuestoInterno,
        undxCaja,
        ml,
        Categoria,
        Subcategoria,
        TipoProducto
      FROM dbo.DIM_Articulo
      ORDER BY descripcionArticulos
    `);

    res.json({
      success: true,
      data: result.recordset,
      total: result.recordset.length
    });
  } catch (err) {
    console.error('Error al obtener artículos:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos',
      detail: err.message
    });
  }
});

// PROVEEDORES
app.get('/api/providers', async (req, res) => {
  try {
    const result = await queryDB(`
      SELECT 
        ProveedorKey,
        idProveedor,
        nombreProveedor,
        CategoriaProveedor
      FROM dbo.DIM_Proveedor
      ORDER BY nombreProveedor
    `);

    res.json({
      success: true,
      data: result.recordset,
      total: result.recordset.length
    });
  } catch (err) {
    console.error('Error al obtener proveedores:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedores',
      detail: err.message
    });
  }
});

// CLIENTES
app.get('/api/clientes', async (req, res) => {
  try {
    const result = await queryDB(`
      SELECT 
        ClienteKey,
        idCliente,
        Cliente,
        Titulo,
        TipoCliente
      FROM dbo.DIM_Cliente
      ORDER BY Cliente
    `);

    res.json({
      success: true,
      data: result.recordset,
      total: result.recordset.length
    });
  } catch (err) {
    console.error('Error obteniendo clientes:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo clientes',
      detail: err.message
    });
  }
});

// SOCIEDADES
app.get('/api/sociedades', async (req, res) => {
  try {
    const result = await queryDB(`
      SELECT 
        SociedadKey,
        idSociedades,
        denominacionSociedad,
        TipoSociedad
      FROM dbo.DIM_Sociedad
      ORDER BY denominacionSociedad
    `);

    res.json({
      success: true,
      data: result.recordset,
      total: result.recordset.length
    });
  } catch (err) {
    console.error('Error al obtener sociedades:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener sociedades',
      detail: err.message
    });
  }
});

// STOCK POR ARTÍCULO
app.get('/api/stock/:articuloKey', async (req, res) => {
  const articuloKey = parseInt(req.params.articuloKey, 10);

  try {
    const stockResult = await queryDB(`
      SELECT 
        ISNULL(SUM(CantidadDisponible), 0) as stockDisponible,
        MAX(undxCaja) as undxCaja,
        CASE 
          WHEN MAX(undxCaja) > 0 THEN ISNULL(SUM(CantidadDisponible), 0) / MAX(undxCaja)
          ELSE 0 
        END as stockDisponibleCajas
      FROM DIM_Lote l
      INNER JOIN DIM_Articulo a ON l.ArticuloKey = a.ArticuloKey
      WHERE l.ArticuloKey = @articuloKey
        AND l.CantidadDisponible > 0
    `, (r) => {
      r.input('articuloKey', sql.Int, articuloKey);
    });

    const stockData = stockResult.recordset[0] || {
      stockDisponible: 0,
      undxCaja: 1,
      stockDisponibleCajas: 0
    };

    res.json({
      success: true,
      data: stockData
    });

  } catch (err) {
    console.error('Error al obtener stock:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener stock',
      detail: err.message
    });
  }
});

// STOCK CONSOLIDADO POR ARTÍCULO
app.get('/api/stock-consolidado/:articuloKey', async (req, res) => {
  const articuloKey = parseInt(req.params.articuloKey, 10);

  try {
    const stockResult = await queryDB(`
      SELECT 
        s.denominacionSociedad as Sociedad,
        l.FechaFactura as FechaFC,
        a.idArticulos as Codigo,
        a.descripcionArticulos as Descripcion,
        p.nombreProveedor as Proveedor,
        l.NumeroFacturaProveedor as FCProveedorLote,
        l.CantidadDisponible as Unidades,
        l.CostoUnitario as PU,
        a.UM,
        a.undxCaja
      FROM DIM_Lote l
      LEFT JOIN DIM_Articulo a ON l.ArticuloKey = a.ArticuloKey
      LEFT JOIN DIM_Proveedor p ON l.ProveedorKey = p.ProveedorKey
      LEFT JOIN DIM_Sociedad s ON l.SociedadKey = s.SociedadKey
      WHERE l.ArticuloKey = @articuloKey
        AND l.CantidadDisponible > 0
      ORDER BY l.FechaFactura ASC
    `, (r) => {
      r.input('articuloKey', sql.Int, articuloKey);
    });

    res.json({
      success: true,
      data: stockResult.recordset,
      total: stockResult.recordset.length
    });

  } catch (err) {
    console.error('Error al obtener stock consolidado:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener stock consolidado',
      detail: err.message
    });
  }
});

// STOCK GENERAL - Todos los artículos con stock
app.get('/api/stock', async (req, res) => {
  try {
    const stockResult = await queryDB(`
      SELECT 
        a.ArticuloKey,
        a.idArticulos,
        a.descripcionArticulos,
        a.UM,
        a.undxCaja,
        a.Categoria,
        ISNULL(SUM(l.CantidadDisponible), 0) as StockTotal,
        COUNT(l.LoteKey) as CantidadLotes,
        CASE 
          WHEN ISNULL(SUM(l.CantidadDisponible), 0) = 0 THEN 'SIN_STOCK'
          WHEN ISNULL(SUM(l.CantidadDisponible), 0) < a.undxCaja THEN 'STOCK_BAJO'
          ELSE 'STOCK_OK'
        END as EstadoStock
      FROM DIM_Articulo a
      LEFT JOIN DIM_Lote l ON a.ArticuloKey = l.ArticuloKey
      GROUP BY a.ArticuloKey, a.idArticulos, a.descripcionArticulos, a.UM, a.undxCaja, a.Categoria
      ORDER BY a.descripcionArticulos
    `);

    res.json({
      success: true,
      data: stockResult.recordset,
      total: stockResult.recordset.length
    });

  } catch (err) {
    console.error('Error al obtener stock general:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener stock general',
      detail: err.message
    });
  }
});

// GUARDAR COMPRAS (COSTEO)
app.post('/api/costeo', async (req, res) => {
  const { compras, factura } = req.body;

  if (!compras || !Array.isArray(compras) || compras.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No hay compras para guardar'
    });
  }

  const transaction = new sql.Transaction(pool);

  try {
    console.log('💾 Iniciando guardado de compras...');
    await transaction.begin();

    let comprasGuardadas = 0;

    // Procesar cada compra
    for (const compra of compras) {
      console.log('📦 Procesando compra:', compra);

      // Insertar en FACT_Compras
      const compraInsert = await transaction.request()
        .input('ArticuloKey', sql.Int, compra.ArticuloKey)
        .input('ProveedorKey', sql.Int, compra.ProveedorKey)
        .input('SociedadKey', sql.Int, compra.SociedadKey)
        .input('cantidad', sql.Decimal(18, 3), compra.cantidad)
        .input('importeNeto', sql.Decimal(18, 2), compra.importeNeto)
        .input('gastosEnvio', sql.Decimal(18, 2), compra.gastosEnvio)
        .input('impuestosInternos', sql.Decimal(18, 2), compra.impuestosInternos)
        .input('percepcionIVA', sql.Decimal(18, 2), compra.percepcionIVA)
        .input('percepcionIIBB', sql.Decimal(18, 2), compra.percepcionIIBB || 0)
        .input('netoImpuesto', sql.Decimal(18, 2), compra.subTotal)
        .input('subTotal', sql.Decimal(18, 2), compra.subTotal)
        .input('costoTotal', sql.Decimal(18, 2), compra.costoTotal)
        .input('PU', sql.Decimal(18, 2), compra.PU)
        .input('factura', sql.NVarChar(50), factura.numero)
        .input('FechaFactura', sql.Date, factura.fechaFactura)
        .input('FechaRecepcion', sql.Date, factura.fechaRecepcion)
        .query(`
          INSERT INTO FACT_Compras 
          (ArticuloKey, ProveedorKey, SociedadKey, cantidad, importeNeto, gastosEnvio, 
           impuestosInternos, percepcionIVA, percepcionIIBB, netoImpuesto, subTotal, 
           costoTotal, PU, factura, FechaFactura, FechaRecepcion)
          OUTPUT INSERTED.ComprasKey
          VALUES 
          (@ArticuloKey, @ProveedorKey, @SociedadKey, @cantidad, @importeNeto, @gastosEnvio,
           @impuestosInternos, @percepcionIVA, @percepcionIIBB, @netoImpuesto, @subTotal,
           @costoTotal, @PU, @factura, @FechaFactura, @FechaRecepcion)
        `);

      const comprasKey = compraInsert.recordset[0].ComprasKey;

      // Crear lote para esta compra
      await transaction.request()
        .input('ArticuloKey', sql.Int, compra.ArticuloKey)
        .input('ProveedorKey', sql.Int, compra.ProveedorKey)
        .input('Proveedor', sql.NVarChar(255), 'Proveedor por defecto') // Se puede obtener del proveedorKey
        .input('NumeroFacturaProveedor', sql.NVarChar(50), factura.numero)
        .input('FechaFactura', sql.Date, factura.fechaFactura)
        .input('CantidadInicial', sql.Decimal(18, 3), compra.cantidad)
        .input('CantidadDisponible', sql.Decimal(18, 3), compra.cantidad)
        .input('CostoUnitario', sql.Decimal(18, 2), compra.PU)
        .input('SociedadKey', sql.Int, compra.SociedadKey)
        .input('ComprasKey', sql.Int, comprasKey)
        .input('NumeroLote', sql.NVarChar(50), `LOTE-${factura.numero}-${comprasKey}`)
        .query(`
          INSERT INTO DIM_Lote 
          (ArticuloKey, ProveedorKey, Proveedor, NumeroFacturaProveedor, FechaFactura,
           CantidadInicial, CantidadDisponible, CostoUnitario, SociedadKey, ComprasKey, NumeroLote)
          VALUES 
          (@ArticuloKey, @ProveedorKey, @Proveedor, @NumeroFacturaProveedor, @FechaFactura,
           @CantidadInicial, @CantidadDisponible, @CostoUnitario, @SociedadKey, @ComprasKey, @NumeroLote)
        `);

      comprasGuardadas++;
      console.log(`✅ Compra ${comprasKey} guardada y lote creado`);
    }

    await transaction.commit();
    console.log(`✅ ${comprasGuardadas} compras guardadas exitosamente`);

    res.json({
      success: true,
      message: `${comprasGuardadas} compras guardadas correctamente`,
      comprasGuardadas: comprasGuardadas
    });

  } catch (err) {
    try {
      await transaction.rollback();
      console.log('🔙 Transacción revertida');
    } catch (rollbackErr) {
      console.error('Error en rollback:', rollbackErr.message);
    }

    console.error('❌ Error al guardar compras:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al guardar las compras',
      detail: err.message
    });
  }
});

// PREVENTA
app.post('/api/preventa', async (req, res) => {
  const { fecha, clienteKey, lineas } = req.body;

  if (!lineas || !Array.isArray(lineas) || lineas.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No hay artículos en la venta'
    });
  }

  try {
    // Obtener cliente
    const clienteResult = await queryDB(
      'SELECT Cliente FROM DIM_Cliente WHERE ClienteKey = @clienteKey',
      (r) => r.input('clienteKey', sql.Int, clienteKey)
    );

    const nombreCliente = clienteResult.recordset[0]?.Cliente || 'Cliente no encontrado';
    let total = 0;
    const lineasProcesadas = [];

    let html = `
      <div class="border rounded-lg p-4 mb-4 bg-blue-50">
        <h3 class="font-bold text-lg mb-2 text-blue-800">Resumen de Venta</h3>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Cliente:</strong> ${nombreCliente}</p>
      </div>
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2 text-left">Artículo</th>
            <th class="border p-2 text-center">Cajas</th>
            <th class="border p-2 text-right">Precio Caja</th>
            <th class="border p-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Procesar líneas secuencialmente
    for (const linea of lineas) {
      const articulo = await queryDB(
        'SELECT descripcionArticulos, undxCaja FROM DIM_Articulo WHERE ArticuloKey = @key',
        (r) => r.input('key', sql.Int, linea.articuloKey)
      );

      if (articulo.recordset.length > 0) {
        const art = articulo.recordset[0];
        const subtotal = linea.cajas * linea.precioCaja;
        total += subtotal;

        html += `
          <tr class="hover:bg-gray-50">
            <td class="border p-2">${art.descripcionArticulos}</td>
            <td class="border p-2 text-center">${linea.cajas}</td>
            <td class="border p-2 text-right">$${linea.precioCaja.toFixed(2)}</td>
            <td class="border p-2 text-right">$${subtotal.toFixed(2)}</td>
          </tr>
        `;

        lineasProcesadas.push({
          articuloKey: linea.articuloKey,
          cajas: linea.cajas,
          precioCaja: linea.precioCaja
        });
      }
    }

    html += `
        </tbody>
        <tfoot>
          <tr class="bg-green-50 font-bold">
            <td colspan="3" class="border p-2 text-right">TOTAL:</td>
            <td class="border p-2 text-right text-green-700">$${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    `;

    res.json({
      success: true,
      html,
      dataInsert: {
        fecha,
        clienteKey,
        sociedadKey: 1,
        lineas: lineasProcesadas
      }
    });

  } catch (err) {
    console.error('Error en preventa:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al calcular preventa',
      detail: err.message
    });
  }
});

// CREAR VENTA CON GESTIÓN DE LOTES - VERSIÓN FINAL CORREGIDA
app.post('/api/ventas', async (req, res) => {
  console.log('🛒 ===== INICIANDO PROCESO DE VENTA =====');
  console.log('📦 Datos recibidos:', JSON.stringify(req.body, null, 2));
  
  const { fecha, clienteKey, sociedadKey, lineas } = req.body;

  // Validaciones
  if (!fecha || !clienteKey || !lineas || !Array.isArray(lineas) || lineas.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Datos incompletos para la venta' 
    });
  }

  const transaction = new sql.Transaction(pool);
  
  try {
    console.log('🔁 Iniciando transacción...');
    await transaction.begin();

    // 1. Verificar cliente
    const clienteCheck = await transaction.request()
      .input('clienteKey', sql.Int, clienteKey)
      .query('SELECT ClienteKey, Cliente FROM DIM_Cliente WHERE ClienteKey = @clienteKey');

    if (clienteCheck.recordset.length === 0) {
      throw new Error(`Cliente con Key ${clienteKey} no existe`);
    }
    console.log(`✅ Cliente encontrado: ${clienteCheck.recordset[0].Cliente}`);

    // 2. Calcular total de la venta
    const totalVenta = lineas.reduce((sum, linea) => {
      return sum + (parseFloat(linea.cajas || 0) * parseFloat(linea.precioCaja || 0));
    }, 0);
    console.log(`💰 Total venta calculado: $${totalVenta}`);

    // 3. Insertar cabecera de venta
    console.log('📝 Insertando cabecera de venta...');
    const ventaInsert = await transaction.request()
      .input('Fecha', sql.Date, fecha)
      .input('ClienteKey', sql.Int, clienteKey)
      .input('SociedadKey', sql.Int, sociedadKey || 1)
      .input('TotalVenta', sql.Decimal(18, 2), totalVenta)
      .query(`
        INSERT INTO FACT_Ventas (Fecha, ClienteKey, SociedadKey, TotalVenta)
        OUTPUT INSERTED.VentaKey
        VALUES (@Fecha, @ClienteKey, @SociedadKey, @TotalVenta)
      `);

    const ventaKey = ventaInsert.recordset[0].VentaKey;
    console.log(`✅ Venta creada - ID: ${ventaKey}`);

    let totalCostoVenta = 0;

    // 4. Procesar cada línea de venta
    console.log(`📦 Procesando ${lineas.length} líneas...`);
    
    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i];
      console.log(`\n--- Procesando línea ${i + 1} ---`);
      
      if (!linea.articuloKey) {
        throw new Error(`Línea ${i + 1} no tiene articuloKey`);
      }

      // Obtener información del artículo
      const articuloInfo = await transaction.request()
        .input('articuloKey', sql.Int, linea.articuloKey)
        .query(`
          SELECT ArticuloKey, descripcionArticulos, undxCaja 
          FROM DIM_Articulo 
          WHERE ArticuloKey = @articuloKey
        `);

      if (articuloInfo.recordset.length === 0) {
        throw new Error(`Artículo ${linea.articuloKey} no encontrado`);
      }

      const articulo = articuloInfo.recordset[0];
      const undxCaja = articulo.undxCaja || 1;
      const cantidadUnidades = parseFloat(linea.cajas || 0) * undxCaja;

      console.log(`📊 Artículo: ${articulo.descripcionArticulos}`);
      console.log(`📦 Cajas: ${linea.cajas}, Unidades: ${cantidadUnidades}`);

      // Buscar lotes disponibles
      const lotesDisponibles = await transaction.request()
        .input('articuloKey', sql.Int, linea.articuloKey)
        .query(`
          SELECT LoteKey, NumeroLote, CantidadDisponible, CostoUnitario
          FROM DIM_Lote
          WHERE ArticuloKey = @articuloKey
            AND CantidadDisponible > 0
          ORDER BY FechaFactura ASC
        `);

      console.log(`📋 Lotes disponibles: ${lotesDisponibles.recordset.length}`);
      
      if (lotesDisponibles.recordset.length === 0) {
        throw new Error(`No hay stock disponible para ${articulo.descripcionArticulos}`);
      }

      let cantidadRestante = cantidadUnidades;
      let loteKeyUsado = null;
      let costoTotalLinea = 0;

      // Consumir de los lotes (FIFO)
      for (const lote of lotesDisponibles.recordset) {
        if (cantidadRestante <= 0) break;

        const cantidadAUsar = Math.min(cantidadRestante, lote.CantidadDisponible);
        console.log(`📦 Usando ${cantidadAUsar} unidades del lote ${lote.NumeroLote}`);
        
        // Actualizar cantidad disponible en el lote
        await transaction.request()
          .input('loteKey', sql.Int, lote.LoteKey)
          .input('cantidadUsada', sql.Decimal(18, 3), cantidadAUsar)
          .query(`
            UPDATE DIM_Lote 
            SET CantidadDisponible = CantidadDisponible - @cantidadUsada
            WHERE LoteKey = @loteKey
          `);

        costoTotalLinea += cantidadAUsar * lote.CostoUnitario;
        cantidadRestante -= cantidadAUsar;
        loteKeyUsado = lote.LoteKey;
      }

      // Verificar stock
      if (cantidadRestante > 0) {
        throw new Error(`Stock insuficiente para ${articulo.descripcionArticulos}. Faltan ${cantidadRestante} unidades`);
      }

      console.log(`✅ Stock suficiente`);

      // Calcular valores para la línea
      const ventaTotal = parseFloat(linea.cajas || 0) * parseFloat(linea.precioCaja || 0);
      const costoUnitario = cantidadUnidades > 0 ? costoTotalLinea / cantidadUnidades : 0;

      console.log(`💰 Línea - Venta: $${ventaTotal}, Costo: $${costoTotalLinea}`);

      // Acumular totales
      totalCostoVenta += costoTotalLinea;

      // Insertar línea de venta (SOLO campos no computados)
      console.log(`💾 Insertando línea en FACT_Ventas_Linea...`);
      await transaction.request()
        .input('VentaKey', sql.Int, ventaKey)
        .input('ArticuloKey', sql.Int, linea.articuloKey)
        .input('LoteKey', sql.Int, loteKeyUsado)
        .input('CantidadUnidades', sql.Decimal(18, 3), cantidadUnidades)
        .input('CantidadCajas', sql.Decimal(18, 3), parseFloat(linea.cajas || 0))
        .input('PrecioCaja', sql.Decimal(18, 2), parseFloat(linea.precioCaja || 0))
        .input('PrecioUnidad', sql.Decimal(18, 2), parseFloat(linea.precioCaja || 0) / undxCaja)
        .input('VentaTotal', sql.Decimal(18, 2), ventaTotal)
        .input('CostoUnitario', sql.Decimal(18, 2), costoUnitario)
        .input('CostoTotal', sql.Decimal(18, 2), costoTotalLinea)
        .query(`
          INSERT INTO FACT_Ventas_Linea 
          (VentaKey, ArticuloKey, LoteKey, CantidadUnidades, CantidadCajas, 
           PrecioCaja, PrecioUnidad, VentaTotal, CostoUnitario, CostoTotal)
          VALUES 
          (@VentaKey, @ArticuloKey, @LoteKey, @CantidadUnidades, @CantidadCajas,
           @PrecioCaja, @PrecioUnidad, @VentaTotal, @CostoUnitario, @CostoTotal)
        `);

      console.log(`✅ Línea ${i + 1} insertada correctamente`);
    }

    // 5. Calcular margen total (la base de datos calculará automáticamente los márgenes por línea)
    const totalMargenVenta = totalVenta - totalCostoVenta;
    
    // 6. Actualizar totales en cabecera (solo campos no computados)
    console.log(`📊 Actualizando totales - Costo: $${totalCostoVenta}`);
    await transaction.request()
      .input('ventaKey', sql.Int, ventaKey)
      .input('totalCosto', sql.Decimal(18, 2), totalCostoVenta)
      .query(`
        UPDATE FACT_Ventas 
        SET TotalCosto = @totalCosto
        WHERE VentaKey = @ventaKey
      `);

    // 7. Confirmar transacción
    await transaction.commit();
    console.log(`🎉 VENTA ${ventaKey} COMPLETADA EXITOSAMENTE`);
    console.log('=========================================\n');

    res.json({ 
      success: true, 
      ventaKey,
      totalVenta: totalVenta.toFixed(2),
      totalCosto: totalCostoVenta.toFixed(2),
      totalMargen: totalMargenVenta.toFixed(2),
      message: `Venta registrada correctamente (ID: ${ventaKey})`
    });

  } catch (err) {
    // Rollback en caso de error
    try {
      await transaction.rollback();
      console.log('🔙 Transacción revertida debido a error');
    } catch (rollbackErr) {
      console.error('Error en rollback:', rollbackErr.message);
    }

    console.error('❌ ERROR DETALLADO:', err.message);
    console.log('=========================================\n');

    res.status(500).json({
      success: false,
      message: 'Error al registrar la venta',
      detail: err.message
    });
  }
});

// OBTENER VENTAS - CORREGIDO CON ESTRUCTURA REAL
app.get('/api/ventas', async (req, res) => {
  try {
    console.log('📋 Obteniendo lista de ventas...');
    const { id, fechaDesde, fechaHasta } = req.query;
    
    let query = `
      SELECT 
        v.VentaKey,
        v.Fecha,
        v.TotalVenta,
        v.TotalCosto,
        v.TotalMargen,
        c.ClienteKey,
        c.Cliente,
        s.denominacionSociedad
      FROM FACT_Ventas v
      LEFT JOIN DIM_Cliente c ON v.ClienteKey = c.ClienteKey
      LEFT JOIN DIM_Sociedad s ON v.SociedadKey = s.SociedadKey
      WHERE 1=1
    `;
    
    const request = pool.request();
    
    // Filtros
    if (id) {
      query += ' AND v.VentaKey = @id';
      request.input('id', sql.Int, parseInt(id, 10));
    }
    
    if (fechaDesde) {
      query += ' AND v.Fecha >= @fechaDesde';
      request.input('fechaDesde', sql.Date, fechaDesde);
    }
    
    if (fechaHasta) {
      query += ' AND v.Fecha <= @fechaHasta';
      request.input('fechaHasta', sql.Date, fechaHasta);
    }
    
    query += ' ORDER BY v.VentaKey DESC';
    
    const result = await request.query(query);
    
    console.log(`✅ Ventas obtenidas: ${result.recordset.length}`);
    
    res.json({
      success: true,
      data: result.recordset,
      total: result.recordset.length
    });
  } catch (err) {
    console.error('❌ Error al obtener ventas:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas',
      detail: err.message
    });
  }
});

// OBTENER VENTA ESPECÍFICA POR ID - CORREGIDO CON ESTRUCTURA REAL
app.get('/api/ventas/:id', async (req, res) => {
  const ventaKey = parseInt(req.params.id, 10);
  
  try {
    console.log(`📋 Obteniendo venta ${ventaKey}...`);
    
    // Obtener cabecera de venta
    const ventaResult = await queryDB(`
      SELECT 
        v.VentaKey,
        v.Fecha,
        v.TotalVenta,
        v.TotalCosto,
        v.TotalMargen,
        c.ClienteKey,
        c.Cliente,
        s.SociedadKey,
        s.denominacionSociedad
      FROM FACT_Ventas v
      LEFT JOIN DIM_Cliente c ON v.ClienteKey = c.ClienteKey
      LEFT JOIN DIM_Sociedad s ON v.SociedadKey = s.SociedadKey
      WHERE v.VentaKey = @ventaKey
    `, (r) => {
      r.input('ventaKey', sql.Int, ventaKey);
    });

    if (ventaResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    const venta = ventaResult.recordset[0];

    // Obtener líneas de venta
    const lineasResult = await queryDB(`
      SELECT 
        vl.LineaKey,
        vl.VentaKey,
        vl.ArticuloKey,
        vl.LoteKey,
        vl.CantidadUnidades,
        vl.CantidadCajas,
        vl.PrecioCaja,
        vl.PrecioUnidad,
        vl.VentaTotal,
        vl.CostoUnitario,
        vl.CostoTotal,
        vl.MargenTotal,
        vl.PorcentajeMargen,
        a.idArticulos as CodigoArticulo,
        a.descripcionArticulos as DescripcionArticulo,
        a.UM,
        a.undxCaja,
        a.Categoria
      FROM FACT_Ventas_Linea vl
      LEFT JOIN DIM_Articulo a ON vl.ArticuloKey = a.ArticuloKey
      WHERE vl.VentaKey = @ventaKey
      ORDER BY vl.LineaKey
    `, (r) => {
      r.input('ventaKey', sql.Int, ventaKey);
    });

    venta.Lineas = lineasResult.recordset;

    res.json({
      success: true,
      data: venta
    });

  } catch (err) {
    console.error('❌ Error al obtener venta:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener venta',
      detail: err.message
    });
  }
});
// ACTUALIZAR VENTA EXISTENTE - CORREGIDO CON ESTRUCTURA REAL
app.put('/api/ventas/:id', async (req, res) => {
  const ventaKey = parseInt(req.params.id, 10);
  const { fecha, clienteKey, sociedadKey, lineas } = req.body;

  console.log(`🔄 Actualizando venta ${ventaKey}...`);
  
  if (!fecha || !clienteKey || !lineas || !Array.isArray(lineas) || lineas.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Datos incompletos para la venta' 
    });
  }

  const transaction = new sql.Transaction(pool);
  
  try {
    await transaction.begin();

    // 1. Verificar que la venta existe
    const ventaCheck = await transaction.request()
      .input('ventaKey', sql.Int, ventaKey)
      .query('SELECT VentaKey FROM FACT_Ventas WHERE VentaKey = @ventaKey');

    if (ventaCheck.recordset.length === 0) {
      throw new Error(`Venta ${ventaKey} no existe`);
    }

    // 2. Eliminar líneas existentes
    await transaction.request()
      .input('ventaKey', sql.Int, ventaKey)
      .query('DELETE FROM FACT_Ventas_Linea WHERE VentaKey = @ventaKey');

    // 3. Revertir stock de lotes (restaurar cantidades)
    const lineasAnteriores = await transaction.request()
      .input('ventaKey', sql.Int, ventaKey)
      .query(`
        SELECT ArticuloKey, LoteKey, CantidadUnidades 
        FROM FACT_Ventas_Linea 
        WHERE VentaKey = @ventaKey
      `);

    for (const linea of lineasAnteriores.recordset) {
      if (linea.LoteKey) {
        await transaction.request()
          .input('loteKey', sql.Int, linea.LoteKey)
          .input('cantidad', sql.Decimal(18, 3), linea.CantidadUnidades)
          .query(`
            UPDATE DIM_Lote 
            SET CantidadDisponible = CantidadDisponible + @cantidad
            WHERE LoteKey = @loteKey
          `);
      }
    }

    // 4. Recalcular totales
    const totalVenta = lineas.reduce((sum, linea) => {
      return sum + (parseFloat(linea.cajas || 0) * parseFloat(linea.precioCaja || 0));
    }, 0);

    let totalCostoVenta = 0;

    // 5. Procesar nuevas líneas
    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i];
      
      if (!linea.articuloKey) {
        throw new Error(`Línea ${i + 1} no tiene articuloKey`);
      }

      // Obtener información del artículo
      const articuloInfo = await transaction.request()
        .input('articuloKey', sql.Int, linea.articuloKey)
        .query(`
          SELECT ArticuloKey, descripcionArticulos, undxCaja 
          FROM DIM_Articulo 
          WHERE ArticuloKey = @articuloKey
        `);

      if (articuloInfo.recordset.length === 0) {
        throw new Error(`Artículo ${linea.articuloKey} no encontrado`);
      }

      const articulo = articuloInfo.recordset[0];
      const undxCaja = articulo.undxCaja || 1;
      const cantidadUnidades = parseFloat(linea.cajas || 0) * undxCaja;

      // Buscar lotes disponibles y consumir stock (FIFO)
      const lotesDisponibles = await transaction.request()
        .input('articuloKey', sql.Int, linea.articuloKey)
        .query(`
          SELECT LoteKey, NumeroLote, CantidadDisponible, CostoUnitario
          FROM DIM_Lote
          WHERE ArticuloKey = @articuloKey
            AND CantidadDisponible > 0
          ORDER BY FechaFactura ASC
        `);

      if (lotesDisponibles.recordset.length === 0) {
        throw new Error(`No hay stock disponible para ${articulo.descripcionArticulos}`);
      }

      let cantidadRestante = cantidadUnidades;
      let loteKeyUsado = null;
      let costoTotalLinea = 0;

      for (const lote of lotesDisponibles.recordset) {
        if (cantidadRestante <= 0) break;

        const cantidadAUsar = Math.min(cantidadRestante, lote.CantidadDisponible);
        
        await transaction.request()
          .input('loteKey', sql.Int, lote.LoteKey)
          .input('cantidadUsada', sql.Decimal(18, 3), cantidadAUsar)
          .query(`
            UPDATE DIM_Lote 
            SET CantidadDisponible = CantidadDisponible - @cantidadUsada
            WHERE LoteKey = @loteKey
          `);

        costoTotalLinea += cantidadAUsar * lote.CostoUnitario;
        cantidadRestante -= cantidadAUsar;
        loteKeyUsado = lote.LoteKey;
      }

      if (cantidadRestante > 0) {
        throw new Error(`Stock insuficiente para ${articulo.descripcionArticulos}. Faltan ${cantidadRestante} unidades`);
      }

      // Calcular valores para la línea
      const ventaTotal = parseFloat(linea.cajas || 0) * parseFloat(linea.precioCaja || 0);
      const costoUnitario = cantidadUnidades > 0 ? costoTotalLinea / cantidadUnidades : 0;
      const margenTotal = ventaTotal - costoTotalLinea;
      const porcentajeMargen = ventaTotal > 0 ? (margenTotal / ventaTotal) * 100 : 0;

      totalCostoVenta += costoTotalLinea;

      // Insertar nueva línea
      await transaction.request()
        .input('VentaKey', sql.Int, ventaKey)
        .input('ArticuloKey', sql.Int, linea.articuloKey)
        .input('LoteKey', sql.Int, loteKeyUsado)
        .input('CantidadUnidades', sql.Decimal(18, 3), cantidadUnidades)
        .input('CantidadCajas', sql.Decimal(18, 3), parseFloat(linea.cajas || 0))
        .input('PrecioCaja', sql.Decimal(18, 2), parseFloat(linea.precioCaja || 0))
        .input('PrecioUnidad', sql.Decimal(18, 2), parseFloat(linea.precioCaja || 0) / undxCaja)
        .input('VentaTotal', sql.Decimal(18, 2), ventaTotal)
        .input('CostoUnitario', sql.Decimal(18, 2), costoUnitario)
        .input('CostoTotal', sql.Decimal(18, 2), costoTotalLinea)
        .input('MargenTotal', sql.Decimal(18, 2), margenTotal)
        .input('PorcentajeMargen', sql.Decimal(18, 2), porcentajeMargen)
        .query(`
          INSERT INTO FACT_Ventas_Linea 
          (VentaKey, ArticuloKey, LoteKey, CantidadUnidades, CantidadCajas, 
           PrecioCaja, PrecioUnidad, VentaTotal, CostoUnitario, CostoTotal,
           MargenTotal, PorcentajeMargen)
          VALUES 
          (@VentaKey, @ArticuloKey, @LoteKey, @CantidadUnidades, @CantidadCajas,
           @PrecioCaja, @PrecioUnidad, @VentaTotal, @CostoUnitario, @CostoTotal,
           @MargenTotal, @PorcentajeMargen)
        `);
    }

    // 6. Actualizar cabecera de venta
    const totalMargenVenta = totalVenta - totalCostoVenta;
    
    await transaction.request()
      .input('ventaKey', sql.Int, ventaKey)
      .input('fecha', sql.Date, fecha)
      .input('clienteKey', sql.Int, clienteKey)
      .input('sociedadKey', sql.Int, sociedadKey || 1)
      .input('totalVenta', sql.Decimal(18, 2), totalVenta)
      .input('totalCosto', sql.Decimal(18, 2), totalCostoVenta)
      .input('totalMargen', sql.Decimal(18, 2), totalMargenVenta)
      .query(`
        UPDATE FACT_Ventas 
        SET Fecha = @fecha,
            ClienteKey = @clienteKey,
            SociedadKey = @sociedadKey,
            TotalVenta = @totalVenta,
            TotalCosto = @totalCosto,
            TotalMargen = @totalMargen
        WHERE VentaKey = @ventaKey
      `);

    await transaction.commit();
    console.log(`✅ VENTA ${ventaKey} ACTUALIZADA EXITOSAMENTE`);

    res.json({ 
      success: true, 
      ventaKey,
      totalVenta: totalVenta.toFixed(2),
      totalCosto: totalCostoVenta.toFixed(2),
      totalMargen: totalMargenVenta.toFixed(2),
      message: `Venta ${ventaKey} actualizada correctamente`
    });

  } catch (err) {
    try {
      await transaction.rollback();
      console.log('🔙 Transacción revertida debido a error');
    } catch (rollbackErr) {
      console.error('Error en rollback:', rollbackErr.message);
    }

    console.error('❌ ERROR ACTUALIZANDO VENTA:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la venta',
      detail: err.message
    });
  }
});


// ========================================
// ENDPOINTS ADICIONALES ÚTILES
// ========================================

// AGREGAR STOCK (compra simulada)
app.post('/api/agregar-stock', async (req, res) => {
  const { articuloKey, cantidad, precioUnitario, numeroLote } = req.body;

  try {
    await queryDB(`
      INSERT INTO DIM_Lote 
      (ArticuloKey, ProveedorKey, Proveedor, NumeroFacturaProveedor, FechaFactura, 
       CantidadInicial, CantidadDisponible, CostoUnitario, NumeroLote)
      VALUES 
      (@articuloKey, 1, 'PROVEEDOR MANUAL', 'MANUAL-${Date.now()}', GETDATE(),
       @cantidad, @cantidad, @precioUnitario, @numeroLote)
    `, (r) => {
      r.input('articuloKey', sql.Int, articuloKey);
      r.input('cantidad', sql.Decimal(18, 3), cantidad);
      r.input('precioUnitario', sql.Decimal(18, 2), precioUnitario);
      r.input('numeroLote', sql.NVarChar(50), numeroLote || `LOTE-MANUAL-${Date.now()}`);
    });

    res.json({
      success: true,
      message: 'Stock agregado correctamente'
    });

  } catch (err) {
    console.error('Error al agregar stock:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al agregar stock',
      detail: err.message
    });
  }
});

// DASHBOARD - Estadísticas
app.get('/api/dashboard', async (req, res) => {
  try {
    const [
      totalVentas,
      totalClientes,
      totalArticulos,
      ventasHoy
    ] = await Promise.all([
      queryDB('SELECT COUNT(*) as count, ISNULL(SUM(TotalVenta), 0) as total FROM FACT_Ventas'),
      queryDB('SELECT COUNT(*) as count FROM DIM_Cliente'),
      queryDB('SELECT COUNT(*) as count FROM DIM_Articulo'),
      queryDB('SELECT COUNT(*) as count, ISNULL(SUM(TotalVenta), 0) as total FROM FACT_Ventas WHERE Fecha = CAST(GETDATE() AS DATE)')
    ]);

    res.json({
      success: true,
      data: {
        totalVentas: totalVentas.recordset[0].count,
        montoTotalVentas: totalVentas.recordset[0].total,
        totalClientes: totalClientes.recordset[0].count,
        totalArticulos: totalArticulos.recordset[0].count,
        ventasHoy: ventasHoy.recordset[0].count,
        montoHoy: ventasHoy.recordset[0].total
      }
    });

  } catch (err) {
    console.error('Error en dashboard:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error al cargar dashboard',
      detail: err.message
    });
  }
});

// ========================================
// MANEJO DE ERRORES GLOBAL
// ========================================
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

// Manejo graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Cerrando servidor...');
  if (pool) {
    await pool.close();
  }
  process.exit(0);
});