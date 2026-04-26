import pool from '../config/database.js';

export const listarReportesEquipos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT re.*, u.nombre as creador_nombre,
              (SELECT COUNT(*) FROM reportes_equipos_items WHERE reporte_id = re.id) as total_equipos
       FROM reportes_equipos re
       LEFT JOIN usuarios u ON re.creado_por = u.id
       ORDER BY re.creado_en DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando reportes de equipos:', error);
    res.status(500).json({ error: 'Error al listar reportes de equipos' });
  }
};

export const obtenerReporteEquipos = async (req, res) => {
  try {
    const { id } = req.params;

    const reporteRes = await pool.query(
      `SELECT re.*, u.nombre as creador_nombre
       FROM reportes_equipos re
       LEFT JOIN usuarios u ON re.creado_por = u.id
       WHERE re.id = $1`,
      [id]
    );

    if (reporteRes.rows.length === 0) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    const itemsRes = await pool.query(
      'SELECT * FROM reportes_equipos_items WHERE reporte_id = $1 ORDER BY numero',
      [id]
    );

    res.json({
      ...reporteRes.rows[0],
      items: itemsRes.rows
    });
  } catch (error) {
    console.error('Error obteniendo reporte de equipos:', error);
    res.status(500).json({ error: 'Error al obtener reporte de equipos' });
  }
};

export const crearReporteEquipos = async (req, res) => {
  const client = await pool.connect();
  try {
    const { titulo, items } = req.body;

    if (!titulo || !items || items.length === 0) {
      return res.status(400).json({ error: 'Título y al menos un equipo son requeridos' });
    }

    await client.query('BEGIN');

    const reporteRes = await client.query(
      'INSERT INTO reportes_equipos (titulo, creado_por) VALUES ($1, $2) RETURNING *',
      [titulo, req.usuario.id]
    );
    const reporteId = reporteRes.rows[0].id;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await client.query(
        `INSERT INTO reportes_equipos_items 
         (reporte_id, numero, usuario, cargo, empresa, area_asignacion, nombre_equipo,
          marca, modelo, serial, tipo_equipo, sistema_operativo, office, mouse, teclado,
          base, monitor, procesador, ram, disco_duro, antivirus, observaciones, fecha, firma, id_equipo)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)`,
        [
          reporteId, i + 1,
          item.usuario || '', item.cargo || '', item.empresa || '', item.area_asignacion || '',
          item.nombre_equipo || '', item.marca || '', item.modelo || '', item.serial || '',
          item.tipo_equipo || '', item.sistema_operativo || '', item.office || '',
          item.mouse || '', item.teclado || '', item.base || '', item.monitor || '',
          item.procesador || '', item.ram || '', item.disco_duro || '', item.antivirus || '',
          item.observaciones || '', item.fecha || '', item.firma || '', item.id_equipo || ''
        ]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Reporte de equipos creado exitosamente',
      reporte: { ...reporteRes.rows[0], items }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando reporte de equipos:', error);
    res.status(500).json({ error: 'Error al crear reporte de equipos' });
  } finally {
    client.release();
  }
};

export const generarPDFReporteEquipos = async (req, res) => {
  try {
    const { id } = req.params;

    const reporteRes = await pool.query(
      'SELECT * FROM reportes_equipos WHERE id = $1',
      [id]
    );

    if (reporteRes.rows.length === 0) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    const itemsRes = await pool.query(
      'SELECT * FROM reportes_equipos_items WHERE reporte_id = $1 ORDER BY numero',
      [id]
    );

    const { generarReporteEquiposPDF } = await import('../utils/pdfGenerator.js');
    const pdfBuffer = await generarReporteEquiposPDF({
      ...reporteRes.rows[0],
      items: itemsRes.rows
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte-equipos-${id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF de reporte de equipos:', error);
    res.status(500).json({ error: 'Error al generar PDF' });
  }
};
