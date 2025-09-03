import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,           
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,         
    pass: process.env.SMTP_PASS          
  }
});

export async function sendResetEmail(to, link) {
  const html = `
    <p>Solicitaste restablecer tu contraseña. El enlace expira en <b>1 hora</b>.</p>
    <p><a href="${link}" style="display:inline-block;padding:12px 18px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px">
      Restablecer contraseña
    </a></p>
    <p>Si no fuiste vos, ignorá este mensaje.</p>
  `;
  return transporter.sendMail({
    from: `"Soporte" <${process.env.SMTP_USER}>`,
    to,
    subject: "Restablecer contraseña",
    html
  });
}
