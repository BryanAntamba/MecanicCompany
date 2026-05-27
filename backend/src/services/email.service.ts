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

// Envía el código de verificación al correo indicado.
// contexto: 'verificacion' (cliente al enviar solicitud) | 'recuperacion' (mecánico al recuperar contraseña)
export async function enviarCodigoEmail(
    correo: string,
    codigo: string,
    contexto: 'verificacion' | 'recuperacion' = 'verificacion',
): Promise<void> {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.warn(`[EMAIL DESACTIVADO] Código para ${correo}: ${codigo}`);
        return;
    }

    const esRecuperacion = contexto === 'recuperacion';
    const titulo  = esRecuperacion ? 'Recuperación de contraseña'   : 'Código de verificación';
    const mensaje = esRecuperacion
        ? 'Recibimos una solicitud para restablecer la contraseña asociada a tu cuenta. Ingresa el siguiente código para continuar con el proceso:'
        : 'Para confirmar tu identidad y completar el envío de tu solicitud de servicio, ingresa el siguiente código de verificación:';

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: correo,
        subject: `Mecanic Company — ${titulo}`,
        html: `
      <!DOCTYPE html>
      <html lang="es">
      <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0"
                style="background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">

                <!-- Cabecera -->
                <tr>
                  <td style="background-color:#111111;padding:28px 40px;">
                    <p style="margin:0;font-size:20px;font-weight:bold;color:#ffffff;letter-spacing:1px;">
                      MECANIC COMPANY
                    </p>
                    <p style="margin:4px 0 0;font-size:12px;color:#aaaaaa;letter-spacing:2px;text-transform:uppercase;">
                      ${titulo}
                    </p>
                  </td>
                </tr>

                <!-- Cuerpo -->
                <tr>
                  <td style="padding:36px 40px 28px;">
                    <p style="margin:0 0 16px;font-size:15px;color:#333333;line-height:1.6;">
                      ${mensaje}
                    </p>

                    <!-- Código -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding:24px 0;">
                          <div style="display:inline-block;background-color:#f7f7f7;border:1px solid #dddddd;
                                      border-radius:6px;padding:18px 36px;">
                            <span style="font-size:40px;font-weight:bold;color:#111111;
                                         letter-spacing:12px;font-family:'Courier New',monospace;">
                              ${codigo}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0;font-size:13px;color:#777777;line-height:1.6;">
                      Este código es válido por <strong style="color:#333333;">15 minutos</strong>.
                      Si no realizaste esta solicitud, puedes ignorar este mensaje con total seguridad.
                    </p>
                  </td>
                </tr>

                <!-- Pie -->
                <tr>
                  <td style="background-color:#f7f7f7;border-top:1px solid #e0e0e0;padding:18px 40px;">
                    <p style="margin:0;font-size:12px;color:#999999;">
                      © ${new Date().getFullYear()} Mecanic Company. Este es un correo automático, por favor no respondas a este mensaje.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
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

    const fila = (label: string, valor: string) =>
        `<tr>
          <td style="padding:10px 14px;font-size:13px;color:#555555;background:#fafafa;border-bottom:1px solid #eeeeee;width:42%;">${label}</td>
          <td style="padding:10px 14px;font-size:13px;color:#111111;border-bottom:1px solid #eeeeee;">${valor}</td>
        </tr>`;

    const seccion = (titulo: string, filas: string) =>
        `<tr>
          <td colspan="2" style="padding:18px 14px 6px;font-size:11px;font-weight:bold;color:#888888;letter-spacing:1.5px;text-transform:uppercase;border-bottom:2px solid #111111;">
            ${titulo}
          </td>
        </tr>${filas}`;

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: correoCliente,
        subject: `Mecanic Company — Reporte de servicio · ${solicitud.nombreCliente}`,
        html: `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0"
          style="background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">

          <!-- Cabecera -->
          <tr>
            <td style="background-color:#111111;padding:28px 40px;">
              <p style="margin:0;font-size:20px;font-weight:bold;color:#ffffff;letter-spacing:1px;">
                MECANIC COMPANY
              </p>
              <p style="margin:4px 0 0;font-size:12px;color:#aaaaaa;letter-spacing:2px;text-transform:uppercase;">
                Reporte Técnico de Servicio
              </p>
            </td>
          </tr>

          <!-- Saludo -->
          <tr>
            <td style="padding:28px 40px 8px;">
              <p style="margin:0;font-size:15px;color:#333333;line-height:1.7;">
                Estimado/a <strong style="color:#111111;">${solicitud.nombreCliente}</strong>,
              </p>
              <p style="margin:10px 0 0;font-size:14px;color:#555555;line-height:1.7;">
                A continuación encontrará el reporte completo del servicio técnico realizado a su vehículo en nuestras instalaciones.
              </p>
            </td>
          </tr>

          <!-- Tabla de datos -->
          <tr>
            <td style="padding:20px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border-radius:6px;overflow:hidden;border:1px solid #e0e0e0;">
                ${seccion('Cliente', `
                  ${fila('Nombre', solicitud.nombreCliente)}
                  ${fila('Teléfono', solicitud.telefono)}
                  ${fila('Correo', solicitud.correoCliente)}
                `)}
                ${seccion('Vehículo', `
                  ${fila('Marca', mantenimiento.marca)}
                  ${fila('Modelo', mantenimiento.modelo)}
                  ${fila('Placa', mantenimiento.placa)}
                  ${fila('Año', solicitud.anio)}
                  ${fila('Kilometraje', solicitud.kilometraje + ' km')}
                `)}
                ${seccion('Servicio', `
                  ${fila('Tipo de servicio', solicitud.tipoServicio + (solicitud.otroServicio ? ` — ${solicitud.otroServicio}` : ''))}
                  ${fila('Fecha de servicio', mantenimiento.fechaServicio)}
                  ${fila('Inicio', mantenimiento.fechaInicio)}
                  ${fila('Finalización', mantenimiento.fechaFinalizacion)}
                  ${fila('Mecánico', mantenimiento.mecanicoAsignado)}
                `)}
                ${seccion('Trabajo Realizado', `
                  ${fila('Diagnóstico previo', mantenimiento.diagnostico)}
                  ${fila('Trabajo realizado', mantenimiento.trabajoRealizado + (mantenimiento.otroTrabajo ? ` — ${mantenimiento.otroTrabajo}` : ''))}
                  ${fila('Descripción técnica', mantenimiento.diagnosticoRealizado)}
                  ${fila('Repuestos utilizados', mantenimiento.repuestosUtilizados)}
                  ${mantenimiento.observaciones ? fila('Observaciones', mantenimiento.observaciones) : ''}
                `)}
              </table>
            </td>
          </tr>

          <!-- Costos -->
          <tr>
            <td style="padding:20px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border-radius:6px;overflow:hidden;border:1px solid #e0e0e0;">
                <tr>
                  <td colspan="2" style="padding:12px 14px 6px;font-size:11px;font-weight:bold;color:#888888;letter-spacing:1.5px;text-transform:uppercase;border-bottom:2px solid #111111;">
                    Resumen de Costos
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:13px;color:#555555;background:#fafafa;border-bottom:1px solid #eeeeee;">Mano de obra</td>
                  <td style="padding:10px 14px;font-size:13px;color:#111111;border-bottom:1px solid #eeeeee;text-align:right;">$${Number(mantenimiento.costoManoObra).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:13px;color:#555555;background:#fafafa;border-bottom:1px solid #eeeeee;">Repuestos</td>
                  <td style="padding:10px 14px;font-size:13px;color:#111111;border-bottom:1px solid #eeeeee;text-align:right;">$${Number(mantenimiento.costoRepuestos).toFixed(2)}</td>
                </tr>
                <tr style="background-color:#111111;">
                  <td style="padding:12px 14px;font-size:14px;font-weight:bold;color:#ffffff;">Total</td>
                  <td style="padding:12px 14px;font-size:14px;font-weight:bold;color:#ffffff;text-align:right;">$${totalCosto}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Mensaje final -->
          <tr>
            <td style="padding:28px 40px 24px;">
              <p style="margin:0;font-size:13px;color:#777777;line-height:1.7;">
                Gracias por confiar en <strong style="color:#333333;">Mecanic Company</strong>. 
                Si tiene alguna pregunta sobre este reporte, no dude en contactarnos.
              </p>
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="background-color:#f7f7f7;border-top:1px solid #e0e0e0;padding:18px 40px;">
              <p style="margin:0;font-size:12px;color:#999999;">
                © ${new Date().getFullYear()} Mecanic Company — Tu vehículo en manos expertas. Este es un correo automático, por favor no respondas a este mensaje.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    });
}
