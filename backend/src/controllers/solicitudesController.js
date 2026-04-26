import pool from '../config/database.js';

// Obtener disponibilidad de horarios (ruta pública)
export const obtenerDisponibilidad = async (req, res) => {
  try {
    const { fecha, tipo_servicio } = req.query;
    
    if (!fecha || !tipo_servicio) {
      return res.status(400).json({ 
        error: 'Fecha y tipo de servicio son requeridos' 
      });
    }
    
    // Obtener técnicos disponibles
    const tecnicos = await pool.query(
      `SELECT id, nombre 
       FROM usuarios 
       WHERE rol = 'tecnico' AND activo = true`
    );
    
    // Obtener servicios programados para esa fecha
    const serviciosProgramados = await pool.query(
      `SELECT tecnico_asignado_id, fecha_programada
       FROM servicios
       WHERE DATE(fecha_programada) = $1
       AND estado NOT IN ('cerrado', 'entregado')
       AND tecnico_asignado_id IS NOT NULL`,
      [fecha]
    );
    
    // Horarios disponibles (9:00 AM a 6:00 PM, cada 2 horas)
    const horarios = [
      { hora: '09:00', label: '9:00 AM' },
      { hora: '11:00', label: '11:00 AM' },
      { hora: '13:00', label: '1:00 PM' },
      { hora: '15:00', label: '3:00 PM' },
      { hora: '17:00', label: '5:00 PM' }
    ];
    
    // Calcular disponibilidad por técnico y horario
    const disponibilidad = horarios.map(horario => {
      const tecnicosDisponibles = tecnicos.rows.filter(tecnico => {
        // Verificar si el técnico tiene un servicio en ese horario
        const tieneServicio = serviciosProgramados.rows.some(servicio => {
          if (servicio.tecnico_asignado_id !== tecnico.id) return false;
          
          const horaServicio = new Date(servicio.fecha_programada).toTimeString().slice(0, 5);
          return horaServicio === horario.hora;
        });
        
        return !tieneServicio;
      });
      
      return {
        hora: horario.hora,
        label: horario.label,
        disponible: tecnicosDisponibles.length > 0,
        tecnicos_disponibles: tecnicosDisponibles.length
      };
    });
    
    res.json({
      fecha,
      tipo_servicio,
      disponibilidad
    });
    
  } catch (error) {
    console.error('Error obteniendo disponibilidad:', error);
    res.status(500).json({ 
      error: 'Error al obtener disponibilidad' 
    });
  }
};

// Crear solicitud de servicio (ruta pública)
export const crearSolicitud = async (req, res) => {
  try {
    const { 
      cliente_nombre,
      cliente_telefono,
      cliente_email,
      tipo_servicio,
      tipo_solicitud, // 'servicio' o 'cotizacion'
      categoria_servicio,
      direccion_servicio,
      equipo_marca,
      equipo_modelo,
      falla_reportada,
      fecha_programada,
      hora_programada
    } = req.body;
    
    // Validaciones
    if (!cliente_nombre || !cliente_telefono || !tipo_servicio || !falla_reportada) {
      return res.status(400).json({ 
        error: 'Nombre, teléfono, tipo de servicio y descripción son requeridos' 
      });
    }
    
    if (!tipo_solicitud || !['servicio', 'cotizacion'].includes(tipo_solicitud)) {
      return res.status(400).json({ 
        error: 'Tipo de solicitud debe ser "servicio" o "cotizacion"' 
      });
    }
    
    if (tipo_servicio === 'campo' && (!fecha_programada || !hora_programada)) {
      return res.status(400).json({ 
        error: 'Para servicios de campo, fecha y hora son requeridas' 
      });
    }
    
    // Buscar o crear cliente
    let cliente_id;
    
    const clienteExiste = await pool.query(
      'SELECT id FROM clientes WHERE telefono = $1',
      [cliente_telefono]
    );
    
    if (clienteExiste.rows.length > 0) {
      cliente_id = clienteExiste.rows[0].id;
      
      // Actualizar información del cliente
      await pool.query(
        `UPDATE clientes 
         SET nombre = $1, email = $2, direccion = $3 
         WHERE id = $4`,
        [cliente_nombre, cliente_email, direccion_servicio, cliente_id]
      );
    } else {
      // Crear nuevo cliente
      const nuevoCliente = await pool.query(
        `INSERT INTO clientes (tipo, nombre, telefono, email, direccion) 
         VALUES ('persona', $1, $2, $3, $4) 
         RETURNING id`,
        [cliente_nombre, cliente_telefono, cliente_email, direccion_servicio]
      );
      cliente_id = nuevoCliente.rows[0].id;
    }
    
    // Crear fecha y hora combinadas si es campo
    let fecha_hora_programada = null;
    if (tipo_servicio === 'campo' && fecha_programada && hora_programada) {
      fecha_hora_programada = `${fecha_programada} ${hora_programada}:00`;
    }
    
    // NO asignar técnico automáticamente
    // Las solicitudes quedan en estado "por_asignar"
    let tecnico_asignado = null;
    
    // Generar código de servicio
    const fecha = new Date();
    const codigo = `SRV-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}-${Date.now().toString().slice(-5)}`;
    
    // Crear servicio en estado "por_asignar"
    const nuevoServicio = await pool.query(
      `INSERT INTO servicios 
       (codigo, cliente_id, tipo_servicio, tipo_solicitud, estado,
        categoria_servicio, equipo_marca, equipo_modelo, falla_reportada, 
        fecha_programada, tecnico_asignado_id) 
       VALUES ($1, $2, $3, $4, 'por_asignar', $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        codigo,
        cliente_id,
        tipo_servicio,
        tipo_solicitud,
        categoria_servicio || 'general',
        equipo_marca,
        equipo_modelo,
        falla_reportada,
        fecha_hora_programada,
        tecnico_asignado
      ]
    );
    
    const mensajeSegunTipo = tipo_solicitud === 'cotizacion' 
      ? 'Nos pondremos en contacto contigo con la cotización solicitada'
      : 'Nos pondremos en contacto contigo pronto para confirmar tu servicio';
    
    res.status(201).json({
      mensaje: 'Solicitud recibida exitosamente',
      codigo_servicio: codigo,
      tipo_solicitud,
      servicio: nuevoServicio.rows[0],
      nota: mensajeSegunTipo
    });
    
  } catch (error) {
    console.error('Error creando solicitud:', error);
    res.status(500).json({ 
      error: 'Error al procesar solicitud' 
    });
  }
};

// Obtener servicios para el calendario (usa fecha_programada y si no, fecha_ingreso)
export const obtenerServiciosCalendario = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    
    let query = `
      SELECT 
        s.id,
        s.codigo,
        s.tipo_servicio,
        s.estado,
        s.fecha_programada,
        s.fecha_ingreso,
        c.nombre as cliente_nombre,
        c.telefono as cliente_telefono,
        u.nombre as tecnico_nombre,
        s.falla_reportada
      FROM servicios s
      LEFT JOIN clientes c ON s.cliente_id = c.id
      LEFT JOIN usuarios u ON s.tecnico_asignado_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Filtrar por rango usando la fecha base
    // fecha_base = COALESCE(fecha_programada, fecha_ingreso)
    if (fecha_inicio) {
      params.push(fecha_inicio);
      query += ` AND COALESCE(DATE(s.fecha_programada), DATE(s.fecha_ingreso)) >= $${params.length}`;
    }
    
    if (fecha_fin) {
      params.push(fecha_fin);
      query += ` AND COALESCE(DATE(s.fecha_programada), DATE(s.fecha_ingreso)) <= $${params.length}`;
    }
    
    // Si es técnico, solo ver sus servicios
    if (req.usuario.rol === 'tecnico') {
      params.push(req.usuario.id);
      query += ` AND s.tecnico_asignado_id = $${params.length}`;
    }
    
    // Ordenar también por la fecha base
    query += ' ORDER BY COALESCE(s.fecha_programada, s.fecha_ingreso), s.id';
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error obteniendo servicios calendario:', error);
    res.status(500).json({ 
      error: 'Error al obtener servicios' 
    });
  }
};
