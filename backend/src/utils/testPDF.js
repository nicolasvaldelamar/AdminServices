import fs from 'fs';
import { generarFacturaPDF, generarCotizacionPDF } from './pdfGenerator.js';

// Factura de prueba
const facturaPrueba = {
  numero_factura: 'F-2026-00001',
  fecha_emision: new Date(),
  fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  cliente_nombre: 'Cliente de Prueba S.A.S',
  cliente_telefono: '(+57) 300 123 4567',
  cliente_email: 'cliente@ejemplo.com',
  cliente_direccion: 'Calle 123 #45-67, Bogotá',
  items: [
    {
      descripcion: 'Servicio técnico especializado',
      cantidad: 1,
      precio_unitario: 150000,
      subtotal: 150000
    },
    {
      descripcion: 'Reemplazo de disco duro 1TB SSD',
      cantidad: 1,
      precio_unitario: 180000,
      subtotal: 180000
    },
    {
      descripcion: 'Instalación de sistema operativo',
      cantidad: 1,
      precio_unitario: 70000,
      subtotal: 70000
    }
  ],
  subtotal: 400000,
  iva: 76000,
  descuento: 0,
  total: 476000,
  estado: 'pendiente',
  notas: 'Pago contra entrega. Garantía de 30 días en mano de obra.',
  terminos_condiciones: 'Garantía de 30 días en mano de obra. No cubre daños por mal uso. Repuestos con garantía del fabricante.'
};

// Cotización de prueba
const cotizacionPrueba = {
  numero_cotizacion: 'C-2026-00001',
  fecha_emision: new Date(),
  fecha_validez: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  cliente_nombre: 'Empresa Demo Ltda',
  cliente_telefono: '(+57) 300 987 6543',
  cliente_email: 'demo@empresa.com',
  cliente_direccion: 'Carrera 45 #67-89, Medellín',
  items: [
    {
      descripcion: 'Diagnóstico completo de red',
      cantidad: 1,
      precio_unitario: 80000,
      subtotal: 80000
    },
    {
      descripcion: 'Configuración de firewall',
      cantidad: 1,
      precio_unitario: 200000,
      subtotal: 200000
    },
    {
      descripcion: 'Instalación de cámaras IP',
      cantidad: 4,
      precio_unitario: 150000,
      subtotal: 600000
    }
  ],
  subtotal: 880000,
  iva: 167200,
  descuento: 50000,
  total: 997200,
  estado: 'pendiente',
  notas: 'Incluye visita técnica inicial sin costo.',
  terminos_condiciones: 'Cotización válida por 30 días. Precios no incluyen instalación. Equipos sujetos a disponibilidad.'
};

async function probarPDFs() {
  console.log('\n🧪 Probando Generación de PDFs...\n');
  
  try {
    // Probar factura
    console.log('1️⃣  Generando factura de prueba...');
    const facturaPDF = await generarFacturaPDF(facturaPrueba);
    fs.writeFileSync('factura-prueba.pdf', facturaPDF);
    console.log('✅ Factura generada: factura-prueba.pdf');
    
    // Probar cotización
    console.log('\n2️⃣  Generando cotización de prueba...');
    const cotizacionPDF = await generarCotizacionPDF(cotizacionPrueba);
    fs.writeFileSync('cotizacion-prueba.pdf', cotizacionPDF);
    console.log('✅ Cotización generada: cotizacion-prueba.pdf');
    
    console.log('\n✨ ¡PDFs generados exitosamente!');
    console.log('\n📁 Archivos creados en la carpeta backend:');
    console.log('   - factura-prueba.pdf');
    console.log('   - cotizacion-prueba.pdf');
    console.log('\n💡 Abre los PDFs para verificar que el diseño es correcto.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error generando PDFs:', error);
    process.exit(1);
  }
}

probarPDFs();
