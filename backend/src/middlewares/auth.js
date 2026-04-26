import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No se proporcionó token de autenticación' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Token inválido o expirado' 
    });
  }
};

export const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ 
        error: 'No autenticado' 
      });
    }
    
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        error: 'No tiene permisos para realizar esta acción' 
      });
    }
    
    next();
  };
};
