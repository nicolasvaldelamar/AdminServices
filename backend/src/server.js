import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import serviciosRoutes from './routes/servicios.routes.js';
import informesRoutes from './routes/informes.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import seguimientoRoutes from './routes/seguimiento.routes.js';
import facturacionRoutes from './routes/facturacion.routes.js';

// Configuración
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check para Render
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Rutas
app.get('/api', (req, res) => {
  res.json({ 
    mensaje: 'API de Gestión de Servicios Técnicos - Arnol Caicedo',
    version: '1.0.0',
    documentacion: '/api/docs'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/informes', informesRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/seguimiento', seguimientoRoutes);
app.use('/api/facturacion', facturacionRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada' 
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 Servidor iniciado');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('Endpoints disponibles:');
  console.log('  GET  /api');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/auth/perfil');
  console.log('  GET  /api/usuarios');
  console.log('  GET  /api/clientes');
  console.log('  GET  /api/servicios');
  console.log('  GET  /api/informes');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

export default app;
