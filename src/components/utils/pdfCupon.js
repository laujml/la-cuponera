// src/utils/pdfCupon.js
/**
 * Generates a printable coupon HTML page and opens it in a new tab.
 * The user can then use browser Print → Save as PDF.
 * No external PDF library needed.
 */
export const generarPDFCupon = (cupon) => {
  const oferta = cupon.oferta || {}
  const ahorro = ((oferta.precio_regular || 0) - (cupon.precio_pagado || 0)).toFixed(2)

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Cupón - ${cupon.codigo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
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
    .header h1 { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; }
    .header p { font-size: 13px; opacity: 0.9; margin-top: 4px; }
    .descuento {
      font-size: 56px;
      font-weight: 900;
      line-height: 1;
      margin: 12px 0 4px;
    }
    .body { padding: 24px; }
    .oferta-titulo {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 6px;
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
      padding: 16px;
      margin: 16px 0;
    }
    .codigo-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
    .codigo {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 4px;
      color: #ea580c;
      font-family: 'Courier New', monospace;
      margin: 6px 0;
    }
    .precios {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px 0;
    }
    .precio-regular { font-size: 14px; color: #9ca3af; text-decoration: line-through; }
    .precio-oferta { font-size: 32px; font-weight: 900; color: #dc2626; }
    .ahorro { font-size: 13px; color: #16a34a; font-weight: 600; }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 16px;
    }
    .info-item { background: #f9fafb; border-radius: 8px; padding: 10px; }
    .info-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-value { font-size: 13px; font-weight: 600; color: #374151; margin-top: 2px; }
    .footer {
      background: #1f2937;
      color: #9ca3af;
      text-align: center;
      padding: 14px;
      font-size: 11px;
    }
    .footer strong { color: white; }
    @media print {
      body { background: white; padding: 0; }
      .cupon { box-shadow: none; width: 100%; border-radius: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="cupon">

    <div class="header">
      <p>LA CUPONERA</p>
      <div class="descuento">${oferta.porcentaje_descuento || ''}% OFF</div>
      <p>Cupón de descuento</p>
    </div>

    <div class="body">
      <p class="oferta-titulo">${oferta.titulo || 'Oferta'}</p>
      <p class="empresa">📍 ${oferta.empresa_nombre || ''}</p>

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
        <p style="font-size:11px;color:#9ca3af;">Presenta este código al momento de canjear</p>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <p class="info-label">Fecha de compra</p>
          <p class="info-value">${new Date(cupon.fecha_compra).toLocaleDateString('es-ES')}</p>
        </div>
        <div class="info-item">
          <p class="info-label">Válido hasta</p>
          <p class="info-value">${new Date(cupon.fecha_vencimiento).toLocaleDateString('es-ES')}</p>
        </div>
      </div>

      ${oferta.otros_detalles ? `
      <div style="margin-top:14px;background:#f9fafb;border-radius:8px;padding:10px;">
        <p style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Condiciones</p>
        <p style="font-size:12px;color:#4b5563;">${oferta.otros_detalles}</p>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <strong>La Cuponera</strong> — Presenta tu DUI junto a este cupón · lacuponera.com
    </div>
  </div>

  <script>
    window.onload = () => window.print()
  </script>
</body>
</html>`

  const ventana = window.open('', '_blank')
  ventana.document.write(html)
  ventana.document.close()
}