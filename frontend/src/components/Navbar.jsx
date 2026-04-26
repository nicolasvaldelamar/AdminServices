import { Menu, Bell, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-slate-600 hover:text-slate-900">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Sistema de Gestión de Servicios
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notificaciones */}
          <button className="p-2.5 hover:bg-slate-100/80 rounded-xl relative transition-colors duration-200">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          
          {/* Menú de usuario */}
          <div className="relative">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="flex items-center gap-3 p-2 pr-4 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-primary-500/30">
                {usuario?.nombre?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-900">{usuario?.nombre}</p>
                <p className="text-xs text-slate-500 capitalize font-medium">{usuario?.rol}</p>
              </div>
            </button>
            
            {menuAbierto && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/60 py-2 z-50 backdrop-blur-xl">
                <a
                  href="/app/perfil"
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200 font-medium"
                >
                  Mi Perfil
                </a>
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={logout}
                  className="w-full text-left block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
