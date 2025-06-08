import nodemailer from 'nodemailer';

// Configuração do transporter conforme script oficial Brevo
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function enviarEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Ivan" <${process.env.EMAIL_USER}>`,
      ...options,
    });
    console.log(`E-mail enviado para: ${options.to}`);
    return true;
  } catch (error) {
    console.error('Erro detalhado ao enviar email:', error);
    return false;
  }
}
