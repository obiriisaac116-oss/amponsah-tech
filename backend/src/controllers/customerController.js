const Customer = require('../models/Customer');
const Booking = require('../models/Booking');

// GET /api/customers  (admin)
async function getCustomers(req, res, next) {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (search) {
      const q = search.trim();
      filter.$or = [
        { name:  { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ];
    }

    const [customers, total] = await Promise.all([
      Customer.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Customer.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: customers,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/customers/:id  (admin)
async function getCustomer(req, res, next) {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Fetch recent bookings for this customer
    const bookings = await Booking.find({ customer: customer._id })
      .populate('service', 'name price')
      .sort({ date: -1 })
      .limit(10);

    res.json({ success: true, data: { customer, bookings } });
  } catch (err) {
    next(err);
  }
}

// PUT /api/customers/:id  (admin)
async function updateCustomer(req, res, next) {
  try {
    const allowed = ['name', 'phone', 'notes'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCustomers, getCustomer, updateCustomer };
