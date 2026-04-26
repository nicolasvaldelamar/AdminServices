import express from 'express';
import { 
  listarFacturas,
  obtenerFactura,
  crearFactura,
  actualizarEstadoFactura,
  listarCotizaciones,
  obtenerCotizacion,
  crearCotizacion,
  actualizarEstadoCotizacion,
  descargarFacturaPDF,
  descargarCotizacionPDF
} from '../controllers/facturacionController.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas de Facturas
router.get('/facturas', verificarRol('administrador', 'recepcion'), listarFacturas);
router.get('/facturas/:id', verificarRol('administrador', 'recepcion'), obtenerFactura);
router.get('/facturas/:id/pdf', verificarRol('administrador', 'recepcion'), descargarFacturaPDF);
router.post('/facturas', verificarRol('administrador', 'recepcion'), crearFactura);
router.patch('/facturas/:id/estado', verificarRol('administrador', 'recepcion'), actualizarEstadoFactura);

// Rutas de Cotizaciones
router.get('/cotizaciones', verificarRol('administrador', 'recepcion'), listarCotizaciones);
router.get('/cotizaciones/:id', verificarRol('administrador', 'recepcion'), obtenerCotizacion);
router.get('/cotizaciones/:id/pdf', verificarRol('administrador', 'recepcion'), descargarCotizacionPDF);
router.post('/cotizaciones', verificarRol('administrador', 'recepcion'), crearCotizacion);
router.patch('/cotizaciones/:id/estado', verificarRol('administrador', 'recepcion'), actualizarEstadoCotizacion);

export default router;
