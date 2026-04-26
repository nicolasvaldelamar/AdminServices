-- Recreate v_servicios_completos to expose foreign key ids and newer columns
-- (categoria_servicio, cotizacion_aprobada). The previous version omitted
-- tecnico_asignado_id, which broke filtering when a técnico listed services.

DROP VIEW IF EXISTS v_servicios_completos CASCADE;

CREATE VIEW v_servicios_completos AS
SELECT
  s.id,
  s.codigo,
  s.tipo_servicio,
  s.categoria_servicio,
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
  s.cotizacion_aprobada,
  s.facturado,
  s.monto_facturado,
  s.cliente_id,
  c.nombre AS cliente_nombre,
  c.telefono AS cliente_telefono,
  c.tipo AS cliente_tipo,
  s.tecnico_asignado_id,
  t.nombre AS tecnico_nombre,
  t.email AS tecnico_email,
  s.creado_por,
  cr.nombre AS creado_por_nombre,
  s.creado_en,
  s.actualizado_en
FROM servicios s
LEFT JOIN clientes c ON s.cliente_id = c.id
LEFT JOIN usuarios t ON s.tecnico_asignado_id = t.id
LEFT JOIN usuarios cr ON s.creado_por = cr.id;
