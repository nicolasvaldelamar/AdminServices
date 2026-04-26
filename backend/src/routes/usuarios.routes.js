import express from 'express';
import { 
  listarUsuarios, 
  obtenerUsuario, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario,
  listarTecnicos
} from '../controllers/usuariosController.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Listar técnicos (todos los roles)
router.get('/tecnicos', listarTecnicos);

// Gestión completa de usuarios (solo admin)
router.get('/', verificarRol('administrador', 'recepcion'), listarUsuarios);
router.get('/:id', verificarRol('administrador'), obtenerUsuario);
router.post('/', verificarRol('administrador'), crearUsuario);
router.put('/:id', verificarRol('administrador'), actualizarUsuario);
router.delete('/:id', verificarRol('administrador'), eliminarUsuario);

export default router;
