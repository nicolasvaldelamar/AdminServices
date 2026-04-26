Plantilla de factura
===================
Para que la factura PDF use el diseño oficial, copia aquí el archivo de plantilla con este nombre exacto:

  factura-template.pdf

Por ejemplo, si tu plantilla se llama "1136 (2).pdf", cópiala o renómbrala a:
  factura-template.pdf
y colócala en esta carpeta (backend/assets/).

Si no existe factura-template.pdf, el sistema generará la factura con un diseño por defecto.

Si al usar la plantilla los textos no coinciden con los recuadros, puedes ajustar las
coordenadas en backend/src/utils/pdfGenerator.js, dentro de la función
generarFacturaPDFConPlantilla (objeto "c" y posiciones de totales).
