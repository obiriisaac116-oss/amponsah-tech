import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { fetchServices, fetchSlots, createBooking } from '../api/services';
import { SpinnerIcon } from '../components/Icons';

const STEPS = ['Service', 'Date & Time', 'Details', 'Confirm'];

const CATEGORY_ICONS = {
  'CCTV Installation':     '📷',
  'Internet & Networking': '🌐',
  'Electrical Services':   '⚡',
};

const CATEGORY_STYLE = {
  'CCTV Installation':     { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  'Internet & Networking': { bg: '#ecfeff', color: '#0e7490', border: '#a5f3fc' },
  'Electrical Services':   { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
};

function getDateRange() {
  const today = new Date();
  const max = new Date(today);
  max.setDate(today.getDate() + 30);
  return {
    min: today.toISOString().split('T')[0],
    max: max.toISOString().split('T')[0],
  };
}

function formatDuration(mins) {
  if (!mins) return '';
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins} min`;
}

// ─── Inline style constants ──────────────────────────────────────────────────
const S = {
  page:       { background: '#f8fafc', minHeight: '100vh' },
  pageHdr:    { background: 'linear-gradient(135deg,#1e3a8a,#1e40af)', padding: '2rem 1rem' },
  pageHdrInner:{ maxWidth: 600, margin: '0 auto' },
  pageTitle:  { fontSize: 'clamp(1.4rem,5vw,2rem)', fontWeight: 900, color: 'white', margin: '0 0 4px' },
  pageSub:    { color: '#bfdbfe', fontSize: 14, margin: 0 },
  body:       { maxWidth: 600, margin: '0 auto', padding: '1.5rem 1rem 4rem' },
  card:       { background: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 0 },
  cardTitle:  { fontWeight: 800, fontSize: 17, color: '#0f172a', margin: '0 0 4px' },
  cardSub:    { fontSize: 13, color: '#64748b', margin: '0 0 16px' },
  label:      { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input:      { width: '100%', border: '1.5px solid #cbd5e1', borderRadius: '0.625rem', padding: '0.75rem 1rem', fontSize: 16, background: 'white', color: '#0f172a', boxSizing: 'border-box', outline: 'none', WebkitAppearance: 'none' },
  error:      { color: '#dc2626', fontSize: 12, marginTop: 4 },
  row:        { display: 'flex', gap: 12 },
  btnPrimary: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#1e3a8a', color: 'white', fontWeight: 700, fontSize: 15, padding: '0.75rem 1rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer' },
  btnSecondary:{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'white', color: '#1e3a8a', fontWeight: 700, fontSize: 15, padding: '0.75rem 1rem', borderRadius: '0.625rem', border: '1.5px solid #cbd5e1', cursor: 'pointer' },
};

export default function BookingPage() {
  const { serviceId: paramServiceId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(paramServiceId ? 1 : 0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const { min, max } = getDateRange();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  useEffect(() => {
    if (paramServiceId && services.length > 0) {
      const found = services.find(s => s._id === paramServiceId);
      if (found) { setSelectedService(found); setStep(1); }
    }
  }, [paramServiceId, services]);

  const { data: slotsData, isLoading: loadingSlots } = useQuery({
    queryKey: ['slots', selectedService?._id, selectedDate],
    queryFn: () => fetchSlots(selectedService._id, selectedDate),
    enabled: !!(selectedService && selectedDate),
  });

  const slots = slotsData?.slots || [];

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: res => navigate(`/confirmation/${res.data.confirmationCode}`),
    onError: err => toast.error(err.message),
  });

  function onSubmit(data) {
    mutation.mutate({
      serviceId: selectedService._id,
      date: selectedDate,
      time: selectedTime,
      notes: data.notes,
      customer: { name: data.name, email: data.email, phone: data.phone },
    });
  }

  function goNext() { setStep(s => s + 1); }
  function goBack() {
    if (step === 1 && paramServiceId) navigate('/book');
    else setStep(s => s - 1);
  }

  return (
    <div style={S.page}>
      {/* Page header */}
      <div style={S.pageHdr}>
        <div style={S.pageHdrInner}>
          <h1 style={S.pageTitle}>Book a Service</h1>
          <p style={S.pageSub}>Complete the steps below to confirm your appointment.</p>
        </div>
      </div>

      <div style={S.body}>

        {/* ── Step indicator ── */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 13,
                  background: i < step ? '#1e3a8a' : i === step ? '#eff6ff' : 'white',
                  color: i < step ? 'white' : i === step ? '#1e3a8a' : '#94a3b8',
                  border: i < step ? 'none' : i === step ? '2px solid #1e3a8a' : '2px solid #e2e8f0',
                  boxShadow: i === step ? '0 0 0 4px rgba(30,58,138,0.12)' : 'none',
                  flexShrink: 0,
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 10, marginTop: 4, fontWeight: 600, whiteSpace: 'nowrap', color: i === step ? '#1e3a8a' : i < step ? '#64748b' : '#94a3b8' }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, margin: '0 4px 18px', background: i < step ? '#1e3a8a' : '#e2e8f0' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 0: Service ── */}
        {step === 0 && (
          <div style={S.card}>
            <h2 style={S.cardTitle}>Select a Service</h2>
            <p style={S.cardSub}>Choose the service you need and we'll come to you.</p>

            {loadingServices ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                <SpinnerIcon />
              </div>
            ) : services.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                <p style={{ fontSize: 14 }}>No services available right now.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {services.map(svc => {
                  const cs = CATEGORY_STYLE[svc.category] || {};
                  const icon = CATEGORY_ICONS[svc.category] || '🔧';
                  return (
                    <button
                      key={svc._id}
                      type="button"
                      onClick={() => { setSelectedService(svc); goNext(); }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '0.875rem',
                        borderRadius: '0.875rem', cursor: 'pointer',
                        border: '1.5px solid #e2e8f0', background: 'white',
                        display: 'flex', alignItems: 'center', gap: 12,
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#1e3a8a'; e.currentTarget.style.background = '#f8faff'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                    >
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: cs.bg || '#f1f5f9', border: `1px solid ${cs.border || '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                        {icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                          <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>{svc.name}</p>
                          <p style={{ fontWeight: 800, fontSize: 14, color: '#1e3a8a', margin: 0, flexShrink: 0 }}>GHS {svc.price.toFixed(2)}</p>
                        </div>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>⏱ {formatDuration(svc.duration)} · {svc.category}</p>
                      </div>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#cbd5e1" strokeWidth={2.5} style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Date & Time ── */}
        {step === 1 && (
          <div style={S.card}>
            <h2 style={S.cardTitle}>Pick a Date &amp; Time</h2>

            {/* Service badge */}
            {selectedService && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#eff6ff', borderRadius: 10, padding: '8px 12px', border: '1px solid #bfdbfe', marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>{CATEGORY_ICONS[selectedService.category] || '🔧'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#1e3a8a', margin: 0 }}>{selectedService.name}</p>
                  <p style={{ fontSize: 11, color: '#3b82f6', margin: 0 }}>GHS {selectedService.price.toFixed(2)} · {formatDuration(selectedService.duration)}</p>
                </div>
                <button type="button" onClick={() => { setSelectedService(null); setStep(0); }}
                  style={{ fontSize: 12, color: '#64748b', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Change
                </button>
              </div>
            )}

            {/* Date picker */}
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>📅 Select Date</label>
              <input
                type="date" min={min} max={max} value={selectedDate}
                onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                style={S.input}
              />
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>🕐 Available Times</label>
                {loadingSlots ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}><SpinnerIcon /></div>
                ) : slots.length === 0 ? (
                  <div style={{ background: '#fef2f2', borderRadius: 10, padding: '0.875rem', border: '1px solid #fecaca', textAlign: 'center' }}>
                    <p style={{ color: '#dc2626', fontSize: 13, fontWeight: 600, margin: 0 }}>No slots available — try another date</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: 8 }}>
                    {slots.map(t => (
                      <button key={t} type="button" onClick={() => setSelectedTime(t)}
                        style={{
                          padding: '0.5rem 0', borderRadius: 8, fontWeight: 700, fontSize: 13,
                          border: selectedTime === t ? '2px solid #1e3a8a' : '1.5px solid #e2e8f0',
                          background: selectedTime === t ? '#1e3a8a' : 'white',
                          color: selectedTime === t ? 'white' : '#374151',
                          cursor: 'pointer',
                        }}>
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={S.row}>
              <button type="button" onClick={goBack} style={S.btnSecondary}>← Back</button>
              <button type="button" onClick={goNext} disabled={!selectedDate || !selectedTime}
                style={{ ...S.btnPrimary, opacity: (!selectedDate || !selectedTime) ? 0.5 : 1, cursor: (!selectedDate || !selectedTime) ? 'not-allowed' : 'pointer' }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Details ── */}
        {step === 2 && (
          <div style={S.card}>
            <h2 style={S.cardTitle}>Your Details</h2>
            <p style={S.cardSub}>We'll use this to confirm your appointment.</p>
            <form onSubmit={e => e.preventDefault()}>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Full Name *</label>
                <input {...register('name', { required: 'Name is required' })} placeholder="e.g. Kwame Mensah" style={S.input} />
                {errors.name && <p style={S.error}>{errors.name.message}</p>}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Email Address *</label>
                <input {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                  type="email" placeholder="you@example.com" style={S.input} />
                {errors.email && <p style={S.error}>{errors.email.message}</p>}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Phone Number * <span style={{ fontWeight: 400, color: '#94a3b8' }}>(WhatsApp preferred)</span></label>
                <input {...register('phone', { required: 'Phone required' })} type="tel" placeholder="0256 287 345" style={S.input} />
                {errors.phone && <p style={S.error}>{errors.phone.message}</p>}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={S.label}>Site Address / Location <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span></label>
                <input {...register('notes')} placeholder="e.g. 12 Accra Road, Kumasi" style={S.input} />
              </div>
              <div style={S.row}>
                <button type="button" onClick={goBack} style={S.btnSecondary}>← Back</button>
                <button type="button" onClick={handleSubmit(() => goNext())} style={S.btnPrimary}>Review →</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === 3 && (
          <div style={S.card}>
            <h2 style={S.cardTitle}>Confirm Your Booking</h2>
            <p style={S.cardSub}>Review everything before confirming.</p>

            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1rem', marginBottom: 12, border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Booking</p>
              <SRow label="Service"  value={selectedService?.name} />
              <SRow label="Date"     value={selectedDate} />
              <SRow label="Time"     value={selectedTime} />
              <SRow label="Duration" value={formatDuration(selectedService?.duration)} />
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: '#1e3a8a' }}>GHS {selectedService?.price.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1rem', marginBottom: 12, border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Your Details</p>
              <SRow label="Name"  value={getValues('name')} />
              <SRow label="Email" value={getValues('email')} />
              <SRow label="Phone" value={getValues('phone')} />
              {getValues('notes') && <SRow label="Location" value={getValues('notes')} />}
            </div>

            <div style={{ background: '#eff6ff', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: 16, fontSize: 12, color: '#1d4ed8', display: 'flex', gap: 8 }}>
              <span>ℹ️</span><span>Confirmation sent to your email &amp; WhatsApp. Payment collected on-site.</span>
            </div>

            <div style={S.row}>
              <button type="button" onClick={goBack} style={S.btnSecondary}>← Back</button>
              <button type="button" onClick={handleSubmit(onSubmit)} disabled={mutation.isPending}
                style={{ ...S.btnPrimary, opacity: mutation.isPending ? 0.7 : 1 }}>
                {mutation.isPending ? <><SpinnerIcon /> Booking…</> : '✓ Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#0f172a', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}
