import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { fetchServices, fetchSlots, createBooking } from '../api/services';
import { SpinnerIcon } from '../components/Icons';

const STEPS = ['Service', 'Date & Time', 'Details', 'Confirm'];

const CATEGORY_ICONS = {
  'CCTV Installation':    '📷',
  'Internet & Networking': '🌐',
  'Electrical Services':  '⚡',
};

const CATEGORY_STYLE = {
  'CCTV Installation':    { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  'Internet & Networking': { bg: '#ecfeff', color: '#0e7490', border: '#a5f3fc' },
  'Electrical Services':  { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
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
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins} min`;
}

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

  // Pre-select service from URL param
  useEffect(() => {
    if (paramServiceId && services.length > 0) {
      const found = services.find((s) => s._id === paramServiceId);
      if (found) {
        setSelectedService(found);
        setStep(1);
      }
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
    onSuccess: (res) => navigate(`/confirmation/${res.data.confirmationCode}`),
    onError: (err) => toast.error(err.message),
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

  function goNext() { setStep((s) => s + 1); }
  function goBack() {
    if (step === 1 && paramServiceId) {
      navigate('/book');
    } else {
      setStep((s) => s - 1);
    }
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1e40af)' }} className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Book a Service</h1>
          <p className="text-blue-200 text-sm">Fill in the steps below to confirm your appointment.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  style={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14,
                    border: i < step ? 'none' : i === step ? '2px solid #1e3a8a' : '2px solid #cbd5e1',
                    background: i < step ? '#1e3a8a' : i === step ? '#eff6ff' : 'white',
                    color: i < step ? 'white' : i === step ? '#1e3a8a' : '#94a3b8',
                    transition: 'all 0.2s',
                    boxShadow: i === step ? '0 0 0 4px rgba(30,58,138,0.12)' : 'none',
                  }}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{
                  fontSize: 11, marginTop: 4, fontWeight: 600,
                  color: i === step ? '#1e3a8a' : i < step ? '#64748b' : '#94a3b8',
                }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, marginBottom: 20, marginLeft: 4, marginRight: 4,
                  background: i < step ? '#1e3a8a' : '#e2e8f0',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 0: Choose Service ── */}
        {step === 0 && (
          <div className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Select a Service</h2>
            <p className="text-sm text-slate-500 mb-5">Choose the service you need and we'll come to you.</p>

            {loadingServices ? (
              <div className="flex justify-center py-10">
                <SpinnerIcon className="w-8 h-8" style={{ color: '#1e3a8a' }} />
              </div>
            ) : (
              <div className="space-y-2.5">
                {services.map((svc) => {
                  const catStyle = CATEGORY_STYLE[svc.category] || {};
                  const icon = CATEGORY_ICONS[svc.category] || '🔧';
                  const isSelected = selectedService?._id === svc._id;

                  return (
                    <button
                      key={svc._id}
                      type="button"
                      onClick={() => { setSelectedService(svc); goNext(); }}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '1rem', borderRadius: '0.875rem',
                        border: isSelected ? '2px solid #1e3a8a' : '1.5px solid #e2e8f0',
                        background: isSelected ? '#eff6ff' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: '0.875rem',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#93c5fd';
                          e.currentTarget.style.background = '#fafcff';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,58,138,0.1)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 44, height: 44, borderRadius: '0.75rem', flexShrink: 0,
                        background: catStyle.bg || '#f1f5f9',
                        border: `1px solid ${catStyle.border || '#e2e8f0'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20,
                      }}>
                        {icon}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{svc.name}</p>
                          <p style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.9rem', flexShrink: 0 }}>
                            GHS {svc.price.toFixed(2)}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 3 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 999,
                            background: catStyle.bg || '#f1f5f9',
                            color: catStyle.color || '#475569',
                            border: `1px solid ${catStyle.border || '#e2e8f0'}`,
                          }}>
                            {svc.category}
                          </span>
                          <span style={{ fontSize: 11, color: '#64748b' }}>⏱ {formatDuration(svc.duration)}</span>
                        </div>
                        {svc.description && (
                          <p style={{ fontSize: 12, color: '#64748b', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {svc.description}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <svg style={{ width: 18, height: 18, color: isSelected ? '#1e3a8a' : '#cbd5e1', flexShrink: 0 }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
          <div className="card space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Pick a Date &amp; Time</h2>
              {/* Selected service summary */}
              {selectedService && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#eff6ff', borderRadius: '0.75rem', padding: '0.6rem 0.875rem',
                  border: '1px solid #bfdbfe', marginTop: 10,
                }}>
                  <span style={{ fontSize: 18 }}>{CATEGORY_ICONS[selectedService.category] || '🔧'}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#1e3a8a' }}>{selectedService.name}</p>
                    <p style={{ fontSize: 11, color: '#3b82f6' }}>
                      GHS {selectedService.price.toFixed(2)} · {formatDuration(selectedService.duration)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSelectedService(null); setStep(0); }}
                    style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                📅 Select Date
              </label>
              <input
                type="date"
                min={min}
                max={max}
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                className="input"
              />
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                  🕐 Available Time Slots
                </label>
                {loadingSlots ? (
                  <div className="flex justify-center py-6">
                    <SpinnerIcon className="w-6 h-6" style={{ color: '#1e3a8a' }} />
                  </div>
                ) : slots.length === 0 ? (
                  <div style={{ background: '#fef2f2', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #fecaca', textAlign: 'center' }}>
                    <p style={{ color: '#dc2626', fontSize: 13, fontWeight: 600 }}>No slots available for this date</p>
                    <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>Please try a different day</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 8 }}>
                    {slots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        style={{
                          padding: '0.5rem 0.25rem', borderRadius: '0.625rem', fontWeight: 600, fontSize: 13,
                          border: selectedTime === t ? '2px solid #1e3a8a' : '1.5px solid #e2e8f0',
                          background: selectedTime === t ? '#1e3a8a' : 'white',
                          color: selectedTime === t ? 'white' : '#374151',
                          cursor: 'pointer', transition: 'all 0.15s',
                          boxShadow: selectedTime === t ? '0 2px 8px rgba(30,58,138,0.3)' : 'none',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={goBack} className="btn-secondary flex-1">← Back</button>
              <button
                type="button"
                onClick={goNext}
                disabled={!selectedDate || !selectedTime}
                className="btn-primary flex-1"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Customer Details ── */}
        {step === 2 && (
          <div className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Your Details</h2>
            <p className="text-sm text-slate-500 mb-5">We'll use this to send your confirmation and contact you.</p>
            <form className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Full Name *
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="e.g. Kwame Mensah"
                  className="input"
                />
                {errors.name && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.name.message}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Email Address *
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="input"
                />
                {errors.email && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Phone Number * <span style={{ color: '#94a3b8', fontWeight: 400 }}>(WhatsApp preferred)</span>
                </label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  type="tel"
                  placeholder="0256 287 345"
                  className="input"
                />
                {errors.phone && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.phone.message}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Site Address / Location <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  {...register('notes')}
                  placeholder="e.g. 12 Accra Road, Kumasi"
                  className="input"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={goBack} className="btn-secondary flex-1">← Back</button>
                <button
                  type="button"
                  onClick={handleSubmit(() => goNext())}
                  className="btn-primary flex-1"
                >
                  Review →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === 3 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Confirm Your Booking</h2>
              <p className="text-sm text-slate-500 mb-5">Please review your details before confirming.</p>

              {/* Summary */}
              <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Booking Summary
                </p>
                <SummaryRow label="Service"  value={selectedService?.name} />
                <SummaryRow label="Category" value={selectedService?.category} />
                <SummaryRow label="Date"     value={selectedDate} />
                <SummaryRow label="Time"     value={selectedTime} />
                <SummaryRow label="Duration" value={formatDuration(selectedService?.duration)} />
                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Total</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#1e3a8a' }}>
                    GHS {selectedService?.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Customer summary */}
              <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1rem', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Your Details
                </p>
                <SummaryRow label="Name"    value={getValues('name')} />
                <SummaryRow label="Email"   value={getValues('email')} />
                <SummaryRow label="Phone"   value={getValues('phone')} />
                {getValues('notes') && <SummaryRow label="Location" value={getValues('notes')} />}
              </div>

              <div style={{ background: '#eff6ff', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: 12, color: '#3b82f6', display: 'flex', gap: 8 }}>
                <span>ℹ️</span>
                <span>A confirmation will be sent to your email and WhatsApp. Payment is collected on-site.</span>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={goBack} className="btn-secondary flex-1">← Back</button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="btn-primary flex-1"
                >
                  {mutation.isPending ? (
                    <><SpinnerIcon className="w-4 h-4" /> Booking…</>
                  ) : (
                    '✓ Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', fontSize: 13 }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#1e293b', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}
