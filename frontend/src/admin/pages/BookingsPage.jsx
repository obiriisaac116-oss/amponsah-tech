import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchBookings, updateBookingStatus, adminCancelBooking } from '../api/admin';
import { SpinnerIcon } from '../../components/Icons';

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'];

const STATUS_STYLE = {
  pending:   { bg: '#fefce8', color: '#854d0e', border: '#fde68a' },
  confirmed: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  completed: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  cancelled: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'no-show': { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
};

function ActionBtn({ label, color, onClick }) {
  const colors = {
    blue:  { bg: '#eff6ff', text: '#1d4ed8' },
    green: { bg: '#f0fdf4', text: '#15803d' },
    red:   { bg: '#fef2f2', text: '#dc2626' },
    gray:  { bg: '#f8fafc', text: '#64748b' },
  }[color] || { bg: '#f8fafc', text: '#374151' };

  return (
    <button onClick={onClick}
      style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: colors.bg, color: colors.text, border: 'none', cursor: 'pointer' }}>
      {label}
    </button>
  );
}

export default function BookingsPage() {
  const qc = useQueryClient();
  const [page, setPage]     = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [date, setDate]     = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', page, status, search, date],
    queryFn: () => fetchBookings({ page, limit: 15, ...(status !== 'all' && { status }), ...(search && { search }), ...(date && { date }) }),
    keepPreviousData: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries(['admin-bookings']); },
    onError:   e  => toast.error(e.message),
  });

  const cancelMutation = useMutation({
    mutationFn: id => adminCancelBooking(id, 'Cancelled by admin'),
    onSuccess: () => { toast.success('Booking cancelled'); qc.invalidateQueries(['admin-bookings']); },
    onError:   e => toast.error(e.message),
  });

  const bookings   = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>Bookings</h2>
        <span style={{ fontSize: 12, color: '#64748b' }}>{pagination?.total ?? 0} total</span>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="Search name, email, code…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ flex: '1 1 160px', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0.5rem 0.75rem', fontSize: 13, outline: 'none' }}
          />
          <input
            type="date" value={date}
            onChange={e => { setDate(e.target.value); setPage(1); }}
            style={{ flex: '0 1 140px', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0.5rem 0.75rem', fontSize: 13, outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              style={{
                padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                border: status === s ? '2px solid #1e3a8a' : '1.5px solid #e2e8f0',
                background: status === s ? '#1e3a8a' : 'white',
                color: status === s ? 'white' : '#64748b',
                cursor: 'pointer', textTransform: 'capitalize',
              }}>
              {s}
            </button>
          ))}
          {(search || date || status !== 'all') && (
            <button onClick={() => { setSearch(''); setDate(''); setStatus('all'); setPage(1); }}
              style={{ padding: '5px 12px', borderRadius: 999, fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Booking cards */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}><SpinnerIcon /></div>
      ) : bookings.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
          No bookings found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bookings.map(b => {
            const ss = STATUS_STYLE[b.status] || STATUS_STYLE['no-show'];
            return (
              <div key={b._id} style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.customer?.name}
                    </p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{b.customer?.email}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, flexShrink: 0, textTransform: 'capitalize' }}>
                    {b.status}
                  </span>
                </div>

                {/* Details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginBottom: 10, fontSize: 12 }}>
                  <InfoCell label="Code"    value={<span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e3a8a' }}>{b.confirmationCode}</span>} />
                  <InfoCell label="Service" value={b.service?.name} />
                  <InfoCell label="Date"    value={b.date} />
                  <InfoCell label="Time"    value={<span style={{ fontFamily: 'monospace' }}>{b.time}</span>} />
                  <InfoCell label="Price"   value={`${b.serviceSnapshot?.currency || 'GHS'} ${b.serviceSnapshot?.price?.toFixed(2) || '—'}`} />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                  {b.status === 'pending' && (
                    <ActionBtn label="Confirm"  color="blue"  onClick={() => statusMutation.mutate({ id: b._id, status: 'confirmed' })} />
                  )}
                  {['pending', 'confirmed'].includes(b.status) && (
                    <ActionBtn label="Complete" color="green" onClick={() => statusMutation.mutate({ id: b._id, status: 'completed' })} />
                  )}
                  {['pending', 'confirmed'].includes(b.status) && (
                    <ActionBtn label="Cancel"   color="red"   onClick={() => cancelMutation.mutate(b._id)} />
                  )}
                  {b.status === 'confirmed' && (
                    <ActionBtn label="No-show"  color="gray"  onClick={() => statusMutation.mutate({ id: b._id, status: 'no-show' })} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#1e3a8a', fontWeight: 700, fontSize: 13, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
            ← Prev
          </button>
          <span style={{ fontSize: 13, color: '#64748b' }}>
            {pagination.page} / {pagination.pages}
          </span>
          <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#1e3a8a', fontWeight: 700, fontSize: 13, cursor: page === pagination.pages ? 'not-allowed' : 'pointer', opacity: page === pagination.pages ? 0.4 : 1 }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function InfoCell({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 12, color: '#1e293b', margin: 0, fontWeight: 600 }}>{value}</p>
    </div>
  );
}
