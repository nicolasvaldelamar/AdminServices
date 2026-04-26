-- ============================================
-- MEJORAS: Estado por asignar y tipo de solicitud
-- ============================================

-- Agregar nuevo estado "por_asignar"
ALTER TABLE servicios DROP CONSTRAINT IF EXISTS servicios_estado_check;
ALTER TABLE servicios ADD CONSTRAINT servicios_estado_check CHECK (
  estado IN (
    'por_asignar',    -- NUEVO: Solicitud recibida, sin técnico asignado
    'recibido',
    'en_diagnostico',
    'cotizado',
    'aprobado',
    'en_reparacion',
    'listo',
    'entregado',
    'facturado',
    'cerrado'
  )
);

-- Agregar campo tipo_solicitud
ALTER TABLE servicios ADD COLUMN IF NOT EXISTS tipo_solicitud VARCHAR(20) DEFAULT 'servicio' CHECK (tipo_solicitud IN ('servicio', 'cotizacion'));

-- ============================================
-- TABLA: FACTURAS
-- ============================================
CREATE TABLE IF NOT EXISTS facturas (
  id SERIAL PRIMARY KEY,
  numero_factura VARCHAR(50) UNIQUE NOT NULL,
  servicio_id INTEGER REFERENCES servicios(id) ON DELETE CASCADE,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id),
  
  -- Detalles de la factura
  fecha_emision DATE DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  
  -- Items de la factura (JSON array)
  items JSONB NOT NULL,
  
  -- Montos
  subtotal DECIMAL(10, 2) NOT NULL,
  iva DECIMAL(10, 2) DEFAULT 0,
  descuento DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Estado
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagada', 'vencida', 'anulada')),
  
  -- Notas
  notas TEXT,
  terminos_condiciones TEXT,
  
  -- Auditoría
  creada_por INTEGER REFERENCES usuarios(id),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para facturas
CREATE INDEX IF NOT EXISTS idx_facturas_numero ON facturas(numero_factura);
CREATE INDEX IF NOT EXISTS idx_facturas_servicio ON facturas(servicio_id);
CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
CREATE INDEX IF NOT EXISTS idx_facturas_fecha ON facturas(fecha_emision);

-- ============================================
-- TABLA: COTIZACIONES
-- ============================================
CREATE TABLE IF NOT EXISTS cotizaciones (
  id SERIAL PRIMARY KEY,
  numero_cotizacion VARCHAR(50) UNIQUE NOT NULL,
  servicio_id INTEGER REFERENCES servicios(id) ON DELETE CASCADE,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id),
  
  -- Detalles de la cotización
  fecha_emision DATE DEFAULT CURRENT_DATE,
  fecha_validez DATE,
  
  -- Items de la cotización (JSON array)
  items JSONB NOT NULL,
  
  -- Montos
  subtotal DECIMAL(10, 2) NOT NULL,
  iva DECIMAL(10, 2) DEFAULT 0,
  descuento DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Estado
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'vencida')),
  fecha_aprobacion TIMESTAMP,
  aprobada_por VARCHAR(100),
  
  -- Notas
  notas TEXT,
  terminos_condiciones TEXT,
  
  -- Auditoría
  creada_por INTEGER REFERENCES usuarios(id),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para cotizaciones
CREATE INDEX IF NOT EXISTS idx_cotizaciones_numero ON cotizaciones(numero_cotizacion);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_servicio ON cotizaciones(servicio_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente ON cotizaciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_fecha ON cotizaciones(fecha_emision);

-- Triggers para actualizar timestamps
DROP TRIGGER IF EXISTS trigger_actualizar_facturas ON facturas;
CREATE TRIGGER trigger_actualizar_facturas
BEFORE UPDATE ON facturas
FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

DROP TRIGGER IF EXISTS trigger_actualizar_cotizaciones ON cotizaciones;
CREATE TRIGGER trigger_actualizar_cotizaciones
BEFORE UPDATE ON cotizaciones
FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Función para generar número de factura
CREATE OR REPLACE FUNCTION generar_numero_factura()
RETURNS TEXT AS $$
DECLARE
  siguiente_numero INTEGER;
  anio TEXT;
BEGIN
  anio := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero_factura FROM 'F-' || anio || '-(.*)') AS INTEGER)), 0) + 1
  INTO siguiente_numero
  FROM facturas
  WHERE numero_factura LIKE 'F-' || anio || '-%';
  
  RETURN 'F-' || anio || '-' || LPAD(siguiente_numero::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Función para generar número de cotización
CREATE OR REPLACE FUNCTION generar_numero_cotizacion()
RETURNS TEXT AS $$
DECLARE
  siguiente_numero INTEGER;
  anio TEXT;
BEGIN
  anio := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero_cotizacion FROM 'C-' || anio || '-(.*)') AS INTEGER)), 0) + 1
  INTO siguiente_numero
  FROM cotizaciones
  WHERE numero_cotizacion LIKE 'C-' || anio || '-%';
  
  RETURN 'C-' || anio || '-' || LPAD(siguiente_numero::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ACTUALIZAR SERVICIOS EXISTENTES
-- ============================================

-- Actualizar servicios sin tipo_solicitud
UPDATE servicios 
SET tipo_solicitud = 'servicio' 
WHERE tipo_solicitud IS NULL;

COMMIT;
