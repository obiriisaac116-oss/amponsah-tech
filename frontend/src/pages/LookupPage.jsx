import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { lookupBooking, cancelBooking } from '../api/services';
import { SpinnerIcon } from '../components/Icons';

const STATUS_META = {
  pending:   { bg: '#fefce8', color: '#854d0e', border: '#fde68a', label: 'Pending' },
  confirmed: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Confirmed' },
  completed: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', label: 'Completed' },
  cancelled: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'Cancelled' },
  'no-show': { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0', label: 'No-show'  },
};

export default function LookupPage() {
  const [code, setCode] = useState('');
  const [booking, setBooking] = useState(null);
  const [confirming, setConfirming] = useState(false);

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
      setConfirming(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const service = booking?.serviceSnapshot || booking?.service;
  const customer = booking?.customer;
  const statusMeta = STATUS_META[booking?.status] || STATUS_META.pending;
  const canCancel = ['pending', 'confirmed'].includes(booking?.status);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1e40af)', padding: '3rem 1rem 2rem' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 900, color: 'white', marginBottom: 6 }}>
            Find My Booking
          </h1>
          <p style={{ color: '#bfdbfe', fontSize: 14, marginBottom: '1.5rem' }}>
            Enter your confirmation code to view or manage your appointment.
          </p>

          {/* Search input */}
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && code.length >= 5 && lookupMutation.mutate()}
              placeholder="e.g. ABC12345"
              maxLength={8}
              style={{
                flex: 1, padding: '0.75rem 1rem', borderRadius: '0.75rem',
                border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)',
                color: 'white', fontSize: 16, fontFamily: 'monospace', fontWeight: 700,
                letterSpacing: '0.15em', outline: 'none',
              }}
            />
            <button
              onClick={() => lookupMutation.mutate()}
              disabled={code.length < 5 || lookupMutation.isPending}
              style={{
                background: code.length >= 5 ? 'white' : 'rgba(255,255,255,0.2)',
                color: code.length >= 5 ? '#1e3a8a' : 'rgba(255,255,255,0.5)',
                fontWeight: 800, fontSize: 14, padding: '0.75rem 1.25rem',
                borderRadius: '0.75rem', border: 'none', cursor: code.length >= 5 ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
                minWidth: 80,
              }}
            >
              {lookupMutation.isPending ? <SpinnerIcon className="w-4 h-4" /> : '🔍 Find'}
            </button>
          </div>
        </div>

        {/* Wave */}
        <div style={{ lineHeight: 0, marginTop: '1.5rem' }}>
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ width: '100%', height: 36, display: 'block' }}>
            <path d="M0,20 C360,50 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f8fafc"/>
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

        {/* Empty state */}
        {!booking && !lookupMutation.isPending && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔎</div>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#64748b' }}>Enter your confirmation code above</p>
            <p style={{ fontSize: 12, marginTop: 6 }}>The code was included in your booking confirmation email</p>
          </div>
        )}

        {/* Result card */}
        {booking && (
          <div style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>

            {/* Card header */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                  Confirmation Code
                </p>
                <p style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '0.15em', fontFamily: 'monospace' }}>
                  {booking.confirmationCode}
                </p>
              </div>
              <span style={{
                padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                background: statusMeta.bg, color: statusMeta.color, border: `1px solid ${statusMeta.border}`,
              }}>
                {statusMeta.label}
              </span>
            </div>

            {/* Details */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Appointment
              </p>
              <DetailRow icon="🔧" label="Service"  value={service?.name} />
              <DetailRow icon="📅" label="Date"     value={booking.date} />
              <DetailRow icon="🕐" label="Time"     value={booking.time} />
              <DetailRow icon="💰" label="Price"    value={`${service?.currency || ''} ${Number(service?.price || 0).toFixed(2)}`} highlight />
            </div>

            {/* Customer */}
            <div style={{ padding: '1.25rem', borderBottom: canCancel ? '1px solid #f1f5f9' : 'none' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Customer
              </p>
              <DetailRow icon="👤" label="Name"  value={customer?.name} />
              <DetailRow icon="✉"  label="Email" value={customer?.email} />
            </div>

            {/* Cancel section */}
            {canCancel && (
              <div style={{ padding: '1.25rem' }}>
                {confirming ? (
                  <div>
                    <div style={{ background: '#fef2f2', borderRadius: '0.75rem', padding: '0.875rem', marginBottom: '0.875rem', border: '1px solid #fecaca' }}>
                      <p style={{ fontWeight: 700, color: '#dc2626', fontSize: 14, marginBottom: 4 }}>Cancel this booking?</p>
                      <p style={{ fontSize: 12, color: '#94a3b8' }}>This action cannot be undone.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => setConfirming(false)}
                        style={{
                          flex: 1, padding: '0.7rem', borderRadius: '0.625rem',
                          border: '1.5px solid #cbd5e1', background: 'white', color: '#1e3a8a',
                          fontWeight: 700, fontSize: 14, cursor: 'pointer',
                        }}
                      >
                        Keep It
                      </button>
                      <button
                        onClick={() => cancelMutation.mutate()}
                        disabled={cancelMutation.isPending}
                        style={{
                          flex: 1, padding: '0.7rem', borderRadius: '0.625rem',
                          background: '#dc2626', color: 'white', border: 'none',
                          fontWeight: 700, fontSize: 14, cursor: cancelMutation.isPending ? 'not-allowed' : 'pointer',
                          opacity: cancelMutation.isPending ? 0.6 : 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                      >
                        {cancelMutation.isPending && <SpinnerIcon className="w-4 h-4" />}
                        Yes, Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(true)}
                    style={{
                      width: '100%', padding: '0.7rem', borderRadius: '0.625rem',
                      border: '1.5px solid #fecaca', background: '#fef2f2', color: '#dc2626',
                      fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; }}
                  >
                    Cancel This Booking
                  </button>
                )}
              </div>
            )}

            {/* Completed / cancelled state */}
            {booking.status === 'cancelled' && (
              <div style={{ padding: '1rem 1.25rem', background: '#fef2f2', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#dc2626' }}>
                <span>❌</span> This booking has been cancelled.
              </div>
            )}
            {booking.status === 'completed' && (
              <div style={{ padding: '1rem 1.25rem', background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#16a34a' }}>
                <span>✅</span> This appointment has been completed. Thank you!
              </div>
            )}
          </div>
        )}

        {/* Book again nudge */}
        {booking && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <a href="/book" style={{ color: '#1e3a8a', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              📅 Book another service →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, highlight }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', fontSize: 13, borderBottom: '1px solid #f8fafc' }}>
      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{icon}</span>{label}
      </span>
      <span style={{ fontWeight: highlight ? 800 : 600, color: highlight ? '#1e3a8a' : '#1e293b' }}>
        {value}
      </span>
    </div>
  );
}
