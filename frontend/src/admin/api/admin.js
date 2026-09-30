import api from '../../api/client';

// Dashboard
export const fetchStats      = ()           => api.get('/admin/stats').then(r => r.data.data);

// Bookings
export const fetchBookings   = (params)     => api.get('/bookings', { params }).then(r => r.data);
export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status }).then(r => r.data.data);
export const adminCancelBooking = (id, reason) =>
  api.patch(`/bookings/${id}/cancel`, { reason }).then(r => r.data);

// Customers
export const fetchCustomers  = (params)     => api.get('/customers', { params }).then(r => r.data);
export const fetchCustomer   = (id)         => api.get(`/customers/${id}`).then(r => r.data.data);
export const updateCustomer  = (id, data)   => api.put(`/customers/${id}`, data).then(r => r.data.data);

// Services (admin CRUD)
export const adminFetchServices  = ()          => api.get('/services').then(r => r.data.data);
export const adminCreateService  = (data)      => api.post('/services', data).then(r => r.data.data);
export const adminUpdateService  = (id, data)  => api.put(`/services/${id}`, data).then(r => r.data.data);
export const adminDeleteService  = (id)        => api.delete(`/services/${id}`).then(r => r.data);

// Auth
export const changePassword  = (body)       => api.put('/auth/change-password', body).then(r => r.data);
export const createAdmin     = (body)       => api.post('/admin/create-admin', body).then(r => r.data.data);
