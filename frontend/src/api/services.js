import api from './client';

export const fetchServices = () =>
  api.get('/services').then((r) => r.data.data);

export const fetchService = (id) =>
  api.get(`/services/${id}`).then((r) => r.data.data);

export const fetchSlots = (serviceId, date) =>
  api.get('/bookings/slots', { params: { serviceId, date } }).then((r) => r.data.data);

export const createBooking = (payload) =>
  api.post('/bookings', payload).then((r) => r.data);

export const lookupBooking = (code) =>
  api.get(`/bookings/${code}`).then((r) => r.data.data);

export const cancelBooking = (id, reason) =>
  api.patch(`/bookings/${id}/cancel`, { reason }).then((r) => r.data);
