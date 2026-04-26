import express from 'express';
import { 
  listarClientes, 
  obtenerCliente, 
  crearCliente, 
  actualizarCliente, 
  eliminarCliente 
} from '../controllers/clientesController.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Listar y obtener (todos los roles)
router.get('/', listarClientes);
router.get('/:id', obtenerCliente);

// Crear, actualizar y eliminar (admin y recepción)
router.post('/', verificarRol('administrador', 'recepcion'), crearCliente);
router.put('/:id', verificarRol('administrador', 'recepcion'), actualizarCliente);
router.delete('/:id', verificarRol('administrador'), eliminarCliente);

export default router;
