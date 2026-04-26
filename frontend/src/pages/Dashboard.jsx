import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Wrench, 
  Users, 
  DollarSign, 
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { ESTADOS, TIPOS_SERVICIO } from '../utils/estados'
import { formatearMoneda, formatearFechaHora } from '../utils/format'

export default function Dashboard() {
  const { usuario } = useAuth()
  const [estadisticas, setEstadisticas] = useState(null)
  const [serviciosRecientes, setServiciosRecientes] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    cargarDatos()
  }, [])
  
  const cargarDatos = async () => {
    try {
      const [statsRes, serviciosRes] = await Promise.all([
        api.get('/servicios/estadisticas'),
        api.get('/servicios?limit=5')
      ])
      
      setEstadisticas(statsRes.data)
      setServiciosRecientes(serviciosRes.data)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
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
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Bienvenido, {usuario?.nombre}
          </h1>
          <p className="text-slate-600 font-light text-sm sm:text-base lg:text-lg">
            Resumen de actividad del sistema
          </p>
        </div>
        <div className="hidden md:block">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-5 py-3 rounded-2xl border border-primary-200">
            <p className="text-sm text-primary-700 font-medium">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {usuario?.rol !== 'tecnico' && (
          <Link to="/app/servicios/por-asignar" className="stat-card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 font-medium mb-1">Por Asignar</p>
                <p className="text-4xl font-bold text-orange-600 mb-2 tracking-tight">
                  {estadisticas?.por_estado?.find(e => e.estado === 'por_asignar')?.cantidad || 0}
                </p>
                <p className="text-xs text-slate-500 font-medium">Requieren atención</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Clock className="text-white" size={28} />
              </div>
            </div>
          </Link>
        )}
        
        <div className="stat-card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-600 font-medium mb-1">Total Servicios</p>
              <p className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                {estadisticas?.total_servicios || 0}
              </p>
              <p className="text-xs text-slate-500 font-medium">En el sistema</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Wrench className="text-white" size={28} />
            </div>
          </div>
        </div>
        
        <div className="stat-card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-600 font-medium mb-1">Pendientes</p>
              <p className="text-4xl font-bold text-amber-600 mb-2 tracking-tight">
                {estadisticas?.pendientes_facturacion || 0}
              </p>
              <p className="text-xs text-slate-500 font-medium">Por facturar</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <AlertCircle className="text-white" size={28} />
            </div>
          </div>
        </div>
        
        <div className="stat-card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-600 font-medium mb-1">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-emerald-600 mb-2 tracking-tight">
                {formatearMoneda(estadisticas?.ingresos_mes_actual || 0)}
              </p>
              <p className="text-xs text-slate-500 font-medium">Facturado</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <DollarSign className="text-white" size={28} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficos y listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Servicios por estado */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-6 text-slate-900">Servicios por Estado</h3>
          <div className="space-y-3">
            {estadisticas?.por_estado?.map((item) => (
              <div key={item.estado} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <span className={`badge ${ESTADOS[item.estado]?.badge || 'badge-gray'}`}>
                    {ESTADOS[item.estado]?.label || item.estado}
                  </span>
                </div>
                <span className="font-bold text-slate-900 text-lg">{item.cantidad}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Servicios por técnico */}
        {usuario?.rol !== 'tecnico' && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-6 text-slate-900">Servicios por Técnico</h3>
            <div className="space-y-3">
              {estadisticas?.por_tecnico?.map((item) => (
                <div key={item.nombre} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                      <span className="text-sm font-semibold text-white">
                        {item.nombre?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-slate-700 font-medium">{item.nombre}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-lg">{item.cantidad}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Servicios recientes */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Servicios Recientes</h3>
          <Link to="/app/servicios" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1 group">
            Ver todos 
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>
        
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {serviciosRecientes.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                    {servicio.codigo}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700 font-medium">
                    {servicio.cliente_nombre}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <span>{TIPOS_SERVICIO[servicio.tipo_servicio]?.icon}</span>
                      <span className="text-slate-700">{TIPOS_SERVICIO[servicio.tipo_servicio]?.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`badge ${ESTADOS[servicio.estado]?.badge}`}>
                      {ESTADOS[servicio.estado]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                    {formatearFechaHora(servicio.fecha_ingreso)}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      to={`/app/servicios/${servicio.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-semibold hover:underline transition-all duration-200"
                    >
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
