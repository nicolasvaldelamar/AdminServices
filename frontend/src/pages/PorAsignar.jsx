import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Clock, AlertCircle } from 'lucide-react'
import api from '../services/api'
import { TIPOS_SERVICIO } from '../utils/estados'
import { formatearFechaHora } from '../utils/format'

export default function PorAsignar() {
  const [servicios, setServicios] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    cargarDatos()
  }, [])
  
  const cargarDatos = async () => {
    try {
      const [serviciosRes, tecnicosRes] = await Promise.all([
        api.get('/servicios?estado=por_asignar'),
        api.get('/usuarios/tecnicos')
      ])
      setServicios(serviciosRes.data)
      setTecnicos(tecnicosRes.data)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const asignarTecnico = async (servicioId, tecnicoId) => {
    try {
      await api.put(`/servicios/${servicioId}`, {
        tecnico_asignado_id: tecnicoId
      })
      
      await api.patch(`/servicios/${servicioId}/estado`, {
        estado: 'recibido'
      })
      
      cargarDatos()
    } catch (error) {
      alert(error.response?.data?.error || 'Error al asignar técnico')
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Clock size={24} className="text-white" />
            </div>
            Servicios Por Asignar
          </h1>
          <p className="text-slate-600 font-light text-sm sm:text-base lg:text-lg ml-16">
            Solicitudes pendientes de asignación de técnico
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl px-6 py-3 shadow-lg">
          <p className="text-3xl font-bold text-orange-600">{servicios.length}</p>
          <p className="text-xs text-orange-700 font-semibold">Pendiente{servicios.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      
      {/* Lista de servicios */}
      {servicios.length === 0 ? (
        <div className="card text-center py-12">
          <Clock className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay servicios por asignar
          </h3>
          <p className="text-gray-600">
            Todos los servicios han sido asignados a técnicos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="card hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500 hover:border-l-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {servicio.codigo}
                    </h3>
                    <span className={`text-2xl`}>
                      {TIPOS_SERVICIO[servicio.tipo_servicio]?.icon}
                    </span>
                    <span className="badge badge-info">
                      {servicio.tipo_solicitud === 'cotizacion' ? 'Cotización' : 'Servicio'}
                    </span>
                    {servicio.prioridad === 'urgente' && (
                      <span className="badge badge-danger flex items-center gap-1">
                        <AlertCircle size={14} />
                        Urgente
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Cliente:</p>
                      <p className="font-semibold text-gray-900">
                        {servicio.cliente_nombre}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        📞 {servicio.cliente_telefono}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Tipo de Servicio:</p>
                      <p className="font-semibold text-gray-900">
                        {TIPOS_SERVICIO[servicio.tipo_servicio]?.label}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Recibido: {formatearFechaHora(servicio.fecha_ingreso)}
                      </p>
                    </div>
                  </div>
                  
                  {servicio.equipo_marca && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Equipo:</p>
                      <p className="font-medium text-gray-900">
                        {servicio.equipo_marca} {servicio.equipo_modelo && `- ${servicio.equipo_modelo}`}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      {servicio.tipo_solicitud === 'cotizacion' ? 'Descripción:' : 'Problema Reportado:'}
                    </p>
                    <p className="text-gray-900">{servicio.falla_reportada}</p>
                  </div>
                </div>
              </div>
              
              {/* Asignar Técnico */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UserPlus size={18} />
                    Asignar a:
                  </label>
                  
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        asignarTecnico(servicio.id, e.target.value)
                      }
                    }}
                    className="input-field flex-1 max-w-xs"
                    defaultValue=""
                  >
                    <option value="">Seleccionar técnico...</option>
                    {tecnicos.map((tecnico) => (
                      <option key={tecnico.id} value={tecnico.id}>
                        {tecnico.nombre}
                      </option>
                    ))}
                  </select>
                  
                  <Link
                    to={`/app/servicios/${servicio.id}`}
                    className="btn-secondary text-sm"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
