/**
 * Slot-availability helpers.
 */

/**
 * Build all possible time slots for a given date based on business hours config.
 * @param {string} date  - YYYY-MM-DD
 * @param {object} config - BusinessHours document
 * @returns {string[]} array of "HH:MM" strings
 */
function buildSlots(date, config) {
  const dayOfWeek = new Date(date + 'T00:00:00').getDay(); // 0=Sun
  const schedule = config.weeklySchedule.find((s) => s.day === dayOfWeek);

  if (!schedule || !schedule.isOpen) return [];

  const blocked = config.blockedDates.some((b) => b.date === date);
  if (blocked) return [];

  const slots = [];
  const [openH, openM] = schedule.openTime.split(':').map(Number);
  const [closeH, closeM] = schedule.closeTime.split(':').map(Number);

  let current = openH * 60 + openM;
  const end = closeH * 60 + closeM;
  const interval = config.slotInterval || 30;

  while (current < end) {
    const h = String(Math.floor(current / 60)).padStart(2, '0');
    const m = String(current % 60).padStart(2, '0');
    slots.push(`${h}:${m}`);
    current += interval;
  }

  return slots;
}

/**
 * Filter out slots that are already fully booked for a service.
 * @param {string[]} slots
 * @param {string} date
 * @param {object} service   - Service document (has maxConcurrent)
 * @param {object[]} bookings - Existing bookings for that date & service
 */
function filterAvailableSlots(slots, service, bookings) {
  const counts = {};
  for (const b of bookings) {
    if (['cancelled', 'no-show'].includes(b.status)) continue;
    counts[b.time] = (counts[b.time] || 0) + 1;
  }

  return slots.filter((slot) => {
    const booked = counts[slot] || 0;
    return booked < (service.maxConcurrent || 1);
  });
}

module.exports = { buildSlots, filterAvailableSlots };
