import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { lookupBooking } from '../api/services';
import { SpinnerIcon } from '../components/Icons';

export default function ConfirmationPage() {
  const { code } = useParams();

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['booking', code],
    queryFn: () => lookupBooking(code),
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <SpinnerIcon className="w-10 h-10" style={{ color: '#1e3a8a' }} />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '5rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
        <h2 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Booking Not Found</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
          That confirmation code doesn't match any booking. Double-check and try again.
        </p>
        <Link to="/lookup" className="btn-primary">Try Again</Link>
      </div>
    );
  }

  const service = booking.serviceSnapshot || booking.service;
  const customer = booking.customer;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Success banner */}
      <div style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', padding: '2.5rem 1rem', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
          border: '3px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 34, margin: '0 auto 1rem',
        }}>
          ✓
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 900, color: 'white', marginBottom: 6 }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: '#bbf7d0', fontSize: 14 }}>
          Your appointment is locked in. Check your email for confirmation.
        </p>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Confirmation code */}
        <div style={{
          background: 'white', borderRadius: '1.25rem', padding: '1.5rem',
          border: '2px solid #bbf7d0', boxShadow: '0 4px 16px rgba(22,163,74,0.1)',
          textAlign: 'center', marginBottom: '1.25rem',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Your Confirmation Code
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '0.2em', fontFamily: 'monospace' }}>
            {booking.confirmationCode}
          </p>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
            Save this code to view or manage your booking
          </p>
        </div>

        {/* Booking details card */}
        <div style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>Booking Details</p>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
              background: '#dcfce7', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Confirmed
            </span>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <DetailRow icon="🔧" label="Service"  value={service?.name} />
            <DetailRow icon="📅" label="Date"     value={booking.date} />
            <DetailRow icon="🕐" label="Time"     value={booking.time} />
            <DetailRow icon="⏱" label="Duration" value={
              service?.duration >= 60
                ? `${Math.floor(service.duration/60)}h${service.duration%60>0?' '+service.duration%60+'m':''}`
                : `${service?.duration} min`
            } />
            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#1e3a8a' }}>
                {service?.currency} {Number(service?.price || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer card */}
        <div style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.875rem 1.25rem' }}>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>Customer Details</p>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <DetailRow icon="👤" label="Name"  value={customer?.name} />
            <DetailRow icon="✉"  label="Email" value={customer?.email} />
            <DetailRow icon="📞" label="Phone" value={customer?.phone} />
          </div>
        </div>

        {/* Info note */}
        <div style={{
          background: '#eff6ff', borderRadius: '0.875rem', padding: '0.875rem 1rem',
          border: '1px solid #bfdbfe', fontSize: 13, color: '#1d4ed8', marginBottom: '1.5rem',
          display: 'flex', gap: 8,
        }}>
          <span>ℹ️</span>
          <span>Our team will contact you to confirm the appointment time. Payment is collected on-site.</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/" style={{
            flex: 1, minWidth: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, background: 'white', color: '#1e3a8a', fontWeight: 700, fontSize: 14,
            padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #cbd5e1',
            textDecoration: 'none', transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            ← Back to Home
          </Link>
          <Link to="/book" style={{
            flex: 1, minWidth: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, background: '#1e3a8a', color: 'white', fontWeight: 700, fontSize: 14,
            padding: '0.75rem', borderRadius: '0.75rem', textDecoration: 'none',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#1e2d6b'}
            onMouseLeave={e => e.currentTarget.style.background = '#1e3a8a'}
          >
            📅 Book Another
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: 13, borderBottom: '1px solid #f8fafc' }}>
      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{icon}</span>{label}
      </span>
      <span style={{ fontWeight: 600, color: '#1e293b', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}
