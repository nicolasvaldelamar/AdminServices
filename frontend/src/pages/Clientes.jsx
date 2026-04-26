import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Building2, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Clientes() {
  const { usuario } = useAuth()
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroContrato, setFiltroContrato] = useState('')
  
  useEffect(() => {
    cargarClientes()
  }, [filtroTipo, filtroContrato])
  
  const cargarClientes = async () => {
    try {
      const params = new URLSearchParams()
      if (filtroTipo) params.append('tipo', filtroTipo)
      if (filtroContrato) params.append('contrato_activo', filtroContrato)
      if (busqueda) params.append('busqueda', busqueda)
      
      const response = await api.get(`/clientes?${params}`)
      setClientes(response.data)
    } catch (error) {
      console.error('Error cargando clientes:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleBuscar = (e) => {
    e.preventDefault()
    cargarClientes()
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
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2">Clientes</h1>
          <p className="text-slate-600 font-light text-sm sm:text-base lg:text-lg">
            Gestión de clientes y contactos
          </p>
        </div>
        {puedeCrear && (
          <Link to="/app/clientes/nuevo" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nuevo Cliente
          </Link>
        )}
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="card">
        <form onSubmit={handleBuscar} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, razón social o contacto..."
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="input-field"
          >
            <option value="">Todos los tipos</option>
            <option value="empresa">Empresas</option>
            <option value="persona">Personas</option>
          </select>
          
          <select
            value={filtroContrato}
            onChange={(e) => setFiltroContrato(e.target.value)}
            className="input-field"
          >
            <option value="">Todos</option>
            <option value="true">Con contrato activo</option>
            <option value="false">Sin contrato</option>
          </select>
          
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>
      </div>
      
      {/* Lista de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((cliente) => (
          <Link
            key={cliente.id}
            to={`/app/clientes/${cliente.id}`}
            className="group card hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                cliente.tipo === 'empresa' 
                  ? 'bg-gradient-to-br from-sky-500 to-sky-600 shadow-sky-500/30' 
                  : 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30'
              }`}>
                {cliente.tipo === 'empresa' ? (
                  <Building2 className="text-white" size={26} />
                ) : (
                  <User className="text-white" size={26} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate text-lg mb-1">
                  {cliente.nombre}
                </h3>
                {cliente.razon_social && (
                  <p className="text-sm text-slate-600 truncate font-medium">
                    {cliente.razon_social}
                  </p>
                )}
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  📞 {cliente.telefono}
                </p>
                {cliente.contrato_activo && (
                  <span className="inline-block mt-3 badge badge-success">
                    Contrato Activo
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {clientes.length === 0 && (
        <div className="card text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay clientes registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza agregando tu primer cliente
          </p>
          {puedeCrear && (
            <Link to="/app/clientes/nuevo" className="btn-primary inline-flex items-center gap-2">
              <Plus size={20} />
              Nuevo Cliente
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
