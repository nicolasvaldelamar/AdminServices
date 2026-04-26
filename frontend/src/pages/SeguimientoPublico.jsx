import { useState } from 'react'
import { Search, CheckCircle, Clock, Package, Wrench, TrendingUp, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { formatearFechaHora, formatearMoneda } from '../utils/format'

export default function SeguimientoPublico() {
  const [codigo, setCodigo] = useState('')
  const [servicio, setServicio] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const buscarServicio = async (e) => {
    e.preventDefault()
    
    if (!codigo.trim()) {
      setError('Por favor ingresa un código de servicio')
      return
    }
    
    setLoading(true)
    setError('')
    setServicio(null)
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/seguimiento/${codigo.trim()}`
      )
      setServicio(response.data)
    } catch (error) {
      setError(
        error.response?.data?.error || 
        'No se encontró un servicio con ese código. Verifica que esté correcto.'
      )
    } finally {
      setLoading(false)
    }
  }
  
  const obtenerEstadoInfo = (estado) => {
    const estados = {
      'por_asignar': { 
        label: 'Por Asignar', 
        color: 'bg-orange-100 text-orange-800',
        icono: '⏳',
        descripcion: 'Tu solicitud está siendo revisada y será asignada a un técnico pronto'
      },
      'recibido': { 
        label: 'Recibido', 
        color: 'bg-gray-100 text-gray-800',
        icono: '📥',
        descripcion: 'Tu equipo ha sido recibido y registrado en nuestro sistema'
      },
      'en_diagnostico': { 
        label: 'En Diagnóstico', 
        color: 'bg-blue-100 text-blue-800',
        icono: '🔍',
        descripcion: 'Nuestro técnico está evaluando tu equipo'
      },
      'cotizado': { 
        label: 'Cotizado', 
        color: 'bg-purple-100 text-purple-800',
        icono: '💰',
        descripcion: 'Hemos preparado una cotización para la reparación'
      },
      'aprobado': { 
        label: 'Aprobado', 
        color: 'bg-indigo-100 text-indigo-800',
        icono: '✅',
        descripcion: 'La cotización ha sido aprobada, comenzaremos la reparación'
      },
      'en_reparacion': { 
        label: 'En Reparación', 
        color: 'bg-yellow-100 text-yellow-800',
        icono: '🔧',
        descripcion: 'Estamos trabajando en la reparación de tu equipo'
      },
      'listo': { 
        label: 'Listo', 
        color: 'bg-green-100 text-green-800',
        icono: '✨',
        descripcion: 'Tu equipo está listo para ser entregado'
      },
      'entregado': { 
        label: 'Entregado', 
        color: 'bg-teal-100 text-teal-800',
        icono: '📦',
        descripcion: 'El equipo ha sido entregado al cliente'
      },
      'facturado': { 
        label: 'Facturado', 
        color: 'bg-emerald-100 text-emerald-800',
        icono: '💵',
        descripcion: 'Servicio completado y facturado'
      },
      'cerrado': { 
        label: 'Cerrado', 
        color: 'bg-gray-200 text-gray-900',
        icono: '🏁',
        descripcion: 'Servicio completado exitosamente'
      }
    }
    
    return estados[estado] || estados['recibido']
  }
  
  const resetBusqueda = () => {
    setCodigo('')
    setServicio(null)
    setError('')
  }
  
  return (
    <div className="min-h-screen gradient-bg p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-primary-500/20 rounded-3xl blur-2xl"></div>
            <img 
            src="/IMG_2233.PNG" 
            alt="Logo" 
              className="relative w-40 h-auto drop-shadow-2xl"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Seguimiento de Servicio
          </h1>
          <p className="text-primary-100 text-lg font-light">
            Consulta el estado de tu servicio técnico en tiempo real
          </p>
        </div>
        
        {/* Buscador */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 mb-8 border border-white/20">
          <form onSubmit={buscarServicio} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Servicio
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="input-field flex-1"
                  placeholder="Ej: SRV-20260120-12345"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Buscar
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Ingresa el código que recibiste al solicitar el servicio
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>
        
        {/* Resultado */}
        {servicio && (
          <div className="space-y-6">
            {/* Estado Principal */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">
                  {obtenerEstadoInfo(servicio.estado).icono}
                </div>
                <span className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${obtenerEstadoInfo(servicio.estado).color}`}>
                  {obtenerEstadoInfo(servicio.estado).label}
                </span>
                <p className="text-gray-600 mt-3">
                  {obtenerEstadoInfo(servicio.estado).descripcion}
                </p>
              </div>
              
              {/* Barra de Progreso */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso</span>
                  <span className="font-semibold">{servicio.progreso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${servicio.progreso}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Información del Servicio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Código de Servicio</p>
                  <p className="font-bold text-lg text-gray-900">{servicio.codigo}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tipo de Servicio</p>
                  <p className="font-semibold text-gray-900">
                    {servicio.tipo_servicio === 'taller' ? '🔧 Taller' : '🚗 Campo'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha de Ingreso</p>
                  <p className="font-semibold text-gray-900">
                    {formatearFechaHora(servicio.fecha_ingreso)}
                  </p>
                </div>
                
                {servicio.tecnico_nombre && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Técnico Asignado</p>
                    <p className="font-semibold text-gray-900">{servicio.tecnico_nombre}</p>
                  </div>
                )}
                
                {servicio.fecha_programada && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha Programada</p>
                    <p className="font-semibold text-gray-900">
                      {formatearFechaHora(servicio.fecha_programada)}
                    </p>
                  </div>
                )}
                
                {servicio.prioridad === 'urgente' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Prioridad</p>
                    <span className="badge badge-danger">Urgente</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Información del Equipo */}
            {(servicio.equipo_marca || servicio.equipo_modelo) && (
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={20} />
                  Información del Equipo
                </h3>
                <div className="space-y-2">
                  {servicio.equipo_marca && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Marca:</span>
                      <span className="font-medium">{servicio.equipo_marca}</span>
                    </div>
                  )}
                  {servicio.equipo_modelo && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modelo:</span>
                      <span className="font-medium">{servicio.equipo_modelo}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Problema Reportado:</p>
                    <p className="text-gray-900">{servicio.falla_reportada}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Informe Técnico */}
            {servicio.informe && (
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench size={20} />
                  Informe Técnico
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Diagnóstico:</p>
                    <p className="text-gray-900">{servicio.informe.diagnostico}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Trabajo Realizado:</p>
                    <p className="text-gray-900">{servicio.informe.trabajo_realizado}</p>
                  </div>
                  {servicio.informe.recomendaciones && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Recomendaciones:</p>
                      <p className="text-gray-900">{servicio.informe.recomendaciones}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Cotización */}
            {servicio.cotizacion_monto && (
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Cotización
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monto:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatearMoneda(servicio.cotizacion_monto)}
                  </span>
                </div>
                {servicio.cotizacion_aprobada && (
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    ✅ Cotización aprobada
                  </p>
                )}
              </div>
            )}
            
            {/* Timeline Visual */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Historial del Servicio</h3>
              <div className="space-y-4">
                <TimelineItem 
                  fecha={servicio.fecha_ingreso}
                  titulo="Servicio Recibido"
                  completado={true}
                />
                {servicio.estado !== 'recibido' && (
                  <TimelineItem 
                    fecha={servicio.creado_en}
                    titulo="En Proceso"
                    completado={true}
                  />
                )}
                {servicio.fecha_finalizacion && (
                  <TimelineItem 
                    fecha={servicio.fecha_finalizacion}
                    titulo="Trabajo Completado"
                    completado={true}
                  />
                )}
                {servicio.fecha_entrega && (
                  <TimelineItem 
                    fecha={servicio.fecha_entrega}
                    titulo="Equipo Entregado"
                    completado={true}
                  />
                )}
              </div>
            </div>
            
            {/* Botón para nueva búsqueda */}
            <div className="text-center">
              <button
                onClick={resetBusqueda}
                className="btn-secondary"
              >
                Consultar Otro Servicio
              </button>
            </div>
          </div>
        )}
        
        {/* Información de contacto */}
        <div className="mt-8 text-center text-primary-100 text-sm">
          <p className="mb-2">¿Tienes preguntas sobre tu servicio?</p>
          <p>Contáctanos: <a href="tel:0000000000" className="font-semibold hover:text-white">Teléfono</a></p>
        </div>
      </div>
    </div>
  )
}

// Componente de Timeline
function TimelineItem({ fecha, titulo, completado }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-3 h-3 rounded-full mt-1 ${completado ? 'bg-green-500' : 'bg-gray-300'}`}></div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{titulo}</p>
        <p className="text-sm text-gray-600">{formatearFechaHora(fecha)}</p>
      </div>
      {completado && <CheckCircle size={20} className="text-green-500 mt-1" />}
    </div>
  )
}
