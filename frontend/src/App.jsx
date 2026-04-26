import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Páginas
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import ClienteDetalle from './pages/ClienteDetalle'
import ClienteForm from './pages/ClienteForm'
import Servicios from './pages/Servicios'
import ServicioDetalle from './pages/ServicioDetalle'
import ServicioForm from './pages/ServicioForm'
import InformeTecnico from './pages/InformeTecnico'
import Usuarios from './pages/Usuarios'
import UsuarioForm from './pages/UsuarioForm'
import Perfil from './pages/Perfil'
import Calendario from './pages/Calendario'
import SolicitudPublica from './pages/SolicitudPublica'
import SeguimientoPublico from './pages/SeguimientoPublico'
import Facturacion from './pages/Facturacion'
import FacturaForm from './pages/FacturaForm'
import CotizacionForm from './pages/CotizacionForm'
import PorAsignar from './pages/PorAsignar'
import Landing from './pages/Landing'
import ReportesTecnicos from './pages/ReportesTecnicos'
import ReporteEquiposForm from './pages/ReporteEquiposForm'

// Layout
import Layout from './components/Layout'

// Componente de ruta protegida
const ProtectedRoute = ({ children, rolesPermitidos }) => {
  const { usuario, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!usuario) {
    return <Navigate to="/login" replace />
  }
  
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      {/* Ruta de login */}
      <Route path="/login" element={<Login />} />
      
      {/* Landing pública */}
      <Route path="/" element={<Landing />} />
      
      {/* Rutas públicas */}
      <Route path="/solicitar-servicio" element={<SolicitudPublica />} />
      <Route path="/seguimiento" element={<SeguimientoPublico />} />
      
      {/* Rutas protegidas */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        
        {/* Clientes */}
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/nuevo" element={
          <ProtectedRoute rolesPermitidos={['administrador', 'recepcion']}>
            <ClienteForm />
          </ProtectedRoute>
        } />
        <Route path="clientes/:id" element={<ClienteDetalle />} />
        <Route path="clientes/:id/editar" element={
          <ProtectedRoute rolesPermitidos={['administrador', 'recepcion']}>
            <ClienteForm />
          </ProtectedRoute>
        } />
        
        {/* Servicios */}
        <Route path="servicios" element={<Servicios />} />
        <Route path="servicios/por-asignar" element={
          <ProtectedRoute rolesPermitidos={['administrador', 'recepcion']}>
            <PorAsignar />
          </ProtectedRoute>
        } />
        <Route path="servicios/nuevo" element={
          <ProtectedRoute rolesPermitidos={['administrador', 'recepcion']}>
            <ServicioForm />
          </ProtectedRoute>
        } />
        <Route path="servicios/:id" element={<ServicioDetalle />} />
        <Route path="servicios/:id/editar" element={
          <ProtectedRoute rolesPermitidos={['administrador', 'recepcion']}>
            <ServicioForm />
          </ProtectedRoute>
        } />
        <Route path="servicios/:id/informe" element={<InformeTecnico />} />
        
        {/* Usuarios */}
        <Route path="usuarios" element={
          <ProtectedRoute rolesPermitidos={['administrador']}>
            <Usuarios />
          </ProtectedRoute>
        } />
        <Route path="usuarios/nuevo" element={
          <ProtectedRoute rolesPermitidos={['administrador']}>
            <UsuarioForm />
          </ProtectedRoute>
        } />
        
        {/* Reportes técnicos */}
        <Route
          path="reportes-tecnicos"
          element={
            <ProtectedRoute rolesPermitidos={['administrador', 'tecnico']}>
              <ReportesTecnicos />
            </ProtectedRoute>
          }
        />
        <Route path="reportes-tecnicos/equipos/nuevo" element={
          <ProtectedRoute rolesPermitidos={['administrador', 'tecnico']}>
            <ReporteEquiposForm />
          </ProtectedRoute>
        } />
        <Route path="reportes-tecnicos/equipos/:id" element={
          <ProtectedRoute rolesPermitidos={['administrador', 'tecnico']}>
            <ReporteEquiposForm />
          </ProtectedRoute>
        } />
        <Route path="usuarios/:id/editar" element={
          <ProtectedRoute rolesPermitidos={['administrador']}>
            <UsuarioForm />
          </ProtectedRoute>
        } />
        
        {/* Perfil */}
        <Route path="perfil" element={<Perfil />} />
        
        {/* Calendario */}
        <Route path="calendario" element={<Calendario />} />
        
        {/* Facturación */}
        <Route path="facturacion" element={
          <ProtectedRoute rolesPermitidos={['administrador', 'recepcion']}>
            <Facturacion />
          </ProtectedRoute>
        } />
        <Route path="facturacion/nueva-factura" element={
          <ProtectedRoute rolesPermitidos={['administrador', 'recepcion']}>
            <FacturaForm />
          </ProtectedRoute>
        } />
        <Route path="facturacion/nueva-cotizacion" element={
          <ProtectedRoute rolesPermitidos={['administrador', 'recepcion']}>
            <CotizacionForm />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
