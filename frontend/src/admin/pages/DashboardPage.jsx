import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '../api/admin';
import { SpinnerIcon, CalendarIcon, UserIcon, CheckCircleIcon, ClockIcon } from '../../components/Icons';

const STATUS_BADGE = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  'no-show': 'bg-gray-100 text-gray-600',
};

function StatCard({ label, value, sub, color = 'text-gray-900' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
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
      <div className="flex justify-center py-20">
        <SpinnerIcon className="w-8 h-8 text-brand-600" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Failed to load dashboard stats.</p>;
  }

  const { stats, todaySchedule } = data;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-sm text-gray-500">Overview of your booking business today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Bookings"  value={stats.todayBookings}   color="text-brand-600" />
        <StatCard label="Total Bookings"    value={stats.totalBookings}   />
        <StatCard label="Total Customers"   value={stats.totalCustomers}  />
        <StatCard
          label="Total Revenue"
          value={`GHS ${stats.totalRevenue.toFixed(2)}`}
          sub="From completed bookings"
          color="text-green-600"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending"   value={stats.pendingBookings}   color="text-yellow-600" />
        <StatCard label="Confirmed" value={stats.confirmedBookings} color="text-blue-600"   />
        <StatCard label="Completed" value={stats.completedBookings} color="text-green-600"  />
        <StatCard label="Cancelled" value={stats.cancelledBookings} color="text-red-500"    />
      </div>

      {/* Today's schedule */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        {todaySchedule.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            No bookings scheduled for today.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todaySchedule.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono font-medium">{b.time}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{b.customer?.name}</td>
                    <td className="px-5 py-3 text-gray-600">{b.service?.name}</td>
                    <td className="px-5 py-3 text-gray-500">{b.customer?.phone}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_BADGE[b.status] || 'bg-gray-100'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
