CREATE TABLE sucursales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(30),
    activa BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT now()
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    sucursal_id INTEGER REFERENCES sucursales(id),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol VARCHAR(30) NOT NULL, -- admin, encargado, tecnico
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT now()
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT now()
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,

    -- Relación
    categoria_id INTEGER NOT NULL REFERENCES categorias(id),

    -- Identificación
    nombre VARCHAR(150) NOT NULL,
    sku VARCHAR(100) UNIQUE,

    -- Contenido
    descripcion TEXT,
    imagen TEXT, -- ruta o URL (CDN, S3, etc)

    -- Inventario
    stock INTEGER NOT NULL DEFAULT 0,

    -- Precios
    precio_compra NUMERIC(10,2) NOT NULL,
    precio_venta NUMERIC(10,2) NOT NULL,

    -- Datos flexibles
    atributos JSONB DEFAULT '{}'::jsonb,
    compatibilidad JSONB DEFAULT '[]'::jsonb,

    -- Estado
    activo BOOLEAN DEFAULT TRUE,

    -- Auditoría
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP DEFAULT now()
);

CREATE TABLE stock_sucursal (
    id SERIAL PRIMARY KEY,
    sucursal_id INTEGER REFERENCES sucursales(id),
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL DEFAULT 0,
    actualizado_en TIMESTAMP DEFAULT now(),
    UNIQUE (sucursal_id, producto_id)
);

CREATE TABLE movimientos_stock (
    id SERIAL PRIMARY KEY,
    sucursal_id INTEGER REFERENCES sucursales(id),
    producto_id INTEGER REFERENCES productos(id),
    tipo VARCHAR(30) NOT NULL, 
    -- ingreso, venta, reparacion, ajuste
    cantidad INTEGER NOT NULL,
    referencia_tipo VARCHAR(30), 
    -- venta, reparacion, manual
    referencia_id INTEGER,
    creado_en TIMESTAMP DEFAULT now()
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(150),
    creado_en TIMESTAMP DEFAULT now()
);

CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    sucursal_id INTEGER REFERENCES sucursales(id),
    usuario_id INTEGER REFERENCES usuarios(id),
    cliente_id INTEGER REFERENCES clientes(id),
    total NUMERIC(10,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'completada',
    creado_en TIMESTAMP DEFAULT now()
);

CREATE TABLE venta_items (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);

CREATE TABLE reparaciones (
    id SERIAL PRIMARY KEY,
    sucursal_id INTEGER REFERENCES sucursales(id),
    cliente_id INTEGER REFERENCES clientes(id),
    equipo TEXT NOT NULL,           -- Ej: iPhone 11
    problema_reportado TEXT,
    estado VARCHAR(30) DEFAULT 'pendiente',
    costo_total NUMERIC(10,2),
    creado_en TIMESTAMP DEFAULT now(),
    actualizado_en TIMESTAMP
);
