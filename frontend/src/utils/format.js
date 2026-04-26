import { format, formatDistance, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  try {
    return format(parseISO(fecha), 'dd/MM/yyyy', { locale: es })
  } catch {
    return '-'
  }
}

export const formatearFechaHora = (fecha) => {
  if (!fecha) return '-'
  try {
    return format(parseISO(fecha), 'dd/MM/yyyy HH:mm', { locale: es })
  } catch {
    return '-'
  }
}

export const formatearFechaRelativa = (fecha) => {
  if (!fecha) return '-'
  try {
    return formatDistance(parseISO(fecha), new Date(), { 
      addSuffix: true, 
      locale: es 
    })
  } catch {
    return '-'
  }
}

export const formatearMoneda = (monto) => {
  if (monto === null || monto === undefined) return '-'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(monto)
}

export const formatearTiempo = (minutos) => {
  if (!minutos) return '-'
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  if (horas === 0) return `${mins} min`
  if (mins === 0) return `${horas}h`
  return `${horas}h ${mins}min`
}
