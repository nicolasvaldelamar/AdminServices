import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }
    
    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND activo = true',
      [email.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }
    
    const usuario = result.rows[0];
    
    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValido) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }
    
    // Generar token
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        rol: usuario.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // No enviar password en la respuesta
    delete usuario.password;
    
    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error al iniciar sesión' 
    });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol, telefono, creado_en FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ 
      error: 'Error al obtener perfil' 
    });
  }
};

export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;
    
    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({ 
        error: 'Contraseña actual y nueva son requeridas' 
      });
    }
    
    if (passwordNuevo.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    // Obtener usuario actual
    const result = await pool.query(
      'SELECT password FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );
    
    const usuario = result.rows[0];
    
    // Verificar contraseña actual
    const passwordValido = await bcrypt.compare(passwordActual, usuario.password);
    
    if (!passwordValido) {
      return res.status(401).json({ 
        error: 'Contraseña actual incorrecta' 
      });
    }
    
    // Hash nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordNuevo, salt);
    
    // Actualizar contraseña
    await pool.query(
      'UPDATE usuarios SET password = $1 WHERE id = $2',
      [passwordHash, req.usuario.id]
    );
    
    res.json({ 
      mensaje: 'Contraseña actualizada exitosamente' 
    });
    
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ 
      error: 'Error al cambiar contraseña' 
    });
  }
};
