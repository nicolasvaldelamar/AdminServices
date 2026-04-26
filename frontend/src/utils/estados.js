// Configuración de estados de servicios
export const ESTADOS = {
  por_asignar: {
    label: 'Por Asignar',
    color: 'bg-orange-100 text-orange-800',
    badge: 'badge-warning'
  },
  recibido: {
    label: 'Recibido',
    color: 'bg-gray-100 text-gray-800',
    badge: 'badge-gray'
  },
  en_diagnostico: {
    label: 'En Diagnóstico',
    color: 'bg-blue-100 text-blue-800',
    badge: 'badge-info'
  },
  cotizado: {
    label: 'Cotizado',
    color: 'bg-purple-100 text-purple-800',
    badge: 'badge-info'
  },
  aprobado: {
    label: 'Aprobado',
    color: 'bg-indigo-100 text-indigo-800',
    badge: 'badge-info'
  },
  en_reparacion: {
    label: 'En Reparación',
    color: 'bg-yellow-100 text-yellow-800',
    badge: 'badge-warning'
  },
  listo: {
    label: 'Listo',
    color: 'bg-green-100 text-green-800',
    badge: 'badge-success'
  },
  entregado: {
    label: 'Entregado',
    color: 'bg-teal-100 text-teal-800',
    badge: 'badge-success'
  },
  facturado: {
    label: 'Facturado',
    color: 'bg-emerald-100 text-emerald-800',
    badge: 'badge-success'
  },
  cerrado: {
    label: 'Cerrado',
    color: 'bg-gray-200 text-gray-900',
    badge: 'badge-gray'
  }
}

export const PRIORIDADES = {
  normal: {
    label: 'Normal',
    color: 'bg-gray-100 text-gray-800'
  },
  urgente: {
    label: 'Urgente',
    color: 'bg-red-100 text-red-800'
  }
}

export const TIPOS_SERVICIO = {
  taller: {
    label: 'Taller',
    icon: '🔧'
  },
  campo: {
    label: 'Campo',
    icon: '🚗'
  }
}

export const ROLES = {
  administrador: {
    label: 'Administrador',
    color: 'bg-red-100 text-red-800'
  },
  recepcion: {
    label: 'Recepción',
    color: 'bg-blue-100 text-blue-800'
  },
  tecnico: {
    label: 'Técnico',
    color: 'bg-green-100 text-green-800'
  }
}
