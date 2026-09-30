import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { lookupBooking } from '../api/services';
import { CheckCircleIcon, CalendarIcon, ClockIcon, SpinnerIcon } from '../components/Icons';

export default function ConfirmationPage() {
  const { code } = useParams();

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['booking', code],
    queryFn: () => lookupBooking(code),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <SpinnerIcon className="w-10 h-10 text-brand-600" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-red-500 font-medium mb-4">Booking not found.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  const service = booking.serviceSnapshot || booking.service;
  const customer = booking.customer;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {/* Success icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircleIcon className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
      <p className="text-gray-500 mb-8">
        Your appointment has been booked. A confirmation has been sent to{' '}
        <span className="font-medium text-gray-800">{customer?.email}</span>.
      </p>

      {/* Confirmation card */}
      <div className="card text-left space-y-3 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-gray-900">Booking Details</h2>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full uppercase tracking-wide">
            Confirmed
          </span>
        </div>

        <div className="text-center py-3 bg-brand-50 rounded-xl">
          <p className="text-xs text-brand-600 font-medium uppercase tracking-widest mb-1">Confirmation Code</p>
          <p className="text-2xl font-bold text-brand-700 tracking-widest">{booking.confirmationCode}</p>
        </div>

        <Row label="Service"   value={service?.name} />
        <Row
          label="Date"
          value={booking.date}
          icon={<CalendarIcon className="w-4 h-4 text-gray-400" />}
        />
        <Row
          label="Time"
          value={booking.time}
          icon={<ClockIcon className="w-4 h-4 text-gray-400" />}
        />
        <Row label="Duration"  value={`${service?.duration} min`} />
        <Row
          label="Price"
          value={`${service?.currency || ''} ${Number(service?.price || 0).toFixed(2)}`}
          highlight
        />
        <div className="border-t pt-3 mt-3 space-y-1 text-sm">
          <p className="text-gray-500">Customer</p>
          <p className="font-medium text-gray-800">{customer?.name}</p>
          <p className="text-gray-500 text-xs">{customer?.email} · {customer?.phone}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/" className="btn-secondary flex-1 text-center">Back to Home</Link>
        <Link to="/book" className="btn-primary flex-1 text-center">Book Another</Link>
      </div>
    </div>
  );
}

function Row({ label, value, highlight, icon }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500 flex items-center gap-1">{icon}{label}</span>
      <span className={`font-medium ${highlight ? 'text-brand-600' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}
