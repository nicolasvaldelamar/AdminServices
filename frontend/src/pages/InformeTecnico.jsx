import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, FileText } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { formatearTiempo } from '../utils/format'

export default function InformeTecnico() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [servicio, setServicio] = useState(null)
  const [informe, setInforme] = useState(null)
  
  useEffect(() => {
    cargarDatos()
  }, [id])
  
  const cargarDatos = async () => {
    try {
      const servicioRes = await api.get(`/servicios/${id}`)
      setServicio(servicioRes.data)
      
      try {
        const informeRes = await api.get(`/informes/servicio/${id}`)
        setInforme(informeRes.data)
        
        Object.keys(informeRes.data).forEach(key => {
          setValue(key, informeRes.data[key])
        })
      } catch (error) {
        console.log('No existe informe previo')
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const onSubmit = async (data) => {
    setGuardando(true)
    setError('')
    
    try {
      if (informe) {
        await api.put(`/informes/servicio/${id}`, data)
      } else {
        await api.post(`/informes/servicio/${id}`, data)
      }
      navigate(`/app/servicios/${id}`)
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar informe')
    } finally {
      setGuardando(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!servicio) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Servicio no encontrado</h3>
        <Link to="/app/servicios" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Volver a servicios
        </Link>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to={`/app/servicios/${id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft size={20} />
        Volver al servicio
      </Link>
      
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <FileText className="text-primary-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {informe ? 'Editar Informe Técnico' : 'Crear Informe Técnico'}
            </h1>
            <p className="text-gray-600">{servicio.codigo} - {servicio.cliente_nombre}</p>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnóstico *
            </label>
            <textarea
              {...register('diagnostico', { required: 'Este campo es requerido' })}
              rows={4}
              className="input-field"
              placeholder="Descripción detallada del diagnóstico realizado..."
            />
            {errors.diagnostico && (
              <p className="mt-1 text-sm text-red-600">{errors.diagnostico.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Describe el problema encontrado y las causas identificadas
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trabajo Realizado *
            </label>
            <textarea
              {...register('trabajo_realizado', { required: 'Este campo es requerido' })}
              rows={5}
              className="input-field"
              placeholder="Detalle del trabajo realizado, pasos seguidos, procedimientos aplicados..."
            />
            {errors.trabajo_realizado && (
              <p className="mt-1 text-sm text-red-600">{errors.trabajo_realizado.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Explica en detalle todas las acciones realizadas para resolver el problema
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repuestos Utilizados
            </label>
            <textarea
              {...register('repuestos_usados')}
              rows={3}
              className="input-field"
              placeholder="Lista de repuestos, componentes o materiales utilizados..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Especifica marca, modelo y cantidad de cada repuesto usado
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recomendaciones
            </label>
            <textarea
              {...register('recomendaciones')}
              rows={3}
              className="input-field"
              placeholder="Recomendaciones para el cliente, mantenimientos preventivos sugeridos..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Sugerencias para evitar futuros problemas o mejorar el rendimiento
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiempo Invertido (minutos)
            </label>
            <input
              type="number"
              {...register('tiempo_invertido')}
              className="input-field"
              placeholder="120"
              min="0"
            />
            <p className="mt-1 text-xs text-gray-500">
              Tiempo total dedicado al servicio en minutos
            </p>
          </div>
          
          <div className="pt-6 border-t border-gray-200 flex gap-4">
            <button
              type="submit"
              disabled={guardando}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {guardando ? 'Guardando...' : 'Guardar Informe'}
            </button>
            
            <Link
              to={`/app/servicios/${id}`}
              className="btn-secondary"
            >
              Cancelar
            </Link>
          </div>
        </form>
        
        {informe && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600">Creado por:</p>
                  <p className="font-medium">{informe.tecnico_nombre}</p>
                </div>
                {informe.tiempo_invertido && (
                  <div className="text-right">
                    <p className="text-gray-600">Tiempo invertido:</p>
                    <p className="font-medium">{formatearTiempo(informe.tiempo_invertido)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
