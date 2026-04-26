import PDFDocument from 'pdfkit';
import { PDFDocument as PDFLibDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta a la plantilla de factura (copiar "1136 (2).pdf" como factura-template.pdf en backend/assets)
const FACTURA_TEMPLATE_PATH = path.join(__dirname, '../../assets/factura-template.pdf');

// Configuración de la empresa
const EMPRESA = {
  nombre: 'Arnol Caicedo Pacheco',
  cc: 'CC - 1047438365',
  slogan: 'Soluciones en Tecnología y Ciberseguridad',
  telefono: '3156151507',
  email: 'caicedotecno@gmail.com',
  direccion: 'Canapote Cll60 #14-196',
  ciudad: 'Cartagena, Bolívar (Colombia)',
  web: 'www.solucionescartagena.com.co'
};

const MEDIOS_PAGO = [
  'DAVIVIENDA (Ahorro): 488410376898',
  'DAVIVIENDA (Daviplata): 3156151507',
  'MOVII O POR BALOTO: 3156151507',
  'NEQUI: 3156151507'
];

// Colores corporativos
const COLORES = {
  primario: '#2563eb',
  secundario: '#1e40af',
  gris: '#6b7280',
  grisClaro: '#f3f4f6',
  negro: '#111827',
  verde: '#10b981'
};

// Función auxiliar para formatear moneda
const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
};

// Función auxiliar para formatear fecha
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// ============================================
// GENERAR FACTURA EN PDF (usa plantilla literal si existe)
// ============================================
async function generarFacturaPDFConPlantilla(factura) {
  if (!fs.existsSync(FACTURA_TEMPLATE_PATH)) return null;
  const templateBytes = await fs.promises.readFile(FACTURA_TEMPLATE_PATH);
  const pdfDoc = await PDFLibDocument.load(new Uint8Array(templateBytes));
  const page = pdfDoc.getPage(0);
  const { height } = page.getSize();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0.11, 0.09, 0.15);

  // Coordenadas: y en pdf-lib 0 = abajo. Ajustar según tu plantilla "1136 (2).pdf"
  const c = {
    numero: { x: 450, y: height - 80 },
    fecha: { x: 450, y: height - 95 },
    clienteNombre: { x: 72, y: height - 120 },
    clienteNit: { x: 72, y: height - 135 },
    clienteDireccion: { x: 72, y: height - 150 },
    tablaInicioY: height - 200,
    filaAltura: 20,
    colDesc: 72,
    colCant: 320,
    colPrec: 390,
    colSub: 448,
    totalesX: 350,
  };
  const fechaStr = new Date(factura.fecha_emision).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });

  page.drawText(factura.numero_factura || '', { ...c.numero, size: 10, font: helveticaBold, color: black });
  page.drawText(fechaStr, { ...c.fecha, size: 10, font: helveticaBold, color: black });
  page.drawText(factura.cliente_nombre || '', { x: c.clienteNombre.x, y: c.clienteNombre.y, size: 10, font: helveticaBold, color: black });
  const nitStr = (factura.cliente_nit || factura.cliente_documento || '').toString();
  if (nitStr) page.drawText('NIT: ' + nitStr, { x: c.clienteNit.x, y: c.clienteNit.y, size: 9, font: helvetica, color: black });
  if (factura.cliente_direccion) page.drawText(factura.cliente_direccion, { x: c.clienteDireccion.x, y: c.clienteDireccion.y, size: 9, font: helvetica, color: black });

  const items = typeof factura.items === 'string' ? JSON.parse(factura.items) : factura.items || [];
  const moneda = (v) => '$' + Number(v).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let rowY = c.tablaInicioY;
  for (const item of items) {
    const desc = (item.descripcion || '').substring(0, 55);
    page.drawText(desc, { x: c.colDesc, y: rowY, size: 8, font: helvetica, color: black });
    page.drawText(String(item.cantidad), { x: c.colCant, y: rowY, size: 8, font: helvetica, color: black });
    page.drawText(moneda(item.precio_unitario), { x: c.colPrec, y: rowY, size: 8, font: helvetica, color: black });
    page.drawText(moneda(item.subtotal ?? item.cantidad * item.precio_unitario), { x: c.colSub, y: rowY, size: 8, font: helvetica, color: black });
    rowY -= c.filaAltura;
  }

  let totY = height - 400;
  page.drawText(moneda(factura.subtotal), { x: c.totalesX + 80, y: totY, size: 9, font: helvetica, color: black });
  totY -= 15;
  if (factura.iva > 0) {
    page.drawText(moneda(factura.iva), { x: c.totalesX + 80, y: totY, size: 9, font: helvetica, color: black });
    totY -= 15;
  }
  if (factura.descuento > 0) {
    page.drawText('-' + moneda(factura.descuento), { x: c.totalesX + 80, y: totY, size: 9, font: helvetica, color: black });
    totY -= 15;
  }
  totY -= 8;
  page.drawText(moneda(factura.total), { x: c.totalesX + 60, y: totY, size: 10, font: helveticaBold, color: black });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export const generarFacturaPDF = async (factura) => {
  try {
    const buffer = await generarFacturaPDFConPlantilla(factura);
    if (buffer) return buffer;
  } catch (e) {
    console.warn('Factura con plantilla falló, usando diseño por defecto:', e?.message || e);
  }
  return _generarFacturaPDFKit(factura);
};

function _generarFacturaPDFKit(factura) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 40, bottom: 40, left: 60, right: 60 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const left = 60;
      const right = 552;
      const contentW = right - left;

      // --- "Factura" centrado, subrayado ---
      doc
        .fontSize(22)
        .fillColor(COLORES.negro)
        .text('Factura', left, 45, { align: 'center', width: contentW, underline: true });

      // --- Bloque emisor (izquierda) ---
      let y = 85;
      const lineH = 13;
      doc.fontSize(9).fillColor(COLORES.negro);
      doc.text(EMPRESA.cc, left, y);                         y += lineH;
      doc.text(EMPRESA.direccion, left, y);                   y += lineH;
      doc.text(EMPRESA.ciudad, left, y);                      y += lineH;
      doc.text(EMPRESA.telefono, left, y);                    y += lineH;
      doc.text(EMPRESA.email, left, y);                       y += lineH + 4;
      doc.font('Helvetica-Bold').fontSize(10);
      doc.text(EMPRESA.nombre, left, y);
      doc.font('Helvetica').fontSize(9);

      // --- Número y Fecha (derecha, alineados con el bloque emisor) ---
      const rightCol = 400;
      let ry = 85;
      doc.fillColor(COLORES.negro).fontSize(9);
      doc.text('Número', rightCol, ry);
      doc.font('Helvetica-Bold').text(factura.numero_factura, rightCol, ry + lineH);
      doc.font('Helvetica');
      ry += lineH * 2 + 4;
      doc.text('Fecha', rightCol, ry);
      const fechaStr = new Date(factura.fecha_emision).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
      doc.font('Helvetica-Bold').text(fechaStr, rightCol, ry + lineH);
      doc.font('Helvetica');

      // --- Línea separadora azul ---
      y += 18;
      doc
        .strokeColor(COLORES.primario)
        .lineWidth(2)
        .moveTo(left, y)
        .lineTo(right, y)
        .stroke();

      // --- Datos del cliente ---
      y += 14;
      doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORES.negro);
      doc.text(factura.cliente_nombre || '', left, y, { width: 300 });
      doc.font('Helvetica').fontSize(9);
      y += 16;

      if (factura.cliente_nit || factura.cliente_documento) {
        doc.text('NIT: ' + (factura.cliente_nit || factura.cliente_documento || ''), left, y);
        y += lineH;
      }
      if (factura.cliente_direccion) {
        doc.text(factura.cliente_direccion, left, y, { width: 300 });
        y += lineH;
      }
      doc.text(EMPRESA.ciudad, left, y);
      y += lineH + 10;

      // --- Tabla de items ---
      const colDesc = left;
      const colCant = left + 320;
      const colPrec = left + 390;
      const colSub  = left + 448;
      const tableW = contentW;
      const headerH = 20;
      const rowH = 20;

      // Header
      doc
        .rect(colDesc, y, tableW, headerH)
        .fill('#f0f0f0');
      doc
        .strokeColor('#cccccc').lineWidth(0.5)
        .rect(colDesc, y, tableW, headerH).stroke();

      doc.fontSize(8).fillColor(COLORES.negro).font('Helvetica-Bold');
      doc.text('Descripción', colDesc + 6, y + 6, { width: 310 });
      doc.text('Cantidad', colCant, y + 6, { width: 60, align: 'center' });
      doc.text('Precio', colPrec, y + 6, { width: 55, align: 'right' });
      doc.text('Subtotal', colSub, y + 6, { width: 42, align: 'right' });
      doc.font('Helvetica');

      y += headerH;

      const items = typeof factura.items === 'string'
        ? JSON.parse(factura.items)
        : factura.items;

      items.forEach((item) => {
        // Row border
        doc.strokeColor('#e0e0e0').lineWidth(0.5).rect(colDesc, y, tableW, rowH).stroke();

        doc.fontSize(8).fillColor(COLORES.negro);
        doc.text(item.descripcion || '', colDesc + 6, y + 6, { width: 310 });
        doc.text(String(item.cantidad), colCant, y + 6, { width: 60, align: 'center' });

        const monedaFormato = (v) => {
          return '$' + Number(v).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        doc.text(monedaFormato(item.precio_unitario), colPrec, y + 6, { width: 55, align: 'right' });
        doc.text(monedaFormato(item.subtotal || (item.cantidad * item.precio_unitario)), colSub, y + 6, { width: 42, align: 'right' });

        y += rowH;
      });

      // Línea bajo la tabla
      doc.strokeColor('#cccccc').lineWidth(0.5).moveTo(left, y).lineTo(right, y).stroke();

      y += 16;

      // --- Medios de pago (izquierda) ---
      const mpY = y;
      doc.fontSize(8).fillColor(COLORES.primario).font('Helvetica-Bold');
      doc.text('Medios de Pago:', left, y);
      doc.font('Helvetica').fillColor(COLORES.negro);
      y += 13;
      MEDIOS_PAGO.forEach((medio) => {
        doc.fontSize(7.5).text('• ' + medio, left, y, { width: 260 });
        y += 11;
      });

      // --- Totales (derecha, al lado de medios de pago) ---
      const totX = colPrec - 30;
      let totY = mpY;

      const monedaTotal = (v) => {
        return '$' + Number(v).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };

      doc.fontSize(9).fillColor(COLORES.negro);
      doc.text('Base Imponible', totX, totY, { width: 80, align: 'left' });
      doc.text(monedaTotal(factura.subtotal), totX + 80, totY, { width: 62, align: 'right' });
      totY += 15;

      if (factura.iva > 0) {
        doc.text('IVA (19%)', totX, totY, { width: 80, align: 'left' });
        doc.text(monedaTotal(factura.iva), totX + 80, totY, { width: 62, align: 'right' });
        totY += 15;
      }

      if (factura.descuento > 0) {
        doc.fillColor('#dc2626');
        doc.text('Descuento', totX, totY, { width: 80, align: 'left' });
        doc.text('-' + monedaTotal(factura.descuento), totX + 80, totY, { width: 62, align: 'right' });
        doc.fillColor(COLORES.negro);
        totY += 15;
      }

      // Total con fondo
      totY += 2;
      doc
        .rect(totX, totY - 2, 144, 20)
        .fill(COLORES.primario);
      doc
        .fontSize(9).fillColor('white').font('Helvetica-Bold');
      doc.text('Total', totX + 6, totY + 3, { width: 50, align: 'left' });
      doc.text(monedaTotal(factura.total), totX + 56, totY + 3, { width: 82, align: 'right' });
      doc.font('Helvetica');

      // --- Footer: URL web centrada ---
      const footerY = doc.page.height - 60;
      doc
        .fontSize(9)
        .fillColor(COLORES.primario)
        .text(EMPRESA.web, left, footerY, { align: 'center', width: contentW, link: 'https://' + EMPRESA.web });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// ============================================
// GENERAR COTIZACIÓN EN PDF
// ============================================
export const generarCotizacionPDF = async (cotizacion) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // ===== HEADER =====
      
      try {
        const candidates = [
          path.join(__dirname, '../../../logo.jpeg'),
          path.join(process.cwd(), 'logo.jpeg'),
          path.join(process.cwd(), 'backend', 'logo.jpeg'),
        ];
        const logoPath = candidates.find(fs.existsSync);
        if (logoPath) {
          doc.image(logoPath, 50, 45, { width: 80 });
        }
      } catch (error) {
        console.log('Logo no encontrado');
      }

      doc
        .fontSize(20)
        .fillColor(COLORES.primario)
        .text(EMPRESA.nombre, 150, 50, { align: 'left' })
        .fontSize(10)
        .fillColor(COLORES.gris)
        .text(EMPRESA.slogan, 150, 75)
        .text(EMPRESA.telefono + ' | ' + EMPRESA.email, 150, 90)
        .text(EMPRESA.direccion, 150, 105);

      // COTIZACIÓN label
      doc
        .fontSize(28)
        .fillColor('#8b5cf6')
        .text('COTIZACIÓN', 400, 50, { align: 'right' })
        .fontSize(12)
        .fillColor(COLORES.negro)
        .text(cotizacion.numero_cotizacion, 400, 85, { align: 'right' });

      doc
        .strokeColor('#8b5cf6')
        .lineWidth(2)
        .moveTo(50, 140)
        .lineTo(562, 140)
        .stroke();

      // ===== INFORMACIÓN =====
      let yPos = 160;

      doc
        .fontSize(10)
        .fillColor(COLORES.gris)
        .text('Fecha de Emisión:', 400, yPos, { continued: true, align: 'left' })
        .fillColor(COLORES.negro)
        .text(' ' + formatearFecha(cotizacion.fecha_emision), { align: 'right' });

      if (cotizacion.fecha_validez) {
        doc
          .fillColor(COLORES.gris)
          .text('Válida hasta:', 400, yPos + 15, { continued: true, align: 'left' })
          .fillColor(COLORES.negro)
          .text(' ' + formatearFecha(cotizacion.fecha_validez), { align: 'right' });
      }

      doc
        .fontSize(12)
        .fillColor('#8b5cf6')
        .text('CLIENTE', 50, yPos);

      doc
        .fontSize(10)
        .fillColor(COLORES.negro)
        .text(cotizacion.cliente_nombre, 50, yPos + 20, { width: 300 })
        .fillColor(COLORES.gris)
        .text('Tel: ' + cotizacion.cliente_telefono, 50, yPos + 35);

      if (cotizacion.cliente_email) {
        doc.text('Email: ' + cotizacion.cliente_email, 50, yPos + 50);
      }

      yPos += 90;

      // ===== TABLA DE ITEMS =====
      const tableTop = yPos;
      const colDescripcion = 50;
      const colCantidad = 350;
      const colPrecio = 420;
      const colSubtotal = 490;

      doc
        .rect(50, tableTop, 512, 25)
        .fillAndStroke('#8b5cf6', '#8b5cf6');

      doc
        .fontSize(10)
        .fillColor('white')
        .text('DESCRIPCIÓN', colDescripcion + 10, tableTop + 8, { width: 280 })
        .text('CANT.', colCantidad, tableTop + 8, { width: 60, align: 'center' })
        .text('PRECIO', colPrecio, tableTop + 8, { width: 60, align: 'right' })
        .text('SUBTOTAL', colSubtotal, tableTop + 8, { width: 62, align: 'right' });

      let itemY = tableTop + 30;
      const items = typeof cotizacion.items === 'string' 
        ? JSON.parse(cotizacion.items) 
        : cotizacion.items;

      items.forEach((item, index) => {
        if (index % 2 === 0) {
          doc.rect(50, itemY - 5, 512, 25).fill(COLORES.grisClaro);
        }

        doc
          .fontSize(10)
          .fillColor(COLORES.negro)
          .text(item.descripcion, colDescripcion + 10, itemY, { width: 280 })
          .text(item.cantidad.toString(), colCantidad, itemY, { width: 60, align: 'center' })
          .text(formatearMoneda(item.precio_unitario), colPrecio, itemY, { width: 60, align: 'right' })
          .text(formatearMoneda(item.subtotal || (item.cantidad * item.precio_unitario)), colSubtotal, itemY, { width: 62, align: 'right' });

        itemY += 25;
      });

      doc
        .strokeColor(COLORES.gris)
        .lineWidth(1)
        .moveTo(50, itemY + 5)
        .lineTo(562, itemY + 5)
        .stroke();

      // ===== TOTALES =====
      const totalesX = 400;
      let totalesY = itemY + 20;

      doc
        .fontSize(10)
        .fillColor(COLORES.gris)
        .text('Subtotal:', totalesX, totalesY, { width: 100, align: 'left' })
        .fillColor(COLORES.negro)
        .text(formatearMoneda(cotizacion.subtotal), totalesX + 100, totalesY, { width: 62, align: 'right' });

      totalesY += 20;

      if (cotizacion.iva > 0) {
        doc
          .fillColor(COLORES.gris)
          .text('IVA (19%):', totalesX, totalesY, { width: 100, align: 'left' })
          .fillColor(COLORES.negro)
          .text(formatearMoneda(cotizacion.iva), totalesX + 100, totalesY, { width: 62, align: 'right' });
        totalesY += 20;
      }

      if (cotizacion.descuento > 0) {
        doc
          .fillColor(COLORES.gris)
          .text('Descuento:', totalesX, totalesY, { width: 100, align: 'left' })
          .fillColor('#dc2626')
          .text('-' + formatearMoneda(cotizacion.descuento), totalesX + 100, totalesY, { width: 62, align: 'right' });
        totalesY += 20;
      }

      doc
        .rect(totalesX, totalesY - 5, 162, 30)
        .fillAndStroke('#8b5cf6', '#8b5cf6');

      doc
        .fontSize(12)
        .fillColor('white')
        .text('TOTAL:', totalesX + 10, totalesY + 3, { width: 100, align: 'left' })
        .fontSize(14)
        .text(formatearMoneda(cotizacion.total), totalesX + 100, totalesY + 3, { width: 52, align: 'right' });

      // ===== NOTAS Y TÉRMINOS =====
      totalesY += 50;

      if (cotizacion.notas) {
        doc
          .fontSize(10)
          .fillColor('#8b5cf6')
          .text('NOTAS:', 50, totalesY)
          .fillColor(COLORES.gris)
          .text(cotizacion.notas, 50, totalesY + 15, { width: 500 });
        totalesY += 60;
      }

      if (cotizacion.terminos_condiciones) {
        doc
          .fontSize(9)
          .fillColor(COLORES.gris)
          .text('Términos y Condiciones:', 50, totalesY)
          .fontSize(8)
          .text(cotizacion.terminos_condiciones, 50, totalesY + 15, { width: 500 });
      }

      // ===== FOOTER =====
      const footerY = 720;

      doc
        .strokeColor('#8b5cf6')
        .lineWidth(1)
        .moveTo(50, footerY)
        .lineTo(562, footerY)
        .stroke();

      doc
        .fontSize(8)
        .fillColor(COLORES.gris)
        .text(
          'Esta cotización es válida por 30 días a partir de la fecha de emisión',
          50,
          footerY + 10,
          { align: 'center', width: 512 }
        )
        .text(
          EMPRESA.nombre + ' | ' + EMPRESA.web + ' | ' + EMPRESA.telefono,
          50,
          footerY + 25,
          { align: 'center', width: 512 }
        );

      const estadoColor = cotizacion.estado === 'aprobada' ? COLORES.verde : 
                          cotizacion.estado === 'rechazada' ? '#dc2626' : 
                          '#f59e0b';
      
      doc
        .fontSize(10)
        .fillColor(estadoColor)
        .text(cotizacion.estado.toUpperCase(), 50, 750, { align: 'right', width: 512 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// ============================================
// GENERAR REPORTE DE EQUIPOS EN PDF
// ============================================
export const generarReporteEquiposPDF = async (reporte) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LEGAL',
        layout: 'landscape',
        margins: { top: 40, bottom: 30, left: 20, right: 20 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const pageW = doc.page.width - 40;

      const cols = [
        { label: '#', w: 22 },
        { label: 'Usuario', w: 58 },
        { label: 'Cargo', w: 52 },
        { label: 'Empresa', w: 52 },
        { label: 'Area', w: 48 },
        { label: 'Equipo', w: 52 },
        { label: 'Marca', w: 42 },
        { label: 'Modelo', w: 50 },
        { label: 'Serial', w: 52 },
        { label: 'Tipo', w: 38 },
        { label: 'S.O.', w: 42 },
        { label: 'Office', w: 28 },
        { label: 'Procesador', w: 58 },
        { label: 'RAM', w: 28 },
        { label: 'Disco', w: 42 },
        { label: 'Antivirus', w: 42 },
        { label: 'Obs.', w: 70 },
      ];

      doc
        .fontSize(14)
        .fillColor(COLORES.primario)
        .text(reporte.titulo || 'Reporte de Equipos', 20, 20, { align: 'center', width: pageW });

      doc
        .fontSize(8)
        .fillColor(COLORES.gris)
        .text(EMPRESA.nombre + ' | Generado: ' + formatearFecha(new Date()), 20, 38, { align: 'center', width: pageW });

      let y = 56;
      const rowH = 14;
      const startX = 20;
      const fontSize = 5.5;

      const drawHeader = () => {
        let x = startX;
        cols.forEach((col) => {
          doc.rect(x, y, col.w, rowH).fillAndStroke(COLORES.primario, COLORES.primario);
          doc.fontSize(fontSize).fillColor('white').text(col.label, x + 2, y + 3, { width: col.w - 4, lineBreak: false });
          x += col.w;
        });
        y += rowH;
      };

      drawHeader();

      const items = reporte.items || [];
      items.forEach((item, idx) => {
        if (y + rowH > doc.page.height - 30) {
          doc.addPage();
          y = 20;
          drawHeader();
        }

        const bg = idx % 2 === 0 ? COLORES.grisClaro : '#ffffff';
        let x = startX;
        const vals = [
          item.numero || idx + 1,
          item.usuario, item.cargo, item.empresa, item.area_asignacion,
          item.nombre_equipo, item.marca, item.modelo, item.serial,
          item.tipo_equipo, item.sistema_operativo, item.office,
          item.procesador, item.ram, item.disco_duro, item.antivirus,
          item.observaciones
        ];

        cols.forEach((col, ci) => {
          doc.rect(x, y, col.w, rowH).fillAndStroke(bg, '#e2e8f0');
          const val = String(vals[ci] || '');
          doc.fontSize(fontSize).fillColor(COLORES.negro).text(val, x + 2, y + 3, { width: col.w - 4, lineBreak: false });
          x += col.w;
        });
        y += rowH;
      });

      doc
        .fontSize(7)
        .fillColor(COLORES.gris)
        .text('Total equipos: ' + items.length, 20, y + 8);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
