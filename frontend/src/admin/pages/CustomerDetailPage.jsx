import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { fetchCustomer, updateCustomer } from '../api/admin';
import { SpinnerIcon } from '../../components/Icons';

const STATUS_STYLE = {
  pending:   { bg: '#fefce8', color: '#854d0e' },
  confirmed: { bg: '#eff6ff', color: '#1d4ed8' },
  completed: { bg: '#f0fdf4', color: '#15803d' },
  cancelled: { bg: '#fef2f2', color: '#dc2626' },
  'no-show': { bg: '#f8fafc', color: '#64748b' },
};

const S = {
  card:  { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 },
  input: { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0.65rem 0.875rem', fontSize: 15, outline: 'none', boxSizing: 'border-box' },
  btn:   { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#1e3a8a', color: 'white', fontWeight: 700, fontSize: 14, padding: '0.7rem 1.5rem', borderRadius: 8, border: 'none', cursor: 'pointer' },
};

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customer', id],
    queryFn: () => fetchCustomer(id),
  });

  const { register, handleSubmit } = useForm({
    values: data?.customer
      ? { name: data.customer.name, phone: data.customer.phone, notes: data.customer.notes || '' }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: body => updateCustomer(id, body),
    onSuccess: () => { toast.success('Customer updated'); qc.invalidateQueries(['admin-customer', id]); },
    onError: e => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <SpinnerIcon />
      </div>
    );
  }

  if (!data) {
    return <p style={{ color: '#dc2626', fontSize: 14 }}>Customer not found.</p>;
  }

  const { customer, bookings } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 720 }}>

      {/* Back + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)}
          style={{ fontSize: 13, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>
          ← Back
        </button>
        <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', margin: 0 }}>{customer.name}</h2>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 160px), 1fr))', gap: '0.75rem' }}>
        <div style={{ ...S.card, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bookings</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e3a8a', margin: 0 }}>{customer.totalBookings}</p>
        </div>
        <div style={{ ...S.card, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Member Since</p>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {new Date(customer.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Edit form */}
      <div style={S.card}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', margin: '0 0 1rem' }}>Customer Info</h3>
        <form onSubmit={handleSubmit(d => mutation.mutate(d))}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={S.label}>Full Name</label>
              <input {...register('name')} style={S.input} />
            </div>
            <div>
              <label style={S.label}>Email <span style={{ color: '#94a3b8', fontWeight: 400 }}>(read-only)</span></label>
              <input value={customer.email} disabled style={{ ...S.input, background: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={S.label}>Phone</label>
              <input {...register('phone')} style={S.input} />
            </div>
            <div>
              <label style={S.label}>Notes</label>
              <textarea {...register('notes')} rows={2} style={{ ...S.input, resize: 'vertical' }} />
            </div>
          </div>
          <button type="submit" disabled={mutation.isPending} style={{ ...S.btn, opacity: mutation.isPending ? 0.7 : 1 }}>
            {mutation.isPending && <SpinnerIcon />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Recent bookings */}
      <div style={S.card}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', margin: '0 0 1rem' }}>Recent Bookings</h3>
        {bookings.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, padding: '1.5rem 0' }}>No bookings yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bookings.map(b => {
              const ss = STATUS_STYLE[b.status] || STATUS_STYLE['no-show'];
              return (
                <div key={b._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem', background: '#f8fafc', borderRadius: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.service?.name}
                    </p>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0, fontFamily: 'monospace' }}>
                      {b.date} · {b.time}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#1e3a8a', margin: '0 0 3px' }}>
                      {b.serviceSnapshot?.currency || 'GHS'} {b.serviceSnapshot?.price?.toFixed(2) || '—'}
                    </p>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: ss.bg, color: ss.color, textTransform: 'capitalize' }}>
                      {b.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
