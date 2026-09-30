import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { fetchCustomer, updateCustomer } from '../api/admin';
import { SpinnerIcon } from '../../components/Icons';

const STATUS_BADGE = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  'no-show': 'bg-gray-100 text-gray-600',
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
      ? { name: data.customer.name, phone: data.customer.phone, notes: data.customer.notes }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (body) => updateCustomer(id, body),
    onSuccess: () => {
      toast.success('Customer updated');
      qc.invalidateQueries(['admin-customer', id]);
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <div className="flex justify-center py-20"><SpinnerIcon className="w-8 h-8 text-brand-600" /></div>;
  if (!data) return <p className="text-red-500">Customer not found.</p>;

  const { customer, bookings } = data;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-700">← Back</button>
        <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Edit form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Customer Info</h3>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input {...register('name')} className="input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input value={customer.email} disabled className="input text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input {...register('phone')} className="input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <textarea {...register('notes')} rows={3} className="input text-sm resize-none" />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary text-sm flex items-center gap-2"
            >
              {mutation.isPending && <SpinnerIcon className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Stats</h3>
          <div className="space-y-3 text-sm">
            <Row label="Total Bookings"  value={customer.totalBookings} />
            <Row label="Member Since"    value={new Date(customer.createdAt).toLocaleDateString('en-GB')} />
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        {bookings.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">No bookings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-50">
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{b.service?.name}</td>
                  <td className="px-5 py-3 font-mono text-gray-500">{b.date} {b.time}</td>
                  <td className="px-5 py-3 text-gray-500">{b.serviceSnapshot?.currency} {b.serviceSnapshot?.price?.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_BADGE[b.status] || ''}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
