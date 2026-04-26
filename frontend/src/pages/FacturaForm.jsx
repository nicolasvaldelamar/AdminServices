import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { formatearMoneda } from '../utils/format'

export default function FacturaForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clientes, setClientes] = useState([])
  const [servicios, setServicios] = useState([])
  const [items, setItems] = useState([{ descripcion: '', cantidad: 1, precio_unitario: 0 }])
  
  const clienteSeleccionado = watch('cliente_id')
  const aplicarIVA = watch('aplicar_iva')
  
  useEffect(() => {
    cargarDatos()
    
    const servicioId = searchParams.get('servicio_id')
    if (servicioId) {
      cargarServicio(servicioId)
    }
  }, [])
  
  const cargarDatos = async () => {
    try {
      const [clientesRes, serviciosRes] = await Promise.all([
        api.get('/clientes'),
        api.get('/servicios')
      ])
      setClientes(clientesRes.data)
      setServicios(serviciosRes.data)
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
  }
  
  const cargarServicio = async (servicioId) => {
    try {
      const response = await api.get(`/servicios/${servicioId}`)
      const servicio = response.data
      
      setValue('servicio_id', servicio.id)
      setValue('cliente_id', servicio.cliente_id)
      
      // Agregar servicio como item
      setItems([{
        descripcion: `Servicio técnico - ${servicio.codigo}`,
        cantidad: 1,
        precio_unitario: servicio.cotizacion_monto || 0
      }])
    } catch (error) {
      console.error('Error cargando servicio:', error)
    }
  }
  
  const agregarItem = () => {
    setItems([...items, { descripcion: '', cantidad: 1, precio_unitario: 0 }])
  }
  
  const eliminarItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }
  
  const actualizarItem = (index, campo, valor) => {
    const nuevosItems = [...items]
    nuevosItems[index][campo] = valor
    setItems(nuevosItems)
  }
  
  const calcularTotales = () => {
    const subtotal = items.reduce((acc, item) => {
      return acc + (item.cantidad * item.precio_unitario)
    }, 0)
    
    const iva = aplicarIVA ? subtotal * 0.19 : 0
    const descuento = 0 // Puedes agregar campo para descuento
    const total = subtotal + iva - descuento
    
    return { subtotal, iva, descuento, total }
  }
  
  const onSubmit = async (data) => {
    if (items.length === 0 || items.some(item => !item.descripcion)) {
      setError('Debes agregar al menos un item válido')
      return
    }
    
    setLoading(true)
    setError('')
    
    const totales = calcularTotales()
    
    const facturaData = {
      ...data,
      items,
      ...totales
    }
    
    try {
      await api.post('/facturacion/facturas', facturaData)
      navigate('/app/facturacion')
    } catch (error) {
      setError(error.response?.data?.error || 'Error al crear factura')
    } finally {
      setLoading(false)
    }
  }
  
  const totales = calcularTotales()
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/app/facturacion" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft size={20} />
        Volver a facturación
      </Link>
      
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Factura</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                {...register('cliente_id', { required: 'Cliente es requerido' })}
                className="input-field"
              >
                <option value="">Seleccione un cliente...</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
              {errors.cliente_id && (
                <p className="mt-1 text-sm text-red-600">{errors.cliente_id.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicio Asociado (opcional)
              </label>
              <select
                {...register('servicio_id')}
                className="input-field"
              >
                <option value="">Sin servicio asociado</option>
                {servicios
                  .filter(s => !s.facturado && s.cliente_id == clienteSeleccionado)
                  .map(servicio => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.codigo}
                    </option>
                  ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                {...register('fecha_vencimiento')}
                className="input-field"
              />
            </div>
            
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                {...register('aplicar_iva')}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Aplicar IVA (19%)
              </label>
            </div>
          </div>
          
          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Items de la Factura</h3>
              <button
                type="button"
                onClick={agregarItem}
                className="btn-secondary text-sm flex items-center gap-2"
              >
                <Plus size={16} />
                Agregar Item
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="col-span-5">
                    <label className="block text-xs text-gray-600 mb-1">Descripción</label>
                    <input
                      value={item.descripcion}
                      onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)}
                      className="input-field"
                      placeholder="Descripción del item"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Cantidad</label>
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => actualizarItem(index, 'cantidad', parseInt(e.target.value) || 0)}
                      className="input-field"
                      min="1"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Precio Unit.</label>
                    <input
                      type="number"
                      value={item.precio_unitario}
                      onChange={(e) => actualizarItem(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                      className="input-field"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Subtotal</label>
                    <div className="input-field bg-gray-100 text-right font-semibold">
                      {formatearMoneda(item.cantidad * item.precio_unitario)}
                    </div>
                  </div>
                  
                  <div className="col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => eliminarItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Totales */}
          <div className="bg-primary-50 rounded-lg p-6">
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatearMoneda(totales.subtotal)}</span>
              </div>
              
              {aplicarIVA && (
                <div className="flex justify-between text-gray-700">
                  <span>IVA (19%):</span>
                  <span className="font-semibold">{formatearMoneda(totales.iva)}</span>
                </div>
              )}
              
              {totales.descuento > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Descuento:</span>
                  <span className="font-semibold">-{formatearMoneda(totales.descuento)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold text-primary-900 pt-3 border-t-2 border-primary-200">
                <span>TOTAL:</span>
                <span>{formatearMoneda(totales.total)}</span>
              </div>
            </div>
          </div>
          
          {/* Notas y términos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                {...register('notas')}
                rows={4}
                className="input-field"
                placeholder="Información adicional para el cliente..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Términos y Condiciones
              </label>
              <textarea
                {...register('terminos_condiciones')}
                rows={4}
                className="input-field"
                placeholder="Garantía de 30 días en mano de obra..."
                defaultValue="Garantía de 30 días en mano de obra. No cubre daños por mal uso."
              />
            </div>
          </div>
          
          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Crear Factura'}
            </button>
            
            <Link to="/app/facturacion" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
