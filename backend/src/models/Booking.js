const mongoose = require('mongoose');
const { nanoid } = require('../utils/nanoid');

const STATUS = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'];

const bookingSchema = new mongoose.Schema(
  {
    confirmationCode: {
      type: String,
      unique: true,
      default: () => nanoid(8).toUpperCase(),
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    // Denormalised snapshot so records survive service edits
    serviceSnapshot: {
      name: String,
      duration: Number,
      price: Number,
      currency: String,
    },
    date: {
      type: String, // stored as YYYY-MM-DD
      required: true,
      index: true,
    },
    time: {
      type: String, // stored as HH:MM (24-hour)
      required: true,
    },
    status: {
      type: String,
      enum: STATUS,
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    // Notification tracking
    notifications: {
      confirmationSent: { type: Boolean, default: false },
      reminderSent:     { type: Boolean, default: false },
      cancellationSent: { type: Boolean, default: false },
    },
    cancelledAt: Date,
    cancelledBy: {
      type: String,
      enum: ['customer', 'admin'],
    },
    cancellationReason: String,
  },
  { timestamps: true }
);

// Compound index for slot-availability queries
bookingSchema.index({ date: 1, time: 1, service: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
