import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import api from '../services/api'

const EQUIPO_VACIO = {
  usuario: '', cargo: '', empresa: '', area_asignacion: '', nombre_equipo: '',
  marca: '', modelo: '', serial: '', tipo_equipo: '', sistema_operativo: '',
  office: '', mouse: '', teclado: '', base: '', monitor: '',
  procesador: '', ram: '', disco_duro: '', antivirus: '', observaciones: '',
  fecha: '', firma: '', id_equipo: ''
}

export default function ReporteEquiposForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [titulo, setTitulo] = useState('')
  const [items, setItems] = useState([{ ...EQUIPO_VACIO }])
  const [loading, setLoading] = useState(false)
  const [cargando, setCargando] = useState(!!id)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      cargarReporte()
    }
  }, [id])

  const cargarReporte = async () => {
    try {
      const res = await api.get(`/informes/reportes-equipos/${id}`)
      setTitulo(res.data.titulo)
      setItems(res.data.items.length > 0 ? res.data.items : [{ ...EQUIPO_VACIO }])
    } catch (err) {
      setError('Error al cargar el reporte')
    } finally {
      setCargando(false)
    }
  }

  const agregarEquipo = () => {
    setItems([...items, { ...EQUIPO_VACIO }])
  }

  const eliminarEquipo = (index) => {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const actualizarCampo = (index, campo, valor) => {
    const nuevos = [...items]
    nuevos[index] = { ...nuevos[index], [campo]: valor }
    setItems(nuevos)
  }

  const guardar = async () => {
    if (!titulo.trim()) {
      setError('El título del reporte es obligatorio')
      return
    }
    if (items.every(it => !it.usuario && !it.nombre_equipo && !it.marca)) {
      setError('Agrega al menos un equipo con datos')
      return
    }

    setLoading(true)
    setError('')
    try {
      await api.post('/informes/reportes-equipos', { titulo, items })
      navigate('/app/reportes-tecnicos')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el reporte')
    } finally {
      setLoading(false)
    }
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const campos = [
    { key: 'usuario', label: 'Usuario', w: 'w-32' },
    { key: 'cargo', label: 'Cargo', w: 'w-28' },
    { key: 'empresa', label: 'Empresa', w: 'w-28' },
    { key: 'area_asignacion', label: 'Área', w: 'w-28' },
    { key: 'nombre_equipo', label: 'Nombre Equipo', w: 'w-32' },
    { key: 'marca', label: 'Marca', w: 'w-24' },
    { key: 'modelo', label: 'Modelo', w: 'w-28' },
    { key: 'serial', label: 'Serial', w: 'w-28' },
    { key: 'tipo_equipo', label: 'Tipo', w: 'w-24', type: 'select', options: ['Portátil', 'Escritorio', 'Todo en uno', 'Servidor', 'Otro'] },
    { key: 'sistema_operativo', label: 'S.O.', w: 'w-28' },
    { key: 'office', label: 'Office', w: 'w-20' },
    { key: 'procesador', label: 'Procesador', w: 'w-32' },
    { key: 'ram', label: 'RAM', w: 'w-20' },
    { key: 'disco_duro', label: 'Disco', w: 'w-24' },
    { key: 'antivirus', label: 'Antivirus', w: 'w-24' },
    { key: 'observaciones', label: 'Observaciones', w: 'w-40' },
  ]

  return (
    <div className="space-y-6">
      <Link to="/app/reportes-tecnicos" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft size={20} />
        Volver a Reportes Técnicos
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? 'Editar Reporte de Equipos' : 'Nuevo Reporte de Equipos'}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título del reporte *
          </label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input-field max-w-lg"
            placeholder="Ej: Equipos Zona Franca Diciembre 2025"
          />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Equipos ({items.length})
          </h3>
          <button type="button" onClick={agregarEquipo} className="btn-secondary text-sm flex items-center gap-2">
            <Plus size={16} />
            Agregar Equipo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">#</th>
                {campos.map((c) => (
                  <th key={c.key} className="px-2 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-2 py-1 text-gray-500 font-medium">{idx + 1}</td>
                  {campos.map((c) => (
                    <td key={c.key} className="px-1 py-1">
                      {c.type === 'select' ? (
                        <select
                          value={item[c.key] || ''}
                          onChange={(e) => actualizarCampo(idx, c.key, e.target.value)}
                          className={`${c.w} text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
                        >
                          <option value="">--</option>
                          {c.options.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={item[c.key] || ''}
                          onChange={(e) => actualizarCampo(idx, c.key, e.target.value)}
                          className={`${c.w} text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
                          placeholder={c.label}
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-1 py-1">
                    <button
                      type="button"
                      onClick={() => eliminarEquipo(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={guardar}
          disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? 'Guardando...' : 'Guardar Reporte'}
        </button>
        <Link to="/app/reportes-tecnicos" className="btn-secondary">
          Cancelar
        </Link>
      </div>
    </div>
  )
}
