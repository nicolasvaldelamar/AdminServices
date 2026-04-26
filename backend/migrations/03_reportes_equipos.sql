-- ============================================
-- TABLA: REPORTES DE EQUIPOS
-- ============================================

CREATE TABLE IF NOT EXISTS reportes_equipos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  creado_por INTEGER REFERENCES usuarios(id),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reportes_equipos_items (
  id SERIAL PRIMARY KEY,
  reporte_id INTEGER NOT NULL REFERENCES reportes_equipos(id) ON DELETE CASCADE,
  numero INTEGER,
  usuario VARCHAR(150),
  cargo VARCHAR(150),
  empresa VARCHAR(150),
  area_asignacion VARCHAR(150),
  nombre_equipo VARCHAR(150),
  marca VARCHAR(100),
  modelo VARCHAR(100),
  serial VARCHAR(100),
  tipo_equipo VARCHAR(50),
  sistema_operativo VARCHAR(100),
  office VARCHAR(50),
  mouse VARCHAR(150),
  teclado VARCHAR(150),
  base VARCHAR(150),
  monitor VARCHAR(150),
  procesador VARCHAR(150),
  ram VARCHAR(50),
  disco_duro VARCHAR(100),
  antivirus VARCHAR(100),
  observaciones TEXT,
  fecha VARCHAR(50),
  firma VARCHAR(150),
  id_equipo VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_reportes_equipos_creado_por ON reportes_equipos(creado_por);
CREATE INDEX IF NOT EXISTS idx_reportes_equipos_items_reporte ON reportes_equipos_items(reporte_id);

CREATE TRIGGER trigger_actualizar_reportes_equipos
BEFORE UPDATE ON reportes_equipos
FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
