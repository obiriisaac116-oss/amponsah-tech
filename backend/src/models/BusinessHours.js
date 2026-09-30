const mongoose = require('mongoose');

/**
 * Stores the business opening hours and blocked dates.
 * There will only ever be one document (singleton pattern).
 */
const businessHoursSchema = new mongoose.Schema(
  {
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    weeklySchedule: [
      {
        day: { type: Number, min: 0, max: 6 },
        isOpen: { type: Boolean, default: true },
        openTime: { type: String, default: '09:00' },  // HH:MM
        closeTime: { type: String, default: '17:00' }, // HH:MM
      },
    ],
    // Specific dates that are fully blocked (holidays, etc.)
    blockedDates: [
      {
        date: String,   // YYYY-MM-DD
        reason: String,
      },
    ],
    // Booking slot interval in minutes (e.g. 30 → slots at 09:00, 09:30, 10:00 …)
    slotInterval: {
      type: Number,
      default: 30,
      min: 15,
    },
    // How many days ahead customers can book
    bookingWindowDays: {
      type: Number,
      default: 30,
    },
  },
  { timestamps: true }
);

businessHoursSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    // Seed default Mon–Sat, 9 AM – 5 PM
    config = await this.create({
      weeklySchedule: [
        { day: 0, isOpen: false },
        { day: 1, isOpen: true,  openTime: '09:00', closeTime: '17:00' },
        { day: 2, isOpen: true,  openTime: '09:00', closeTime: '17:00' },
        { day: 3, isOpen: true,  openTime: '09:00', closeTime: '17:00' },
        { day: 4, isOpen: true,  openTime: '09:00', closeTime: '17:00' },
        { day: 5, isOpen: true,  openTime: '09:00', closeTime: '17:00' },
        { day: 6, isOpen: true,  openTime: '09:00', closeTime: '13:00' },
      ],
    });
  }
  return config;
};

module.exports = mongoose.model('BusinessHours', businessHoursSchema);
