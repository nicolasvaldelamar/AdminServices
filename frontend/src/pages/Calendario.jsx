import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import api from '../services/api'
import { ESTADOS, TIPOS_SERVICIO } from '../utils/estados'
import { formatearFechaHora } from '../utils/format'

export default function Calendario() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [mesActual, setMesActual] = useState(new Date())
  const [vistaCalendario, setVistaCalendario] = useState(true)
  
  useEffect(() => {
    cargarServicios()
  }, [mesActual])
  
  const cargarServicios = async () => {
    try {
      const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1)
      const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0)
      
      const response = await api.get('/solicitudes/calendario', {
        params: {
          fecha_inicio: primerDia.toISOString().split('T')[0],
          fecha_fin: ultimoDia.toISOString().split('T')[0]
        }
      })
      
      setServicios(response.data)
    } catch (error) {
      console.error('Error cargando servicios:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const cambiarMes = (direccion) => {
    const nuevoMes = new Date(mesActual)
    nuevoMes.setMonth(mesActual.getMonth() + direccion)
    setMesActual(nuevoMes)
  }
  
  const obtenerDiasDelMes = () => {
    const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1)
    const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0)
    
    const dias = []
    
    // Días del mes anterior para completar la primera semana
    const primerDiaSemana = primerDia.getDay()
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const dia = new Date(primerDia)
      dia.setDate(dia.getDate() - i - 1)
      dias.push({ fecha: dia, esOtroMes: true })
    }
    
    // Días del mes actual
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const dia = new Date(mesActual.getFullYear(), mesActual.getMonth(), i)
      dias.push({ fecha: dia, esOtroMes: false })
    }
    
    return dias
  }
  
  const obtenerServiciosDelDia = (fecha) => {
    return servicios.filter(servicio => {
      const fechaServicio = servicio.fecha_programada 
        ? new Date(servicio.fecha_programada)
        : new Date(servicio.fecha_ingreso)
      
      return fechaServicio.toDateString() === fecha.toDateString()
    })
  }
  
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CalendarIcon size={32} />
            Calendario de Servicios
          </h1>
          <p className="text-gray-600 mt-1">
            Visualiza y organiza los servicios programados
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setVistaCalendario(!vistaCalendario)}
            className="btn-secondary"
          >
            {vistaCalendario ? 'Vista Lista' : 'Vista Calendario'}
          </button>
        </div>
      </div>
      
      {vistaCalendario ? (
        /* Vista de Calendario */
        <div className="card">
          {/* Navegación del mes */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => cambiarMes(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900">
              {meses[mesActual.getMonth()]} {mesActual.getFullYear()}
            </h2>
            
            <button
              onClick={() => cambiarMes(1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dias.map(dia => (
              <div key={dia} className="text-center font-semibold text-gray-600 py-2">
                {dia}
              </div>
            ))}
          </div>
          
          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-2">
            {obtenerDiasDelMes().map((dia, index) => {
              const serviciosDelDia = obtenerServiciosDelDia(dia.fecha)
              const esHoy = dia.fecha.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border rounded-lg ${
                    dia.esOtroMes 
                      ? 'bg-gray-50 text-gray-400' 
                      : esHoy
                      ? 'bg-primary-50 border-primary-500'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-1 ${esHoy ? 'text-primary-600' : ''}`}>
                    {dia.fecha.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {serviciosDelDia.map(servicio => (
                      <Link
                        key={servicio.id}
                        to={`/app/servicios/${servicio.id}`}
                        className={`block text-xs p-1 rounded truncate ${ESTADOS[servicio.estado]?.color}`}
                        title={`${servicio.codigo} - ${servicio.cliente_nombre}`}
                      >
                        {TIPOS_SERVICIO[servicio.tipo_servicio]?.icon} {servicio.codigo}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Leyenda */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Leyenda</h3>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary-50 border border-primary-500 rounded"></div>
                <span>Hoy</span>
              </div>
              {Object.entries(ESTADOS).slice(0, 5).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${value.color}`}></div>
                  <span>{value.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Vista de Lista */
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            Servicios de {meses[mesActual.getMonth()]}
          </h3>
          
          {servicios.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CalendarIcon className="mx-auto mb-2" size={48} />
              <p>No hay servicios programados para este mes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {servicios.map(servicio => (
                <Link
                  key={servicio.id}
                  to={`/app/servicios/${servicio.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">
                          {servicio.codigo}
                        </span>
                        <span className={`badge ${ESTADOS[servicio.estado]?.badge}`}>
                          {ESTADOS[servicio.estado]?.label}
                        </span>
                        <span className="text-sm text-gray-600">
                          {TIPOS_SERVICIO[servicio.tipo_servicio]?.icon}{' '}
                          {TIPOS_SERVICIO[servicio.tipo_servicio]?.label}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Cliente:</strong> {servicio.cliente_nombre}
                      </p>
                      
                      {servicio.tecnico_nombre && (
                        <p className="text-sm text-gray-600">
                          <strong>Técnico:</strong> {servicio.tecnico_nombre}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        {servicio.falla_reportada?.substring(0, 100)}...
                      </p>
                    </div>
                    
                    <div className="text-right text-sm text-gray-600">
                      {formatearFechaHora(servicio.fecha_programada || servicio.fecha_ingreso)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
