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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Customers</h2>
        <span className="text-sm text-gray-500">{pagination?.total ?? 0} total</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <input
          type="text"
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input max-w-sm text-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><SpinnerIcon className="w-7 h-7 text-brand-600" /></div>
        ) : customers.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No customers found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Bookings</th>
                <th className="px-5 py-3">Since</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">{c.name}</td>
                  <td className="px-5 py-3 text-gray-500">{c.email}</td>
                  <td className="px-5 py-3 text-gray-500">{c.phone}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="inline-block bg-brand-50 text-brand-600 font-semibold text-xs px-2 py-1 rounded-full">
                      {c.totalBookings}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(c.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      to={`/admin/customers/${c._id}`}
                      className="text-xs text-brand-600 hover:underline font-medium"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm px-4 py-2 disabled:opacity-40">Previous</button>
          <span className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</span>
          <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm px-4 py-2 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
