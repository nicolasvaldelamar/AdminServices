import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { ESTADOS, TIPOS_SERVICIO, PRIORIDADES } from '../utils/estados'
import { formatearFechaHora } from '../utils/format'

export default function Servicios() {
  const { usuario } = useAuth()
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroPrioridad, setFiltroPrioridad] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  
  useEffect(() => {
    cargarServicios()
  }, [filtroEstado, filtroTipo, filtroPrioridad, filtroCategoria])
  
  const cargarServicios = async () => {
    try {
      const params = new URLSearchParams()
      if (filtroEstado) params.append('estado', filtroEstado)
      if (filtroTipo) params.append('tipo_servicio', filtroTipo)
      if (filtroPrioridad) params.append('prioridad', filtroPrioridad)
      if (filtroCategoria) params.append('categoria_servicio', filtroCategoria)
      
      const response = await api.get(`/servicios?${params}`)
      setServicios(response.data)
    } catch (error) {
      console.error('Error cargando servicios:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const puedeCrear = ['administrador', 'recepcion'].includes(usuario?.rol)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Servicios</h1>
          <p className="text-slate-600 font-light text-lg">
            Gestión de servicios técnicos
          </p>
        </div>
        {puedeCrear && (
          <Link to="/app/servicios/nuevo" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nuevo Servicio
          </Link>
        )}
      </div>
      
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="input-field"
          >
            <option value="">Todos los estados</option>
            {Object.entries(ESTADOS).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="input-field"
          >
            <option value="">Todos los tipos</option>
            {Object.entries(TIPOS_SERVICIO).map(([key, value]) => (
              <option key={key} value={key}>{value.icon} {value.label}</option>
            ))}
          </select>
          
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="input-field"
          >
            <option value="">Todas las prioridades</option>
            {Object.entries(PRIORIDADES).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>

          <input
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="input-field"
            placeholder="Filtrar por categoría (ej: cámaras, software...)"
          />
        </div>
      </div>
      
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Código
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Categoría
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Prioridad
              </th>
              {usuario?.rol !== 'tecnico' && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Técnico
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {servicios.map((servicio) => (
              <tr key={servicio.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {servicio.codigo}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {servicio.cliente_nombre}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {servicio.tipo_servicio === 'taller' ? 'Taller' : 'Campo'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800">
                  {servicio.categoria_servicio || 'General'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {servicio.falla_reportada}
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${ESTADOS[servicio.estado]?.badge}`}>
                    {ESTADOS[servicio.estado]?.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${servicio.prioridad === 'urgente' ? 'badge-danger' : 'badge-gray'}`}>
                    {PRIORIDADES[servicio.prioridad]?.label}
                  </span>
                </td>
                {usuario?.rol !== 'tecnico' && (
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {servicio.tecnico_nombre || '-'}
                  </td>
                )}
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
        
        {servicios.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No hay servicios registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}
