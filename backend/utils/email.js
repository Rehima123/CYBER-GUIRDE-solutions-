import nodemailer from 'nodemailer'

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

// Base send function
export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter()
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'CyberGuard Solutions <noreply@cyberguard.com>',
    to,
    subject,
    html,
    text,
  })
}

// ── Email Templates ──────────────────────────────────

export const sendContactConfirmation = async ({ name, email, service }) => {
  const serviceMap = {
    network: 'Network Security',
    cloud: 'Cloud Protection',
    endpoint: 'Endpoint Security',
    encryption: 'Data Encryption',
    monitoring: '24/7 SOC Monitoring',
    incident: 'Incident Response',
  }

  await sendEmail({
    to: email,
    subject: 'We received your message — CyberGuard Solutions',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#020810;font-family:Inter,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#0a1628;border:1px solid #1a3a5c;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#0a1628,#050d1a);padding:40px;text-align:center;border-bottom:1px solid #1a3a5c;">
            <h1 style="color:#00d4ff;margin:0;font-size:24px;">⚡ CyberGuard Solutions</h1>
          </div>
          <div style="padding:40px;">
            <h2 style="color:#ffffff;margin-top:0;">Hi ${name},</h2>
            <p style="color:#94a3b8;line-height:1.7;">
              Thank you for reaching out! We've received your message and one of our cybersecurity experts will get back to you within <strong style="color:#00d4ff;">24 hours</strong>.
            </p>
            ${service ? `<p style="color:#94a3b8;">You expressed interest in: <strong style="color:#00ff88;">${serviceMap[service] || service}</strong></p>` : ''}
            <div style="background:#050d1a;border:1px solid #1a3a5c;border-radius:8px;padding:20px;margin:24px 0;">
              <p style="color:#64748b;margin:0 0 8px;font-size:12px;font-family:monospace;">NEED IMMEDIATE HELP?</p>
              <p style="color:#94a3b8;margin:4px 0;">📞 +251 925 259 536</p>
              <p style="color:#94a3b8;margin:4px 0;">✉️ info@cyberguard.com</p>
            </div>
            <p style="color:#64748b;font-size:13px;">Stay secure,<br><strong style="color:#00d4ff;">The CyberGuard Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export const sendContactNotification = async ({ name, email, company, service, message, phone }) => {
  await sendEmail({
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `🔔 New Contact: ${name} — ${service || 'General Inquiry'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
          <div style="background:#0a1628;padding:24px 32px;">
            <h2 style="color:#00d4ff;margin:0;">New Contact Form Submission</h2>
          </div>
          <div style="padding:32px;">
            <table style="width:100%;border-collapse:collapse;">
              ${[
                ['Name', name],
                ['Email', email],
                ['Company', company || '—'],
                ['Phone', phone || '—'],
                ['Service', service || '—'],
              ].map(([label, value]) => `
                <tr>
                  <td style="padding:10px 0;color:#64748b;font-size:13px;width:120px;vertical-align:top;">${label}</td>
                  <td style="padding:10px 0;color:#1e293b;font-weight:500;">${value}</td>
                </tr>
              `).join('')}
            </table>
            <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin-top:16px;">
              <p style="color:#64748b;font-size:12px;margin:0 0 8px;">MESSAGE</p>
              <p style="color:#1e293b;margin:0;line-height:1.6;">${message}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export const sendPasswordResetEmail = async ({ name, email, resetUrl }) => {
  await sendEmail({
    to: email,
    subject: 'Password Reset Request — CyberGuard Solutions',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#020810;font-family:Inter,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#0a1628;border:1px solid #1a3a5c;border-radius:12px;overflow:hidden;">
          <div style="background:#0a1628;padding:40px;text-align:center;border-bottom:1px solid #1a3a5c;">
            <h1 style="color:#00d4ff;margin:0;">⚡ CyberGuard Solutions</h1>
          </div>
          <div style="padding:40px;">
            <h2 style="color:#ffffff;margin-top:0;">Password Reset</h2>
            <p style="color:#94a3b8;">Hi ${name}, you requested a password reset. Click the button below. This link expires in <strong style="color:#00d4ff;">10 minutes</strong>.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetUrl}" style="background:#00d4ff;color:#020810;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color:#64748b;font-size:13px;">If you didn't request this, ignore this email. Your password won't change.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export const sendWelcomeEmail = async ({ name, email }) => {
  await sendEmail({
    to: email,
    subject: 'Welcome to CyberGuard Solutions',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#020810;font-family:Inter,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#0a1628;border:1px solid #1a3a5c;border-radius:12px;overflow:hidden;">
          <div style="padding:40px;text-align:center;border-bottom:1px solid #1a3a5c;">
            <h1 style="color:#00d4ff;margin:0;">⚡ Welcome to CyberGuard</h1>
          </div>
          <div style="padding:40px;">
            <h2 style="color:#ffffff;margin-top:0;">Hi ${name}! 👋</h2>
            <p style="color:#94a3b8;line-height:1.7;">Your account has been created. You're now part of a community of 500+ protected businesses.</p>
            <p style="color:#64748b;font-size:13px;">Stay secure,<br><strong style="color:#00d4ff;">The CyberGuard Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}
