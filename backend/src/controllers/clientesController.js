import pool from '../config/database.js';

export const listarClientes = async (req, res) => {
  try {
    const { tipo, contrato_activo, busqueda } = req.query;
    
    let query = 'SELECT * FROM clientes WHERE 1=1';
    const params = [];
    
    if (tipo) {
      params.push(tipo);
      query += ` AND tipo = $${params.length}`;
    }
    
    if (contrato_activo !== undefined) {
      params.push(contrato_activo === 'true');
      query += ` AND contrato_activo = $${params.length}`;
    }
    
    if (busqueda) {
      params.push(`%${busqueda}%`);
      query += ` AND (nombre ILIKE $${params.length} OR razon_social ILIKE $${params.length} OR contacto ILIKE $${params.length})`;
    }
    
    query += ' ORDER BY nombre';
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando clientes:', error);
    res.status(500).json({ 
      error: 'Error al listar clientes' 
    });
  }
};

export const obtenerCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener cliente
    const clienteResult = await pool.query(
      'SELECT * FROM clientes WHERE id = $1',
      [id]
    );
    
    if (clienteResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Cliente no encontrado' 
      });
    }
    
    const cliente = clienteResult.rows[0];
    
    // Obtener historial de servicios
    const serviciosResult = await pool.query(
      `SELECT id, codigo, tipo_servicio, estado, fecha_ingreso, falla_reportada
       FROM servicios 
       WHERE cliente_id = $1 
       ORDER BY fecha_ingreso DESC 
       LIMIT 10`,
      [id]
    );
    
    cliente.servicios_recientes = serviciosResult.rows;
    
    // Estadísticas
    const statsResult = await pool.query(
      `SELECT 
        COUNT(*) as total_servicios,
        COUNT(CASE WHEN estado = 'cerrado' THEN 1 END) as servicios_completados,
        COUNT(CASE WHEN estado NOT IN ('cerrado', 'entregado') THEN 1 END) as servicios_activos,
        SUM(monto_facturado) as total_facturado
       FROM servicios 
       WHERE cliente_id = $1`,
      [id]
    );
    
    cliente.estadisticas = statsResult.rows[0];
    
    res.json(cliente);
  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    res.status(500).json({ 
      error: 'Error al obtener cliente' 
    });
  }
};

export const crearCliente = async (req, res) => {
  try {
    const { 
      tipo, 
      nombre, 
      razon_social, 
      contacto, 
      telefono, 
      email, 
      direccion, 
      contrato_activo, 
      notas 
    } = req.body;
    
    // Validaciones
    if (!tipo || !nombre || !telefono) {
      return res.status(400).json({ 
        error: 'Tipo, nombre y teléfono son requeridos' 
      });
    }
    
    if (!['empresa', 'persona'].includes(tipo)) {
      return res.status(400).json({ 
        error: 'Tipo debe ser "empresa" o "persona"' 
      });
    }
    
    const result = await pool.query(
      `INSERT INTO clientes 
       (tipo, nombre, razon_social, contacto, telefono, email, direccion, contrato_activo, notas, creado_por) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        tipo, 
        nombre, 
        razon_social, 
        contacto, 
        telefono, 
        email?.toLowerCase(), 
        direccion, 
        contrato_activo || false, 
        notas,
        req.usuario.id
      ]
    );
    
    res.status(201).json({
      mensaje: 'Cliente creado exitosamente',
      cliente: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({ 
      error: 'Error al crear cliente' 
    });
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      tipo, 
      nombre, 
      razon_social, 
      contacto, 
      telefono, 
      email, 
      direccion, 
      contrato_activo, 
      notas 
    } = req.body;
    
    // Verificar que el cliente existe
    const existe = await pool.query(
      'SELECT id FROM clientes WHERE id = $1',
      [id]
    );
    
    if (existe.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Cliente no encontrado' 
      });
    }
    
    // Construir query dinámicamente
    const campos = [];
    const valores = [];
    let contador = 1;
    
    if (tipo) {
      if (!['empresa', 'persona'].includes(tipo)) {
        return res.status(400).json({ 
          error: 'Tipo debe ser "empresa" o "persona"' 
        });
      }
      campos.push(`tipo = $${contador++}`);
      valores.push(tipo);
    }
    
    if (nombre) {
      campos.push(`nombre = $${contador++}`);
      valores.push(nombre);
    }
    
    if (razon_social !== undefined) {
      campos.push(`razon_social = $${contador++}`);
      valores.push(razon_social);
    }
    
    if (contacto !== undefined) {
      campos.push(`contacto = $${contador++}`);
      valores.push(contacto);
    }
    
    if (telefono) {
      campos.push(`telefono = $${contador++}`);
      valores.push(telefono);
    }
    
    if (email !== undefined) {
      campos.push(`email = $${contador++}`);
      valores.push(email?.toLowerCase());
    }
    
    if (direccion !== undefined) {
      campos.push(`direccion = $${contador++}`);
      valores.push(direccion);
    }
    
    if (contrato_activo !== undefined) {
      campos.push(`contrato_activo = $${contador++}`);
      valores.push(contrato_activo);
    }
    
    if (notas !== undefined) {
      campos.push(`notas = $${contador++}`);
      valores.push(notas);
    }
    
    if (campos.length === 0) {
      return res.status(400).json({ 
        error: 'No se proporcionaron campos para actualizar' 
      });
    }
    
    valores.push(id);
    
    const query = `
      UPDATE clientes 
      SET ${campos.join(', ')} 
      WHERE id = $${contador}
      RETURNING *
    `;
    
    const result = await pool.query(query, valores);
    
    res.json({
      mensaje: 'Cliente actualizado exitosamente',
      cliente: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(500).json({ 
      error: 'Error al actualizar cliente' 
    });
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si tiene servicios asociados
    const servicios = await pool.query(
      'SELECT COUNT(*) as total FROM servicios WHERE cliente_id = $1',
      [id]
    );
    
    if (parseInt(servicios.rows[0].total) > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar un cliente con servicios asociados' 
      });
    }
    
    const result = await pool.query(
      'DELETE FROM clientes WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Cliente no encontrado' 
      });
    }
    
    res.json({ 
      mensaje: 'Cliente eliminado exitosamente' 
    });
    
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(500).json({ 
      error: 'Error al eliminar cliente' 
    });
  }
};
