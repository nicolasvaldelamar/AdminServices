import pool from '../config/database.js';
import { generarFacturaPDF, generarCotizacionPDF } from '../utils/pdfGenerator.js';

// ============================================
// FACTURAS
// ============================================

export const listarFacturas = async (req, res) => {
  try {
    const { estado, cliente_id } = req.query;
    
    let query = `
      SELECT f.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono,
             u.nombre as creador_nombre
      FROM facturas f
      LEFT JOIN clientes c ON f.cliente_id = c.id
      LEFT JOIN usuarios u ON f.creada_por = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (estado) {
      params.push(estado);
      query += ` AND f.estado = $${params.length}`;
    }
    
    if (cliente_id) {
      params.push(cliente_id);
      query += ` AND f.cliente_id = $${params.length}`;
    }
    
    query += ' ORDER BY f.fecha_emision DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando facturas:', error);
    res.status(500).json({ error: 'Error al listar facturas' });
  }
};

export const obtenerFactura = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT f.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono,
              c.email as cliente_email, c.direccion as cliente_direccion,
              s.codigo as servicio_codigo
       FROM facturas f
       LEFT JOIN clientes c ON f.cliente_id = c.id
       LEFT JOIN servicios s ON f.servicio_id = s.id
       WHERE f.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo factura:', error);
    res.status(500).json({ error: 'Error al obtener factura' });
  }
};

export const crearFactura = async (req, res) => {
  try {
    const {
      servicio_id,
      cliente_id,
      items,
      subtotal,
      iva,
      descuento,
      total,
      fecha_vencimiento,
      notas,
      terminos_condiciones
    } = req.body;

    // Normalizar servicio_id para evitar strings vacíos
    const servicioId = servicio_id === '' ? null : servicio_id || null;
    
    if (!cliente_id || !items || items.length === 0) {
      return res.status(400).json({ 
        error: 'Cliente e items son requeridos' 
      });
    }
    
    // Generar número de factura
    const numeroResult = await pool.query('SELECT generar_numero_factura() as numero');
    const numero_factura = numeroResult.rows[0].numero;
    
    const result = await pool.query(
      `INSERT INTO facturas 
       (numero_factura, servicio_id, cliente_id, items, subtotal, iva, 
        descuento, total, fecha_vencimiento, notas, terminos_condiciones, creada_por)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        numero_factura,
        servicioId,
        cliente_id,
        JSON.stringify(items),
        subtotal,
        iva || 0,
        descuento || 0,
        total,
        fecha_vencimiento,
        notas,
        terminos_condiciones,
        req.usuario.id
      ]
    );
    
    // Si tiene servicio asociado, actualizar su estado
    if (servicioId) {
      await pool.query(
        'UPDATE servicios SET facturado = true, monto_facturado = $1 WHERE id = $2',
        [total, servicioId]
      );
    }
    
    res.status(201).json({
      mensaje: 'Factura creada exitosamente',
      factura: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando factura:', error);
    res.status(500).json({ error: 'Error al crear factura' });
  }
};

export const actualizarEstadoFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!['pendiente', 'pagada', 'vencida', 'anulada'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    
    const result = await pool.query(
      'UPDATE facturas SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    res.json({
      mensaje: 'Estado actualizado',
      factura: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

// ============================================
// COTIZACIONES
// ============================================

export const listarCotizaciones = async (req, res) => {
  try {
    const { estado, cliente_id } = req.query;
    
    let query = `
      SELECT c.*, cl.nombre as cliente_nombre, cl.telefono as cliente_telefono,
             u.nombre as creador_nombre
      FROM cotizaciones c
      LEFT JOIN clientes cl ON c.cliente_id = cl.id
      LEFT JOIN usuarios u ON c.creada_por = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (estado) {
      params.push(estado);
      query += ` AND c.estado = $${params.length}`;
    }
    
    if (cliente_id) {
      params.push(cliente_id);
      query += ` AND c.cliente_id = $${params.length}`;
    }
    
    query += ' ORDER BY c.fecha_emision DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando cotizaciones:', error);
    res.status(500).json({ error: 'Error al listar cotizaciones' });
  }
};

export const obtenerCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT c.*, cl.nombre as cliente_nombre, cl.telefono as cliente_telefono,
              cl.email as cliente_email, cl.direccion as cliente_direccion,
              s.codigo as servicio_codigo
       FROM cotizaciones c
       LEFT JOIN clientes cl ON c.cliente_id = cl.id
       LEFT JOIN servicios s ON c.servicio_id = s.id
       WHERE c.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo cotización:', error);
    res.status(500).json({ error: 'Error al obtener cotización' });
  }
};

export const crearCotizacion = async (req, res) => {
  try {
    const {
      servicio_id,
      cliente_id,
      items,
      subtotal,
      iva,
      descuento,
      total,
      fecha_validez,
      notas,
      terminos_condiciones
    } = req.body;
    
    if (!cliente_id || !items || items.length === 0) {
      return res.status(400).json({ 
        error: 'Cliente e items son requeridos' 
      });
    }
    
    // Generar número de cotización
    const numeroResult = await pool.query('SELECT generar_numero_cotizacion() as numero');
    const numero_cotizacion = numeroResult.rows[0].numero;
    
    const result = await pool.query(
      `INSERT INTO cotizaciones 
       (numero_cotizacion, servicio_id, cliente_id, items, subtotal, iva, 
        descuento, total, fecha_validez, notas, terminos_condiciones, creada_por)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        numero_cotizacion,
        servicio_id,
        cliente_id,
        JSON.stringify(items),
        subtotal,
        iva || 0,
        descuento || 0,
        total,
        fecha_validez,
        notas,
        terminos_condiciones,
        req.usuario.id
      ]
    );
    
    // Si tiene servicio asociado, actualizar monto de cotización
    if (servicio_id) {
      await pool.query(
        'UPDATE servicios SET cotizacion_monto = $1, estado = \'cotizado\' WHERE id = $2',
        [total, servicio_id]
      );
    }
    
    res.status(201).json({
      mensaje: 'Cotización creada exitosamente',
      cotizacion: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando cotización:', error);
    res.status(500).json({ error: 'Error al crear cotización' });
  }
};

export const actualizarEstadoCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, aprobada_por } = req.body;
    
    if (!['pendiente', 'aprobada', 'rechazada', 'vencida'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    
    const updates = {estado};
    if (estado === 'aprobada') {
      updates.fecha_aprobacion = 'CURRENT_TIMESTAMP';
      updates.aprobada_por = aprobada_por;
    }
    
    const result = await pool.query(
      `UPDATE cotizaciones 
       SET estado = $1, 
           fecha_aprobacion = ${estado === 'aprobada' ? 'CURRENT_TIMESTAMP' : 'fecha_aprobacion'},
           aprobada_por = $2
       WHERE id = $3 
       RETURNING *`,
      [estado, aprobada_por || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    // Si fue aprobada y tiene servicio, actualizar servicio
    if (estado === 'aprobada' && result.rows[0].servicio_id) {
      await pool.query(
        'UPDATE servicios SET cotizacion_aprobada = true, estado = \'aprobado\' WHERE id = $1',
        [result.rows[0].servicio_id]
      );
    }
    
    res.json({
      mensaje: 'Estado actualizado',
      cotizacion: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

// ============================================
// DESCARGA DE PDFs
// ============================================

export const descargarFacturaPDF = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT f.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono,
              c.email as cliente_email, c.direccion as cliente_direccion
       FROM facturas f
       LEFT JOIN clientes c ON f.cliente_id = c.id
       WHERE f.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    const factura = result.rows[0];
    const pdfBuffer = await generarFacturaPDF(factura);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=factura-${factura.numero_factura}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF de factura:', error);
    res.status(500).json({ error: 'Error al generar PDF' });
  }
};

export const descargarCotizacionPDF = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT c.*, cl.nombre as cliente_nombre, cl.telefono as cliente_telefono,
              cl.email as cliente_email, cl.direccion as cliente_direccion
       FROM cotizaciones c
       LEFT JOIN clientes cl ON c.cliente_id = cl.id
       WHERE c.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    const cotizacion = result.rows[0];
    const pdfBuffer = await generarCotizacionPDF(cotizacion);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cotizacion-${cotizacion.numero_cotizacion}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF de cotización:', error);
    res.status(500).json({ error: 'Error al generar PDF' });
  }
};
