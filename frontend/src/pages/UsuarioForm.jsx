import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import api from '../services/api'

export default function UsuarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const esEdicion = Boolean(id)
  
  useEffect(() => {
    if (esEdicion) {
      cargarUsuario()
    }
  }, [id])
  
  const cargarUsuario = async () => {
    try {
      const response = await api.get(`/usuarios/${id}`)
      const usuario = response.data
      
      Object.keys(usuario).forEach(key => {
        setValue(key, usuario[key])
      })
    } catch (error) {
      console.error('Error cargando usuario:', error)
    }
  }
  
  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    
    try {
      if (esEdicion) {
        delete data.password
        await api.put(`/usuarios/${id}`, data)
      } else {
        await api.post('/usuarios', data)
      }
      navigate('/app/usuarios')
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar usuario')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/app/usuarios" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft size={20} />
        Volver
      </Link>
      
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {esEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              {...register('nombre', { required: 'Este campo es requerido' })}
              className="input-field"
              placeholder="Juan Pérez"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico *
            </label>
            <input
              type="email"
              {...register('email', { required: 'Este campo es requerido' })}
              className="input-field"
              placeholder="usuario@arnolcaicedo.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          {!esEdicion && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                })}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol *
            </label>
            <select
              {...register('rol', { required: 'Este campo es requerido' })}
              className="input-field"
            >
              <option value="">Seleccione un rol...</option>
              <option value="administrador">Administrador</option>
              <option value="recepcion">Recepción</option>
              <option value="tecnico">Técnico</option>
            </select>
            {errors.rol && (
              <p className="mt-1 text-sm text-red-600">{errors.rol.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              El rol determina los permisos y accesos del usuario en el sistema
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              {...register('telefono')}
              className="input-field"
              placeholder="3001234567"
            />
          </div>
          
          {esEdicion && (
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('activo')}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Usuario activo
              </label>
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Guardar Usuario'}
            </button>
            
            <Link to="/app/usuarios" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
