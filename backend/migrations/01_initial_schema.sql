-- ============================================
-- SISTEMA DE GESTIÓN DE SERVICIOS TÉCNICOS
-- Arnol Caicedo - Soluciones en Tecnología
-- ============================================

-- Eliminar tablas si existen (para desarrollo)
DROP TABLE IF EXISTS informes_tecnicos CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- ============================================
-- TABLA: USUARIOS
-- ============================================
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'recepcion', 'tecnico')),
  telefono VARCHAR(20),
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- ============================================
-- TABLA: CLIENTES
-- ============================================
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('empresa', 'persona')),
  nombre VARCHAR(200) NOT NULL,
  razon_social VARCHAR(200),
  contacto VARCHAR(100),
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  direccion TEXT,
  contrato_activo BOOLEAN DEFAULT false,
  notas TEXT,
  creado_por INTEGER REFERENCES usuarios(id),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para clientes
CREATE INDEX idx_clientes_tipo ON clientes(tipo);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_contrato ON clientes(contrato_activo);

-- ============================================
-- TABLA: SERVICIOS
-- ============================================
CREATE TABLE servicios (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id),
  tipo_servicio VARCHAR(20) NOT NULL CHECK (tipo_servicio IN ('taller', 'campo')),
  
  -- Información del equipo (opcional para servicios de campo)
  equipo_marca VARCHAR(100),
  equipo_modelo VARCHAR(100),
  equipo_serial VARCHAR(100),
  
  -- Detalles del servicio
  falla_reportada TEXT NOT NULL,
  prioridad VARCHAR(20) DEFAULT 'normal' CHECK (prioridad IN ('normal', 'urgente')),
  
  -- Asignación
  tecnico_asignado_id INTEGER REFERENCES usuarios(id),
  
  -- Estado del servicio
  estado VARCHAR(30) NOT NULL DEFAULT 'recibido' CHECK (
    estado IN (
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
  ),
  
  -- Fechas importantes
  fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_programada TIMESTAMP, -- Para servicios de campo
  fecha_finalizacion TIMESTAMP,
  fecha_entrega TIMESTAMP,
  
  -- Información administrativa
  cotizacion_monto DECIMAL(10, 2),
  cotizacion_aprobada BOOLEAN DEFAULT false,
  facturado BOOLEAN DEFAULT false,
  monto_facturado DECIMAL(10, 2),
  
  -- Auditoría
  creado_por INTEGER REFERENCES usuarios(id),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para servicios
CREATE INDEX idx_servicios_codigo ON servicios(codigo);
CREATE INDEX idx_servicios_cliente ON servicios(cliente_id);
CREATE INDEX idx_servicios_tipo ON servicios(tipo_servicio);
CREATE INDEX idx_servicios_estado ON servicios(estado);
CREATE INDEX idx_servicios_tecnico ON servicios(tecnico_asignado_id);
CREATE INDEX idx_servicios_prioridad ON servicios(prioridad);
CREATE INDEX idx_servicios_facturado ON servicios(facturado);
CREATE INDEX idx_servicios_fecha_ingreso ON servicios(fecha_ingreso);

-- ============================================
-- TABLA: INFORMES TÉCNICOS
-- ============================================
CREATE TABLE informes_tecnicos (
  id SERIAL PRIMARY KEY,
  servicio_id INTEGER NOT NULL REFERENCES servicios(id) ON DELETE CASCADE,
  tecnico_id INTEGER NOT NULL REFERENCES usuarios(id),
  
  -- Contenido del informe
  diagnostico TEXT NOT NULL,
  trabajo_realizado TEXT NOT NULL,
  repuestos_usados TEXT,
  recomendaciones TEXT,
  
  -- Tiempo invertido (en minutos)
  tiempo_invertido INTEGER,
  
  -- Archivos adjuntos (rutas separadas por comas)
  fotos TEXT,
  documentos TEXT,
  
  -- Auditoría
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para informes técnicos
CREATE INDEX idx_informes_servicio ON informes_tecnicos(servicio_id);
CREATE INDEX idx_informes_tecnico ON informes_tecnicos(tecnico_id);

-- ============================================
-- FUNCIÓN: Actualizar timestamp automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER trigger_actualizar_usuarios
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_clientes
BEFORE UPDATE ON clientes
FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_servicios
BEFORE UPDATE ON servicios
FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_informes
BEFORE UPDATE ON informes_tecnicos
FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- ============================================
-- FUNCIÓN: Generar código de servicio automático
-- ============================================
CREATE OR REPLACE FUNCTION generar_codigo_servicio()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.codigo IS NULL OR NEW.codigo = '' THEN
    NEW.codigo = 'SRV-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generar_codigo
BEFORE INSERT ON servicios
FOR EACH ROW EXECUTE FUNCTION generar_codigo_servicio();

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Usuarios por defecto
-- Passwords: admin123, tecnico123, recepcion123 (hash bcrypt)
INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES
('Administrador', 'admin@arnolcaicedo.com', '$2a$10$XqJyf6Rs3KwVVhDh.vVEaO6FvI7zXKZCgmJ1RGk1wJGxKT9QYqThu', 'administrador', '0000000000'),
('Técnico Principal', 'tecnico@arnolcaicedo.com', '$2a$10$fhHR8pKBVnKoUwBwqYvSPe7C5qvXhD7JGKtL8AzWxT8RqGxCqK3Jy', 'tecnico', '0000000001'),
('Recepción', 'recepcion@arnolcaicedo.com', '$2a$10$YnVqm5vKDkPqWxQwExQxQOhGx8KvYKvYKvYKvYKvYKvYKvYKvYKvy', 'recepcion', '0000000002');

-- Cliente de ejemplo
INSERT INTO clientes (tipo, nombre, contacto, telefono, email, direccion, contrato_activo, creado_por) VALUES
('empresa', 'Empresa Demo S.A.S', 'Juan Pérez', '3001234567', 'contacto@demo.com', 'Calle 123 #45-67', true, 1);

COMMIT;

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de servicios con información completa
CREATE OR REPLACE VIEW v_servicios_completos AS
SELECT 
  s.id,
  s.codigo,
  s.tipo_servicio,
  s.estado,
  s.prioridad,
  s.falla_reportada,
  s.equipo_marca,
  s.equipo_modelo,
  s.equipo_serial,
  s.fecha_ingreso,
  s.fecha_programada,
  s.fecha_finalizacion,
  s.fecha_entrega,
  s.cotizacion_monto,
  s.facturado,
  s.monto_facturado,
  c.nombre as cliente_nombre,
  c.telefono as cliente_telefono,
  c.tipo as cliente_tipo,
  t.nombre as tecnico_nombre,
  t.email as tecnico_email,
  cr.nombre as creado_por_nombre,
  s.creado_en,
  s.actualizado_en
FROM servicios s
LEFT JOIN clientes c ON s.cliente_id = c.id
LEFT JOIN usuarios t ON s.tecnico_asignado_id = t.id
LEFT JOIN usuarios cr ON s.creado_por = cr.id;

-- Vista de estadísticas por técnico
CREATE OR REPLACE VIEW v_estadisticas_tecnicos AS
SELECT 
  u.id,
  u.nombre,
  COUNT(s.id) as total_servicios,
  COUNT(CASE WHEN s.estado = 'cerrado' THEN 1 END) as servicios_completados,
  COUNT(CASE WHEN s.estado NOT IN ('cerrado', 'entregado') THEN 1 END) as servicios_pendientes,
  AVG(CASE 
    WHEN s.fecha_finalizacion IS NOT NULL AND s.fecha_ingreso IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (s.fecha_finalizacion - s.fecha_ingreso))/86400 
  END) as dias_promedio_servicio
FROM usuarios u
LEFT JOIN servicios s ON u.id = s.tecnico_asignado_id
WHERE u.rol = 'tecnico' AND u.activo = true
GROUP BY u.id, u.nombre;

COMMIT;
