const businessName = () => process.env.BUSINESS_NAME || 'BookEasy';
const frontendUrl  = () => process.env.FRONTEND_URL  || 'http://localhost:5173';

/**
 * Shared wrapper so all emails have a consistent look.
 */
function wrap(content) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${businessName()}</title>
  <style>
    body { margin:0; padding:0; background:#f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#111827; }
    .wrapper { max-width:560px; margin:32px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.08); }
    .header  { background:#2563eb; padding:28px 32px; text-align:center; }
    .header h1 { margin:0; color:#fff; font-size:22px; font-weight:700; letter-spacing:-.3px; }
    .body    { padding:32px; }
    .detail-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #f3f4f6; font-size:15px; }
    .detail-row:last-child { border-bottom:none; }
    .label   { color:#6b7280; }
    .value   { font-weight:600; color:#111827; }
    .code-box { background:#eff6ff; border-radius:12px; text-align:center; padding:20px; margin:24px 0; }
    .code    { font-size:28px; font-weight:800; color:#2563eb; letter-spacing:6px; }
    .btn     { display:inline-block; background:#2563eb; color:#fff; text-decoration:none; padding:14px 28px; border-radius:10px; font-weight:600; font-size:15px; }
    .footer  { background:#f9fafb; padding:20px 32px; text-align:center; font-size:13px; color:#9ca3af; border-top:1px solid #f3f4f6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><h1>${businessName()}</h1></div>
    <div class="body">${content}</div>
    <div class="footer">© ${new Date().getFullYear()} ${businessName()}. All rights reserved.</div>
  </div>
</body>
</html>`;
}

/**
 * Confirmation email sent to customer after booking.
 */
function confirmationEmail({ booking, customer, service }) {
  const url = `${frontendUrl()}/confirmation/${booking.confirmationCode}`;
  const snap = booking.serviceSnapshot || service;

  const content = `
    <h2 style="margin-top:0;font-size:20px;">Your booking is confirmed! 🎉</h2>
    <p style="color:#6b7280;margin-bottom:24px;">Hi ${customer.name}, we've reserved your spot. Here are the details:</p>

    <div class="code-box">
      <p style="margin:0 0 6px;font-size:13px;color:#6b7280;font-weight:500;letter-spacing:2px;text-transform:uppercase;">Confirmation Code</p>
      <p class="code">${booking.confirmationCode}</p>
    </div>

    <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <div class="detail-row"><span class="label">Service</span>  <span class="value">${snap.name}</span></div>
      <div class="detail-row"><span class="label">Date</span>     <span class="value">${booking.date}</span></div>
      <div class="detail-row"><span class="label">Time</span>     <span class="value">${booking.time}</span></div>
      <div class="detail-row"><span class="label">Duration</span> <span class="value">${snap.duration} minutes</span></div>
      <div class="detail-row"><span class="label">Price</span>    <span class="value">${snap.currency} ${Number(snap.price).toFixed(2)}</span></div>
    </div>

    <p style="text-align:center;margin-bottom:24px;">
      <a href="${url}" class="btn">View My Booking</a>
    </p>

    <p style="font-size:14px;color:#6b7280;">
      Need to cancel or reschedule? Use your confirmation code at <a href="${frontendUrl()}/lookup" style="color:#2563eb;">${frontendUrl()}/lookup</a> or reply to this email.
    </p>`;

  return wrap(content);
}

/**
 * Cancellation email sent when a booking is cancelled.
 */
function cancellationEmail({ booking, customer, service }) {
  const snap = booking.serviceSnapshot || service;

  const content = `
    <h2 style="margin-top:0;font-size:20px;">Booking Cancelled</h2>
    <p style="color:#6b7280;margin-bottom:24px;">Hi ${customer.name}, your booking has been cancelled.</p>

    <div style="background:#fef2f2;border-radius:12px;padding:16px 20px;margin-bottom:24px;border:1px solid #fecaca;">
      <div class="detail-row"><span class="label">Service</span>  <span class="value">${snap.name}</span></div>
      <div class="detail-row"><span class="label">Date</span>     <span class="value">${booking.date}</span></div>
      <div class="detail-row"><span class="label">Time</span>     <span class="value">${booking.time}</span></div>
      <div class="detail-row"><span class="label">Code</span>     <span class="value">${booking.confirmationCode}</span></div>
    </div>

    <p style="text-align:center;margin-bottom:24px;">
      <a href="${frontendUrl()}/book" class="btn">Book Again</a>
    </p>

    <p style="font-size:14px;color:#6b7280;">
      If you didn't request this cancellation, please contact us immediately.
    </p>`;

  return wrap(content);
}

/**
 * Reminder email sent the day before the appointment.
 */
function reminderEmail({ booking, customer, service }) {
  const snap = booking.serviceSnapshot || service;
  const url  = `${frontendUrl()}/confirmation/${booking.confirmationCode}`;

  const content = `
    <h2 style="margin-top:0;font-size:20px;">Reminder: Appointment Tomorrow ⏰</h2>
    <p style="color:#6b7280;margin-bottom:24px;">Hi ${customer.name}, this is a reminder about your appointment tomorrow.</p>

    <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <div class="detail-row"><span class="label">Service</span>  <span class="value">${snap.name}</span></div>
      <div class="detail-row"><span class="label">Date</span>     <span class="value">${booking.date}</span></div>
      <div class="detail-row"><span class="label">Time</span>     <span class="value">${booking.time}</span></div>
      <div class="detail-row"><span class="label">Duration</span> <span class="value">${snap.duration} minutes</span></div>
    </div>

    <p style="text-align:center;margin-bottom:24px;">
      <a href="${url}" class="btn">View My Booking</a>
    </p>`;

  return wrap(content);
}

module.exports = { confirmationEmail, cancellationEmail, reminderEmail };
