import pool from '../config/database.js';

export const listarServicios = async (req, res) => {
  try {
    const { 
      estado, 
      tipo_servicio, 
      tecnico_id, 
      cliente_id, 
      prioridad,
      facturado,
      fecha_desde,
      fecha_hasta,
      categoria_servicio
    } = req.query;
    
    let query = 'SELECT * FROM v_servicios_completos WHERE 1=1';
    const params = [];
    
    // Filtrar por rol del usuario
    if (req.usuario.rol === 'tecnico') {
      params.push(req.usuario.id);
      query += ` AND tecnico_asignado_id = $${params.length}`;
    }
    
    if (estado) {
      params.push(estado);
      query += ` AND estado = $${params.length}`;
    }
    
    if (tipo_servicio) {
      params.push(tipo_servicio);
      query += ` AND tipo_servicio = $${params.length}`;
    }
    
    if (tecnico_id) {
      params.push(tecnico_id);
      query += ` AND tecnico_asignado_id = $${params.length}`;
    }
    
    if (cliente_id) {
      params.push(cliente_id);
      query += ` AND cliente_id = $${params.length}`;
    }
    
    if (prioridad) {
      params.push(prioridad);
      query += ` AND prioridad = $${params.length}`;
    }

    if (categoria_servicio) {
      params.push(categoria_servicio);
      query += ` AND categoria_servicio ILIKE $${params.length}`;
    }
    
    if (facturado !== undefined) {
      params.push(facturado === 'true');
      query += ` AND facturado = $${params.length}`;
    }
    
    if (fecha_desde) {
      params.push(fecha_desde);
      query += ` AND fecha_ingreso >= $${params.length}`;
    }
    
    if (fecha_hasta) {
      params.push(fecha_hasta);
      query += ` AND fecha_ingreso <= $${params.length}`;
    }
    
    query += ' ORDER BY fecha_ingreso DESC';
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando servicios:', error);
    res.status(500).json({ 
      error: 'Error al listar servicios' 
    });
  }
};

export const obtenerServicio = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener servicio completo
    let query = 'SELECT * FROM v_servicios_completos WHERE id = $1';
    const params = [id];
    
    // Si es técnico, solo puede ver sus servicios
    if (req.usuario.rol === 'tecnico') {
      query += ' AND tecnico_asignado_id = $2';
      params.push(req.usuario.id);
    }
    
    const servicioResult = await pool.query(query, params);
    
    if (servicioResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Servicio no encontrado o no tiene acceso' 
      });
    }
    
    const servicio = servicioResult.rows[0];
    
    // Obtener informe técnico si existe
    const informeResult = await pool.query(
      `SELECT it.*, u.nombre as tecnico_nombre
       FROM informes_tecnicos it
       LEFT JOIN usuarios u ON it.tecnico_id = u.id
       WHERE it.servicio_id = $1
       ORDER BY it.creado_en DESC
       LIMIT 1`,
      [id]
    );
    
    if (informeResult.rows.length > 0) {
      servicio.informe_tecnico = informeResult.rows[0];
    }
    
    res.json(servicio);
  } catch (error) {
    console.error('Error obteniendo servicio:', error);
    res.status(500).json({ 
      error: 'Error al obtener servicio' 
    });
  }
};

export const crearServicio = async (req, res) => {
  try {
    const { 
      cliente_id,
      tipo_servicio,
      equipo_marca,
      equipo_modelo,
      equipo_serial,
      falla_reportada,
      prioridad,
      tecnico_asignado_id,
      categoria_servicio,
      fecha_programada
    } = req.body;
    
    // Validaciones
    if (!cliente_id || !tipo_servicio || !falla_reportada) {
      return res.status(400).json({ 
        error: 'Cliente, tipo de servicio y falla reportada son requeridos' 
      });
    }
    
    if (!['taller', 'campo'].includes(tipo_servicio)) {
      return res.status(400).json({ 
        error: 'Tipo de servicio debe ser "taller" o "campo"' 
      });
    }
    
    // Verificar que el cliente existe
    const clienteExiste = await pool.query(
      'SELECT id FROM clientes WHERE id = $1',
      [cliente_id]
    );
    
    if (clienteExiste.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Cliente no encontrado' 
      });
    }
    
    // Generar código de servicio
    const fecha = new Date();
    const codigo = `SRV-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}-${Date.now().toString().slice(-5)}`;
    
    const result = await pool.query(
      `INSERT INTO servicios 
       (codigo, cliente_id, tipo_servicio, categoria_servicio, equipo_marca, equipo_modelo, equipo_serial, 
        falla_reportada, prioridad, tecnico_asignado_id, fecha_programada, creado_por) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        codigo,
        cliente_id,
        tipo_servicio,
        categoria_servicio || 'general',
        equipo_marca,
        equipo_modelo,
        equipo_serial,
        falla_reportada,
        prioridad || 'normal',
        tecnico_asignado_id,
        fecha_programada,
        req.usuario.id
      ]
    );
    
    res.status(201).json({
      mensaje: 'Servicio creado exitosamente',
      servicio: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error creando servicio:', error);
    res.status(500).json({ 
      error: 'Error al crear servicio' 
    });
  }
};

export const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      tipo_servicio,
      equipo_marca,
      equipo_modelo,
      equipo_serial,
      falla_reportada,
      prioridad,
      tecnico_asignado_id,
      categoria_servicio,
      fecha_programada,
      cotizacion_monto,
      cotizacion_aprobada
    } = req.body;
    
    // Verificar que el servicio existe
    const existe = await pool.query(
      'SELECT id FROM servicios WHERE id = $1',
      [id]
    );
    
    if (existe.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Servicio no encontrado' 
      });
    }
    
    // Construir query dinámicamente
    const campos = [];
    const valores = [];
    let contador = 1;
    
    if (tipo_servicio) {
      if (!['taller', 'campo'].includes(tipo_servicio)) {
        return res.status(400).json({ 
          error: 'Tipo de servicio debe ser "taller" o "campo"' 
        });
      }
      campos.push(`tipo_servicio = $${contador++}`);
      valores.push(tipo_servicio);
    }
    
    if (equipo_marca !== undefined) {
      campos.push(`equipo_marca = $${contador++}`);
      valores.push(equipo_marca);
    }
    
    if (equipo_modelo !== undefined) {
      campos.push(`equipo_modelo = $${contador++}`);
      valores.push(equipo_modelo);
    }
    
    if (equipo_serial !== undefined) {
      campos.push(`equipo_serial = $${contador++}`);
      valores.push(equipo_serial);
    }
    
    if (falla_reportada) {
      campos.push(`falla_reportada = $${contador++}`);
      valores.push(falla_reportada);
    }
    
    if (prioridad) {
      campos.push(`prioridad = $${contador++}`);
      valores.push(prioridad);
    }
    
    if (tecnico_asignado_id !== undefined) {
      campos.push(`tecnico_asignado_id = $${contador++}`);
      valores.push(tecnico_asignado_id);
    }
    
    if (fecha_programada !== undefined) {
      campos.push(`fecha_programada = $${contador++}`);
      valores.push(fecha_programada);
    }

    if (categoria_servicio !== undefined) {
      campos.push(`categoria_servicio = $${contador++}`);
      valores.push(categoria_servicio || 'general');
    }
    
    if (cotizacion_monto !== undefined) {
      campos.push(`cotizacion_monto = $${contador++}`);
      valores.push(cotizacion_monto);
    }
    
    if (cotizacion_aprobada !== undefined) {
      campos.push(`cotizacion_aprobada = $${contador++}`);
      valores.push(cotizacion_aprobada);
    }
    
    if (campos.length === 0) {
      return res.status(400).json({ 
        error: 'No se proporcionaron campos para actualizar' 
      });
    }
    
    valores.push(id);
    
    const query = `
      UPDATE servicios 
      SET ${campos.join(', ')} 
      WHERE id = $${contador}
      RETURNING *
    `;
    
    const result = await pool.query(query, valores);
    
    res.json({
      mensaje: 'Servicio actualizado exitosamente',
      servicio: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error actualizando servicio:', error);
    res.status(500).json({ 
      error: 'Error al actualizar servicio' 
    });
  }
};

export const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    const estadosValidos = [
      'recibido',
      'en_diagnostico',
      'cotizado',
      'aprobado',
      'en_reparacion',
      'listo',
      'entregado',
      'facturado',
      'cerrado'
    ];
    
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        error: 'Estado inválido' 
      });
    }
    
    // Campos adicionales según el estado
    const camposAdicionales = [];
    const valoresAdicionales = [];
    
    if (estado === 'listo' || estado === 'entregado') {
      camposAdicionales.push('fecha_finalizacion = CURRENT_TIMESTAMP');
    }
    
    if (estado === 'entregado') {
      camposAdicionales.push('fecha_entrega = CURRENT_TIMESTAMP');
    }
    
    const camposQuery = camposAdicionales.length > 0 
      ? `, ${camposAdicionales.join(', ')}` 
      : '';
    
    const result = await pool.query(
      `UPDATE servicios 
       SET estado = $1 ${camposQuery}
       WHERE id = $2
       RETURNING *`,
      [estado, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Servicio no encontrado' 
      });
    }
    
    res.json({
      mensaje: 'Estado actualizado exitosamente',
      servicio: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error cambiando estado:', error);
    res.status(500).json({ 
      error: 'Error al cambiar estado' 
    });
  }
};

export const facturarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_facturado } = req.body;
    
    if (!monto_facturado || monto_facturado <= 0) {
      return res.status(400).json({ 
        error: 'Monto de facturación inválido' 
      });
    }
    
    const result = await pool.query(
      `UPDATE servicios 
       SET estado = 'facturado', facturado = true, monto_facturado = $1
       WHERE id = $2
       RETURNING *`,
      [monto_facturado, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Servicio no encontrado' 
      });
    }
    
    res.json({
      mensaje: 'Servicio facturado exitosamente',
      servicio: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error facturando servicio:', error);
    res.status(500).json({ 
      error: 'Error al facturar servicio' 
    });
  }
};

export const obtenerEstadisticas = async (req, res) => {
  try {
    // Total de servicios
    const totalResult = await pool.query(
      'SELECT COUNT(*) as total FROM servicios'
    );
    
    // Servicios por estado
    const porEstadoResult = await pool.query(
      `SELECT estado, COUNT(*) as cantidad 
       FROM servicios 
       GROUP BY estado 
       ORDER BY cantidad DESC`
    );
    
    // Servicios por tipo
    const porTipoResult = await pool.query(
      `SELECT tipo_servicio, COUNT(*) as cantidad 
       FROM servicios 
       GROUP BY tipo_servicio`
    );
    
    // Servicios por técnico
    const porTecnicoResult = await pool.query(
      `SELECT u.nombre, COUNT(s.id) as cantidad
       FROM usuarios u
       LEFT JOIN servicios s ON u.id = s.tecnico_asignado_id
       WHERE u.rol = 'tecnico' AND u.activo = true
       GROUP BY u.nombre
       ORDER BY cantidad DESC`
    );
    
    // Servicios pendientes de facturación (no facturados y no cerrados)
    const pendientesFacturacionResult = await pool.query(
      `SELECT COUNT(*) as cantidad 
       FROM servicios 
       WHERE facturado = false 
         AND estado NOT IN ('cerrado', 'facturado')`
    );
    
    // Ingresos del mes actual (con facturas)
    let ingresosMes = 0;
    try {
      const ingresosMesFactura = await pool.query(
        `SELECT COALESCE(SUM(total), 0) as total
         FROM facturas 
         WHERE fecha_emision IS NOT NULL
           AND EXTRACT(MONTH FROM fecha_emision) = EXTRACT(MONTH FROM CURRENT_DATE)
           AND EXTRACT(YEAR FROM fecha_emision) = EXTRACT(YEAR FROM CURRENT_DATE)`
      );
      ingresosMes = parseFloat(ingresosMesFactura.rows[0].total);
    } catch (e) {
      // Si falla por tabla inexistente (antes de migración), fallback a servicios
      const ingresosMesServicios = await pool.query(
        `SELECT COALESCE(SUM(monto_facturado), 0) as total
         FROM servicios 
         WHERE facturado = true 
         AND EXTRACT(MONTH FROM fecha_ingreso) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(YEAR FROM fecha_ingreso) = EXTRACT(YEAR FROM CURRENT_DATE)`
      );
      ingresosMes = parseFloat(ingresosMesServicios.rows[0].total);
    }
    
    res.json({
      total_servicios: totalResult.rows[0].total,
      por_estado: porEstadoResult.rows,
      por_tipo: porTipoResult.rows,
      por_tecnico: porTecnicoResult.rows,
      pendientes_facturacion: pendientesFacturacionResult.rows[0].cantidad,
      ingresos_mes_actual: ingresosMes
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas' 
    });
  }
};
