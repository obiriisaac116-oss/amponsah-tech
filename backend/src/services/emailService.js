const nodemailer = require('nodemailer');

/**
 * Create and return a transporter, cached after first call.
 */
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return _transporter;
}

/**
 * Send an email.
 * @param {object} opts
 * @param {string} opts.to
 * @param {string} opts.subject
 * @param {string} opts.html
 * @param {string} [opts.text]
 */
async function sendEmail({ to, subject, html, text }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn('[Email] SMTP not configured — skipping email to', to);
    return;
  }

  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: `"${process.env.BUSINESS_NAME || 'BookEasy'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ''),
  });

  console.log(`[Email] Sent to ${to}: ${info.messageId}`);
  return info;
}

module.exports = { sendEmail };
