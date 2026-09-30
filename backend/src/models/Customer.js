const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Upsert helper — find by email or create new
customerSchema.statics.findOrCreate = async function (data) {
  let customer = await this.findOne({ email: data.email.toLowerCase() });
  if (!customer) {
    customer = await this.create(data);
  }
  return customer;
};

module.exports = mongoose.model('Customer', customerSchema);
