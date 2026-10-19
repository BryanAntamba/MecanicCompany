import nodemailer from 'nodemailer';

// Configuración de Nodemailer con Gmail
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.MAIL_USER || 'stivoter1234567@gmail.com',
    pass: process.env.MAIL_PASS || 'tayr wnrf ehko iijs',
  },
});

// Log de configuración del mailer
console.log(`[MAILER] 📧 Configurado con email: ${process.env.MAIL_USER || 'stivoter1234567@gmail.com'}`);
console.log(`[MAILER] 🔗 Host: ${process.env.MAIL_HOST || 'smtp.gmail.com'}:${process.env.MAIL_PORT || '587'}`);

interface EnviarCorreoParams {
  para: string;
  asunto: string;
  html: string;
  texto?: string;
}

export async function enviarCorreo({
  para,
  asunto,
  html,
  texto,
}: EnviarCorreoParams): Promise<void> {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM || `MecanicCompany <${process.env.MAIL_USER || 'stivoter1234567@gmail.com'}>`,
      to: para,
      subject: asunto,
      html: html,
      text: texto,
    };

    console.log(`[MAILER] 📤 Intentando enviar email a: ${para}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] ✅ Email enviado a ${para} - MessageID: ${info.messageId}`);
  } catch (error: any) {
    console.error(`[MAILER] ❌ Error al enviar email a ${para}:`);
    console.error(`  Código: ${error?.code}`);
    console.error(`  Mensaje: ${error?.message}`);
    console.error(`  Respuesta: ${error?.response}`);
    // NO lanzar error - solo loguear. El reporte debe guardarse aunque falle el correo
  }
}
