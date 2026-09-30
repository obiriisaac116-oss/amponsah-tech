const Service = require('../models/Service');

// GET /api/services
async function getServices(req, res, next) {
  try {
    const filter = {};
    // Public callers only see active services
    if (!req.admin) filter.isActive = true;

    const services = await Service.find(filter).sort({ name: 1 });
    res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
}

// GET /api/services/:id
async function getService(req, res, next) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
}

// POST /api/services  (admin)
async function createService(req, res, next) {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
}

// PUT /api/services/:id  (admin)
async function updateService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/services/:id  (admin)
async function deleteService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deactivated' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getServices, getService, createService, updateService, deleteService };
