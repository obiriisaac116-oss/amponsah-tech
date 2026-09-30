/**
 * Daily reminder job — sends WhatsApp + email reminders for bookings tomorrow.
 *
 * Uses a simple setInterval approach (no external scheduler needed).
 * Runs once at startup (in case it was missed) then every 24 h.
 *
 * For production you can replace the interval with a proper cron scheduler
 * like 'node-cron': schedule('0 8 * * *', runReminders)
 */

const Booking  = require('../models/Booking');
const Customer = require('../models/Customer');
const { sendBookingReminder } = require('./notificationService');

async function runReminders() {
  // Calculate tomorrow's date string YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  console.log(`[ReminderJob] Running for ${dateStr}`);

  const bookings = await Booking.find({
    date:   dateStr,
    status: { $in: ['pending', 'confirmed'] },
    'notifications.reminderSent': false,
  }).populate('service');

  if (bookings.length === 0) {
    console.log('[ReminderJob] No reminders to send.');
    return;
  }

  for (const booking of bookings) {
    const customer = await Customer.findById(booking.customer);
    if (!customer) continue;

    try {
      await sendBookingReminder(booking, customer, booking.service);
    } catch (err) {
      console.error(`[ReminderJob] Failed for booking ${booking._id}:`, err.message);
    }
  }

  console.log(`[ReminderJob] Done — processed ${bookings.length} reminders.`);
}

/**
 * Start the reminder job.
 * Runs once immediately (in case server restarted after scheduled time),
 * then every 24 hours.
 */
function startReminderJob() {
  // Run immediately on startup
  runReminders().catch((err) => console.error('[ReminderJob] Error:', err.message));

  // Then every 24 hours
  setInterval(() => {
    runReminders().catch((err) => console.error('[ReminderJob] Error:', err.message));
  }, 24 * 60 * 60 * 1000);

  console.log('[ReminderJob] Scheduled — runs every 24 hours.');
}

module.exports = { startReminderJob, runReminders };
