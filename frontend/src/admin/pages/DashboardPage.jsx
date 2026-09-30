import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '../api/admin';
import { SpinnerIcon } from '../../components/Icons';

const STATUS_STYLE = {
  pending:   { bg: '#fefce8', color: '#854d0e' },
  confirmed: { bg: '#eff6ff', color: '#1d4ed8' },
  completed: { bg: '#f0fdf4', color: '#15803d' },
  cancelled: { bg: '#fef2f2', color: '#dc2626' },
  'no-show': { bg: '#f8fafc', color: '#64748b' },
};

function StatCard({ label, value, sub, valueColor = '#0f172a' }) {
  return (
    <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 6px', fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: '1.6rem', fontWeight: 800, color: valueColor, margin: 0, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchStats,
    refetchInterval: 60_000,
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <SpinnerIcon />
      </div>
    );
  }

  if (isError) {
    return <p style={{ color: '#dc2626', fontSize: 14 }}>Failed to load stats.</p>;
  }

  const { stats, todaySchedule } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div>
        <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', margin: '0 0 4px' }}>Dashboard</h2>
        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Overview of your business today.</p>
      </div>

      {/* Primary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 160px), 1fr))', gap: '0.75rem' }}>
        <StatCard label="Today's Bookings" value={stats.todayBookings}  valueColor="#1e3a8a" />
        <StatCard label="Total Bookings"   value={stats.totalBookings}  />
        <StatCard label="Total Customers"  value={stats.totalCustomers} />
        <StatCard label="Total Revenue"
          value={`GHS ${stats.totalRevenue.toFixed(0)}`}
          sub="Completed bookings"
          valueColor="#15803d"
        />
      </div>

      {/* Status breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 130px), 1fr))', gap: '0.75rem' }}>
        <StatCard label="Pending"   value={stats.pendingBookings}   valueColor="#b45309" />
        <StatCard label="Confirmed" value={stats.confirmedBookings} valueColor="#1d4ed8" />
        <StatCard label="Completed" value={stats.completedBookings} valueColor="#15803d" />
        <StatCard label="Cancelled" value={stats.cancelledBookings} valueColor="#dc2626" />
      </div>

      {/* Today's schedule */}
      <div>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', margin: '0 0 12px' }}>Today's Schedule</h3>

        {todaySchedule.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2.5rem', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            No bookings scheduled for today.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todaySchedule.map(b => {
              const ss = STATUS_STYLE[b.status] || STATUS_STYLE['no-show'];
              return (
                <div key={b._id} style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: '#eff6ff', borderRadius: 8, padding: '6px 10px', fontWeight: 800, fontSize: 15, color: '#1e3a8a', fontFamily: 'monospace', flexShrink: 0 }}>
                    {b.time}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.customer?.name}
                    </p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.service?.name} · {b.customer?.phone}
                    </p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: ss.bg, color: ss.color, flexShrink: 0, textTransform: 'capitalize' }}>
                    {b.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
