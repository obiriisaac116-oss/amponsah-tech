import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { lookupBooking, cancelBooking } from '../api/services';
import { SpinnerIcon, CalendarIcon, ClockIcon, CheckCircleIcon } from '../components/Icons';

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  'no-show': 'bg-gray-100 text-gray-600',
};

export default function LookupPage() {
  const [code, setCode] = useState('');
  const [booking, setBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const lookupMutation = useMutation({
    mutationFn: () => lookupBooking(code.trim().toUpperCase()),
    onSuccess: (data) => setBooking(data),
    onError: (err) => toast.error(err.message),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(booking._id, 'Cancelled by customer'),
    onSuccess: () => {
      toast.success('Booking cancelled.');
      setBooking((prev) => ({ ...prev, status: 'cancelled' }));
      setCancelling(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const service = booking?.serviceSnapshot || booking?.service;
  const customer = booking?.customer;

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Find My Booking</h1>
      <p className="text-gray-500 mb-8">Enter your confirmation code to view or manage your booking.</p>

      {/* Search form */}
      <div className="card mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Code</label>
        <div className="flex gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. ABC12345"
            maxLength={8}
            className="input flex-1 uppercase tracking-widest font-mono"
            onKeyDown={(e) => e.key === 'Enter' && lookupMutation.mutate()}
          />
          <button
            onClick={() => lookupMutation.mutate()}
            disabled={code.length < 5 || lookupMutation.isPending}
            className="btn-primary px-5 flex items-center gap-2"
          >
            {lookupMutation.isPending && <SpinnerIcon className="w-4 h-4" />}
            Find
          </button>
        </div>
      </div>

      {/* Result */}
      {booking && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Booking Details</h2>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-600'}`}>
              {booking.status}
            </span>
          </div>

          <div className="bg-brand-50 rounded-xl py-3 text-center">
            <p className="text-xs text-brand-600 font-medium uppercase tracking-widest mb-0.5">Confirmation Code</p>
            <p className="text-xl font-bold text-brand-700 tracking-widest">{booking.confirmationCode}</p>
          </div>

          <div className="space-y-2 text-sm">
            <Row label="Service"  value={service?.name} />
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
            <Row label="Price"    value={`${service?.currency || ''} ${Number(service?.price || 0).toFixed(2)}`} highlight />
            <div className="border-t pt-3">
              <p className="text-gray-500 mb-1">Customer</p>
              <p className="font-medium">{customer?.name}</p>
              <p className="text-gray-400 text-xs">{customer?.email}</p>
            </div>
          </div>

          {/* Cancel button */}
          {['pending', 'confirmed'].includes(booking.status) && (
            <div className="pt-2">
              {cancelling ? (
                <div className="space-y-3">
                  <p className="text-sm text-red-600 font-medium">Are you sure you want to cancel this booking?</p>
                  <div className="flex gap-3">
                    <button onClick={() => setCancelling(false)} className="btn-secondary flex-1 text-sm">
                      Keep Booking
                    </button>
                    <button
                      onClick={() => cancelMutation.mutate()}
                      disabled={cancelMutation.isPending}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      {cancelMutation.isPending && <SpinnerIcon className="w-4 h-4" />}
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setCancelling(true)}
                  className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          )}

          {booking.status === 'cancelled' && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              <CheckCircleIcon className="w-4 h-4 text-gray-400" />
              This booking has been cancelled.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight, icon }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500 flex items-center gap-1">{icon}{label}</span>
      <span className={`font-medium ${highlight ? 'text-brand-600' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}
