// generarPDFAutorizacion.ts
// Genera el PDF de autorización de mantenimiento con expo-print

import * as Print from 'expo-print';
import * as Sharing from './sharing';
import { Platform, Image } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

interface DatosSolicitud {
  id: string;
  nombreCliente: string;
  telefono: string;
  correo: string;
  marca: string;
  modelo: string;
  anio: string;
  placa: string;
  kilometraje: string;
  tipoServicio: string;
  descripcion: string;
  fechaCita?: string;
  horaCita?: string;
  provincia?: string;
  ubicacionMecanica?: string;
}

// Logo en base64 - Se carga dinámicamente según la plataforma
let LOGO_BASE64: string = '';

// Función para obtener el logo en base64
async function getLogoBase64(): Promise<string> {
  if (LOGO_BASE64) {
    return LOGO_BASE64; // Retornar si ya está cargado
  }

  try {
    // Importar la imagen como require (funciona en ambas plataformas)
    const logoSource = require('../assets/images/iconoTransparente.png');
    
    // Obtener el URI del asset
    const resolvedAsset = Image.resolveAssetSource(logoSource);
    let imageUri = resolvedAsset?.uri || String(logoSource);
    
    // En mobile, si es un file:// URI, convertirlo a base64 para que funcione en expo-print
    if (Platform.OS !== 'web' && imageUri.startsWith('file://')) {
      try {
        const base64Data = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        LOGO_BASE64 = `data:image/png;base64,${base64Data}`;
      } catch (fsError) {
        console.warn('[PDF] Error al leer archivo, usando URI directo:', fsError);
        LOGO_BASE64 = imageUri;
      }
    } else if (imageUri.startsWith('data:')) {
      // Ya es un data URL
      LOGO_BASE64 = imageUri;
    } else {
      // Es una ruta relativa, absoluta o web URL
      LOGO_BASE64 = imageUri;
    }
  } catch (error) {
    console.warn('[PDF] Error al cargar logo:', error);
    // Usar un pixel transparente como fallback
    LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  return LOGO_BASE64;
}

export async function generarPDFAutorizacion(solicitud: DatosSolicitud): Promise<string> {
  // Cargar logo en base64
  const logoBase64 = await getLogoBase64();

  const fechaEmision = new Date().toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autorización de Mantenimiento</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #ffffff;
            color: #000000;
            padding: 30px;
            line-height: 1.5;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 3px solid #000000;
        }

        .header {
            background-color: #000000;
            color: white;
            padding: 25px;
            text-align: center;
            border-bottom: 3px solid #000000;
        }

        .logo {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 3px;
            margin-bottom: 8px;
        }

        .header h1 {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 6px;
            letter-spacing: 1px;
        }

        .header p {
            font-size: 12px;
            opacity: 0.9;
        }

        .doc-info {
            display: flex;
            justify-content: space-between;
            padding: 15px 25px;
            background-color: #f5f5f5;
            border-bottom: 2px solid #000000;
        }

        .doc-info-item {
            text-align: center;
        }

        .doc-info-label {
            font-size: 10px;
            color: #666666;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 3px;
        }

        .doc-info-value {
            font-size: 13px;
            color: #000000;
            font-weight: bold;
        }

        .content {
            padding: 25px;
        }

        .section {
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 2px solid #000000;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }

        .info-item {
            background-color: #f5f5f5;
            padding: 10px;
            border: 1px solid #cccccc;
        }

        .info-label {
            font-size: 10px;
            color: #666666;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 3px;
        }

        .info-value {
            font-size: 12px;
            color: #000000;
            font-weight: 600;
        }

        .service-description {
            background-color: #f5f5f5;
            padding: 12px;
            border: 1px solid #cccccc;
            margin-top: 8px;
        }

        .service-description p {
            font-size: 11px;
            color: #333333;
            line-height: 1.6;
        }

        .authorization {
            margin-top: 25px;
            padding: 20px;
            background-color: #ffffff;
            border: 2px solid #000000;
        }

        .authorization-title {
            font-size: 14px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 12px;
            text-align: center;
            text-transform: uppercase;
        }

        .authorization-text {
            font-size: 11px;
            color: #000000;
            line-height: 1.7;
            margin-bottom: 20px;
            text-align: justify;
        }

        .terms-section {
            background-color: #f5f5f5;
            border: 2px solid #000000;
            padding: 15px;
            margin-top: 15px;
        }

        .term-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 10px;
        }

        .term-number {
            min-width: 20px;
            height: 20px;
            background-color: #000000;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 11px;
            margin-right: 10px;
        }

        .term-text {
            font-size: 11px;
            color: #000000;
            line-height: 1.6;
        }

        .alert-box {
            background-color: #ffffff;
            border: 2px solid #000000;
            padding: 12px;
            margin-top: 15px;
            margin-bottom: 20px;
        }

        .alert-box p {
            font-size: 10px;
            color: #000000;
            line-height: 1.5;
        }

        .signature-section {
            background-color: #f5f5f5;
            border: 2px solid #000000;
            padding: 20px;
            margin-top: 15px;
        }

        .signature-section-title {
            text-align: center;
            margin-bottom: 15px;
        }

        .signature-section-title-main {
            font-size: 13px;
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            margin-bottom: 6px;
        }

        .signature-section-subtitle {
            font-size: 10px;
            color: #666666;
        }

        .signature-line {
            border-top: 2px solid #000000;
            margin: 80px auto 12px auto; /* Aumentado a 80px para más separación */
            max-width: 350px;
        }

        .signature-fields {
            text-align: center;
        }

        .signature-field {
            font-size: 11px;
            color: #333333;
            margin-bottom: 6px;
        }

        .footer {
            background-color: #000000;
            color: white;
            padding: 15px 25px;
            border-top: 3px solid #000000;
            text-align: center;
        }

        .footer p {
            font-size: 9px;
            margin-bottom: 6px;
        }

        .footer-contact {
            font-size: 10px;
            font-weight: bold;
        }

        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px;">
                <img src="${logoBase64}" alt="Logo" style="height: 50px; width: auto; filter: brightness(0) invert(1);" />
                <div class="logo">MECANYC COMPANY</div>
            </div>
            <h1>AUTORIZACIÓN DE MANTENIMIENTO Y REPARACIÓN</h1>
        </div>

        <!-- Document Info -->
        <div class="doc-info">
            <div class="doc-info-item">
                <div class="doc-info-label">Nº Solicitud</div>
                <div class="doc-info-value">NUM-${solicitud.id}</div>
            </div>
            <div class="doc-info-item">
                <div class="doc-info-label">Fecha Emisión</div>
                <div class="doc-info-value">${fechaEmision}</div>
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Client Information -->
            <div class="section">
                <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Nombre Completo</div>
                        <div class="info-value">${solicitud.nombreCliente}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Teléfono</div>
                        <div class="info-value">${solicitud.telefono}</div>
                    </div>
                    <div class="info-item" style="grid-column: span 2;">
                        <div class="info-label">Correo Electrónico</div>
                        <div class="info-value">${solicitud.correo}</div>
                    </div>
                </div>
            </div>

            <!-- Vehicle Information -->
            <div class="section">
                <div class="section-title">INFORMACIÓN DEL VEHÍCULO</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Marca y Modelo</div>
                        <div class="info-value">${solicitud.marca} ${solicitud.modelo}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Año</div>
                        <div class="info-value">${solicitud.anio}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Placa</div>
                        <div class="info-value">${solicitud.placa}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Kilometraje</div>
                        <div class="info-value">${solicitud.kilometraje} km</div>
                    </div>
                </div>
            </div>

            <!-- Appointment Information -->
            <div class="section">
                <div class="section-title">INFORMACIÓN DE LA CITA</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Fecha de la Cita</div>
                        <div class="info-value">${solicitud.fechaCita || 'Por definir'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Hora de la Cita</div>
                        <div class="info-value">${solicitud.horaCita || 'Por definir'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Provincia</div>
                        <div class="info-value">${solicitud.provincia || 'Por definir'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Ubicación de la Mecánica</div>
                        <div class="info-value">${solicitud.ubicacionMecanica || 'Por definir'}</div>
                    </div>
                </div>
            </div>

            <!-- Service Details -->
            <div class="section">
                <div class="section-title">SOLICITUD DE SERVICIO</div>
                <div class="info-grid">
                    <div class="info-item" style="grid-column: span 2;">
                        <div class="info-label">Tipo de Servicio Solicitado</div>
                        <div class="info-value">${solicitud.tipoServicio}</div>
                    </div>
                </div>

                <div class="service-description">
                    <div class="info-label">Descripción del Problema / Solicitud del Cliente</div>
                    <p>${solicitud.descripcion}</p>
                </div>
            </div>

            <!-- Info Box -->
            <div class="alert-box">
                <p>
                    <strong>NOTA IMPORTANTE:</strong> Este documento autoriza al taller a realizar los 
                    trabajos de mantenimiento y reparación necesarios según el criterio técnico profesional. 
                    El costo final será calculado en base a los repuestos utilizados y la mano de obra empleada, 
                    y será informado al cliente una vez completado el servicio.
                </p>
            </div>

            <!-- Authorization Section -->
            <div class="authorization">
                <div class="authorization-title">AUTORIZACIÓN DEL CLIENTE</div>
                <p class="authorization-text">
                    Yo, <strong>${solicitud.nombreCliente}</strong>, autorizo expresamente a 
                    <strong>MECANYC COMPANY</strong> para realizar los trabajos de mantenimiento y reparación 
                    que el personal técnico considere necesarios en mi vehículo 
                    <strong>${solicitud.marca} ${solicitud.modelo}, Placa ${solicitud.placa}</strong>, según la evaluación profesional que se 
                    realice durante la inspección.
                    <br><br>
                    Declaro que he sido informado sobre el tipo de servicio solicitado y comprendo que el 
                    personal técnico procederá a realizar las reparaciones necesarias según su criterio 
                    profesional. Acepto que el costo final será determinado por los repuestos y mano de obra 
                    realmente utilizados durante el servicio.
                    <br><br>
                    Autorizo al taller a realizar pruebas de funcionamiento y trabajos necesarios para 
                    garantizar el correcto funcionamiento del vehículo. Me comprometo a pagar por los 
                    servicios realizados una vez finalizados los trabajos y me sea presentado el comprobante 
                    correspondiente.
                </p>
            </div>

            <!-- Terms and Conditions -->
            <div class="section" style="margin-top: 25px;">
                <div class="section-title">TÉRMINOS Y CONDICIONES DEL SERVICIO</div>
                
                <div class="terms-section">
                    <div class="term-item">
                        <div class="term-number">1</div>
                        <div class="term-text">
                            <strong>Plazo de Retiro del Vehículo:</strong> El cliente cuenta con un plazo máximo 
                            de <strong>5 (cinco) días hábiles</strong> a partir de la fecha de notificación de 
                            finalización del servicio para retirar el vehículo del taller.
                        </div>
                    </div>

                    <div class="term-item">
                        <div class="term-number">2</div>
                        <div class="term-text">
                            <strong>Pago del Servicio:</strong> El cliente deberá cancelar el monto total del 
                            servicio al momento de retirar el vehículo. No se entregará el vehículo sin el pago 
                            completo de los servicios prestados y repuestos utilizados.
                        </div>
                    </div>

                    <div class="term-item">
                        <div class="term-number">3</div>
                        <div class="term-text">
                            <strong>Vehículos No Retirados:</strong> Si transcurrido el plazo de 5 días hábiles 
                            el vehículo no ha sido retirado, el taller cobrará una tarifa de 
                            <strong>custodia de $10.00 (diez dólares) por día</strong>.
                        </div>
                    </div>

                    <div class="term-item" style="margin-bottom: 0;">
                        <div class="term-number">4</div>
                        <div class="term-text">
                            <strong>Abandono del Vehículo:</strong> Después de <strong>30 (treinta) días corridos</strong>, 
                            el taller podrá iniciar trámites legales para declarar el vehículo como abandonado.
                        </div>
                    </div>
                </div>

                <!-- Warning Box -->
                <div class="alert-box">
                    <p>
                        <strong>ADVERTENCIA IMPORTANTE:</strong> El incumplimiento de los plazos establecidos 
                        generará costos adicionales de custodia. Después de 30 días sin respuesta, se iniciarán 
                        procedimientos legales. Se recomienda mantener comunicación con el taller.
                    </p>
                </div>

                <!-- Signature Section -->
                <div class="signature-section">
                    <div class="signature-section-title">
                        <div class="signature-section-title-main">FIRMA DEL CLIENTE</div>
                        <div class="signature-section-subtitle">
                            Al firmar, acepto todos los términos y condiciones establecidos
                        </div>
                    </div>
                    
                    <div class="signature-line"></div>
                    
                    <div class="signature-fields">
                        <div class="signature-field">
                            <strong>Cédula:</strong> _____________________________________________
                        </div>
                        <div class="signature-field">
                            <strong>Fecha:</strong> ______ / ______ / __________
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Este documento autoriza la realización de trabajos de mantenimiento según criterio técnico profesional.</p>
            <p>El cliente será informado del costo total al finalizar el servicio.</p>
        </div>
    </div>
</body>
</html>
  `;

  // Generar PDF según la plataforma
  if (Platform.OS === 'web') {
    // En web, usar jsPDF para generar y descargar el PDF directamente
    return new Promise(async (resolve, reject) => {
      try {
        // Cargar jsPDF desde CDN si no está cargado
        if (!(window as any).jspdf) {
          await new Promise<void>((resolveScript, rejectScript) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => resolveScript();
            script.onerror = () => rejectScript(new Error('No se pudo cargar jsPDF'));
            document.head.appendChild(script);
          });
        }

        const { jsPDF } = (window as any).jspdf;

        // Crear PDF
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        let currentY = 20;

        // Header - Fondo negro
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, pageWidth, 35, 'F');

        // Logo y título en blanco
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('MECANYC COMPANY', pageWidth / 2, 14, { align: 'center' });

        doc.setFontSize(11);
        doc.text('AUTORIZACIÓN DE MANTENIMIENTO Y REPARACIÓN', pageWidth / 2, 25, { align: 'center' });

        currentY = 45;

        // Información del documento - Fondo gris
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 10, 'F');
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`Nº Solicitud: NUM-${solicitud.id}`, margin + 3, currentY);
        doc.text(`Fecha Emisión: ${fechaEmision}`, pageWidth - margin - 3, currentY, { align: 'right' });

        currentY += 12;

        // INFORMACIÓN DEL CLIENTE
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMACIÓN DEL CLIENTE', margin, currentY);
        currentY += 1;
        doc.setLineWidth(0.8);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 6;

        // Campos del cliente
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Nombre Completo', margin, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(solicitud.nombreCliente, margin + 35, currentY);
        currentY += 5;

        doc.setFont('helvetica', 'normal');
        doc.text('Teléfono', margin, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(solicitud.telefono, margin + 35, currentY);

        doc.setFont('helvetica', 'normal');
        doc.text('Correo Electrónico', pageWidth / 2, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(solicitud.correo, pageWidth / 2 + 35, currentY);
        currentY += 10;

        // INFORMACIÓN DEL VEHÍCULO
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMACIÓN DEL VEHÍCULO', margin, currentY);
        currentY += 1;
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 6;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Marca y Modelo', margin, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(`${solicitud.marca} ${solicitud.modelo}`, margin + 35, currentY);

        doc.setFont('helvetica', 'normal');
        doc.text('Año', pageWidth / 2, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(solicitud.anio, pageWidth / 2 + 35, currentY);
        currentY += 5;

        doc.setFont('helvetica', 'normal');
        doc.text('Placa', margin, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(solicitud.placa, margin + 35, currentY);

        doc.setFont('helvetica', 'normal');
        doc.text('Kilometraje', pageWidth / 2, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(`${solicitud.kilometraje} km`, pageWidth / 2 + 35, currentY);
        currentY += 10;

        // INFORMACIÓN DE LA CITA
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMACIÓN DE LA CITA', margin, currentY);
        currentY += 1;
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 6;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Fecha de la Cita', margin, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(solicitud.fechaCita || 'Por definir', margin + 35, currentY);

        doc.setFont('helvetica', 'normal');
        doc.text('Hora de la Cita', pageWidth / 2, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(solicitud.horaCita || 'Por definir', pageWidth / 2 + 35, currentY);
        currentY += 5;

        doc.setFont('helvetica', 'normal');
        doc.text('Provincia', margin, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(solicitud.provincia || 'Por definir', margin + 35, currentY);
        currentY += 5;

        doc.setFont('helvetica', 'normal');
        doc.text('Ubicación de la Mecánica', margin, currentY);
        doc.setFont('helvetica', 'bold');
        const ubicacion = solicitud.ubicacionMecanica || 'Por definir';
        const splitUbicacion = doc.splitTextToSize(ubicacion, pageWidth - margin - 60);
        doc.text(splitUbicacion, margin + 45, currentY);
        currentY += (splitUbicacion.length * 4) + 6;

        // SOLICITUD DE SERVICIO
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('SOLICITUD DE SERVICIO', margin, currentY);
        currentY += 1;
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 6;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Tipo de Servicio Solicitado', margin, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(solicitud.tipoServicio, margin + 50, currentY);
        currentY += 7;

        doc.setFont('helvetica', 'normal');
        doc.text('Descripción del Problema / Solicitud del Cliente', margin, currentY);
        currentY += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        const splitDescripcion = doc.splitTextToSize(solicitud.descripcion, pageWidth - 2 * margin);
        doc.text(splitDescripcion, margin, currentY);
        currentY += (splitDescripcion.length * 3.5) + 6;

        // NOTA IMPORTANTE
        doc.setFillColor(255, 250, 205);
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.rect(margin, currentY, pageWidth - 2 * margin, 18, 'FD');
        currentY += 4;

        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('NOTA IMPORTANTE:', margin + 2, currentY);
        currentY += 3.5;
        doc.setFont('helvetica', 'normal');
        const notaTexto = 'Este documento autoriza al taller a realizar los trabajos de mantenimiento y reparación necesarios según el criterio técnico profesional. El costo final será calculado en base a los repuestos utilizados y la mano de obra empleada, y será informado al cliente una vez completado el servicio.';
        const splitNota = doc.splitTextToSize(notaTexto, pageWidth - 2 * margin - 4);
        doc.text(splitNota, margin + 2, currentY);
        currentY += 22;

        // Verificar si necesitamos nueva página
        if (currentY > 200) {
          doc.addPage();
          currentY = 20;
        }

        // AUTORIZACIÓN DEL CLIENTE
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, currentY, pageWidth - 2 * margin, 50, 'F');
        currentY += 5;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('AUTORIZACIÓN DEL CLIENTE', margin + 2, currentY);
        currentY += 5;

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        const textoAutorizacion1 = `Yo, ${solicitud.nombreCliente}, autorizo expresamente a MECANYC COMPANY para realizar los trabajos de mantenimiento y reparación que el personal técnico considere necesarios en mi vehículo ${solicitud.marca} ${solicitud.modelo}, Placa ${solicitud.placa}, según la evaluación profesional que se realice durante la inspección.`;
        const splitAut1 = doc.splitTextToSize(textoAutorizacion1, pageWidth - 2 * margin - 4);
        doc.text(splitAut1, margin + 2, currentY);
        currentY += (splitAut1.length * 3.5) + 3;

        const textoAutorizacion2 = 'Declaro que he sido informado sobre el tipo de servicio solicitado y comprendo que el personal técnico procederá a realizar las reparaciones necesarias según su criterio profesional. Acepto que el costo final será determinado por los repuestos y mano de obra realmente utilizados durante el servicio.';
        const splitAut2 = doc.splitTextToSize(textoAutorizacion2, pageWidth - 2 * margin - 4);
        doc.text(splitAut2, margin + 2, currentY);
        currentY += (splitAut2.length * 3.5) + 3;

        const textoAutorizacion3 = 'Autorizo al taller a realizar pruebas de funcionamiento y trabajos necesarios para garantizar el correcto funcionamiento del vehículo. Me comprometo a pagar por los servicios realizados una vez finalizados los trabajos y me sea presentado el comprobante correspondiente.';
        const splitAut3 = doc.splitTextToSize(textoAutorizacion3, pageWidth - 2 * margin - 4);
        doc.text(splitAut3, margin + 2, currentY);
        currentY += (splitAut3.length * 3.5) + 8;

        // TÉRMINOS Y CONDICIONES
        if (currentY > 220) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('TÉRMINOS Y CONDICIONES DEL SERVICIO', margin, currentY);
        currentY += 1;
        doc.setLineWidth(0.8);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 6;

        // Término 1
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('1.', margin, currentY);
        doc.text('Plazo de Retiro del Vehículo:', margin + 4, currentY);
        currentY += 3.5;
        doc.setFont('helvetica', 'normal');
        const termino1 = 'El cliente cuenta con un plazo máximo de 5 (cinco) días hábiles a partir de la fecha de notificación de finalización del servicio para retirar el vehículo del taller.';
        const splitTerm1 = doc.splitTextToSize(termino1, pageWidth - 2 * margin - 4);
        doc.text(splitTerm1, margin + 4, currentY);
        currentY += (splitTerm1.length * 3.5) + 4;

        // Término 2
        doc.setFont('helvetica', 'bold');
        doc.text('2.', margin, currentY);
        doc.text('Pago del Servicio:', margin + 4, currentY);
        currentY += 3.5;
        doc.setFont('helvetica', 'normal');
        const termino2 = 'El cliente deberá cancelar el monto total del servicio al momento de retirar el vehículo. No se entregará el vehículo sin el pago completo de los servicios prestados y repuestos utilizados.';
        const splitTerm2 = doc.splitTextToSize(termino2, pageWidth - 2 * margin - 4);
        doc.text(splitTerm2, margin + 4, currentY);
        currentY += (splitTerm2.length * 3.5) + 4;

        // Término 3
        doc.setFont('helvetica', 'bold');
        doc.text('3.', margin, currentY);
        doc.text('Vehículos No Retirados:', margin + 4, currentY);
        currentY += 3.5;
        doc.setFont('helvetica', 'normal');
        const termino3 = 'Si transcurrido el plazo de 5 días hábiles el vehículo no ha sido retirado, el taller cobrará una tarifa de custodia de $10.00 (diez dólares) por día.';
        const splitTerm3 = doc.splitTextToSize(termino3, pageWidth - 2 * margin - 4);
        doc.text(splitTerm3, margin + 4, currentY);
        currentY += (splitTerm3.length * 3.5) + 4;

        // Término 4
        doc.setFont('helvetica', 'bold');
        doc.text('4.', margin, currentY);
        doc.text('Abandono del Vehículo:', margin + 4, currentY);
        currentY += 3.5;
        doc.setFont('helvetica', 'normal');
        const termino4 = 'Después de 30 (treinta) días corridos, el taller podrá iniciar trámites legales para declarar el vehículo como abandonado.';
        const splitTerm4 = doc.splitTextToSize(termino4, pageWidth - 2 * margin - 4);
        doc.text(splitTerm4, margin + 4, currentY);
        currentY += (splitTerm4.length * 3.5) + 6;

        // ADVERTENCIA
        doc.setFillColor(255, 250, 205);
        doc.rect(margin, currentY, pageWidth - 2 * margin, 15, 'FD');
        currentY += 4;

        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('ADVERTENCIA IMPORTANTE:', margin + 2, currentY);
        currentY += 3.5;
        doc.setFont('helvetica', 'normal');
        const advertenciaTexto = 'El incumplimiento de los plazos establecidos generará costos adicionales de custodia. Después de 30 días sin respuesta, se iniciarán procedimientos legales. Se recomienda mantener comunicación con el taller.';
        const splitAdvertencia = doc.splitTextToSize(advertenciaTexto, pageWidth - 2 * margin - 4);
        doc.text(splitAdvertencia, margin + 2, currentY);
        currentY += 18;

        // FIRMA - con más espacio arriba
        currentY += 8; // Más espacio antes de la firma
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('FIRMA DEL CLIENTE', pageWidth / 2, currentY, { align: 'center' });
        currentY += 2;
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('Al firmar, acepto todos los términos y condiciones establecidos', pageWidth / 2, currentY, { align: 'center' });
        currentY += 8;

        // Línea de firma
        doc.setLineWidth(0.5);
        doc.line(margin + 40, currentY, pageWidth - margin - 40, currentY);
        currentY += 5;

        // Campos de firma (sin campo Nombre)
        doc.setFontSize(7);
        doc.text('Cédula: _____________________________________________', margin + 10, currentY);
        currentY += 5;
        doc.text('Fecha: ______ / ______ / __________', margin + 10, currentY);

        // Footer
        currentY = pageHeight - 15;
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text('Este documento autoriza la realización de trabajos de mantenimiento según criterio técnico profesional.', pageWidth / 2, currentY, { align: 'center' });
        currentY += 3;
        doc.text('El cliente será informado del costo total al finalizar el servicio.', pageWidth / 2, currentY, { align: 'center' });

        // Descargar
        const fileName = `Autorizacion_${solicitud.nombreCliente.replace(/\s+/g, '_')}_${solicitud.id}.pdf`;
        doc.save(fileName);

        resolve('PDF generado y descargado exitosamente');
      } catch (error) {
        console.error('Error al generar PDF en web:', error);
        reject(error);
      }
    });
  } else {
    // En móvil, usar expo-print y compartir
    const { uri } = await Print.printToFileAsync({ html });
    
    // Compartir el PDF
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Autorización de Mantenimiento',
      UTI: 'com.adobe.pdf'
    });
    
    return uri;
  }
}
