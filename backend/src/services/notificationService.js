const { sendEmail }   = require('./emailService');
const { sendWhatsApp } = require('./whatsappService');
const { confirmationEmail, cancellationEmail, reminderEmail } = require('./emailTemplates');
const Booking = require('../models/Booking');

const biz = () => process.env.BUSINESS_NAME || 'BookEasy';

// ─── WhatsApp message builders ────────────────────────────────────────────────

function confirmationWA(booking, customer, service) {
  const snap = booking.serviceSnapshot || service;
  return [
    `✅ *Booking Confirmed — ${biz()}*`,
    ``,
    `Hi ${customer.name}! Your appointment is booked.`,
    ``,
    `📋 *Details*`,
    `• Service:  ${snap.name}`,
    `• Date:     ${booking.date}`,
    `• Time:     ${booking.time}`,
    `• Duration: ${snap.duration} min`,
    `• Price:    ${snap.currency} ${Number(snap.price).toFixed(2)}`,
    ``,
    `🔑 *Confirmation Code: ${booking.confirmationCode}*`,
    ``,
    `To cancel or view your booking visit:`,
    `${process.env.FRONTEND_URL || 'http://localhost:5173'}/lookup`,
  ].join('\n');
}

function cancellationWA(booking, customer, service) {
  const snap = booking.serviceSnapshot || service;
  return [
    `❌ *Booking Cancelled — ${biz()}*`,
    ``,
    `Hi ${customer.name}, your booking has been cancelled.`,
    ``,
    `• Service: ${snap.name}`,
    `• Date:    ${booking.date}`,
    `• Time:    ${booking.time}`,
    `• Code:    ${booking.confirmationCode}`,
    ``,
    `To book again visit:`,
    `${process.env.FRONTEND_URL || 'http://localhost:5173'}/book`,
  ].join('\n');
}

function reminderWA(booking, customer, service) {
  const snap = booking.serviceSnapshot || service;
  return [
    `⏰ *Reminder — ${biz()}*`,
    ``,
    `Hi ${customer.name}! Your appointment is tomorrow.`,
    ``,
    `• Service: ${snap.name}`,
    `• Date:    ${booking.date}`,
    `• Time:    ${booking.time}`,
    ``,
    `See you then! 😊`,
  ].join('\n');
}

// ─── Public notification functions ───────────────────────────────────────────

/**
 * Send booking confirmation via email + WhatsApp.
 * Called after a booking is created.
 */
async function sendBookingConfirmation(booking, customer, service) {
  const results = await Promise.allSettled([
    sendEmail({
      to:      customer.email,
      subject: `Booking Confirmed — ${booking.confirmationCode}`,
      html:    confirmationEmail({ booking, customer, service }),
    }),
    sendWhatsApp(customer.phone, confirmationWA(booking, customer, service)),
  ]);

  logResults('confirmation', results);

  // Mark confirmation as sent
  await Booking.findByIdAndUpdate(booking._id, {
    'notifications.confirmationSent': true,
  });
}

/**
 * Send cancellation notice via email + WhatsApp.
 */
async function sendCancellationNotice(booking, customer, service) {
  const results = await Promise.allSettled([
    sendEmail({
      to:      customer.email,
      subject: `Booking Cancelled — ${booking.confirmationCode}`,
      html:    cancellationEmail({ booking, customer, service }),
    }),
    sendWhatsApp(customer.phone, cancellationWA(booking, customer, service)),
  ]);

  logResults('cancellation', results);

  await Booking.findByIdAndUpdate(booking._id, {
    'notifications.cancellationSent': true,
  });
}

/**
 * Send a reminder for a booking (called by a scheduled job the day before).
 */
async function sendBookingReminder(booking, customer, service) {
  const results = await Promise.allSettled([
    sendEmail({
      to:      customer.email,
      subject: `Reminder: Your appointment tomorrow — ${booking.date}`,
      html:    reminderEmail({ booking, customer, service }),
    }),
    sendWhatsApp(customer.phone, reminderWA(booking, customer, service)),
  ]);

  logResults('reminder', results);

  await Booking.findByIdAndUpdate(booking._id, {
    'notifications.reminderSent': true,
  });
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function logResults(type, results) {
  results.forEach((r, i) => {
    const channel = i === 0 ? 'Email' : 'WhatsApp';
    if (r.status === 'rejected') {
      console.error(`[Notification] ${type} ${channel} failed:`, r.reason?.message);
    } else {
      console.log(`[Notification] ${type} ${channel} sent OK`);
    }
  });
}

module.exports = {
  sendBookingConfirmation,
  sendCancellationNotice,
  sendBookingReminder,
};
