const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Customer = require('../models/Customer');
const BusinessHours = require('../models/BusinessHours');
const { buildSlots, filterAvailableSlots } = require('../utils/slots');
const { sendBookingConfirmation, sendCancellationNotice } = require('../services/notificationService');

// ─── GET /api/bookings/slots?serviceId=&date= ────────────────────────────────
async function getAvailableSlots(req, res, next) {
  try {
    const { serviceId, date } = req.query;

    if (!serviceId || !date) {
      return res.status(400).json({ success: false, message: 'serviceId and date are required' });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const config = await BusinessHours.getConfig();
    const allSlots = buildSlots(date, config);

    const existingBookings = await Booking.find({
      service: serviceId,
      date,
      status: { $nin: ['cancelled', 'no-show'] },
    });

    const available = filterAvailableSlots(allSlots, service, existingBookings);

    res.json({ success: true, data: { date, slots: available } });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/bookings ───────────────────────────────────────────────────────
async function createBooking(req, res, next) {
  try {
    const { serviceId, date, time, notes, customer: customerData } = req.body;

    // 1. Validate service
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // 2. Check the slot is still available
    const config = await BusinessHours.getConfig();
    const allSlots = buildSlots(date, config);
    if (!allSlots.includes(time)) {
      return res.status(400).json({ success: false, message: 'This time slot is not available' });
    }

    const existingBookings = await Booking.find({
      service: serviceId,
      date,
      time,
      status: { $nin: ['cancelled', 'no-show'] },
    });

    if (existingBookings.length >= (service.maxConcurrent || 1)) {
      return res.status(409).json({ success: false, message: 'This slot is fully booked. Please choose another time.' });
    }

    // 3. Find or create customer
    const customer = await Customer.findOrCreate({
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
    });
    customer.totalBookings += 1;
    await customer.save();

    // 4. Create booking
    const booking = await Booking.create({
      service: service._id,
      customer: customer._id,
      serviceSnapshot: {
        name: service.name,
        duration: service.duration,
        price: service.price,
        currency: service.currency,
      },
      date,
      time,
      notes: notes || '',
      status: 'confirmed',
    });

    await booking.populate('service customer');

    // 5. Send notifications (fire-and-forget, don't fail the booking)
    sendBookingConfirmation(booking, customer, service).catch((err) =>
      console.error('Notification error:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      data: {
        confirmationCode: booking.confirmationCode,
        date: booking.date,
        time: booking.time,
        service: service.name,
        customer: { name: customer.name, email: customer.email },
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/bookings/:id ────────────────────────────────────────────────────
async function getBooking(req, res, next) {
  try {
    // Support both MongoDB _id and confirmationCode
    const query = req.params.id.length === 8
      ? { confirmationCode: req.params.id.toUpperCase() }
      : { _id: req.params.id };

    const booking = await Booking.findOne(query).populate('service customer');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/bookings/:id/cancel ──────────────────────────────────────────
async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id).populate('service customer');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = req.admin ? 'admin' : 'customer';
    booking.cancellationReason = req.body.reason || '';
    await booking.save();

    // Decrease customer count
    await Customer.findByIdAndUpdate(booking.customer._id, { $inc: { totalBookings: -1 } });

    sendCancellationNotice(booking, booking.customer, booking.service).catch((err) =>
      console.error('Cancellation notification error:', err.message)
    );

    res.json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/bookings  (admin) ───────────────────────────────────────────────
async function getAllBookings(req, res, next) {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      date,
      search,
      serviceId,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (date) filter.date = date;
    if (serviceId) filter.service = serviceId;

    let bookings = await Booking.find(filter)
      .populate('service', 'name duration price')
      .populate('customer', 'name email phone')
      .sort({ date: -1, time: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Text search across customer name / email (post-filter)
    if (search) {
      const q = search.toLowerCase();
      bookings = bookings.filter(
        (b) =>
          b.customer?.name?.toLowerCase().includes(q) ||
          b.customer?.email?.toLowerCase().includes(q) ||
          b.confirmationCode?.toLowerCase().includes(q)
      );
    }

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/bookings/:id/status  (admin) ─────────────────────────────────
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const VALID = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'];
    if (!VALID.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('service customer');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAvailableSlots,
  createBooking,
  getBooking,
  cancelBooking,
  getAllBookings,
  updateStatus,
};
