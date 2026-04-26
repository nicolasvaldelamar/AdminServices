import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, FileText, Clock, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { ESTADOS, TIPOS_SERVICIO, PRIORIDADES } from '../utils/estados'
import { formatearFechaHora, formatearMoneda } from '../utils/format'

export default function ServicioDetalle() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [servicio, setServicio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cambiandoEstado, setCambiandoEstado] = useState(false)
  
  useEffect(() => {
    cargarServicio()
  }, [id])
  
  const cargarServicio = async () => {
    try {
      const response = await api.get(`/servicios/${id}`)
      setServicio(response.data)
    } catch (error) {
      console.error('Error cargando servicio:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCambiarEstado = async (nuevoEstado) => {
    setCambiandoEstado(true)
    try {
      await api.patch(`/servicios/${id}/estado`, { estado: nuevoEstado })
      await cargarServicio()
    } catch (error) {
      alert(error.response?.data?.error || 'Error al cambiar estado')
    } finally {
      setCambiandoEstado(false)
    }
  }
  
  const puedeEditar = ['administrador', 'recepcion'].includes(usuario?.rol)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!servicio) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Servicio no encontrado</h3>
        <Link to="/app/servicios" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Volver a servicios
        </Link>
      </div>
    )
  }
  
  const estadosSiguientes = {
    recibido: ['en_diagnostico'],
    en_diagnostico: ['cotizado', 'en_reparacion'],
    cotizado: ['aprobado'],
    aprobado: ['en_reparacion'],
    en_reparacion: ['listo'],
    listo: ['entregado'],
    entregado: ['facturado'],
    facturado: ['cerrado']
  }
  
  return (
    <div className="space-y-6">
      <Link to="/app/servicios" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft size={20} />
        Volver a servicios
      </Link>
      
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{servicio.codigo}</h1>
            <div className="flex items-center gap-3">
              <span className={`badge ${ESTADOS[servicio.estado]?.badge}`}>
                {ESTADOS[servicio.estado]?.label}
              </span>
              <span className={`badge ${servicio.prioridad === 'urgente' ? 'badge-danger' : 'badge-gray'}`}>
                {PRIORIDADES[servicio.prioridad]?.label}
              </span>
              <span className="text-sm text-gray-600">
                {TIPOS_SERVICIO[servicio.tipo_servicio]?.icon}{' '}
                {TIPOS_SERVICIO[servicio.tipo_servicio]?.label}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-end">
            {puedeEditar && (
              <Link to={`/app/servicios/${id}/editar`} className="btn-secondary flex items-center gap-2">
                <Edit size={18} />
                Editar
              </Link>
            )}
            {puedeEditar && servicio.tipo_solicitud === 'cotizacion' && (
              <Link
                to={`/app/facturacion/nueva-cotizacion?servicio_id=${id}`}
                className="btn-secondary flex items-center gap-2"
              >
                <FileText size={18} />
                Crear Cotización
              </Link>
            )}
            {puedeEditar && servicio.tipo_solicitud === 'servicio' && (
              <Link
                to={`/app/facturacion/nueva-factura?servicio_id=${id}`}
                className="btn-primary flex items-center gap-2"
              >
                <FileText size={18} />
                Generar Factura
              </Link>
            )}
            {servicio.informe_tecnico ? (
              <Link to={`/app/servicios/${id}/informe`} className="btn-primary flex items-center gap-2">
                <FileText size={18} />
                Ver Informe
              </Link>
            ) : (
              usuario?.rol === 'tecnico' && (
                <Link to={`/app/servicios/${id}/informe`} className="btn-primary flex items-center gap-2">
                  <FileText size={18} />
                  Crear Informe
                </Link>
              )
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Información del Cliente</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Cliente:</span>
                <Link to={`/app/clientes/${servicio.cliente_id}`} className="ml-2 text-primary-600 hover:text-primary-700 font-medium">
                  {servicio.cliente_nombre}
                </Link>
              </div>
              <div>
                <span className="text-gray-600">Teléfono:</span>
                <span className="ml-2 font-medium">{servicio.cliente_telefono}</span>
              </div>
            </div>
          </div>
          
          {servicio.equipo_marca && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Información del Equipo</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Marca:</span>
                  <span className="ml-2 font-medium">{servicio.equipo_marca}</span>
                </div>
                {servicio.equipo_modelo && (
                  <div>
                    <span className="text-gray-600">Modelo:</span>
                    <span className="ml-2 font-medium">{servicio.equipo_modelo}</span>
                  </div>
                )}
                {servicio.equipo_serial && (
                  <div>
                    <span className="text-gray-600">Serial:</span>
                    <span className="ml-2 font-medium">{servicio.equipo_serial}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {servicio.categoria_servicio && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categoría / Tipo de trabajo</h3>
              <p className="text-gray-700 font-medium">{servicio.categoria_servicio}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Falla Reportada</h3>
          <p className="text-gray-700">{servicio.falla_reportada}</p>
        </div>
        
        {servicio.tecnico_nombre && (
          <div className="mt-4">
            <span className="text-gray-600 text-sm">Técnico asignado:</span>
            <span className="ml-2 font-medium">{servicio.tecnico_nombre}</span>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Fecha de Ingreso</p>
            <p className="font-medium">{formatearFechaHora(servicio.fecha_ingreso)}</p>
          </div>
          {servicio.fecha_programada && (
            <div>
              <p className="text-gray-600">Fecha Programada</p>
              <p className="font-medium">{formatearFechaHora(servicio.fecha_programada)}</p>
            </div>
          )}
          {servicio.fecha_finalizacion && (
            <div>
              <p className="text-gray-600">Fecha Finalización</p>
              <p className="font-medium">{formatearFechaHora(servicio.fecha_finalizacion)}</p>
            </div>
          )}
          {servicio.cotizacion_monto && (
            <div>
              <p className="text-gray-600">Cotización</p>
              <p className="font-medium">{formatearMoneda(servicio.cotizacion_monto)}</p>
            </div>
          )}
        </div>
      </div>
      
      {estadosSiguientes[servicio.estado] && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Cambiar Estado</h3>
          <div className="flex gap-2 flex-wrap">
            {estadosSiguientes[servicio.estado].map((estado) => (
              <button
                key={estado}
                onClick={() => handleCambiarEstado(estado)}
                disabled={cambiandoEstado}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle size={16} />
                Marcar como {ESTADOS[estado]?.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
