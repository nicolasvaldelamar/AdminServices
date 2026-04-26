import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Search, Filter, Plus, X, Download, Monitor } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { formatearFechaHora } from '../utils/format'

export default function ReportesTecnicos() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const esTecnico = usuario?.rol === 'tecnico'

  const [vista, setVista] = useState('informes')

  const [reportes, setReportes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tecnicos, setTecnicos] = useState([])
  const [tecnicoFiltro, setTecnicoFiltro] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const [mostrarSelector, setMostrarSelector] = useState(false)
  const [serviciosSinInforme, setServiciosSinInforme] = useState([])
  const [cargandoServicios, setCargandoServicios] = useState(false)

  const [reportesEquipos, setReportesEquipos] = useState([])
  const [loadingEquipos, setLoadingEquipos] = useState(false)

  useEffect(() => {
    if (!esTecnico) cargarTecnicos()
    cargarReportes()
    cargarReportesEquipos()
  }, [usuario])

  const cargarTecnicos = async () => {
    try {
      const params = new URLSearchParams()
      params.append('rol', 'tecnico')
      const res = await api.get(`/usuarios?${params.toString()}`)
      setTecnicos(res.data)
    } catch (err) {
      console.error('Error cargando técnicos:', err)
    }
  }

  const cargarReportes = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/informes')
      setReportes(res.data)
    } catch (err) {
      console.error('Error cargando reportes:', err)
      setError(err.response?.data?.error || 'Error al cargar los reportes técnicos')
    } finally {
      setLoading(false)
    }
  }

  const cargarReportesEquipos = async () => {
    setLoadingEquipos(true)
    try {
      const res = await api.get('/informes/reportes-equipos')
      setReportesEquipos(res.data)
    } catch (err) {
      console.error('Error cargando reportes de equipos:', err)
    } finally {
      setLoadingEquipos(false)
    }
  }

  const cargarServiciosSinInforme = async () => {
    setCargandoServicios(true)
    try {
      const res = await api.get('/servicios')
      const servicios = res.data || []
      const idsConInforme = new Set(reportes.map((r) => r.servicio_id))
      setServiciosSinInforme(servicios.filter((s) => !idsConInforme.has(s.id)))
    } catch (err) {
      console.error('Error cargando servicios:', err)
    } finally {
      setCargandoServicios(false)
    }
  }

  const abrirSelector = () => {
    setMostrarSelector(true)
    cargarServiciosSinInforme()
  }

  const descargarPDFEquipos = async (reporteId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/informes/reportes-equipos/${reporteId}/pdf`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-equipos-${reporteId}.pdf`
      a.click()
    } catch (err) {
      alert('Error al descargar PDF')
    }
  }

  const reportesFiltrados = reportes.filter((rep) => {
    const coincideTecnico = !tecnicoFiltro || String(rep.tecnico_id) === tecnicoFiltro
    const textoBusqueda = busqueda.toLowerCase()
    const coincideBusqueda =
      !busqueda ||
      (rep.servicio_codigo || '').toLowerCase().includes(textoBusqueda) ||
      (rep.cliente_nombre || '').toLowerCase().includes(textoBusqueda) ||
      (rep.tecnico_nombre || '').toLowerCase().includes(textoBusqueda) ||
      (rep.diagnostico || '').toLowerCase().includes(textoBusqueda)
    return coincideTecnico && coincideBusqueda
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-md">
              <FileText size={20} />
            </span>
            Reportes Técnicos
          </h1>
          <p className="text-gray-600 mt-1">
            Informes de servicio y reportes de inventario de equipos.
          </p>
        </div>

        {vista === 'informes' ? (
          <button onClick={abrirSelector} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nuevo Informe
          </button>
        ) : (
          <Link to="/app/reportes-tecnicos/equipos/nuevo" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nuevo Reporte de Equipos
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
          <button
            onClick={() => setVista('informes')}
            className={`flex-1 px-6 py-3 font-semibold transition-all duration-200 rounded-lg flex items-center justify-center gap-2 ${
              vista === 'informes'
                ? 'bg-white text-primary-600 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText size={16} />
            Informes de Servicio
          </button>
          <button
            onClick={() => setVista('equipos')}
            className={`flex-1 px-6 py-3 font-semibold transition-all duration-200 rounded-lg flex items-center justify-center gap-2 ${
              vista === 'equipos'
                ? 'bg-white text-primary-600 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor size={16} />
            Reportes de Equipos
          </button>
        </div>
      </div>

      {/* Modal selector de servicio */}
      {mostrarSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Seleccionar servicio</h3>
              <button onClick={() => setMostrarSelector(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cargandoServicios ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : serviciosSinInforme.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm">Todos los servicios ya tienen un reporte técnico.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-3">
                    {serviciosSinInforme.length} servicio{serviciosSinInforme.length !== 1 ? 's' : ''} sin reporte
                  </p>
                  {serviciosSinInforme.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setMostrarSelector(false)
                        navigate(`/app/servicios/${s.id}/informe`)
                      }}
                      className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{s.codigo || `#${s.id}`}</p>
                          <p className="text-xs text-gray-500">
                            {s.cliente_nombre || 'Sin cliente'} — {s.falla_reportada ? s.falla_reportada.substring(0, 60) + (s.falla_reportada.length > 60 ? '...' : '') : 'Sin descripción'}
                          </p>
                        </div>
                        <span className="text-primary-600 text-xs font-medium">Crear →</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === Vista: Informes de Servicio === */}
      {vista === 'informes' && (
        <>
          <div className="card">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por código, cliente, técnico o diagnóstico..."
                  className="input-field pl-9 text-sm"
                />
              </div>
              {!esTecnico && (
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-400" />
                  <select
                    value={tecnicoFiltro}
                    onChange={(e) => setTecnicoFiltro(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">Todos los técnicos</option>
                    {tecnicos.map((t) => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : reportesFiltrados.length === 0 ? (
            <div className="card text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-3" size={40} />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {reportes.length === 0 ? 'Aún no hay informes técnicos' : 'Sin resultados para ese filtro'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                {reportes.length === 0
                  ? 'Crea tu primer informe desde el botón "Nuevo Informe".'
                  : 'Intenta con otros términos de búsqueda.'}
              </p>
              {reportes.length === 0 && (
                <button onClick={abrirSelector} className="btn-primary inline-flex items-center gap-2">
                  <Plus size={18} /> Nuevo Informe
                </button>
              )}
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <div className="mb-3 text-xs text-gray-500">
                {reportesFiltrados.length} informe{reportesFiltrados.length !== 1 ? 's' : ''}
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    {!esTecnico && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Técnico</th>}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnóstico</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportesFiltrados.map((rep) => (
                    <tr key={rep.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {rep.servicio_codigo || `#${rep.servicio_id}`}
                        {rep.tipo_servicio && (
                          <span className="ml-2 text-xs text-gray-500">
                            {rep.tipo_servicio === 'taller' ? 'Taller' : 'Campo'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{rep.cliente_nombre || '-'}</td>
                      {!esTecnico && (
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {(rep.tecnico_nombre || '?').charAt(0).toUpperCase()}
                            </div>
                            {rep.tecnico_nombre || '-'}
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                        <span className="line-clamp-2">{rep.diagnostico}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {rep.creado_en ? formatearFechaHora(rep.creado_en) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Link to={`/app/servicios/${rep.servicio_id}/informe`} className="text-primary-600 hover:text-primary-700 text-xs font-semibold">
                            Ver / editar
                          </Link>
                          <Link to={`/app/servicios/${rep.servicio_id}`} className="text-gray-500 hover:text-gray-700 text-xs">
                            Ver servicio
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* === Vista: Reportes de Equipos === */}
      {vista === 'equipos' && (
        <>
          {loadingEquipos ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : reportesEquipos.length === 0 ? (
            <div className="card text-center py-12">
              <Monitor className="mx-auto text-gray-400 mb-3" size={40} />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Aún no hay reportes de equipos</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                Crea un reporte de inventario de equipos con todos sus detalles técnicos.
              </p>
              <Link to="/app/reportes-tecnicos/equipos/nuevo" className="btn-primary inline-flex items-center gap-2">
                <Plus size={18} /> Nuevo Reporte de Equipos
              </Link>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <div className="mb-3 text-xs text-gray-500">
                {reportesEquipos.length} reporte{reportesEquipos.length !== 1 ? 's' : ''} de equipos
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipos</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado por</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportesEquipos.map((rep) => (
                    <tr key={rep.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{rep.titulo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{rep.total_equipos || 0} equipos</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{rep.creador_nombre || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {rep.creado_en ? formatearFechaHora(rep.creado_en) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/app/reportes-tecnicos/equipos/${rep.id}`}
                            className="text-primary-600 hover:text-primary-700 text-xs font-semibold"
                          >
                            Ver / editar
                          </Link>
                          <button
                            onClick={() => descargarPDFEquipos(rep.id)}
                            className="text-green-600 hover:text-green-700 flex items-center gap-1 text-xs"
                          >
                            <Download size={14} /> PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
