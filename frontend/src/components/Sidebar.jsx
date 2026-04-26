import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Wrench,
  FileText,
  UserCog,
  Calendar,
  DollarSign,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { usuario } = useAuth()

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/app',
      roles: ['administrador', 'recepcion', 'tecnico']
    },
    {
      label: 'Calendario',
      icon: Calendar,
      path: '/app/calendario',
      roles: ['administrador', 'recepcion', 'tecnico']
    },
    {
      label: 'Servicios',
      icon: Wrench,
      path: '/app/servicios',
      roles: ['administrador', 'recepcion', 'tecnico']
    },
    {
      label: 'Clientes',
      icon: Users,
      path: '/app/clientes',
      roles: ['administrador', 'recepcion', 'tecnico']
    },
    {
      label: 'Facturación',
      icon: DollarSign,
      path: '/app/facturacion',
      roles: ['administrador', 'recepcion']
    },
    {
      label: 'Reportes Técnicos',
      icon: FileText,
      path: '/app/reportes-tecnicos',
      roles: ['administrador', 'tecnico']
    },
    {
      label: 'Usuarios',
      icon: UserCog,
      path: '/app/usuarios',
      roles: ['administrador']
    }
  ]

  const menuItemsFiltrados = menuItems.filter(item =>
    item.roles.includes(usuario?.rol)
  )

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-72 gradient-bg text-white flex flex-col border-r border-slate-800/50 backdrop-blur-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="border-b border-white/10 flex items-center justify-between py-3 px-4 lg:justify-center lg:px-0">
        <img
          src="/logo-blanco.png"
          alt="Arnol Caicedo"
          className="w-32 sm:w-40 h-auto object-contain"
        />
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-2 -mr-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Cerrar menú"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {menuItemsFiltrados.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/app'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/50'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-slate-400 text-center font-light">
          © 2026 Arnol Caicedo
        </p>
        <p className="text-xs text-slate-500 text-center mt-1 font-light">
          v2.0.0
        </p>
      </div>
    </aside>
  )
}
