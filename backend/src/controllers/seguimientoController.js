import pool from '../config/database.js';

// Consultar estado de servicio (ruta pública)
export const consultarServicio = async (req, res) => {
  try {
    const { codigo } = req.params;
    
    if (!codigo) {
      return res.status(400).json({ 
        error: 'Código de servicio es requerido' 
      });
    }
    
    // Buscar servicio con información básica (sin datos sensibles)
    const result = await pool.query(
      `SELECT 
        s.id,
        s.codigo,
        s.tipo_servicio,
        s.estado,
        s.fecha_ingreso,
        s.fecha_programada,
        s.fecha_finalizacion,
        s.fecha_entrega,
        s.equipo_marca,
        s.equipo_modelo,
        s.falla_reportada,
        s.prioridad,
        c.nombre as cliente_nombre,
        c.telefono as cliente_telefono,
        u.nombre as tecnico_nombre,
        s.cotizacion_monto,
        s.cotizacion_aprobada,
        s.facturado,
        s.creado_en
       FROM servicios s
       LEFT JOIN clientes c ON s.cliente_id = c.id
       LEFT JOIN usuarios u ON s.tecnico_asignado_id = u.id
       WHERE s.codigo = $1`,
      [codigo.toUpperCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Servicio no encontrado',
        mensaje: 'Verifica que el código sea correcto'
      });
    }
    
    const servicio = result.rows[0];
    
    // Obtener informe técnico si existe (solo información básica)
    const informeResult = await pool.query(
      `SELECT 
        diagnostico,
        trabajo_realizado,
        recomendaciones,
        creado_en
       FROM informes_tecnicos
       WHERE servicio_id = $1
       ORDER BY creado_en DESC
       LIMIT 1`,
      [servicio.id]
    );
    
    if (informeResult.rows.length > 0) {
      servicio.informe = informeResult.rows[0];
    }
    
    // Calcular progreso (porcentaje basado en estado)
    const estadosProgreso = {
      'por_asignar': 5,
      'recibido': 15,
      'en_diagnostico': 30,
      'cotizado': 45,
      'aprobado': 55,
      'en_reparacion': 75,
      'listo': 90,
      'entregado': 95,
      'facturado': 100,
      'cerrado': 100
    };
    
    servicio.progreso = estadosProgreso[servicio.estado] || 0;
    
    res.json(servicio);
    
  } catch (error) {
    console.error('Error consultando servicio:', error);
    res.status(500).json({ 
      error: 'Error al consultar servicio' 
    });
  }
};

// Verificar código antes de mostrar formulario (validación rápida)
export const verificarCodigo = async (req, res) => {
  try {
    const { codigo } = req.query;
    
    if (!codigo) {
      return res.status(400).json({ 
        error: 'Código es requerido' 
      });
    }
    
    const result = await pool.query(
      'SELECT COUNT(*) as existe FROM servicios WHERE codigo = $1',
      [codigo.toUpperCase()]
    );
    
    res.json({ 
      existe: parseInt(result.rows[0].existe) > 0 
    });
    
  } catch (error) {
    console.error('Error verificando código:', error);
    res.status(500).json({ 
      error: 'Error al verificar código' 
    });
  }
};
