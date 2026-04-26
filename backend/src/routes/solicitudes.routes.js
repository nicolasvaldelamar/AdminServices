import express from 'express';
import { 
  obtenerDisponibilidad, 
  crearSolicitud,
  obtenerServiciosCalendario
} from '../controllers/solicitudesController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

// Rutas PÚBLICAS (sin autenticación)
router.get('/disponibilidad', obtenerDisponibilidad);
router.post('/crear', crearSolicitud);

// Rutas PROTEGIDAS (requieren autenticación)
router.get('/calendario', verificarToken, obtenerServiciosCalendario);

export default router;
