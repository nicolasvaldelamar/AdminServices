import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import api from '../services/api'

export default function ClienteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const esEdicion = Boolean(id)
  
  useEffect(() => {
    if (esEdicion) {
      cargarCliente()
    }
  }, [id])
  
  const cargarCliente = async () => {
    try {
      const response = await api.get(`/clientes/${id}`)
      const cliente = response.data
      
      Object.keys(cliente).forEach(key => {
        setValue(key, cliente[key])
      })
    } catch (error) {
      console.error('Error cargando cliente:', error)
    }
  }
  
  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    
    try {
      if (esEdicion) {
        await api.put(`/clientes/${id}`, data)
      } else {
        await api.post('/clientes', data)
      }
      navigate('/app/clientes')
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar cliente')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to={id ? `/clientes/${id}` : '/clientes'} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft size={20} />
        Volver
      </Link>
      
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Cliente *
            </label>
            <select
              {...register('tipo', { required: 'Este campo es requerido' })}
              className="input-field"
            >
              <option value="">Seleccione...</option>
              <option value="empresa">Empresa</option>
              <option value="persona">Persona Natural</option>
            </select>
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre / Razón Social *
            </label>
            <input
              {...register('nombre', { required: 'Este campo es requerido' })}
              className="input-field"
              placeholder="Nombre del cliente o empresa"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razón Social (opcional)
            </label>
            <input
              {...register('razon_social')}
              className="input-field"
              placeholder="Nombre legal de la empresa"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contacto
              </label>
              <input
                {...register('contacto')}
                className="input-field"
                placeholder="Nombre de la persona de contacto"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                {...register('telefono', { required: 'Este campo es requerido' })}
                className="input-field"
                placeholder="3001234567"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="input-field"
              placeholder="correo@ejemplo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              {...register('direccion')}
              className="input-field"
              placeholder="Calle 123 #45-67"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('contrato_activo')}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              ¿Tiene contrato activo?
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              {...register('notas')}
              rows={4}
              className="input-field"
              placeholder="Información adicional sobre el cliente..."
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Guardar Cliente'}
            </button>
            
            <Link
              to={id ? `/clientes/${id}` : '/clientes'}
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
