import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import api from '../services/api'

export default function ServicioForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clientes, setClientes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const esEdicion = Boolean(id)
  const tipoServicio = watch('tipo_servicio')
  const categoriaServicio = watch('categoria_servicio')
  
  useEffect(() => {
    cargarDatos()
    
    const clienteId = searchParams.get('cliente_id')
    if (clienteId) {
      setValue('cliente_id', clienteId)
    }
  }, [])
  
  useEffect(() => {
    if (esEdicion) {
      cargarServicio()
    }
  }, [id])
  
  const cargarDatos = async () => {
    try {
      const [clientesRes, tecnicosRes] = await Promise.all([
        api.get('/clientes'),
        api.get('/usuarios/tecnicos')
      ])
      setClientes(clientesRes.data)
      setTecnicos(tecnicosRes.data)
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
  }
  
  const cargarServicio = async () => {
    try {
      const response = await api.get(`/servicios/${id}`)
      const servicio = response.data
      
      Object.keys(servicio).forEach(key => {
        setValue(key, servicio[key])
      })
    } catch (error) {
      console.error('Error cargando servicio:', error)
    }
  }
  
  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    
    // Default de categoría si viene vacío
    if (!data.categoria_servicio) {
      data.categoria_servicio = 'general'
    }
    
    try {
      if (esEdicion) {
        await api.put(`/servicios/${id}`, data)
      } else {
        await api.post('/servicios', data)
      }
      navigate('/app/servicios')
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar servicio')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to={id ? `/app/servicios/${id}` : '/app/servicios'} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft size={20} />
        Volver
      </Link>
      
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {esEdicion ? 'Editar Servicio' : 'Nuevo Servicio'}
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                {...register('cliente_id', { required: 'Este campo es requerido' })}
                className="input-field"
              >
                <option value="">Seleccione un cliente...</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
              {errors.cliente_id && (
                <p className="mt-1 text-sm text-red-600">{errors.cliente_id.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Servicio *
              </label>
              <select
                {...register('tipo_servicio', { required: 'Este campo es requerido' })}
                className="input-field"
              >
                <option value="">Seleccione...</option>
                <option value="taller">🔧 Taller</option>
                <option value="campo">🚗 Campo</option>
              </select>
              {errors.tipo_servicio && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo_servicio.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría / Tipo de trabajo
              </label>
              <input
                {...register('categoria_servicio')}
                className="input-field"
                placeholder="Instalación de cámaras, Desarrollo de software, Mantenimiento..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca del Equipo
              </label>
              <input
                {...register('equipo_marca')}
                className="input-field"
                placeholder="HP, Dell, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo
              </label>
              <input
                {...register('equipo_modelo')}
                className="input-field"
                placeholder="Modelo del equipo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serial
              </label>
              <input
                {...register('equipo_serial')}
                className="input-field"
                placeholder="Número de serial"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Falla Reportada *
            </label>
            <textarea
              {...register('falla_reportada', { required: 'Este campo es requerido' })}
              rows={4}
              className="input-field"
              placeholder="Descripción detallada de la falla reportada por el cliente..."
            />
            {errors.falla_reportada && (
              <p className="mt-1 text-sm text-red-600">{errors.falla_reportada.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad *
              </label>
              <select
                {...register('prioridad', { required: 'Este campo es requerido' })}
                className="input-field"
              >
                <option value="normal">Normal</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Técnico Asignado
              </label>
              <select
                {...register('tecnico_asignado_id')}
                className="input-field"
              >
                <option value="">Sin asignar</option>
                {tecnicos.map(tecnico => (
                  <option key={tecnico.id} value={tecnico.id}>
                    {tecnico.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {tipoServicio === 'campo' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Programada
              </label>
              <input
                type="datetime-local"
                {...register('fecha_programada')}
                className="input-field"
              />
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Guardar Servicio'}
            </button>
            
            <Link
              to={id ? `/app/servicios/${id}` : '/app/servicios'}
              className="btn-secondary"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
