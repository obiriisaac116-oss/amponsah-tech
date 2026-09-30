import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchBookings, updateBookingStatus, adminCancelBooking } from '../api/admin';
import { SpinnerIcon } from '../../components/Icons';

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'];

const STATUS_BADGE = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  'no-show': 'bg-gray-100 text-gray-600',
};

export default function BookingsPage() {
  const qc = useQueryClient();
  const [page, setPage]     = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [date, setDate]     = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', page, status, search, date],
    queryFn: () =>
      fetchBookings({
        page,
        limit: 15,
        ...(status !== 'all' && { status }),
        ...(search && { search }),
        ...(date && { date }),
      }),
    keepPreviousData: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries(['admin-bookings']); },
    onError: (e) => toast.error(e.message),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => adminCancelBooking(id, 'Cancelled by admin'),
    onSuccess: () => { toast.success('Booking cancelled'); qc.invalidateQueries(['admin-bookings']); },
    onError: (e) => toast.error(e.message),
  });

  const bookings   = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
        <span className="text-sm text-gray-500">{pagination?.total ?? 0} total</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name, email or code…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input max-w-xs text-sm"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setPage(1); }}
          className="input w-40 text-sm"
        />
        <div className="flex gap-1 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                status === s
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {(search || date || status !== 'all') && (
          <button
            onClick={() => { setSearch(''); setDate(''); setStatus('all'); setPage(1); }}
            className="text-xs text-gray-400 hover:text-red-500 ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><SpinnerIcon className="w-7 h-7 text-brand-600" /></div>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No bookings found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-brand-600 font-semibold">{b.confirmationCode}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{b.customer?.name}</p>
                    <p className="text-xs text-gray-400">{b.customer?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{b.service?.name}</td>
                  <td className="px-4 py-3 font-mono text-gray-700">
                    <p>{b.date}</p>
                    <p className="text-xs text-gray-400">{b.time}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {b.serviceSnapshot?.currency} {b.serviceSnapshot?.price?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_BADGE[b.status] || 'bg-gray-100'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => statusMutation.mutate({ id: b._id, status: 'confirmed' })}
                          className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded-lg font-medium"
                        >
                          Confirm
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(b.status) && (
                        <button
                          onClick={() => statusMutation.mutate({ id: b._id, status: 'completed' })}
                          className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded-lg font-medium"
                        >
                          Complete
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(b.status) && (
                        <button
                          onClick={() => cancelMutation.mutate(b._id)}
                          className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => statusMutation.mutate({ id: b._id, status: 'no-show' })}
                          className="text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 px-2 py-1 rounded-lg font-medium"
                        >
                          No-show
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={page === pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
