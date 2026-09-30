import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchCustomers } from '../api/admin';
import { SpinnerIcon } from '../../components/Icons';

export default function CustomersPage() {
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', page, search],
    queryFn: () => fetchCustomers({ page, limit: 20, ...(search && { search }) }),
    keepPreviousData: true,
  });

  const customers  = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>Customers</h2>
        <span style={{ fontSize: 12, color: '#64748b' }}>{pagination?.total ?? 0} total</span>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '0.875rem' }}>
        <input
          type="text" placeholder="Search name, email or phone…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0.6rem 0.875rem', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}><SpinnerIcon /></div>
      ) : customers.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
          No customers found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {customers.map(c => (
            <div key={c._id} style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Avatar */}
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', border: '2px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#1e3a8a', flexShrink: 0 }}>
                {c.name?.[0]?.toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.name}
                </p>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.email}
                </p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{c.phone}</p>
              </div>

              {/* Bookings + link */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#eff6ff', color: '#1e3a8a' }}>
                  {c.totalBookings} booking{c.totalBookings !== 1 ? 's' : ''}
                </span>
                <Link to={`/admin/customers/${c._id}`}
                  style={{ fontSize: 12, fontWeight: 700, color: '#1e3a8a', textDecoration: 'none' }}>
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#1e3a8a', fontWeight: 700, fontSize: 13, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
            ← Prev
          </button>
          <span style={{ fontSize: 13, color: '#64748b' }}>{pagination.page} / {pagination.pages}</span>
          <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#1e3a8a', fontWeight: 700, fontSize: 13, cursor: page === pagination.pages ? 'not-allowed' : 'pointer', opacity: page === pagination.pages ? 0.4 : 1 }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
