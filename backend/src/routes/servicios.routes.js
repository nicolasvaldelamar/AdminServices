import express from 'express';
import { 
  listarServicios, 
  obtenerServicio, 
  crearServicio, 
  actualizarServicio,
  cambiarEstado,
  facturarServicio,
  obtenerEstadisticas
} from '../controllers/serviciosController.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Estadísticas (todos los roles; los técnicos reciben datos filtrados a sus servicios)
router.get('/estadisticas', obtenerEstadisticas);

// Listar y obtener (todos los roles, filtrado por rol en el controlador)
router.get('/', listarServicios);
router.get('/:id', obtenerServicio);

// Crear servicio (admin y recepción)
router.post('/', verificarRol('administrador', 'recepcion'), crearServicio);

// Actualizar servicio (admin y recepción)
router.put('/:id', verificarRol('administrador', 'recepcion'), actualizarServicio);

// Cambiar estado (todos pueden cambiar estado)
router.patch('/:id/estado', cambiarEstado);

// Facturar (admin y recepción)
router.patch('/:id/facturar', verificarRol('administrador', 'recepcion'), facturarServicio);

export default router;
