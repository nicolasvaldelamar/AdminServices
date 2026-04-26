import { useState } from 'react'
import { User, Lock, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { ROLES } from '../utils/estados'
import { formatearFechaHora } from '../utils/format'

export default function Perfil() {
  const { usuario } = useAuth()
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  
  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    setExito('')
    
    try {
      await api.put('/auth/cambiar-password', data)
      setExito('Contraseña actualizada exitosamente')
      reset()
    } catch (error) {
      setError(error.response?.data?.error || 'Error al cambiar contraseña')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">
          Información de tu cuenta y configuración
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {usuario?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{usuario?.nombre}</h2>
              <span className={`badge ${ROLES[usuario?.rol]?.color} mt-1`}>
                {ROLES[usuario?.rol]?.label}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User size={20} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{usuario?.email}</p>
              </div>
            </div>
            
            {usuario?.telefono && (
              <div className="flex items-start gap-3">
                <User size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium text-gray-900">{usuario.telefono}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <User size={20} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Miembro desde</p>
                <p className="font-medium text-gray-900">
                  {formatearFechaHora(usuario?.creado_en)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={24} className="text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Cambiar Contraseña</h2>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          {exito && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {exito}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña Actual *
              </label>
              <input
                type="password"
                {...register('passwordActual', { required: 'Este campo es requerido' })}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.passwordActual && (
                <p className="mt-1 text-sm text-red-600">{errors.passwordActual.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña *
              </label>
              <input
                type="password"
                {...register('passwordNuevo', { 
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                })}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.passwordNuevo && (
                <p className="mt-1 text-sm text-red-600">{errors.passwordNuevo.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Información del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Rol en el Sistema</p>
            <p className="text-lg font-bold text-blue-600 mt-1 capitalize">
              {ROLES[usuario?.rol]?.label}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Estado</p>
            <p className="text-lg font-bold text-green-600 mt-1">
              Activo
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Sistema</p>
            <p className="text-lg font-bold text-purple-600 mt-1">
              AdminServices v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
