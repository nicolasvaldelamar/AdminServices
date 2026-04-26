import express from 'express';
import { login, obtenerPerfil, cambiarPassword } from '../controllers/authController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);

// Rutas protegidas
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/cambiar-password', verificarToken, cambiarPassword);

export default router;
