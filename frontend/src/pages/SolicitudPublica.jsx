import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'

export default function SolicitudPublica() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(null)
  const [disponibilidad, setDisponibilidad] = useState([])
  const [cargandoDisponibilidad, setCargandoDisponibilidad] = useState(false)
  
  const tipoServicio = watch('tipo_servicio')
  const fechaSeleccionada = watch('fecha_programada')
  const horaSeleccionada = watch('hora_programada')
  
  // Cargar disponibilidad cuando se selecciona fecha y tipo
  const cargarDisponibilidad = async (fecha, tipo) => {
    if (!fecha || !tipo) return
    
    setCargandoDisponibilidad(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/solicitudes/disponibilidad`,
        { params: { fecha, tipo_servicio: tipo } }
      )
      setDisponibilidad(response.data.disponibilidad)
    } catch (error) {
      console.error('Error cargando disponibilidad:', error)
    } finally {
      setCargandoDisponibilidad(false)
    }
  }
  
  // Observar cambios en fecha y tipo
  useEffect(() => {
    if (fechaSeleccionada && tipoServicio === 'campo') {
      cargarDisponibilidad(fechaSeleccionada, tipoServicio)
    }
  }, [fechaSeleccionada, tipoServicio])
  
  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/solicitudes/crear`,
        data
      )
      
      setExito(response.data)
    } catch (error) {
      setError(error.response?.data?.error || 'Error al enviar solicitud')
    } finally {
      setLoading(false)
    }
  }
  
  if (exito) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-white/20 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
            <CheckCircle className="text-white" size={40} />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            ¡Solicitud Recibida!
          </h2>
          
          <p className="text-slate-600 mb-6 font-light text-lg">
            Tu código de servicio es:
          </p>
          
          <div className="bg-gradient-to-br from-primary-50 to-sky-50 border-2 border-primary-200 rounded-2xl p-6 mb-8 shadow-inner">
            <p className="text-4xl font-bold text-primary-600 tracking-tight">
              {exito.codigo_servicio}
            </p>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            {exito.nota}
          </p>
          
          <div className="space-y-3">
            <a
              href="/seguimiento"
              className="btn-primary w-full block text-center"
            >
              Seguir mi Servicio
            </a>
            
            <button
              onClick={() => {
                setExito(null)
                window.location.reload()
              }}
              className="btn-secondary w-full"
            >
              Hacer Otra Solicitud
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen gradient-bg p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-3xl mx-auto py-12 relative z-10">
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
            Solicita tu Servicio Técnico
          </h1>
          <p className="text-primary-100 text-lg font-light">
            Completa el formulario y nos pondremos en contacto contigo
          </p>
        </div>
        
        {/* Formulario */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información del Cliente */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tus Datos
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    {...register('cliente_nombre', { required: 'Nombre es requerido' })}
                    className="input-field"
                    placeholder="Juan Pérez"
                  />
                  {errors.cliente_nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.cliente_nombre.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      {...register('cliente_telefono', { required: 'Teléfono es requerido' })}
                      className="input-field"
                      placeholder="3001234567"
                    />
                    {errors.cliente_telefono && (
                      <p className="mt-1 text-sm text-red-600">{errors.cliente_telefono.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('cliente_email')}
                      className="input-field"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                {tipoServicio === 'campo' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección donde se realizará el servicio *
                    </label>
                    <input
                      {...register('direccion_servicio', {
                        required: 'La dirección es requerida para servicios en campo'
                      })}
                      className="input-field"
                      placeholder="Ej: Calle 123 #45-67, Barrio, Ciudad"
                    />
                    {errors.direccion_servicio && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.direccion_servicio.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Tipo de Solicitud */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ¿Qué necesitas?
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <label className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${watch('tipo_solicitud') === 'servicio' ? 'border-primary-500 shadow-sm' : 'border-gray-200 hover:border-primary-300'}`}>
                  <input
                    type="radio"
                    {...register('tipo_solicitud', { required: 'Selecciona si necesitas servicio o cotización' })}
                    value="servicio"
                    className="sr-only"
                    defaultChecked
                  />
                  <div className="text-3xl mb-2">🔧</div>
                  <div className="font-semibold">Servicio Técnico</div>
                  <div className="text-xs text-gray-600 mt-1">Reparación o mantenimiento</div>
                </label>
                
                <label className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${watch('tipo_solicitud') === 'cotizacion' ? 'border-primary-500 shadow-sm' : 'border-gray-200 hover:border-primary-300'}`}>
                  <input
                    type="radio"
                    {...register('tipo_solicitud', { required: 'Selecciona si necesitas servicio o cotización' })}
                    value="cotizacion"
                    className="sr-only"
                  />
                  <div className="text-3xl mb-2">💰</div>
                  <div className="font-semibold">Cotización</div>
                  <div className="text-xs text-gray-600 mt-1">Solo presupuesto</div>
                </label>
              </div>
              {errors.tipo_solicitud && (
                <p className="text-sm text-red-600">{errors.tipo_solicitud.message}</p>
              )}
            </div>
            
            {/* Tipo de Servicio */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ¿Dónde prefieres el servicio?
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                  tipoServicio === 'taller' 
                    ? 'border-primary-600 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-300'
                }`}>
                  <input
                    type="radio"
                    {...register('tipo_servicio', { required: true })}
                    value="taller"
                    className="sr-only"
                  />
                  <div className="text-3xl mb-2">🏢</div>
                  <div className="font-semibold">Taller</div>
                  <div className="text-xs text-gray-600 mt-1">Llevas tu equipo</div>
                </label>
                
                <label className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                  tipoServicio === 'campo' 
                    ? 'border-primary-600 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-300'
                }`}>
                  <input
                    type="radio"
                    {...register('tipo_servicio', { required: true })}
                    value="campo"
                    className="sr-only"
                  />
                  <div className="text-3xl mb-2">🚗</div>
                  <div className="font-semibold">Campo</div>
                  <div className="text-xs text-gray-600 mt-1">Vamos a tu ubicación</div>
                </label>
              </div>
            </div>
            
            {/* Información del servicio / trabajo */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información del servicio
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría / Tipo de trabajo
                  </label>
                  <input
                    {...register('categoria_servicio')}
                    className="input-field"
                    placeholder="Ej: Instalación de cámaras, Desarrollo de software, Mantenimiento, Redes..."
                  />
                </div>
              </div>
            </div>
            
            {/* Descripción del problema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuál es el problema? (puedes describir también el equipo / lugar) *
              </label>
              <textarea
                {...register('falla_reportada', { required: 'Descripción es requerida' })}
                rows={4}
                className="input-field"
                placeholder="Ej: Equipo se apaga solo, es un portátil HP; o Instalación de 4 cámaras en oficina; o Mantenimiento a red en bodega..."
              />
              {errors.falla_reportada && (
                <p className="mt-1 text-sm text-red-600">{errors.falla_reportada.message}</p>
              )}
            </div>
            
            {/* Programar Fecha (solo para campo) */}
            {tipoServicio === 'campo' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Programar Visita
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      {...register('fecha_programada', { 
                        required: tipoServicio === 'campo' 
                      })}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                      onChange={(e) => {
                        if (e.target.value && tipoServicio === 'campo') {
                          cargarDisponibilidad(e.target.value, tipoServicio)
                        }
                      }}
                    />
                    <p className="text-xs text-slate-500 mt-1">Solo podrás elegir horas disponibles.</p>
                  </div>
                  
                  {fechaSeleccionada && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock size={16} />
                        Hora Disponible *
                      </label>
                      
                      {cargandoDisponibilidad ? (
                        <div className="text-center py-4 text-gray-500">
                          Cargando disponibilidad...
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {disponibilidad.length === 0 && (
                            <p className="text-sm text-gray-500 col-span-2">
                              No hay horarios configurados para esta fecha.
                            </p>
                          )}
                          {disponibilidad.map((horario) => {
                            const estaSeleccionada = horaSeleccionada === horario.hora
                            const clasesBase = 'cursor-pointer border-2 rounded-lg p-3 text-center transition-all'
                            
                            const clasesEstado = !horario.disponible
                              ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                              : estaSeleccionada
                                ? 'border-primary-600 bg-primary-50 shadow-sm'
                                : 'border-gray-200 hover:border-primary-300'
                            
                            return (
                              <label
                                key={horario.hora}
                                className={`${clasesBase} ${clasesEstado}`}
                              >
                                <input
                                  type="radio"
                                  {...register('hora_programada', { 
                                    required: tipoServicio === 'campo' 
                                  })}
                                  value={horario.hora}
                                  disabled={!horario.disponible}
                                  className="sr-only"
                                />
                                <div className="font-semibold">{horario.label}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {horario.disponible ? '✅ Disponible' : '❌ No disponible'}
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
            
            <p className="text-xs text-center text-gray-500">
              Al enviar esta solicitud, aceptas que nos pongamos en contacto contigo
              para confirmar tu servicio técnico.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
