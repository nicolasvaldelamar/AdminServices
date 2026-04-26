import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

const EMPRESA = {
  nombre: 'Arnol Caicedo Pacheco',
  cc: 'CC 1.047.438.365',
  slogan: 'Soluciones en Tecnología y Ciberseguridad',
  telefono: '+57 315 615 1507',
  email: 'caicedotecno@gmail.com',
  direccion: 'Canapote, Calle 60 #14-196',
  ciudad: 'Cartagena, Bolívar — Colombia',
  web: 'www.solucionescartagena.com.co'
};

const MEDIOS_PAGO = [
  { entidad: 'Davivienda', detalle: 'Cuenta de ahorros 4884 1037 6898' },
  { entidad: 'Daviplata',  detalle: '3156151507' },
  { entidad: 'Nequi',      detalle: '3156151507' },
  { entidad: 'Movii / Baloto', detalle: '3156151507' }
];

const COLORS = {
  primary:    '#2563eb',
  primaryDk:  '#1e40af',
  primaryLt:  '#dbeafe',
  ink:        '#0f172a',
  text:       '#1e293b',
  muted:      '#64748b',
  line:       '#e2e8f0',
  bg:         '#f8fafc',
  white:      '#ffffff',
  success:    '#10b981',
  warning:    '#f59e0b',
  danger:     '#ef4444'
};

const FONT = {
  regular: 'Helvetica',
  bold:    'Helvetica-Bold',
  oblique: 'Helvetica-Oblique'
};

// ============================================
// HELPERS
// ============================================

const formatearMoneda = (valor) => {
  const n = Number(valor || 0);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(n);
};

const formatearFecha = (fecha) => {
  if (!fecha) return '—';
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const formatearFechaCorta = (fecha) => {
  if (!fecha) return '—';
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const findLogoPath = () => {
  const candidates = [
    path.join(__dirname, '..', '..', 'logo.jpeg'),
    path.join(process.cwd(), 'logo.jpeg'),
    path.join(process.cwd(), 'backend', 'logo.jpeg')
  ];
  return candidates.find((p) => {
    try { return fs.existsSync(p); } catch { return false; }
  });
};

const parsearItems = (items) => {
  if (!items) return [];
  if (typeof items === 'string') {
    try { return JSON.parse(items); } catch { return []; }
  }
  return Array.isArray(items) ? items : [];
};

// ============================================
// COMPONENTES VISUALES REUTILIZABLES
// ============================================

const PAGE = {
  width: 612,
  height: 792,
  marginX: 40,
  marginTop: 40,
  marginBottom: 50
};
const CONTENT_W = PAGE.width - PAGE.marginX * 2;

/**
 * Header con banda azul a la izquierda, logo, datos empresa y bloque de tipo de documento
 */
function drawHeader(doc, { tipoDoc, numero, fecha, fechaLabel = 'Fecha de emisión', estadoBadge }) {
  const top = PAGE.marginTop;
  const headerH = 90;

  // Banda decorativa izquierda
  doc.rect(0, top, 6, headerH).fill(COLORS.primary);

  const logoPath = findLogoPath();
  let textX = PAGE.marginX;

  if (logoPath) {
    try {
      doc.image(logoPath, PAGE.marginX, top, { width: 70, height: 70 });
      textX = PAGE.marginX + 85;
    } catch {
      textX = PAGE.marginX;
    }
  }

  // Empresa (izquierda)
  doc.font(FONT.bold).fontSize(15).fillColor(COLORS.ink)
     .text(EMPRESA.nombre, textX, top + 4, { width: 280 });
  doc.font(FONT.regular).fontSize(9).fillColor(COLORS.muted)
     .text(EMPRESA.slogan, textX, top + 24, { width: 280 });
  doc.font(FONT.regular).fontSize(8).fillColor(COLORS.text)
     .text(EMPRESA.cc, textX, top + 40)
     .text(EMPRESA.direccion + ' · ' + EMPRESA.ciudad, textX, top + 52, { width: 280 })
     .text(EMPRESA.telefono + ' · ' + EMPRESA.email, textX, top + 64, { width: 280 });

  // Bloque tipo de documento (derecha)
  const boxW = 180;
  const boxX = PAGE.width - PAGE.marginX - boxW;
  const boxY = top;

  doc.roundedRect(boxX, boxY, boxW, headerH, 6).fill(COLORS.primary);

  doc.font(FONT.bold).fontSize(18).fillColor(COLORS.white)
     .text(tipoDoc, boxX, boxY + 12, { width: boxW, align: 'center' });

  doc.font(FONT.regular).fontSize(8).fillColor('#bfdbfe')
     .text('Número', boxX, boxY + 38, { width: boxW, align: 'center' });
  doc.font(FONT.bold).fontSize(13).fillColor(COLORS.white)
     .text(numero || '—', boxX, boxY + 50, { width: boxW, align: 'center' });

  doc.font(FONT.regular).fontSize(7).fillColor('#bfdbfe')
     .text(fechaLabel, boxX, boxY + 70, { width: boxW, align: 'center' });
  doc.font(FONT.bold).fontSize(9).fillColor(COLORS.white)
     .text(formatearFechaCorta(fecha), boxX, boxY + 79, { width: boxW, align: 'center' });

  if (estadoBadge) {
    const badgeY = boxY + headerH + 6;
    const badgeColor = estadoBadge.color || COLORS.muted;
    doc.roundedRect(boxX, badgeY, boxW, 18, 9).fill(badgeColor);
    doc.font(FONT.bold).fontSize(9).fillColor(COLORS.white)
       .text(estadoBadge.label.toUpperCase(), boxX, badgeY + 5, { width: boxW, align: 'center' });
  }

  return top + headerH + (estadoBadge ? 30 : 16);
}

/**
 * Caja con título y filas de pares clave-valor
 */
function drawInfoBox(doc, { x, y, width, title, rows }) {
  const titleH = 22;
  doc.roundedRect(x, y, width, titleH, 4).fill(COLORS.primaryLt);
  doc.font(FONT.bold).fontSize(9).fillColor(COLORS.primaryDk)
     .text(title.toUpperCase(), x + 12, y + 7);

  let cy = y + titleH + 8;
  doc.font(FONT.regular).fontSize(9).fillColor(COLORS.text);
  rows.forEach((row) => {
    if (!row || (row.value === undefined || row.value === null || row.value === '')) return;
    doc.font(FONT.regular).fontSize(8).fillColor(COLORS.muted)
       .text(row.label, x + 12, cy);
    doc.font(row.bold ? FONT.bold : FONT.regular).fontSize(9).fillColor(COLORS.ink)
       .text(String(row.value), x + 12, cy + 10, { width: width - 24 });
    cy += 28;
  });

  return cy + 4;
}

/**
 * Tabla de items: descripción, cantidad, precio, subtotal
 */
function drawItemsTable(doc, items, startY) {
  const colDesc = PAGE.marginX;
  const colCant = PAGE.marginX + 280;
  const colPrec = PAGE.marginX + 350;
  const colSub  = PAGE.marginX + 440;
  const tableW  = CONTENT_W;
  const headerH = 26;
  const minRowH = 28;

  // Header
  doc.rect(colDesc, startY, tableW, headerH).fill(COLORS.ink);
  doc.font(FONT.bold).fontSize(9).fillColor(COLORS.white);
  doc.text('Descripción',   colDesc + 12, startY + 9, { width: 260 });
  doc.text('Cantidad',      colCant,      startY + 9, { width: 60,  align: 'center' });
  doc.text('Precio unit.',  colPrec,      startY + 9, { width: 80,  align: 'right' });
  doc.text('Subtotal',      colSub,       startY + 9, { width: tableW - (colSub - colDesc) - 12, align: 'right' });

  let y = startY + headerH;
  doc.font(FONT.regular).fontSize(9).fillColor(COLORS.text);

  items.forEach((item, idx) => {
    const desc = String(item.descripcion || '—');
    const descHeight = doc.heightOfString(desc, { width: 260, lineGap: 2 });
    const rowH = Math.max(minRowH, descHeight + 14);

    // Fondo alterno
    if (idx % 2 === 0) {
      doc.rect(colDesc, y, tableW, rowH).fill(COLORS.bg);
    }
    // Borde inferior
    doc.strokeColor(COLORS.line).lineWidth(0.5)
       .moveTo(colDesc, y + rowH).lineTo(colDesc + tableW, y + rowH).stroke();

    const cantidad = Number(item.cantidad || 0);
    const precio = Number(item.precio_unitario || 0);
    const subtotal = item.subtotal !== undefined ? Number(item.subtotal) : cantidad * precio;

    doc.font(FONT.regular).fontSize(9).fillColor(COLORS.text)
       .text(desc, colDesc + 12, y + 8, { width: 260, lineGap: 2 });
    doc.text(String(cantidad), colCant, y + 8, { width: 60, align: 'center' });
    doc.text(formatearMoneda(precio), colPrec, y + 8, { width: 80, align: 'right' });
    doc.font(FONT.bold).fillColor(COLORS.ink)
       .text(formatearMoneda(subtotal), colSub, y + 8, { width: tableW - (colSub - colDesc) - 12, align: 'right' });

    y += rowH;
  });

  return y;
}

/**
 * Caja de totales a la derecha
 */
function drawTotalsBox(doc, { subtotal, iva, descuento, total }, startY, primaryColor = COLORS.primary) {
  const boxW = 220;
  const boxX = PAGE.width - PAGE.marginX - boxW;
  const lineH = 20;
  const padding = 12;

  const rows = [
    { label: 'Subtotal',  value: formatearMoneda(subtotal) },
  ];
  if (Number(descuento) > 0) {
    rows.push({ label: 'Descuento', value: '- ' + formatearMoneda(descuento), color: COLORS.danger });
  }
  if (Number(iva) > 0) {
    rows.push({ label: 'IVA',       value: formatearMoneda(iva) });
  }

  const totalH = rows.length * lineH + 40;
  doc.roundedRect(boxX, startY, boxW, totalH, 6)
     .fillAndStroke(COLORS.bg, COLORS.line);

  let cy = startY + padding;
  rows.forEach((row) => {
    doc.font(FONT.regular).fontSize(9).fillColor(COLORS.muted)
       .text(row.label, boxX + padding, cy);
    doc.font(FONT.regular).fontSize(9).fillColor(row.color || COLORS.text)
       .text(row.value, boxX + padding, cy, { width: boxW - padding * 2, align: 'right' });
    cy += lineH;
  });

  // Línea separadora
  doc.strokeColor(COLORS.line).lineWidth(1)
     .moveTo(boxX + padding, cy).lineTo(boxX + boxW - padding, cy).stroke();
  cy += 8;

  // Total destacado
  doc.font(FONT.bold).fontSize(11).fillColor(primaryColor)
     .text('TOTAL', boxX + padding, cy);
  doc.font(FONT.bold).fontSize(13).fillColor(primaryColor)
     .text(formatearMoneda(total), boxX + padding, cy - 1, { width: boxW - padding * 2, align: 'right' });

  return startY + totalH;
}

/**
 * Caja de medios de pago
 */
function drawMediosPago(doc, startY) {
  const boxW = CONTENT_W;
  const padding = 14;
  const titleH = 22;
  const lineH = 14;
  const totalH = titleH + MEDIOS_PAGO.length * lineH + padding;

  doc.roundedRect(PAGE.marginX, startY, boxW, totalH, 6)
     .fillAndStroke(COLORS.bg, COLORS.line);

  doc.font(FONT.bold).fontSize(10).fillColor(COLORS.primaryDk)
     .text('Medios de pago disponibles', PAGE.marginX + padding, startY + padding);

  let cy = startY + padding + titleH;
  MEDIOS_PAGO.forEach((mp) => {
    doc.font(FONT.bold).fontSize(8).fillColor(COLORS.text)
       .text(mp.entidad, PAGE.marginX + padding, cy, { continued: true })
       .font(FONT.regular).fillColor(COLORS.muted)
       .text('  ·  ' + mp.detalle);
    cy += lineH;
  });

  return startY + totalH;
}

/**
 * Caja con texto largo (notas, términos, diagnóstico)
 */
function drawTextSection(doc, { x, y, width, title, content, accent = COLORS.primary }) {
  if (!content || !String(content).trim()) return y;
  const padding = 12;
  const titleH = 20;

  doc.font(FONT.bold).fontSize(10).fillColor(accent)
     .text(title.toUpperCase(), x, y);

  doc.strokeColor(accent).lineWidth(2)
     .moveTo(x, y + titleH - 4).lineTo(x + 30, y + titleH - 4).stroke();

  let cy = y + titleH + 4;
  doc.font(FONT.regular).fontSize(9.5).fillColor(COLORS.text)
     .text(String(content), x, cy, { width, lineGap: 3 });

  return cy + doc.heightOfString(String(content), { width, lineGap: 3 }) + 14;
}

/**
 * Footer con info empresa y paginación
 */
function drawFooter(doc, { pageNumber, totalPages }) {
  const y = PAGE.height - PAGE.marginBottom + 8;

  doc.strokeColor(COLORS.line).lineWidth(0.5)
     .moveTo(PAGE.marginX, y).lineTo(PAGE.width - PAGE.marginX, y).stroke();

  doc.font(FONT.regular).fontSize(7.5).fillColor(COLORS.muted);
  doc.text(EMPRESA.web,                          PAGE.marginX, y + 8, { width: 200 });
  doc.text(EMPRESA.email + ' · ' + EMPRESA.telefono, 0, y + 8, { width: PAGE.width, align: 'center' });
  if (pageNumber !== undefined) {
    const pageStr = totalPages ? `Página ${pageNumber} de ${totalPages}` : `Página ${pageNumber}`;
    doc.text(pageStr, PAGE.marginX, y + 8, { width: CONTENT_W, align: 'right' });
  }
}

/**
 * Watermark / sello para cotizaciones según estado
 */
function drawWatermark(doc, label, color) {
  doc.save();
  doc.fontSize(110).fillColor(color).fillOpacity(0.06)
     .font(FONT.bold)
     .rotate(-30, { origin: [PAGE.width / 2, PAGE.height / 2] })
     .text(label, 0, PAGE.height / 2 - 60, { width: PAGE.width, align: 'center' });
  doc.restore();
  doc.fillOpacity(1);
}

// ============================================
// FACTURA
// ============================================

export const generarFacturaPDF = (factura) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const items = parsearItems(factura.items);

      // Header
      let y = drawHeader(doc, {
        tipoDoc: 'FACTURA',
        numero: factura.numero_factura,
        fecha: factura.fecha_emision
      });

      y += 6;

      // Cliente + Detalles
      const colW = (CONTENT_W - 16) / 2;
      const cliY = drawInfoBox(doc, {
        x: PAGE.marginX,
        y,
        width: colW,
        title: 'Facturar a',
        rows: [
          { label: 'Cliente',   value: factura.cliente_nombre, bold: true },
          { label: 'NIT / CC',  value: factura.cliente_nit || factura.cliente_documento },
          { label: 'Dirección', value: factura.cliente_direccion },
          { label: 'Teléfono',  value: factura.cliente_telefono },
          { label: 'Email',     value: factura.cliente_email }
        ].filter(r => r.value)
      });

      const detY = drawInfoBox(doc, {
        x: PAGE.marginX + colW + 16,
        y,
        width: colW,
        title: 'Detalles de factura',
        rows: [
          { label: 'Estado', value: (factura.estado || 'pendiente').toUpperCase(), bold: true },
          { label: 'Fecha de emisión', value: formatearFecha(factura.fecha_emision) },
          { label: 'Fecha de vencimiento', value: formatearFecha(factura.fecha_vencimiento) },
          { label: 'Servicio asociado', value: factura.servicio_codigo }
        ].filter(r => r.value)
      });

      y = Math.max(cliY, detY) + 8;

      // Items table
      y = drawItemsTable(doc, items, y) + 16;

      // Totales (caja a la derecha)
      y = drawTotalsBox(doc, {
        subtotal: factura.subtotal,
        iva: factura.iva,
        descuento: factura.descuento,
        total: factura.total
      }, y) + 14;

      // Medios de pago (debajo, full width)
      y = drawMediosPago(doc, y) + 16;

      // Notas / términos
      if (factura.notas) {
        y = drawTextSection(doc, {
          x: PAGE.marginX, y, width: CONTENT_W, title: 'Notas', content: factura.notas
        });
      }
      if (factura.terminos_condiciones) {
        y = drawTextSection(doc, {
          x: PAGE.marginX, y, width: CONTENT_W, title: 'Términos y condiciones', content: factura.terminos_condiciones, accent: COLORS.muted
        });
      }

      drawFooter(doc, { pageNumber: 1 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

// ============================================
// COTIZACIÓN
// ============================================

const ESTADO_COTIZACION = {
  pendiente:  { label: 'Pendiente', color: COLORS.warning, sello: null },
  aprobada:   { label: 'Aprobada',  color: COLORS.success, sello: { text: 'APROBADA',  color: COLORS.success } },
  rechazada:  { label: 'Rechazada', color: COLORS.danger,  sello: { text: 'RECHAZADA', color: COLORS.danger } },
  vencida:    { label: 'Vencida',   color: COLORS.muted,   sello: { text: 'VENCIDA',   color: COLORS.muted } }
};

export const generarCotizacionPDF = (cotizacion) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const items = parsearItems(cotizacion.items);
      const estadoInfo = ESTADO_COTIZACION[cotizacion.estado] || ESTADO_COTIZACION.pendiente;

      if (estadoInfo.sello) {
        drawWatermark(doc, estadoInfo.sello.text, estadoInfo.sello.color);
      }

      let y = drawHeader(doc, {
        tipoDoc: 'COTIZACIÓN',
        numero: cotizacion.numero_cotizacion,
        fecha: cotizacion.fecha_emision,
        estadoBadge: { label: estadoInfo.label, color: estadoInfo.color }
      });

      y += 6;

      const colW = (CONTENT_W - 16) / 2;
      const cliY = drawInfoBox(doc, {
        x: PAGE.marginX,
        y,
        width: colW,
        title: 'Cliente',
        rows: [
          { label: 'Nombre',   value: cotizacion.cliente_nombre, bold: true },
          { label: 'NIT / CC', value: cotizacion.cliente_nit || cotizacion.cliente_documento },
          { label: 'Dirección', value: cotizacion.cliente_direccion },
          { label: 'Teléfono', value: cotizacion.cliente_telefono },
          { label: 'Email',    value: cotizacion.cliente_email }
        ].filter(r => r.value)
      });

      const detY = drawInfoBox(doc, {
        x: PAGE.marginX + colW + 16,
        y,
        width: colW,
        title: 'Detalles',
        rows: [
          { label: 'Fecha de emisión', value: formatearFecha(cotizacion.fecha_emision) },
          { label: 'Válida hasta',     value: formatearFecha(cotizacion.fecha_validez) },
          { label: 'Servicio asociado', value: cotizacion.servicio_codigo }
        ].filter(r => r.value)
      });

      y = Math.max(cliY, detY) + 8;

      y = drawItemsTable(doc, items, y) + 16;

      // Totals
      y = drawTotalsBox(doc, {
        subtotal: cotizacion.subtotal,
        iva: cotizacion.iva,
        descuento: cotizacion.descuento,
        total: cotizacion.total
      }, y) + 16;

      // Notas
      if (cotizacion.notas) {
        y = drawTextSection(doc, {
          x: PAGE.marginX, y, width: CONTENT_W, title: 'Notas', content: cotizacion.notas
        });
      }
      // Términos
      if (cotizacion.terminos_condiciones) {
        y = drawTextSection(doc, {
          x: PAGE.marginX, y, width: CONTENT_W, title: 'Términos y condiciones', content: cotizacion.terminos_condiciones, accent: COLORS.muted
        });
      } else {
        // Términos por defecto
        y = drawTextSection(doc, {
          x: PAGE.marginX, y, width: CONTENT_W,
          title: 'Términos y condiciones',
          content:
            '· Los precios están expresados en pesos colombianos (COP).\n' +
            '· La validez de esta cotización es la indicada en el encabezado.\n' +
            '· Para iniciar el servicio se requiere la aprobación formal de esta cotización.\n' +
            '· Cualquier trabajo adicional al detallado podrá generar costos extra previo aviso.',
          accent: COLORS.muted
        });
      }

      drawFooter(doc, { pageNumber: 1 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

// ============================================
// INFORME TÉCNICO
// ============================================

export const generarInformePDF = (informe) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      let y = drawHeader(doc, {
        tipoDoc: 'INFORME',
        numero: informe.servicio_codigo || `#${informe.id || ''}`,
        fecha: informe.creado_en,
        fechaLabel: 'Fecha del informe'
      });

      y += 6;

      const colW = (CONTENT_W - 16) / 2;
      const cliY = drawInfoBox(doc, {
        x: PAGE.marginX,
        y,
        width: colW,
        title: 'Cliente y servicio',
        rows: [
          { label: 'Cliente',  value: informe.cliente_nombre, bold: true },
          { label: 'Teléfono', value: informe.cliente_telefono },
          { label: 'Servicio', value: informe.servicio_codigo },
          { label: 'Tipo',     value: informe.tipo_servicio === 'campo' ? 'Servicio en campo' : 'Servicio en taller' }
        ].filter(r => r.value)
      });

      const equipoY = drawInfoBox(doc, {
        x: PAGE.marginX + colW + 16,
        y,
        width: colW,
        title: 'Equipo y técnico',
        rows: [
          { label: 'Marca',    value: informe.equipo_marca },
          { label: 'Modelo',   value: informe.equipo_modelo },
          { label: 'Serial',   value: informe.equipo_serial },
          { label: 'Técnico',  value: informe.tecnico_nombre, bold: true },
          { label: 'Tiempo invertido', value: informe.tiempo_invertido ? `${informe.tiempo_invertido} h` : null }
        ].filter(r => r.value)
      });

      y = Math.max(cliY, equipoY) + 12;

      // Falla reportada (resumen)
      if (informe.falla_reportada) {
        y = drawTextSection(doc, {
          x: PAGE.marginX, y, width: CONTENT_W,
          title: 'Falla reportada',
          content: informe.falla_reportada,
          accent: COLORS.warning
        });
      }

      y = drawTextSection(doc, {
        x: PAGE.marginX, y, width: CONTENT_W,
        title: 'Diagnóstico',
        content: informe.diagnostico || '—'
      });

      y = drawTextSection(doc, {
        x: PAGE.marginX, y, width: CONTENT_W,
        title: 'Trabajo realizado',
        content: informe.trabajo_realizado || '—'
      });

      if (informe.repuestos_usados) {
        y = drawTextSection(doc, {
          x: PAGE.marginX, y, width: CONTENT_W,
          title: 'Repuestos utilizados',
          content: informe.repuestos_usados
        });
      }

      if (informe.recomendaciones) {
        y = drawTextSection(doc, {
          x: PAGE.marginX, y, width: CONTENT_W,
          title: 'Recomendaciones',
          content: informe.recomendaciones,
          accent: COLORS.success
        });
      }

      // Bloque de firma
      y = Math.max(y + 30, PAGE.height - PAGE.marginBottom - 90);
      const halfW = (CONTENT_W - 30) / 2;
      [
        { x: PAGE.marginX,             label: 'Técnico responsable', name: informe.tecnico_nombre },
        { x: PAGE.marginX + halfW + 30, label: 'Cliente / Receptor',  name: informe.cliente_nombre }
      ].forEach((firma) => {
        doc.strokeColor(COLORS.muted).lineWidth(0.5)
           .moveTo(firma.x, y + 30).lineTo(firma.x + halfW, y + 30).stroke();
        doc.font(FONT.regular).fontSize(8).fillColor(COLORS.muted)
           .text(firma.label, firma.x, y + 35, { width: halfW, align: 'center' });
        if (firma.name) {
          doc.font(FONT.bold).fontSize(9).fillColor(COLORS.text)
             .text(firma.name, firma.x, y + 48, { width: halfW, align: 'center' });
        }
      });

      drawFooter(doc, { pageNumber: 1 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

// ============================================
// REPORTE DE EQUIPOS (mantenido)
// ============================================

export const generarReporteEquiposPDF = (reporte) => {
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
        { label: 'Obs.', w: 70 }
      ];

      doc.fontSize(14).fillColor(COLORS.primary)
         .text(reporte.titulo || 'Reporte de Equipos', 20, 20, { align: 'center', width: pageW });
      doc.fontSize(8).fillColor(COLORS.muted)
         .text(EMPRESA.nombre + ' · Generado: ' + formatearFecha(new Date()), 20, 38, { align: 'center', width: pageW });

      let y = 56;
      const rowH = 14;
      const startX = 20;
      const fontSize = 5.5;

      const drawTblHeader = () => {
        let x = startX;
        cols.forEach((col) => {
          doc.rect(x, y, col.w, rowH).fillAndStroke(COLORS.primary, COLORS.primary);
          doc.fontSize(fontSize).fillColor('white').text(col.label, x + 2, y + 3, { width: col.w - 4, lineBreak: false });
          x += col.w;
        });
        y += rowH;
      };

      drawTblHeader();

      const items = reporte.items || [];
      items.forEach((item, idx) => {
        if (y + rowH > doc.page.height - 30) {
          doc.addPage();
          y = 20;
          drawTblHeader();
        }
        const bg = idx % 2 === 0 ? COLORS.bg : COLORS.white;
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
          doc.rect(x, y, col.w, rowH).fillAndStroke(bg, COLORS.line);
          const val = String(vals[ci] || '');
          doc.fontSize(fontSize).fillColor(COLORS.ink).text(val, x + 2, y + 3, { width: col.w - 4, lineBreak: false });
          x += col.w;
        });
        y += rowH;
      });

      doc.fontSize(7).fillColor(COLORS.muted)
         .text('Total equipos: ' + items.length, 20, y + 8);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
