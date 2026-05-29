import nodemailer from 'nodemailer';
import { Solicitud, Mantenimiento } from '@prisma/client';

// Crea el transporter de Nodemailer con las variables de entorno
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT ?? 587),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// Genera un código aleatorio de 6 dígitos para recuperación de contraseña
export function generarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Envía el código de verificación al correo personal del mecánico
export async function enviarCodigoEmail(correo: string, codigo: string): Promise<void> {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.warn(`[EMAIL DESACTIVADO] Código para ${correo}: ${codigo}`);
        return;
    }
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: correo,
        subject: 'Mecanic Company — Código de verificación',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1E3A5F;">Recuperación de contraseña</h2>
        <p>Tu código de verificación es:</p>
        <div style="font-size: 36px; font-weight: bold; color: #E67E22; letter-spacing: 8px; text-align: center; padding: 16px;">
          ${codigo}
        </div>
        <p style="color: #666; font-size: 13px;">Este código expira en 15 minutos. Si no solicitaste este código, ignora este mensaje.</p>
        <hr style="border-color: #eee;" />
        <p style="color: #999; font-size: 12px;">Mecanic Company</p>
      </div>
    `,
    });
}

// Envía el reporte técnico de mantenimiento al correo del cliente
export async function enviarReporteEmail(
    correoCliente: string,
    solicitud: Solicitud,
    mantenimiento: Mantenimiento
): Promise<void> {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.warn(`[EMAIL DESACTIVADO] Reporte para ${correoCliente} no enviado.`);
        return;
    }
    const totalCosto = (
        Number(mantenimiento.costoManoObra) + Number(mantenimiento.costoRepuestos)
    ).toFixed(2);

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: correoCliente,
        subject: `Mecanic Company — Reporte de servicio para ${solicitud.nombreCliente}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #333;">
        <h2 style="color: #1E3A5F; border-bottom: 2px solid #E67E22; padding-bottom: 8px;">
          Reporte Técnico de Servicio
        </h2>

        <h3 style="color: #E67E22;">Datos del Cliente</h3>
        <p><strong>Nombre:</strong> ${solicitud.nombreCliente}</p>
        <p><strong>Teléfono:</strong> ${solicitud.telefono}</p>

        <h3 style="color: #E67E22;">Vehículo</h3>
        <p><strong>Marca / Modelo:</strong> ${mantenimiento.marca} ${mantenimiento.modelo}</p>
        <p><strong>Placa:</strong> ${mantenimiento.placa}</p>
        <p><strong>Fecha de servicio:</strong> ${mantenimiento.fechaServicio}</p>

        <h3 style="color: #E67E22;">Diagnóstico y Trabajo Realizado</h3>
        <p><strong>Diagnóstico:</strong> ${mantenimiento.diagnostico}</p>
        <p><strong>Trabajo realizado:</strong> ${mantenimiento.trabajoRealizado}${mantenimiento.otroTrabajo ? ` — ${mantenimiento.otroTrabajo}` : ''}</p>
        <p><strong>Descripción:</strong> ${mantenimiento.diagnosticoRealizado}</p>
        <p><strong>Repuestos utilizados:</strong> ${mantenimiento.repuestosUtilizados}</p>
        <p><strong>Observaciones:</strong> ${mantenimiento.observaciones}</p>

        <h3 style="color: #E67E22;">Costos</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px; border: 1px solid #ddd;">Mano de obra</td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">$${Number(mantenimiento.costoManoObra).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #ddd;">Repuestos</td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">$${Number(mantenimiento.costoRepuestos).toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold; background: #f5f5f5;">
            <td style="padding: 6px; border: 1px solid #ddd;">Total</td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">$${totalCosto}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;"><strong>Mecánico:</strong> ${mantenimiento.mecanicoAsignado}</p>
        <p><strong>Período:</strong> ${mantenimiento.fechaInicio} — ${mantenimiento.fechaFinalizacion}</p>

        <hr style="border-color: #eee; margin-top: 24px;" />
        <p style="color: #999; font-size: 12px; text-align: center;">Mecanic Company — Tu vehículo en manos expertas</p>
      </div>
    `,
    });
}
