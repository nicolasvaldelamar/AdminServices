import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText, DollarSign, Download, Eye } from 'lucide-react'
import api from '../services/api'
import { formatearMoneda, formatearFecha } from '../utils/format'

export default function Facturacion() {
  const [vista, setVista] = useState('facturas') // 'facturas' o 'cotizaciones'
  const [facturas, setFacturas] = useState([])
  const [cotizaciones, setCotizaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')
  
  useEffect(() => {
    cargarDatos()
  }, [vista, fechaInicio, fechaFin, estadoFiltro])
  
  const cargarDatos = async () => {
    setLoading(true)
    try {
      if (vista === 'facturas') {
        const params = {}
        if (fechaInicio) params.fecha_inicio = fechaInicio
        if (fechaFin) params.fecha_fin = fechaFin
        if (estadoFiltro) params.estado = estadoFiltro
        const response = await api.get('/facturacion/facturas', { params })
        setFacturas(response.data)
      } else {
        const params = {}
        if (fechaInicio) params.fecha_inicio = fechaInicio
        if (fechaFin) params.fecha_fin = fechaFin
        if (estadoFiltro) params.estado = estadoFiltro
        const response = await api.get('/facturacion/cotizaciones', { params })
        setCotizaciones(response.data)
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const actualizarEstado = async (id, tipo, nuevoEstado) => {
    try {
      if (tipo === 'factura') {
        await api.patch(`/facturacion/facturas/${id}/estado`, { estado: nuevoEstado })
        cargarDatos()
      } else {
        await api.patch(`/facturacion/cotizaciones/${id}/estado`, { estado: nuevoEstado })
        cargarDatos()
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Error al actualizar estado')
    }
  }
  
  const obtenerEstadoBadge = (estado) => {
    const badges = {
      // Facturas
      pendiente: 'badge-warning',
      pagada: 'badge-success',
      vencida: 'badge-danger',
      anulada: 'badge-gray',
      // Cotizaciones
      aprobada: 'badge-success',
      rechazada: 'badge-danger'
    }
    return badges[estado] || 'badge-info'
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
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <DollarSign size={24} className="text-white" />
            </div>
            Facturación
          </h1>
          <p className="text-slate-600 font-light text-sm sm:text-base lg:text-lg ml-16">
            Gestión de facturas y cotizaciones
          </p>
        </div>
        
        <Link 
          to={`/app/facturacion/nueva-${vista === 'facturas' ? 'factura' : 'cotizacion'}`}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva {vista === 'facturas' ? 'Factura' : 'Cotización'}
        </Link>
      </div>
      
      {/* Tabs */}
      <div className="card">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
          <button
            onClick={() => setVista('facturas')}
            className={`flex-1 px-6 py-3 font-semibold transition-all duration-200 rounded-lg ${
              vista === 'facturas'
                ? 'bg-white text-primary-600 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Facturas
          </button>
          <button
            onClick={() => setVista('cotizaciones')}
            className={`flex-1 px-6 py-3 font-semibold transition-all duration-200 rounded-lg ${
              vista === 'cotizaciones'
                ? 'bg-white text-primary-600 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cotizaciones
          </button>
        </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Fecha inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Fecha fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Estado</label>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Todos</option>
                {vista === 'facturas' ? (
                  <>
                    <option value="pendiente">Pendiente</option>
                    <option value="pagada">Pagada</option>
                    <option value="vencida">Vencida</option>
                    <option value="anulada">Anulada</option>
                  </>
                ) : (
                  <>
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobada">Aprobada</option>
                    <option value="rechazada">Rechazada</option>
                    <option value="vencida">Vencida</option>
                  </>
                )}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => cargarDatos()}
                className="btn-secondary w-full whitespace-nowrap"
              >
                Aplicar filtros
              </button>
              <button
                type="button"
                onClick={() => { setFechaInicio(''); setFechaFin(''); setEstadoFiltro(''); }}
                className="btn-secondary w-full whitespace-nowrap"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenido */}
      {vista === 'facturas' ? (
        /* Lista de Facturas */
        <div className="card">
          {facturas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="mx-auto mb-2" size={48} />
              <p>No hay facturas registradas</p>
              <Link to="/app/facturacion/nueva-factura" className="btn-primary mt-4 inline-flex items-center gap-2">
                <Plus size={20} />
                Crear Primera Factura
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Número
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {facturas.map((factura) => (
                    <tr key={factura.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {factura.numero_factura}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {factura.cliente_nombre}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatearFecha(factura.fecha_emision)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {formatearMoneda(factura.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${obtenerEstadoBadge(factura.estado)}`}>
                          {factura.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 items-center">
                          <select
                            defaultValue={factura.estado}
                            onChange={(e) => actualizarEstado(factura.id, 'factura', e.target.value)}
                            className="input-field text-xs py-1 px-2 w-32"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="pagada">Pagada</option>
                            <option value="vencida">Vencida</option>
                            <option value="anulada">Anulada</option>
                          </select>
                          <button
                            onClick={async () => {
                              try {
                                const response = await api.get(`/facturacion/facturas/${factura.id}/pdf`, {
                                  responseType: 'blob'
                                })
                                const url = window.URL.createObjectURL(response.data)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `factura-${factura.numero_factura}.pdf`
                                a.click()
                                window.URL.revokeObjectURL(url)
                              } catch (error) {
                                alert('Error al descargar PDF')
                              }
                            }}
                            className="text-green-600 hover:text-green-700"
                            title="Descargar PDF"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Lista de Cotizaciones */
        <div className="card">
          {cotizaciones.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="mx-auto mb-2" size={48} />
              <p>No hay cotizaciones registradas</p>
              <Link to="/app/facturacion/nueva-cotizacion" className="btn-primary mt-4 inline-flex items-center gap-2">
                <Plus size={20} />
                Crear Primera Cotización
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Número
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cotizaciones.map((cotizacion) => (
                    <tr key={cotizacion.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {cotizacion.numero_cotizacion}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {cotizacion.cliente_nombre}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatearFecha(cotizacion.fecha_emision)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {formatearMoneda(cotizacion.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${obtenerEstadoBadge(cotizacion.estado)}`}>
                          {cotizacion.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 items-center">
                          <select
                            defaultValue={cotizacion.estado}
                            onChange={(e) => actualizarEstado(cotizacion.id, 'cotizacion', e.target.value)}
                            className="input-field text-xs py-1 px-2 w-32"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="aprobada">Aprobada</option>
                            <option value="rechazada">Rechazada</option>
                            <option value="vencida">Vencida</option>
                          </select>
                          <button
                            onClick={async () => {
                              try {
                                const response = await api.get(`/facturacion/cotizaciones/${cotizacion.id}/pdf`, {
                                  responseType: 'blob'
                                })
                                const url = window.URL.createObjectURL(response.data)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `cotizacion-${cotizacion.numero_cotizacion}.pdf`
                                a.click()
                                window.URL.revokeObjectURL(url)
                              } catch (error) {
                                alert('Error al descargar PDF')
                              }
                            }}
                            className="text-green-600 hover:text-green-700"
                            title="Descargar PDF"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
