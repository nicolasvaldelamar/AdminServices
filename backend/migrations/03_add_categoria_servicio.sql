-- Agrega categoría/servicio (tipo de trabajo) para distinguir diferentes servicios

ALTER TABLE servicios
ADD COLUMN IF NOT EXISTS categoria_servicio VARCHAR(150) DEFAULT 'general';

-- Índice para consultas por categoría
CREATE INDEX IF NOT EXISTS idx_servicios_categoria ON servicios(categoria_servicio);

COMMIT;
