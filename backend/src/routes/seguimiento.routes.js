import express from 'express';
import { consultarServicio, verificarCodigo } from '../controllers/seguimientoController.js';

const router = express.Router();

// Rutas PÚBLICAS (sin autenticación)
router.get('/verificar', verificarCodigo);
router.get('/:codigo', consultarServicio);

export default router;
