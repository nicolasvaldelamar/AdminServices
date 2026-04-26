# Sistema de Gestión de Servicios Técnicos
## Arnol Caicedo - Soluciones en Tecnología y Ciberseguridad

Sistema completo para gestión de servicios técnicos en taller y campo.

## 🚀 Características

### Sistema Interno (Requiere Login)
- ✅ Gestión de clientes (empresas y personas)
- ✅ Recepción y seguimiento de equipos
- ✅ Asignación de servicios (taller/campo)
- ✅ **10 estados** del ciclo de vida
- ✅ Informes técnicos detallados
- ✅ **Calendario visual** de servicios
- ✅ Panel administrativo con reportes
- ✅ Sistema multi-técnico
- ✅ **Módulo de facturación completo**
- ✅ **Generación de PDFs** profesionales
- ✅ Control de cotizaciones
- ✅ Vista especial "Por Asignar"

### Sistema Público (Sin Login)
- ✅ **Solicitud de servicios online** 24/7
- ✅ Elección entre Servicio o Cotización
- ✅ Verificación de disponibilidad en tiempo real
- ✅ **Seguimiento con código** de servicio
- ✅ Barra de progreso visual
- ✅ Timeline de estados

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Multer (subida de archivos)
- **PDFKit** (generación de PDFs)

### Frontend
- React 18
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Lucide React (iconos)
- date-fns (fechas)

## 📋 Requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
cd AdminServices
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://usuario:password@localhost:5432/adminservices
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
NODE_ENV=development
```

### 3. Configurar Base de Datos
```bash
# Crear base de datos
createdb adminservices

# Ejecutar migraciones
npm run migrate
```

### 4. Configurar Frontend
```bash
cd ../frontend
npm install
```

Crear archivo `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Ejecución

### Desarrollo

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173`
El backend en `http://localhost:5000`

## 👤 Usuarios por defecto

| Rol | Email | Password |
|-----|-------|----------|
| **Administrador** | admin@arnolcaicedo.com | admin123 |
| **Técnico** | tecnico@arnolcaicedo.com | tecnico123 |
| **Recepción** | recepcion@arnolcaicedo.com | recepcion123 |

⚠️ **IMPORTANTE:** Cambia estas contraseñas después del primer acceso.

## 📁 Estructura del Proyecto

```
AdminServices/
├── backend/
│   ├── migrations/         # Migraciones SQL
│   ├── src/
│   │   ├── config/         # Configuraciones
│   │   ├── controllers/    # Controladores (8)
│   │   ├── middlewares/    # Autenticación
│   │   ├── routes/         # Rutas API (8)
│   │   ├── utils/          # PDFs y utilidades
│   │   └── server.js       # Servidor Express
│   ├── uploads/            # Archivos subidos
│   ├── logo.jpeg           # Logo para PDFs
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── logo.jpeg       # Logo del sistema
│   ├── src/
│   │   ├── components/     # Layout, Navbar, Sidebar
│   │   ├── pages/          # 15 páginas
│   │   ├── services/       # Cliente API
│   │   ├── context/        # AuthContext
│   │   └── utils/          # Helpers
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── logo.jpeg               # Logo original
├── README.md               # Este archivo
├── INSTALACION.md          # Guía de instalación
├── MANUAL_USUARIO.md       # Manual completo
├── MANUAL_FACTURACION.md   # Guía de facturación
├── PERSONALIZAR_PDF.md     # Personalizar plantillas
├── GUIA_DESARROLLO.md      # Para desarrolladores
├── COMANDOS_RAPIDOS.md     # Referencia rápida
└── RESUMEN_FINAL.md        # Resumen ejecutivo
```

## 🔐 Roles y Permisos

### Administrador
- Acceso completo al sistema
- Gestión de usuarios
- Visualización de todos los reportes
- Control total de estados

### Recepción/Administración
- Registro de clientes
- Recepción de equipos
- Asignación de servicios
- Cambio de estados básicos
- Vista de reportes limitados

### Técnico
- Vista de servicios asignados
- Creación de informes técnicos
- Cambio de estados técnicos
- Subida de fotos/documentos

## 📊 Módulos del Sistema

### 1. Usuarios y Roles
Gestión completa de usuarios con roles diferenciados

### 2. Clientes
- Registro de empresas y personas naturales
- Historial de servicios
- Control de contratos activos

### 3. Servicios
- Flujo completo de estados
- Diferenciación taller/campo
- Asignación de técnicos
- Seguimiento en tiempo real

### 4. Informes Técnicos
- Diagnóstico detallado
- Trabajo realizado
- Repuestos utilizados
- Tiempo invertido
- Adjuntar fotos

### 5. Panel Administrativo
- Servicios pendientes
- Servicios por técnico
- Servicios por estado
- Control de facturación

## 🔄 Estados del Servicio

1. **Recibido** - Ingreso al sistema
2. **En diagnóstico** - Evaluación técnica
3. **Cotizado** - Presupuesto generado
4. **Aprobado** - Cliente aprueba cotización
5. **En reparación** - Trabajo en proceso
6. **Listo** - Trabajo terminado
7. **Entregado** - Cliente recoge/recibe
8. **Facturado** - Cobro realizado
9. **Cerrado** - Servicio completado

## 📝 Licencia

Desarrollado por Arnol Caicedo © 2026
