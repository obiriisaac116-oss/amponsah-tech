import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { fetchServices, fetchSlots, createBooking } from '../api/services';
import { SpinnerIcon, CalendarIcon, ClockIcon } from '../components/Icons';

const STEPS = ['Service', 'Date & Time', 'Your Details', 'Confirm'];

// Get today and max date strings
function getDateRange() {
  const today = new Date();
  const max = new Date(today);
  max.setDate(today.getDate() + 30);
  return {
    min: today.toISOString().split('T')[0],
    max: max.toISOString().split('T')[0],
  };
}

export default function BookingPage() {
  const { serviceId: paramServiceId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(paramServiceId ? 1 : 0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const { min, max } = getDateRange();

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Load services
  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  // Pre-select service from URL param
  useEffect(() => {
    if (paramServiceId && services.length > 0) {
      const found = services.find((s) => s._id === paramServiceId);
      if (found) setSelectedService(found);
    }
  }, [paramServiceId, services]);

  // Load slots whenever service + date are set
  const { data: slotsData, isLoading: loadingSlots } = useQuery({
    queryKey: ['slots', selectedService?._id, selectedDate],
    queryFn: () => fetchSlots(selectedService._id, selectedDate),
    enabled: !!(selectedService && selectedDate),
  });

  const slots = slotsData?.slots || [];

  // Submit booking
  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (res) => {
      navigate(`/confirmation/${res.data.confirmationCode}`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function onSubmit(data) {
    mutation.mutate({
      serviceId: selectedService._id,
      date: selectedDate,
      time: selectedTime,
      notes: data.notes,
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  function goNext() { setStep((s) => s + 1); }
  function goBack() { setStep((s) => s - 1); }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
      <p className="text-gray-500 mb-8">Complete the steps below to secure your slot.</p>

      {/* Step indicator */}
      <div className="flex items-center mb-10 gap-0">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                  i < step
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : i === step
                    ? 'border-brand-600 text-brand-600 bg-white'
                    : 'border-gray-300 text-gray-400 bg-white'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium ${i === step ? 'text-brand-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-5 ${i < step ? 'bg-brand-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 0: Choose Service ── */}
      {step === 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Select a Service</h2>
          {loadingServices ? (
            <div className="flex justify-center py-8"><SpinnerIcon className="w-7 h-7 text-brand-600" /></div>
          ) : (
            <div className="space-y-3">
              {services.map((svc) => (
                <button
                  key={svc._id}
                  onClick={() => { setSelectedService(svc); goNext(); }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors hover:border-brand-500 ${
                    selectedService?._id === svc._id ? 'border-brand-600 bg-brand-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{svc.name}</p>
                      {svc.description && <p className="text-xs text-gray-500 mt-0.5">{svc.description}</p>}
                    </div>
                    <div className="text-right text-sm shrink-0 ml-4">
                      <p className="font-semibold text-brand-600">{svc.currency} {svc.price.toFixed(2)}</p>
                      <p className="text-gray-400">{svc.duration} min</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Step 1: Date & Time ── */}
      {step === 1 && (
        <div className="card space-y-6">
          <h2 className="text-lg font-semibold">Pick a Date & Time</h2>
          <p className="text-sm text-gray-500">
            Service: <span className="font-medium text-gray-800">{selectedService?.name}</span>
          </p>

          {/* Date picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <CalendarIcon className="inline w-4 h-4 mr-1" />Date
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ClockIcon className="inline w-4 h-4 mr-1" />Available Times
              </label>
              {loadingSlots ? (
                <div className="flex justify-center py-4"><SpinnerIcon className="w-6 h-6 text-brand-600" /></div>
              ) : slots.length === 0 ? (
                <p className="text-sm text-red-500">No slots available for this date. Please try another day.</p>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {slots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 px-1 rounded-lg text-sm font-medium border-2 transition-colors ${
                        selectedTime === t
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'border-gray-200 hover:border-brand-400 text-gray-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={goBack} className="btn-secondary flex-1">Back</button>
            <button
              onClick={goNext}
              disabled={!selectedDate || !selectedTime}
              className="btn-primary flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Customer Details ── */}
      {step === 2 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Your Details</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Jane Doe"
                className="input"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
                type="email"
                placeholder="jane@example.com"
                className="input"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                {...register('phone', { required: 'Phone is required' })}
                type="tel"
                placeholder="+233 XX XXX XXXX"
                className="input"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Any special requests or information…"
                className="input resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className="btn-secondary flex-1">Back</button>
              <button
                type="button"
                onClick={handleSubmit(() => goNext())}
                className="btn-primary flex-1"
              >
                Review Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Step 3: Confirm ── */}
      {step === 3 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Confirm Your Booking</h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <Row label="Service"  value={selectedService?.name} />
              <Row label="Date"     value={selectedDate} />
              <Row label="Time"     value={selectedTime} />
              <Row label="Duration" value={`${selectedService?.duration} min`} />
              <Row
                label="Price"
                value={`${selectedService?.currency} ${selectedService?.price.toFixed(2)}`}
                highlight
              />
            </div>
            <p className="text-xs text-gray-400">
              A confirmation will be sent to your email and WhatsApp after booking.
            </p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className="btn-secondary flex-1">Back</button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {mutation.isPending && <SpinnerIcon className="w-4 h-4" />}
                {mutation.isPending ? 'Booking…' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${highlight ? 'text-brand-600' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}
