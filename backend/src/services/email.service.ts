import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Solicitud, Mantenimiento, Mecanico } from '@prisma/client';

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

// Envía el código de verificación al correo personal del mecánico o del cliente
export async function enviarCodigoEmail(correo: string, codigo: string, tipo: 'recuperacion' | 'verificacion'): Promise<void> {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    const msg = `[EMAIL] MAIL_USER o MAIL_PASS no configurados en .env — código para ${correo}: ${codigo}`;
    console.error(msg);
    throw new Error('El servidor de correo no está configurado. Contacta al administrador.');
  }

  const esRecuperacion = tipo === 'recuperacion';
  const subject = esRecuperacion
    ? 'Mecanic Company — Recuperación de contraseña'
    : 'Mecanic Company — Verificación de correo';
  const heading = esRecuperacion
    ? 'Recuperación de contraseña'
    : 'Verificación de correo';
  const mensaje = esRecuperacion
    ? 'Recibimos una solicitud para restablecer la contraseña de tu cuenta.'
    : 'Usa el siguiente código para verificar tu correo electrónico.';

  const iconoSvg = esRecuperacion
    ? '🔑'
    : '✉️';

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: correo,
    subject,
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @keyframes pulse {
      0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
      70%  { box-shadow: 0 0 0 14px rgba(255,255,255,0); }
      100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .code-box {
      animation: pulse 2s infinite;
    }
    .card {
      animation: fadeIn 0.5s ease both;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:40px 0;">
    <tr>
      <td align="center">
        <table class="card" width="480" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.10);">

          <!-- HEADER -->
          <tr>
            <td style="background:#111111;padding:32px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;letter-spacing:3px;color:#ffffff;
                          text-transform:uppercase;">MECANIC</div>
              <div style="font-size:11px;letter-spacing:6px;color:#999999;
                          text-transform:uppercase;margin-top:4px;">COMPANY</div>
              <div style="width:40px;height:2px;background:#ffffff;margin:14px auto 0;"></div>
            </td>
          </tr>

          <!-- ICONO + TITULO -->
          <tr>
            <td style="padding:36px 40px 0;text-align:center;">
              <div style="font-size:40px;margin-bottom:12px;">${iconoSvg}</div>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#111111;
                         letter-spacing:0.5px;">${heading}</h1>
              <p style="margin:10px 0 0;font-size:14px;color:#555555;line-height:1.6;">
                ${mensaje}
              </p>
            </td>
          </tr>

          <!-- CÓDIGO -->
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <div class="code-box"
                   style="display:inline-block;background:#111111;border-radius:10px;
                          padding:18px 36px;">
                <span style="font-size:40px;font-weight:900;letter-spacing:12px;
                             color:#ffffff;font-family:'Courier New',monospace;
                             ">${codigo}</span>
              </div>
              <p style="margin:18px 0 0;font-size:12px;color:#888888;">
                ⏱&nbsp; Este código expira en <strong>15 minutos</strong>
              </p>
            </td>
          </tr>

          <!-- AVISO -->
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="background:#f7f7f7;border-left:3px solid #111111;
                          border-radius:0 6px 6px 0;padding:12px 16px;">
                <p style="margin:0;font-size:12px;color:#666666;line-height:1.6;">
                  Si no solicitaste este código, ignora este mensaje.
                  Tu cuenta permanece segura.
                </p>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f7f7f7;padding:20px 40px;text-align:center;
                       border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:11px;color:#aaaaaa;letter-spacing:1px;
                        text-transform:uppercase;">Mecanic Company &mdash; Tu vehículo en manos expertas</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  }).catch((smtpErr: any) => {
    console.error('[EMAIL] Error SMTP al enviar código de verificación:', smtpErr?.message ?? smtpErr);
    console.error('[EMAIL] Destinatario:', correo);
    console.error('[EMAIL] Config — host:', process.env.MAIL_HOST, '| puerto:', process.env.MAIL_PORT, '| usuario:', process.env.MAIL_USER);
    throw new Error(`Error al enviar el correo: ${smtpErr?.message ?? 'fallo SMTP desconocido'}`);
  });
}

// Envía el reporte técnico de mantenimiento al correo del cliente
export async function enviarReporteEmail(
  correoCliente: string,
  solicitud: Solicitud,
  mantenimiento: Mantenimiento,
  mecanico?: Mecanico | null
): Promise<void> {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    const msg = '[EMAIL] MAIL_USER o MAIL_PASS no configurados en .env — el correo no se envía.';
    console.error(msg);
    throw new Error('El servidor de correo no está configurado. Contacta al administrador.');
  }

  // Prepara la foto del mecánico como attachment inline (CID)
  const attachments: Mail.Attachment[] = [];
  let fotoHtml = '';
  if (mecanico?.fotoPerfil) {
    const match = mecanico.fotoPerfil.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const base64Data = match[2];
      attachments.push({
        filename: 'foto_mecanico.jpg',
        content: Buffer.from(base64Data, 'base64'),
        cid: 'foto_mecanico',
        contentType: mimeType,
        contentDisposition: 'inline',
      });
      fotoHtml = `<img src="cid:foto_mecanico" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid #E67E22;display:block;" />`;
    }
  }

  const totalCosto = (
    Number(mantenimiento.costoManoObra) + Number(mantenimiento.costoRepuestos)
  ).toFixed(2);

  const mecanicoNombre = mecanico
    ? `${mecanico.nombres} ${mecanico.apellidos}`
    : mantenimiento.mecanicoAsignado;
  const mecanicoEspecialidad = mecanico?.especialidad ?? '';

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: correoCliente,
    subject: `Mecanic Company — Reporte de servicio para ${solicitud.nombreCliente}`,
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(-20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .section { animation: fadeIn 0.5s ease both; }
    .mecanico-card { animation: slideRight 0.5s ease 0.2s both; }
  </style>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0"
           style="background:#ffffff;border-radius:12px;overflow:hidden;
                  box-shadow:0 4px 24px rgba(0,0,0,0.10);">

      <!-- HEADER -->
      <tr>
        <td style="background:#111111;padding:28px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="font-size:26px;font-weight:900;letter-spacing:3px;
                            color:#ffffff;text-transform:uppercase;">MECANIC</div>
                <div style="font-size:10px;letter-spacing:6px;color:#888888;
                            text-transform:uppercase;margin-top:2px;">COMPANY</div>
              </td>
              <td align="right" style="color:#ffffff;font-size:12px;
                                       letter-spacing:1px;text-transform:uppercase;">
                Reporte Técnico<br/>
                <span style="color:#888888;font-size:11px;">${mantenimiento.fechaServicio}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- TÍTULO SECCIÓN -->
      <tr>
        <td style="background:#1a1a1a;padding:14px 40px;">
          <p style="margin:0;font-size:13px;color:#cccccc;letter-spacing:2px;
                    text-transform:uppercase;">Informe de Mantenimiento Vehicular</p>
        </td>
      </tr>

      <!-- CUERPO -->
      <tr>
        <td style="padding:32px 40px;">

          <!-- CLIENTE + VEHÍCULO -->
          <table class="section" width="100%" cellpadding="0" cellspacing="0"
                 style="margin-bottom:24px;">
            <tr>
              <td width="48%" style="background:#f8f8f8;border-radius:8px;
                                     padding:16px 20px;vertical-align:top;">
                <p style="margin:0 0 8px;font-size:10px;font-weight:700;
                           letter-spacing:2px;text-transform:uppercase;
                           color:#888888;">Cliente</p>
                <p style="margin:0;font-size:15px;font-weight:700;
                           color:#111111;">${solicitud.nombreCliente}</p>
                <p style="margin:4px 0 0;font-size:12px;color:#555555;">
                  📞 ${solicitud.telefono}</p>
                <p style="margin:4px 0 0;font-size:12px;color:#555555;">
                  ✉️ ${solicitud.correoCliente}</p>
              </td>
              <td width="4%"></td>
              <td width="48%" style="background:#f8f8f8;border-radius:8px;
                                     padding:16px 20px;vertical-align:top;">
                <p style="margin:0 0 8px;font-size:10px;font-weight:700;
                           letter-spacing:2px;text-transform:uppercase;
                           color:#888888;">Vehículo</p>
                <p style="margin:0;font-size:15px;font-weight:700;
                           color:#111111;">${mantenimiento.marca} ${mantenimiento.modelo}</p>
                <p style="margin:4px 0 0;font-size:12px;color:#555555;">
                  🔖 Placa: <strong>${mantenimiento.placa}</strong></p>
                <p style="margin:4px 0 0;font-size:12px;color:#555555;">
                  📅 Período: ${mantenimiento.fechaInicio} — ${mantenimiento.fechaFinalizacion}</p>
              </td>
            </tr>
          </table>

          <!-- DIAGNÓSTICO -->
          <div class="section" style="margin-bottom:20px;">
            <p style="margin:0 0 10px;font-size:10px;font-weight:700;
                       letter-spacing:2px;text-transform:uppercase;
                       color:#888888;border-bottom:1px solid #eeeeee;
                       padding-bottom:6px;">Diagnóstico y trabajo realizado</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:5px 0;font-size:13px;color:#444;width:40%;">
                  Diagnóstico inicial
                </td>
                <td style="padding:5px 0;font-size:13px;color:#111;font-weight:600;">
                  ${mantenimiento.diagnostico}
                </td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:13px;color:#444;">Trabajo realizado</td>
                <td style="padding:5px 0;font-size:13px;color:#111;font-weight:600;">
                  ${mantenimiento.trabajoRealizado}${mantenimiento.otroTrabajo ? ` — ${mantenimiento.otroTrabajo}` : ''}
                </td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:13px;color:#444;vertical-align:top;">Descripción</td>
                <td style="padding:5px 0;font-size:13px;color:#111;">
                  ${mantenimiento.diagnosticoRealizado}
                </td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:13px;color:#444;vertical-align:top;">Repuestos</td>
                <td style="padding:5px 0;font-size:13px;color:#111;">
                  ${mantenimiento.repuestosUtilizados}
                </td>
              </tr>
              ${mantenimiento.observaciones ? `
              <tr>
                <td style="padding:5px 0;font-size:13px;color:#444;vertical-align:top;">Observaciones</td>
                <td style="padding:5px 0;font-size:13px;color:#111;">
                  ${mantenimiento.observaciones}
                </td>
              </tr>` : ''}
            </table>
          </div>

          <!-- COSTOS -->
          <div class="section" style="margin-bottom:24px;">
            <p style="margin:0 0 10px;font-size:10px;font-weight:700;
                       letter-spacing:2px;text-transform:uppercase;
                       color:#888888;border-bottom:1px solid #eeeeee;
                       padding-bottom:6px;">Resumen de costos</p>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border-radius:8px;overflow:hidden;">
              <tr style="background:#f8f8f8;">
                <td style="padding:10px 16px;font-size:13px;color:#444;
                           border-bottom:1px solid #eeeeee;">Mano de obra</td>
                <td style="padding:10px 16px;font-size:13px;color:#111;
                           font-weight:600;text-align:right;
                           border-bottom:1px solid #eeeeee;">
                  $${Number(mantenimiento.costoManoObra).toFixed(2)}</td>
              </tr>
              <tr style="background:#f8f8f8;">
                <td style="padding:10px 16px;font-size:13px;color:#444;
                           border-bottom:1px solid #eeeeee;">Repuestos</td>
                <td style="padding:10px 16px;font-size:13px;color:#111;
                           font-weight:600;text-align:right;
                           border-bottom:1px solid #eeeeee;">
                  $${Number(mantenimiento.costoRepuestos).toFixed(2)}</td>
              </tr>
              <tr style="background:#111111;">
                <td style="padding:12px 16px;font-size:14px;font-weight:700;
                           color:#ffffff;">Total</td>
                <td style="padding:12px 16px;font-size:18px;font-weight:900;
                           color:#ffffff;text-align:right;">
                  $${totalCosto}</td>
              </tr>
            </table>
          </div>

          <!-- MECÁNICO -->
          <div class="mecanico-card"
               style="background:#111111;border-radius:10px;padding:20px 24px;">
            <p style="margin:0 0 14px;font-size:10px;font-weight:700;
                       letter-spacing:2px;text-transform:uppercase;
                       color:#888888;">Mecánico asignado</p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                ${mecanico?.fotoPerfil ? `
                <td style="padding-right:18px;vertical-align:middle;">
                  ${fotoHtml}
                </td>` : ''}
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:17px;font-weight:700;
                             color:#ffffff;">${mecanicoNombre}</p>
                  ${mecanicoEspecialidad ? `<p style="margin:4px 0 0;font-size:12px;
                             color:#aaaaaa;letter-spacing:0.5px;">
                    ${mecanicoEspecialidad}</p>` : ''}
                </td>
              </tr>
            </table>
          </div>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#f7f7f7;padding:20px 40px;text-align:center;
                   border-top:1px solid #eeeeee;">
          <p style="margin:0;font-size:11px;color:#aaaaaa;letter-spacing:1px;
                    text-transform:uppercase;">
            Mecanic Company &mdash; Tu vehículo en manos expertas
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
    attachments,
  }).catch((smtpErr: any) => {
    console.error('[EMAIL] Error SMTP al enviar reporte:', smtpErr?.message ?? smtpErr);
    console.error('[EMAIL] Destinatario:', correoCliente);
    console.error('[EMAIL] Config — host:', process.env.MAIL_HOST, '| puerto:', process.env.MAIL_PORT, '| usuario:', process.env.MAIL_USER);
    throw new Error(`Error al enviar el correo: ${smtpErr?.message ?? 'fallo SMTP desconocido'}`);
  });
}
