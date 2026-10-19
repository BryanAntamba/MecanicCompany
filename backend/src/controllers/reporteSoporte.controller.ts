import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { enviarCorreo } from '../lib/mailer';

// POST /api/reportes-soporte - Cliente envía un reporte de soporte
export async function crearReporteSoporte(req: Request, res: Response): Promise<void> {
  const {
    nombre,
    segundoNombre,
    apellido,
    segundoApellido,
    correo,
    tipoAsunto,
    descripcion,
  } = req.body;

  // Validaciones básicas
  if (!nombre || !apellido || !correo || !tipoAsunto || !descripcion) {
    res.status(400).json({ message: 'Faltan campos requeridos' });
    return;
  }

  const correoNorm = correo.trim().toLowerCase();

  try {
    console.log(`[crearReporteSoporte] 📧 Nuevo reporte de soporte de ${correoNorm}`);

    // Guardar en BD
    const reporte = await prisma.reporteSoporte.create({
      data: {
        nombre,
        segundoNombre: segundoNombre ?? '',
        apellido,
        segundoApellido: segundoApellido ?? '',
        correo: correoNorm,
        tipoAsunto,
        descripcion,
        estado: 'Pendiente',
      },
    });

    console.log(`[crearReporteSoporte] ✅ Reporte guardado: ${reporte.id}`);

    // Enviar email al cliente (confirmación)
    const asuntoCliente = `Reporte de Soporte Recibido - MecanicCompany`;
    const htmlCliente = `
      <h2>¡Gracias por tu reporte!</h2>
      <p>Hola <strong>${nombre} ${apellido}</strong>,</p>
      <p>Tu reporte de soporte ha sido recibido correctamente. Nuestro equipo lo revisará pronto.</p>
      
      <h3>Detalles de tu reporte:</h3>
      <ul>
        <li><strong>Tipo de Asunto:</strong> ${tipoAsunto}</li>
        <li><strong>Descripción:</strong> ${descripcion}</li>
        <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
      </ul>
      
      <p>Te contactaremos pronto a través de este correo si necesitamos más información.</p>
      <p>Saludos,<br><strong>Equipo de MecanicCompany</strong></p>
    `;

    await enviarCorreo({
      para: correoNorm,
      asunto: asuntoCliente,
      html: htmlCliente,
    });

    console.log(`[crearReporteSoporte] 📨 Email confirmación enviado a ${correoNorm}`);

    // Enviar email al soporte interno (cabascangosteven63@gmail.com)
    const emailSoporte = process.env.SOPORTE_EMAIL || 'cabascangosteven63@gmail.com';
    const asuntoSoporte = `[NUEVO REPORTE] ${tipoAsunto} - ${nombre} ${apellido}`;
    const htmlSoporte = `
      <h2>Nuevo Reporte de Soporte</h2>
      <p><strong>Cliente:</strong> ${nombre} ${segundoNombre || ''} ${apellido} ${segundoApellido || ''}</p>
      <p><strong>Correo:</strong> ${correoNorm}</p>
      <p><strong>Tipo de Asunto:</strong> ${tipoAsunto}</p>
      <p><strong>Descripción:</strong></p>
      <p>${descripcion}</p>
      <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
      <p><strong>ID Reporte:</strong> ${reporte.id}</p>
      
      <hr>
      <p>Este es un email automático. Por favor, responde a ${correoNorm} para contactar al cliente.</p>
    `;

    await enviarCorreo({
      para: emailSoporte,
      asunto: asuntoSoporte,
      html: htmlSoporte,
    });

    console.log(`[crearReporteSoporte] 📨 Email al soporte enviado a ${emailSoporte}`);

    // Responder al cliente
    res.status(201).json({
      message: 'Reporte enviado correctamente',
      id: reporte.id,
    });
  } catch (err: any) {
    console.error('[crearReporteSoporte] ❌ Error:', err?.message);
    res.status(500).json({ message: 'Error al enviar el reporte' });
  }
}

// GET /api/reportes-soporte - Admin obtiene todos los reportes (requiere autenticación)
export async function listarReportes(_req: Request, res: Response): Promise<void> {
  try {
    const reportes = await prisma.reporteSoporte.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(reportes);
  } catch (err: any) {
    console.error('[listarReportes]', err?.message);
    res.status(500).json({ message: 'Error al obtener los reportes' });
  }
}
