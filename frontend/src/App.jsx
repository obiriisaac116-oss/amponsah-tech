import { Routes, Route } from 'react-router-dom';

// Public site
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LookupPage from './pages/LookupPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin
import { AuthProvider } from './admin/context/AuthContext';
import RequireAuth from './admin/components/RequireAuth';
import AdminLayout from './admin/components/AdminLayout';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import BookingsPage from './admin/pages/BookingsPage';
import CustomersPage from './admin/pages/CustomersPage';
import CustomerDetailPage from './admin/pages/CustomerDetailPage';
import ServicesAdminPage from './admin/pages/ServicesAdminPage';
import SettingsPage from './admin/pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Public website ── */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/book/:serviceId" element={<BookingPage />} />
          <Route path="/confirmation/:code" element={<ConfirmationPage />} />
          <Route path="/lookup" element={<LookupPage />} />
        </Route>

        {/* ── Admin ── */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="services" element={<ServicesAdminPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
