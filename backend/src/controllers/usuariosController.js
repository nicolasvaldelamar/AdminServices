import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

export const listarUsuarios = async (req, res) => {
  try {
    const { rol, activo } = req.query;
    
    let query = 'SELECT id, nombre, email, rol, telefono, activo, creado_en FROM usuarios WHERE 1=1';
    const params = [];
    
    if (rol) {
      params.push(rol);
      query += ` AND rol = $${params.length}`;
    }
    
    if (activo !== undefined) {
      params.push(activo === 'true');
      query += ` AND activo = $${params.length}`;
    }
    
    query += ' ORDER BY creado_en DESC';
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ 
      error: 'Error al listar usuarios' 
    });
  }
};

export const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT id, nombre, email, rol, telefono, activo, creado_en FROM usuarios WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener usuario' 
    });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol, telefono } = req.body;
    
    // Validaciones
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ 
        error: 'Nombre, email, contraseña y rol son requeridos' 
      });
    }
    
    if (!['administrador', 'recepcion', 'tecnico'].includes(rol)) {
      return res.status(400).json({ 
        error: 'Rol inválido' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    // Verificar que el email no exista
    const existe = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (existe.rows.length > 0) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Crear usuario
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol, telefono) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, nombre, email, rol, telefono, activo, creado_en`,
      [nombre, email.toLowerCase(), passwordHash, rol, telefono]
    );
    
    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ 
      error: 'Error al crear usuario' 
    });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, telefono, activo, password } = req.body;
    
    // Verificar que el usuario existe
    const usuarioExiste = await pool.query(
      'SELECT id FROM usuarios WHERE id = $1',
      [id]
    );
    
    if (usuarioExiste.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Si se cambia el email, verificar que no exista
    if (email) {
      const emailExiste = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
        [email.toLowerCase(), id]
      );
      
      if (emailExiste.rows.length > 0) {
        return res.status(400).json({ 
          error: 'El email ya está registrado' 
        });
      }
    }
    
    // Construir query dinámicamente
    const campos = [];
    const valores = [];
    let contador = 1;
    
    if (nombre) {
      campos.push(`nombre = $${contador++}`);
      valores.push(nombre);
    }
    
    if (email) {
      campos.push(`email = $${contador++}`);
      valores.push(email.toLowerCase());
    }
    
    if (rol) {
      if (!['administrador', 'recepcion', 'tecnico'].includes(rol)) {
        return res.status(400).json({ 
          error: 'Rol inválido' 
        });
      }
      campos.push(`rol = $${contador++}`);
      valores.push(rol);
    }
    
    if (telefono !== undefined) {
      campos.push(`telefono = $${contador++}`);
      valores.push(telefono);
    }
    
    if (activo !== undefined) {
      campos.push(`activo = $${contador++}`);
      valores.push(activo);
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: 'La contraseña debe tener al menos 6 caracteres'
        });
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      campos.push(`password = $${contador++}`);
      valores.push(passwordHash);
    }

    if (campos.length === 0) {
      return res.status(400).json({ 
        error: 'No se proporcionaron campos para actualizar' 
      });
    }
    
    valores.push(id);
    
    const query = `
      UPDATE usuarios 
      SET ${campos.join(', ')} 
      WHERE id = $${contador}
      RETURNING id, nombre, email, rol, telefono, activo, creado_en
    `;
    
    const result = await pool.query(query, valores);
    
    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ 
      error: 'Error al actualizar usuario' 
    });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // No permitir eliminar el propio usuario
    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({ 
        error: 'No puede eliminar su propio usuario' 
      });
    }
    
    // En lugar de eliminar, desactivar
    const result = await pool.query(
      'UPDATE usuarios SET activo = false WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    res.json({ 
      mensaje: 'Usuario desactivado exitosamente' 
    });
    
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ 
      error: 'Error al eliminar usuario' 
    });
  }
};

export const listarTecnicos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, email, telefono 
       FROM usuarios 
       WHERE rol = 'tecnico' AND activo = true 
       ORDER BY nombre`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando técnicos:', error);
    res.status(500).json({ 
      error: 'Error al listar técnicos' 
    });
  }
};
