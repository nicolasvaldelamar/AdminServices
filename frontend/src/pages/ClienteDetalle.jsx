import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Building2,
  FileText,
  Trash2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { ESTADOS, TIPOS_SERVICIO } from '../utils/estados'
import { formatearFechaHora, formatearMoneda } from '../utils/format'

export default function ClienteDetalle() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    cargarCliente()
  }, [id])
  
  const cargarCliente = async () => {
    try {
      const response = await api.get(`/clientes/${id}`)
      setCliente(response.data)
    } catch (error) {
      console.error('Error cargando cliente:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleEliminar = async () => {
    if (!confirm('¿Está seguro de eliminar este cliente?')) return
    
    try {
      await api.delete(`/clientes/${id}`)
      navigate('/app/clientes')
    } catch (error) {
      alert(error.response?.data?.error || 'Error al eliminar cliente')
    }
  }
  
  const puedeEditar = ['administrador', 'recepcion'].includes(usuario?.rol)
  const puedeEliminar = usuario?.rol === 'administrador'
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!cliente) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Cliente no encontrado</h3>
        <Link to="/app/clientes" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Volver a clientes
        </Link>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Navegación */}
      <Link to="/app/clientes" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft size={20} />
        Volver a clientes
      </Link>
      
      {/* Encabezado */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
              cliente.tipo === 'empresa' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <Building2 className={cliente.tipo === 'empresa' ? 'text-blue-600' : 'text-green-600'} size={32} />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{cliente.nombre}</h1>
                <span className={`badge ${cliente.tipo === 'empresa' ? 'badge-info' : 'badge-success'}`}>
                  {cliente.tipo === 'empresa' ? 'Empresa' : 'Persona'}
                </span>
                {cliente.contrato_activo && (
                  <span className="badge badge-success">Contrato Activo</span>
                )}
              </div>
              {cliente.razon_social && (
                <p className="text-gray-600">{cliente.razon_social}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {puedeEditar && (
              <Link
                to={`/app/clientes/${id}/editar`}
                className="btn-secondary flex items-center gap-2"
              >
                <Edit size={18} />
                Editar
              </Link>
            )}
            {puedeEliminar && (
              <button
                onClick={handleEliminar}
                className="btn-danger flex items-center gap-2"
              >
                <Trash2 size={18} />
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Información de contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Información de Contacto</h2>
          <div className="space-y-3">
            {cliente.contacto && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contacto</p>
                  <p className="font-medium">{cliente.contacto}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Phone size={16} className="text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Teléfono</p>
                <p className="font-medium">{cliente.telefono}</p>
              </div>
            </div>
            
            {cliente.email && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{cliente.email}</p>
                </div>
              </div>
            )}
            
            {cliente.direccion && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dirección</p>
                  <p className="font-medium">{cliente.direccion}</p>
                </div>
              </div>
            )}
          </div>
          
          {cliente.notas && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Notas</p>
              <p className="text-sm text-gray-700">{cliente.notas}</p>
            </div>
          )}
        </div>
        
        {/* Estadísticas */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Servicios</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {cliente.estadisticas?.total_servicios || 0}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {cliente.estadisticas?.servicios_completados || 0}
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {cliente.estadisticas?.servicios_activos || 0}
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Facturado</p>
              <p className="text-lg font-bold text-purple-600 mt-1">
                {formatearMoneda(cliente.estadisticas?.total_facturado || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Servicios recientes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Servicios Recientes</h2>
          <Link
            to={`/app/servicios/nuevo?cliente_id=${id}`}
            className="btn-primary text-sm"
          >
            Nuevo Servicio
          </Link>
        </div>
        
        {cliente.servicios_recientes?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cliente.servicios_recientes.map((servicio) => (
                  <tr key={servicio.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {servicio.codigo}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {TIPOS_SERVICIO[servicio.tipo_servicio]?.icon}{' '}
                      {TIPOS_SERVICIO[servicio.tipo_servicio]?.label}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${ESTADOS[servicio.estado]?.badge}`}>
                        {ESTADOS[servicio.estado]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatearFechaHora(servicio.fecha_ingreso)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/app/servicios/${servicio.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Ver detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto mb-2" size={32} />
            <p>No hay servicios registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}
