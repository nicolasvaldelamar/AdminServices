import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  CheckCircle,
  Package,
  Wrench,
  TrendingUp,
  AlertCircle,
  ArrowLeft,
  Clock,
  Sparkles
} from 'lucide-react'
import axios from 'axios'
import { formatearFechaHora, formatearMoneda } from '../utils/format'

const ESTADO_INFO = {
  por_asignar: {
    label: 'Por asignar',
    color: 'bg-orange-100 text-orange-800 ring-orange-600/20',
    accent: 'from-orange-400 to-orange-600',
    icono: '⏳',
    descripcion: 'Tu solicitud está siendo revisada y será asignada a un técnico pronto.'
  },
  recibido: {
    label: 'Recibido',
    color: 'bg-slate-100 text-slate-800 ring-slate-600/20',
    accent: 'from-slate-400 to-slate-600',
    icono: '📥',
    descripcion: 'Tu equipo ha sido recibido y registrado en nuestro sistema.'
  },
  en_diagnostico: {
    label: 'En diagnóstico',
    color: 'bg-blue-100 text-blue-800 ring-blue-600/20',
    accent: 'from-blue-400 to-blue-600',
    icono: '🔍',
    descripcion: 'Nuestro técnico está evaluando tu equipo.'
  },
  cotizado: {
    label: 'Cotizado',
    color: 'bg-purple-100 text-purple-800 ring-purple-600/20',
    accent: 'from-purple-400 to-purple-600',
    icono: '💰',
    descripcion: 'Hemos preparado una cotización para la reparación.'
  },
  aprobado: {
    label: 'Aprobado',
    color: 'bg-indigo-100 text-indigo-800 ring-indigo-600/20',
    accent: 'from-indigo-400 to-indigo-600',
    icono: '✅',
    descripcion: 'La cotización ha sido aprobada, comenzamos la reparación.'
  },
  en_reparacion: {
    label: 'En reparación',
    color: 'bg-amber-100 text-amber-800 ring-amber-600/20',
    accent: 'from-amber-400 to-amber-600',
    icono: '🔧',
    descripcion: 'Estamos trabajando en la reparación de tu equipo.'
  },
  listo: {
    label: 'Listo',
    color: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
    accent: 'from-emerald-400 to-emerald-600',
    icono: '✨',
    descripcion: 'Tu equipo está listo para ser entregado.'
  },
  entregado: {
    label: 'Entregado',
    color: 'bg-teal-100 text-teal-800 ring-teal-600/20',
    accent: 'from-teal-400 to-teal-600',
    icono: '📦',
    descripcion: 'El equipo ha sido entregado al cliente.'
  },
  facturado: {
    label: 'Facturado',
    color: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
    accent: 'from-emerald-500 to-emerald-700',
    icono: '💵',
    descripcion: 'Servicio completado y facturado.'
  },
  cerrado: {
    label: 'Cerrado',
    color: 'bg-slate-200 text-slate-900 ring-slate-700/20',
    accent: 'from-slate-500 to-slate-700',
    icono: '🏁',
    descripcion: 'Servicio completado exitosamente.'
  }
}

const obtenerEstadoInfo = (estado) => ESTADO_INFO[estado] || ESTADO_INFO.recibido

export default function SeguimientoPublico() {
  const [codigo, setCodigo] = useState('')
  const [servicio, setServicio] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const buscarServicio = async (e) => {
    e.preventDefault()
    const codigoLimpio = codigo.trim()

    if (!codigoLimpio) {
      setError('Por favor ingresa un código de servicio')
      return
    }

    setLoading(true)
    setError('')
    setServicio(null)

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/seguimiento/${codigoLimpio}`
      )
      setServicio(response.data)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'No se encontró un servicio con ese código. Verifica que esté correcto.'
      )
    } finally {
      setLoading(false)
    }
  }

  const resetBusqueda = () => {
    setCodigo('')
    setServicio(null)
    setError('')
  }

  const estadoInfo = servicio ? obtenerEstadoInfo(servicio.estado) : null

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-primary-600/10 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-50 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>
          <Link
            to="/solicitar-servicio"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-primary-50 text-sm hover:bg-white/10 transition"
          >
            Solicitar servicio
          </Link>
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-primary-50 backdrop-blur mb-4 sm:mb-6">
            <Sparkles size={14} className="text-primary-300" />
            Seguimiento en tiempo real
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
            Consulta el estado de tu servicio
          </h1>
          <p className="text-primary-100 text-sm sm:text-base lg:text-lg font-light max-w-2xl mx-auto">
            Ingresa el código que recibiste al solicitar el servicio para ver el avance,
            informe técnico y cotización.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 lg:p-10 mb-6 sm:mb-8 border border-white/20">
          <form onSubmit={buscarServicio} className="space-y-4">
            <div>
              <label htmlFor="codigo" className="block text-sm font-semibold text-slate-700 mb-2">
                Código de servicio
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  id="codigo"
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="input-field flex-1 font-mono tracking-wider text-base"
                  placeholder="SRV-20260120-12345"
                  disabled={loading}
                  autoComplete="off"
                  autoCapitalize="characters"
                />
                <button
                  type="submit"
                  disabled={loading || !codigo.trim()}
                  className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed sm:px-6"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <span>Buscando...</span>
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      <span>Buscar</span>
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                El código tiene el formato <span className="font-mono">SRV-YYYYMMDD-XXXXX</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        {servicio && (
          <div className="space-y-5 sm:space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden relative">
              <div
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${estadoInfo.accent}`}
                aria-hidden="true"
              />
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">{estadoInfo.icono}</div>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-base font-semibold ring-1 ${estadoInfo.color}`}>
                  {estadoInfo.label}
                </span>
                <p className="text-slate-600 mt-3 max-w-md mx-auto text-sm sm:text-base">
                  {estadoInfo.descripcion}
                </p>
              </div>

              <div className="mb-6 sm:mb-8">
                <div className="flex items-baseline justify-between text-sm text-slate-600 mb-2">
                  <span className="font-medium">Progreso</span>
                  <span className="font-bold text-slate-900">{servicio.progreso}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full bg-gradient-to-r ${estadoInfo.accent} transition-[width] duration-700 ease-out`}
                    style={{ width: `${servicio.progreso}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 border-t border-slate-100 pt-6">
                <InfoItem label="Código de servicio" value={<span className="font-mono">{servicio.codigo}</span>} />
                <InfoItem
                  label="Tipo de servicio"
                  value={servicio.tipo_servicio === 'taller' ? '🔧 Taller' : '🚗 Campo'}
                />
                <InfoItem label="Fecha de ingreso" value={formatearFechaHora(servicio.fecha_ingreso)} />
                {servicio.tecnico_nombre && (
                  <InfoItem label="Técnico asignado" value={servicio.tecnico_nombre} />
                )}
                {servicio.fecha_programada && (
                  <InfoItem label="Fecha programada" value={formatearFechaHora(servicio.fecha_programada)} />
                )}
                {servicio.prioridad === 'urgente' && (
                  <InfoItem label="Prioridad" value={<span className="badge badge-danger">Urgente</span>} />
                )}
              </div>
            </div>

            {(servicio.equipo_marca || servicio.equipo_modelo || servicio.falla_reportada) && (
              <SeccionCard icon={<Package size={18} />} titulo="Información del equipo">
                <div className="space-y-3">
                  {servicio.equipo_marca && (
                    <FilaInfo label="Marca" value={servicio.equipo_marca} />
                  )}
                  {servicio.equipo_modelo && (
                    <FilaInfo label="Modelo" value={servicio.equipo_modelo} />
                  )}
                  {servicio.falla_reportada && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-sm text-slate-500 mb-1">Problema reportado</p>
                      <p className="text-slate-900">{servicio.falla_reportada}</p>
                    </div>
                  )}
                </div>
              </SeccionCard>
            )}

            {servicio.informe && (
              <SeccionCard icon={<Wrench size={18} />} titulo="Informe técnico">
                <div className="space-y-4">
                  <BloqueInforme titulo="Diagnóstico" texto={servicio.informe.diagnostico} />
                  <BloqueInforme titulo="Trabajo realizado" texto={servicio.informe.trabajo_realizado} />
                  {servicio.informe.recomendaciones && (
                    <BloqueInforme titulo="Recomendaciones" texto={servicio.informe.recomendaciones} />
                  )}
                </div>
              </SeccionCard>
            )}

            {servicio.cotizacion_monto && (
              <SeccionCard icon={<TrendingUp size={18} />} titulo="Cotización">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Monto</span>
                  <span className="text-2xl sm:text-3xl font-bold text-primary-600">
                    {formatearMoneda(servicio.cotizacion_monto)}
                  </span>
                </div>
                {servicio.cotizacion_aprobada && (
                  <p className="mt-3 text-sm text-emerald-700 font-medium flex items-center gap-1.5">
                    <CheckCircle size={16} />
                    Cotización aprobada
                  </p>
                )}
              </SeccionCard>
            )}

            <SeccionCard icon={<Clock size={18} />} titulo="Historial del servicio">
              <ol className="space-y-4">
                <TimelineItem
                  fecha={servicio.fecha_ingreso}
                  titulo="Servicio recibido"
                  completado={true}
                />
                {servicio.estado !== 'recibido' && servicio.estado !== 'por_asignar' && (
                  <TimelineItem
                    fecha={servicio.creado_en}
                    titulo="En proceso"
                    completado={true}
                  />
                )}
                {servicio.fecha_finalizacion && (
                  <TimelineItem
                    fecha={servicio.fecha_finalizacion}
                    titulo="Trabajo completado"
                    completado={true}
                  />
                )}
                {servicio.fecha_entrega && (
                  <TimelineItem
                    fecha={servicio.fecha_entrega}
                    titulo="Equipo entregado"
                    completado={true}
                  />
                )}
              </ol>
            </SeccionCard>

            <div className="text-center pt-2">
              <button onClick={resetBusqueda} className="btn-secondary">
                Consultar otro servicio
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 sm:mt-12 text-center text-primary-100/90 text-xs sm:text-sm">
          <p>
            ¿Tienes preguntas?{' '}
            <Link to="/solicitar-servicio" className="font-semibold text-white hover:underline">
              Solicita un servicio
            </Link>{' '}
            o vuelve al{' '}
            <Link to="/" className="font-semibold text-white hover:underline">
              inicio
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function FilaInfo({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  )
}

function SeccionCard({ icon, titulo, children }) {
  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
          {icon}
        </span>
        {titulo}
      </h3>
      {children}
    </section>
  )
}

function BloqueInforme({ titulo, texto }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{titulo}</p>
      <p className="text-slate-900 text-sm sm:text-base whitespace-pre-line">{texto}</p>
    </div>
  )
}

function TimelineItem({ fecha, titulo, completado }) {
  return (
    <li className="flex items-start gap-3 sm:gap-4">
      <div
        className={`w-3 h-3 rounded-full mt-1.5 ring-4 ${
          completado ? 'bg-emerald-500 ring-emerald-100' : 'bg-slate-300 ring-slate-100'
        }`}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-sm sm:text-base">{titulo}</p>
        <p className="text-xs sm:text-sm text-slate-500">{formatearFechaHora(fecha)}</p>
      </div>
      {completado && <CheckCircle size={20} className="text-emerald-500 mt-0.5 shrink-0" />}
    </li>
  )
}
