const Admin = require('../models/Admin');
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');

// GET /api/admin/stats
async function getDashboardStats(req, res, next) {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const [
      totalBookings,
      todayBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalCustomers,
      recentBookings,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ date: today }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Customer.countDocuments(),
      Booking.find({ date: today })
        .populate('service', 'name')
        .populate('customer', 'name phone')
        .sort({ time: 1 })
        .limit(20),
    ]);

    // Revenue: sum of completed bookings' service price
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$serviceSnapshot.price' },
        },
      },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      data: {
        stats: {
          totalBookings,
          todayBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          cancelledBookings,
          totalCustomers,
          totalRevenue,
        },
        todaySchedule: recentBookings,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/create-admin  (superadmin only)
async function createAdmin(req, res, next) {
  try {
    const { name, email, password, role = 'admin' } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const admin = await Admin.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      data: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardStats, createAdmin };
