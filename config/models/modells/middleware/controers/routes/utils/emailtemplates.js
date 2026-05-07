const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Email templates
const templates = {
  contactConfirmation: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a73e8, #0d47a1); color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { background: #2d3748; color: white; padding: 20px; text-align: center; }
            .button { background: #1a73e8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Cyber Guard Solutions</h1>
                <p>Your Digital Protection Partner</p>
            </div>
            <div class="content">
                <h2>Thank You for Contacting Us!</h2>
                <p>Dear {{name}},</p>
                <p>We have received your inquiry and our security experts will review it shortly.</p>
                <p><strong>Your Message:</strong></p>
                <blockquote style="background: white; padding: 15px; border-left: 4px solid #1a73e8; margin: 15px 0;">
                    {{message}}
                </blockquote>
                <p>We typically respond within 1-2 business hours. For urgent matters, please call us at +1 (555) 123-4567.</p>
                <p>Best regards,<br>The Cyber Guard Solutions Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Cyber Guard Solutions. All rights reserved.</p>
                <p>123 Security Plaza, Tech District, San Francisco, CA 94105</p>
            </div>
        </div>
    </body>
    </html>
  `,

  adminNotification: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #e53935; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .contact-info { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #1a73e8; }
            .priority-high { border-left-color: #e53935; }
            .priority-medium { border-left-color: #ffb300; }
            .priority-low { border-left-color: #00c853; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
                <h3>Contact Details:</h3>
                <div class="contact-info priority-{{priority}}">
                    <p><strong>Name:</strong> {{name}}</p>
                    <p><strong>Email:</strong> {{email}}</p>
                    <p><strong>Company:</strong> {{company}}</p>
                    <p><strong>Phone:</strong> {{phone}}</p>
                    <p><strong>Service:</strong> {{service}}</p>
                    <p><strong>Priority:</strong> <span style="color: {{priorityColor}}">{{priority}}</span></p>
                    <p><strong>Message:</strong><br>{{message}}</p>
                    <p><strong>Submitted:</strong> {{timestamp}}</p>
                </div>
                <p><a href="{{adminUrl}}" class="button" style="background: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a></p>
            </div>
        </div>
    </body>
    </html>
  `
};

// Email service
class EmailService {
  constructor() {
    this.transporter = createTransporter();
  }

  async sendEmail(mailOptions) {
    try {
      await this.transporter.verify();
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendContactConfirmation({ email, name, subject, message }) {
    const html = templates.contactConfirmation
      .replace('{{name}}', name)
      .replace('{{message}}', message);

    const mailOptions = {
      from: `"Cyber Guard Solutions" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: subject || 'Thank you for contacting Cyber Guard Solutions',
      html: html,
      text: `Dear ${name},\n\nThank you for contacting Cyber Guard Solutions. We have received your message and will get back to you shortly.\n\nYour message: ${message}\n\nBest regards,\nThe Cyber Guard Solutions Team`
    };

    return this.sendEmail(mailOptions);
  }

  async sendAdminNotification({ emails, contact }) {
    const priorityColors = {
      urgent: '#e53935',
      high: '#ff6d00',
      medium: '#ffb300',
      low: '#00c853'
    };

    const html = templates.adminNotification
      .replace('{{name}}', contact.name)
      .replace('{{email}}', contact.email)
      .replace('{{company}}', contact.company || 'Not provided')
      .replace('{{phone}}', contact.phone || 'Not provided')
      .replace('{{service}}', contact.service)
      .replace('{{priority}}', contact.priority)
      .replace('{{priorityColor}}', priorityColors[contact.priority] || '#ffb300')
      .replace('{{message}}', contact.message)
      .replace('{{timestamp}}', new Date(contact.createdAt).toLocaleString())
      .replace('{{adminUrl}}', `${process.env.ADMIN_URL}/contacts/${contact._id}`);

    const mailOptions = {
      from: `"Cyber Guard Solutions" <${process.env.EMAIL_FROM}>`,
      to: emails.join(','),
      subject: `New Contact Form: ${contact.name} - ${contact.service} Service`,
      html: html,
      text: `New contact form submission from ${contact.name} (${contact.email}). Service: ${contact.service}. Message: ${contact.message}`
    };

    return this.sendEmail(mailOptions);
  }

  async sendPasswordReset({ email, name, resetUrl }) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a73e8, #0d47a1); color: white; padding: 30px; text-align: center;">
          <h1>Password Reset Request</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px;">
          <h2>Hello ${name},</h2>
          <p>You requested a password reset for your Cyber Guard Solutions account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #1a73e8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
        </div>
        <div style="background: #2d3748; color: white; padding: 20px; text-align: center;">
          <p>&copy; 2024 Cyber Guard Solutions</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Cyber Guard Solutions" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Reset Your Password - Cyber Guard Solutions',
      html: html
    };

    return this.sendEmail(mailOptions);
  }
}

module.exports = new EmailService();