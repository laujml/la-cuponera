// src/utils/pdfCupon.js
/**
 * Generates a printable coupon HTML page and opens it in a new tab.
 * The user can then use browser Print → Save as PDF.
 * No external PDF library needed.
 */
export const generarPDFCupon = (cupon) => {
  const oferta = cupon.oferta || {}
  const ahorro = ((oferta.precio_regular || 0) - (cupon.precio_pagado || 0)).toFixed(2)
  const fechaCompra = cupon.fecha_compra ? new Date(cupon.fecha_compra).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES')
  const fechaVencimiento = cupon.fecha_vencimiento ? new Date(cupon.fecha_vencimiento).toLocaleDateString('es-ES') : 'N/A'

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Cupón - ${cupon.codigo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f3f4f6;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 40px 20px;
    }
    .cupon {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      width: 480px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    }
    .header {
      background: linear-gradient(135deg, #f97316, #dc2626);
      color: white;
      padding: 24px;
      text-align: center;
    }
    .header h1 { font-size: 24px; font-weight: 800; letter-spacing: 1px; margin-bottom: 4px; }
    .header p { font-size: 13px; opacity: 0.9; }
    .descuento {
      font-size: 56px;
      font-weight: 900;
      line-height: 1;
      margin: 12px 0 4px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    .body { padding: 24px; }
    .oferta-titulo {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 6px;
      line-height: 1.3;
    }
    .empresa {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .separator {
      border: none;
      border-top: 2px dashed #d1d5db;
      margin: 16px 0;
    }
    .codigo-section {
      text-align: center;
      background: #fff7ed;
      border: 2px dashed #f97316;
      border-radius: 12px;
      padding: 20px;
      margin: 16px 0;
    }
    .codigo-label { 
      font-size: 11px; 
      color: #9ca3af; 
      text-transform: uppercase; 
      letter-spacing: 1.5px;
      margin-bottom: 8px;
    }
    .codigo {
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 4px;
      color: #ea580c;
      font-family: 'Courier New', monospace;
      margin: 8px 0;
    }
    .codigo-instruccion {
      font-size: 11px;
      color: #9ca3af;
      margin-top: 8px;
    }
    .precios {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px 0;
      padding: 12px;
      background: #f0fdf4;
      border-radius: 8px;
    }
    .precio-regular { font-size: 14px; color: #9ca3af; text-decoration: line-through; }
    .precio-oferta { font-size: 32px; font-weight: 900; color: #16a34a; }
    .ahorro { font-size: 13px; color: #16a34a; font-weight: 600; }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 16px;
    }
    .info-item { background: #f9fafb; border-radius: 8px; padding: 12px; }
    .info-label { 
      font-size: 10px; 
      color: #9ca3af; 
      text-transform: uppercase; 
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-value { font-size: 13px; font-weight: 600; color: #374151; }
    .condiciones {
      margin-top: 16px;
      background: #fefce8;
      border: 1px solid #fef08a;
      border-radius: 8px;
      padding: 12px;
    }
    .condiciones-title {
      font-size: 11px;
      color: #92400e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .condiciones-text {
      font-size: 12px;
      color: #78350f;
      line-height: 1.5;
    }
    .footer {
      background: #1f2937;
      color: #9ca3af;
      text-align: center;
      padding: 16px;
      font-size: 11px;
    }
    .footer strong { color: white; }
    .qr-placeholder {
      width: 80px;
      height: 80px;
      background: #e5e7eb;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #9ca3af;
      margin: 0 auto 12px;
    }
    @media print {
      body { background: white; padding: 0; }
      .cupon { box-shadow: none; width: 100%; max-width: 500px; margin: 0 auto; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="cupon">

    <div class="header">
      <h1>LA CUPONERA</h1>
      <p>Tu cupón de descuento</p>
      <div class="descuento">${oferta.porcentaje_descuento || '0'}% OFF</div>
    </div>

    <div class="body">
      <p class="oferta-titulo">${oferta.titulo || 'Oferta'}</p>
      <p class="empresa">📍 ${oferta.empresa_nombre || 'Establecimiento'}</p>

      <div class="precios">
        <div>
          <p class="precio-regular">Precio regular: $${(oferta.precio_regular || 0).toFixed(2)}</p>
          <p class="ahorro">¡Ahorras $${ahorro}!</p>
        </div>
        <p class="precio-oferta">$${(cupon.precio_pagado || 0).toFixed(2)}</p>
      </div>

      <hr class="separator" />

      <div class="codigo-section">
        <p class="codigo-label">Código único del cupón</p>
        <p class="codigo">${cupon.codigo}</p>
        <p class="codigo-instruccion">Presenta este código junto con tu DUI al canjear</p>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <p class="info-label">📅 Fecha de compra</p>
          <p class="info-value">${fechaCompra}</p>
        </div>
        <div class="info-item">
          <p class="info-label">⏰ Válido hasta</p>
          <p class="info-value">${fechaVencimiento}</p>
        </div>
      </div>

      ${oferta.otros_detalles ? `
      <div class="condiciones">
        <p class="condiciones-title">📋 Condiciones de uso</p>
        <p class="condiciones-text">${oferta.otros_detalles}</p>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <strong>La Cuponera</strong> — El Salvador<br>
      Cupón válido únicamente con presentación de DUI del titular
    </div>
  </div>

  <script>
    // Auto-print when page loads
    window.onload = () => {
      setTimeout(() => window.print(), 500)
    }
  </script>
</body>
</html>`

  const ventana = window.open('', '_blank')
  if (ventana) {
    ventana.document.write(html)
    ventana.document.close()
  } else {
    alert('Por favor permite las ventanas emergentes para descargar el cupón')
  }
}