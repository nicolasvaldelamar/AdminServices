import express from 'express';
import {
  obtenerInforme,
  crearInforme,
  actualizarInforme,
  listarInformesPorTecnico,
  listarTodosInformes,
  descargarInformePDF
} from '../controllers/informesController.js';
import {
  listarReportesEquipos,
  obtenerReporteEquipos,
  crearReporteEquipos,
  generarPDFReporteEquipos
} from '../controllers/reportesEquiposController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(verificarToken);

router.get('/', listarTodosInformes);

router.get('/tecnico/:tecnico_id', listarInformesPorTecnico);

router.get('/servicio/:servicio_id', obtenerInforme);
router.post('/servicio/:servicio_id', crearInforme);
router.put('/servicio/:servicio_id', actualizarInforme);
router.get('/servicio/:servicio_id/pdf', descargarInformePDF);

router.get('/reportes-equipos', listarReportesEquipos);
router.post('/reportes-equipos', crearReporteEquipos);
router.get('/reportes-equipos/:id', obtenerReporteEquipos);
router.get('/reportes-equipos/:id/pdf', generarPDFReporteEquipos);

export default router;
