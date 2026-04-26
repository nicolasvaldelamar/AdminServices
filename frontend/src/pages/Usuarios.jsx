import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, UserCog, Mail, Phone } from 'lucide-react'
import api from '../services/api'
import { ROLES } from '../utils/estados'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroRol, setFiltroRol] = useState('')
  const [filtroActivo, setFiltroActivo] = useState('')
  
  useEffect(() => {
    cargarUsuarios()
  }, [filtroRol, filtroActivo])
  
  const cargarUsuarios = async () => {
    try {
      const params = new URLSearchParams()
      if (filtroRol) params.append('rol', filtroRol)
      if (filtroActivo) params.append('activo', filtroActivo)
      
      const response = await api.get(`/usuarios?${params}`)
      setUsuarios(response.data)
    } catch (error) {
      console.error('Error cargando usuarios:', error)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Gestión de usuarios y roles del sistema
          </p>
        </div>
        <Link to="/app/usuarios/nuevo" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nuevo Usuario
        </Link>
      </div>
      
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="input-field"
          >
            <option value="">Todos los roles</option>
            {Object.entries(ROLES).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          
          <select
            value={filtroActivo}
            onChange={(e) => setFiltroActivo(e.target.value)}
            className="input-field"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {usuario.nombre.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {usuario.nombre}
                  </h3>
                  {!usuario.activo && (
                    <span className="badge badge-danger text-xs">Inactivo</span>
                  )}
                </div>
                
                <span className={`badge ${ROLES[usuario.rol]?.color} text-xs mb-2 inline-block`}>
                  {ROLES[usuario.rol]?.label}
                </span>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <span className="truncate">{usuario.email}</span>
                  </div>
                  {usuario.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      <span>{usuario.telefono}</span>
                    </div>
                  )}
                </div>
                
                <Link
                  to={`/app/usuarios/${usuario.id}/editar`}
                  className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium inline-block"
                >
                  Editar usuario →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {usuarios.length === 0 && (
        <div className="card text-center py-12">
          <UserCog className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay usuarios registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza agregando tu primer usuario
          </p>
          <Link to="/app/usuarios/nuevo" className="btn-primary inline-flex items-center gap-2">
            <Plus size={20} />
            Nuevo Usuario
          </Link>
        </div>
      )}
    </div>
  )
}
