import pool from '../config/database.js';

export const obtenerInforme = async (req, res) => {
  try {
    const { servicio_id } = req.params;
    
    let query = `
      SELECT it.*, u.nombre as tecnico_nombre, s.codigo as servicio_codigo
      FROM informes_tecnicos it
      LEFT JOIN usuarios u ON it.tecnico_id = u.id
      LEFT JOIN servicios s ON it.servicio_id = s.id
      WHERE it.servicio_id = $1
    `;
    const params = [servicio_id];
    
    // Si es técnico, solo puede ver sus propios informes
    if (req.usuario.rol === 'tecnico') {
      query += ' AND it.tecnico_id = $2';
      params.push(req.usuario.id);
    }
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Informe no encontrado o no tiene acceso' 
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo informe:', error);
    res.status(500).json({ 
      error: 'Error al obtener informe' 
    });
  }
};

export const crearInforme = async (req, res) => {
  try {
    const { servicio_id } = req.params;
    const { 
      diagnostico,
      trabajo_realizado,
      repuestos_usados,
      recomendaciones,
      tiempo_invertido
    } = req.body;
    
    // Validaciones
    if (!diagnostico || !trabajo_realizado) {
      return res.status(400).json({ 
        error: 'Diagnóstico y trabajo realizado son requeridos' 
      });
    }
    
    // Verificar que el servicio existe
    let servicioQuery = 'SELECT id, tecnico_asignado_id FROM servicios WHERE id = $1';
    const servicioParams = [servicio_id];
    
    // Si es técnico, verificar que sea su servicio
    if (req.usuario.rol === 'tecnico') {
      servicioQuery += ' AND tecnico_asignado_id = $2';
      servicioParams.push(req.usuario.id);
    }
    
    const servicioResult = await pool.query(servicioQuery, servicioParams);
    
    if (servicioResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Servicio no encontrado o no tiene acceso' 
      });
    }
    
    // Verificar si ya existe un informe
    const informeExiste = await pool.query(
      'SELECT id FROM informes_tecnicos WHERE servicio_id = $1',
      [servicio_id]
    );
    
    if (informeExiste.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Ya existe un informe para este servicio. Use actualizar en su lugar.' 
      });
    }
    
    // Crear informe
    const result = await pool.query(
      `INSERT INTO informes_tecnicos 
       (servicio_id, tecnico_id, diagnostico, trabajo_realizado, repuestos_usados, recomendaciones, tiempo_invertido) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        servicio_id,
        req.usuario.id,
        diagnostico,
        trabajo_realizado,
        repuestos_usados,
        recomendaciones,
        tiempo_invertido
      ]
    );
    
    res.status(201).json({
      mensaje: 'Informe creado exitosamente',
      informe: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error creando informe:', error);
    res.status(500).json({ 
      error: 'Error al crear informe' 
    });
  }
};

export const actualizarInforme = async (req, res) => {
  try {
    const { servicio_id } = req.params;
    const { 
      diagnostico,
      trabajo_realizado,
      repuestos_usados,
      recomendaciones,
      tiempo_invertido
    } = req.body;
    
    // Verificar que el informe existe y el técnico tiene acceso
    let verificarQuery = `
      SELECT it.id 
      FROM informes_tecnicos it
      WHERE it.servicio_id = $1
    `;
    const verificarParams = [servicio_id];
    
    // Si es técnico, verificar que sea su informe
    if (req.usuario.rol === 'tecnico') {
      verificarQuery += ' AND it.tecnico_id = $2';
      verificarParams.push(req.usuario.id);
    }
    
    const verificar = await pool.query(verificarQuery, verificarParams);
    
    if (verificar.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Informe no encontrado o no tiene acceso' 
      });
    }
    
    // Construir query dinámicamente
    const campos = [];
    const valores = [];
    let contador = 1;
    
    if (diagnostico) {
      campos.push(`diagnostico = $${contador++}`);
      valores.push(diagnostico);
    }
    
    if (trabajo_realizado) {
      campos.push(`trabajo_realizado = $${contador++}`);
      valores.push(trabajo_realizado);
    }
    
    if (repuestos_usados !== undefined) {
      campos.push(`repuestos_usados = $${contador++}`);
      valores.push(repuestos_usados);
    }
    
    if (recomendaciones !== undefined) {
      campos.push(`recomendaciones = $${contador++}`);
      valores.push(recomendaciones);
    }
    
    if (tiempo_invertido !== undefined) {
      campos.push(`tiempo_invertido = $${contador++}`);
      valores.push(tiempo_invertido);
    }
    
    if (campos.length === 0) {
      return res.status(400).json({ 
        error: 'No se proporcionaron campos para actualizar' 
      });
    }
    
    valores.push(servicio_id);
    
    const query = `
      UPDATE informes_tecnicos 
      SET ${campos.join(', ')} 
      WHERE servicio_id = $${contador}
      RETURNING *
    `;
    
    const result = await pool.query(query, valores);
    
    res.json({
      mensaje: 'Informe actualizado exitosamente',
      informe: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error actualizando informe:', error);
    res.status(500).json({ 
      error: 'Error al actualizar informe' 
    });
  }
};

export const listarInformesPorTecnico = async (req, res) => {
  try {
    let tecnico_id = req.params.tecnico_id;
    
    if (req.usuario.rol === 'tecnico') {
      tecnico_id = req.usuario.id;
    }
    
    const result = await pool.query(
      `SELECT 
        it.*,
        s.codigo as servicio_codigo,
        s.tipo_servicio,
        s.estado as servicio_estado,
        c.nombre as cliente_nombre,
        u.nombre as tecnico_nombre
       FROM informes_tecnicos it
       LEFT JOIN servicios s ON it.servicio_id = s.id
       LEFT JOIN clientes c ON s.cliente_id = c.id
       LEFT JOIN usuarios u ON it.tecnico_id = u.id
       WHERE it.tecnico_id = $1
       ORDER BY it.creado_en DESC`,
      [tecnico_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando informes:', error);
    res.status(500).json({ 
      error: 'Error al listar informes' 
    });
  }
};

export const listarTodosInformes = async (req, res) => {
  try {
    if (req.usuario.rol === 'tecnico') {
      return listarInformesPorTecnico(
        { ...req, params: { tecnico_id: req.usuario.id } },
        res
      );
    }

    const result = await pool.query(
      `SELECT 
        it.*,
        s.codigo as servicio_codigo,
        s.tipo_servicio,
        s.estado as servicio_estado,
        c.nombre as cliente_nombre,
        u.nombre as tecnico_nombre
       FROM informes_tecnicos it
       LEFT JOIN servicios s ON it.servicio_id = s.id
       LEFT JOIN clientes c ON s.cliente_id = c.id
       LEFT JOIN usuarios u ON it.tecnico_id = u.id
       ORDER BY it.creado_en DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error listando todos los informes:', error);
    res.status(500).json({ 
      error: 'Error al listar informes' 
    });
  }
};
