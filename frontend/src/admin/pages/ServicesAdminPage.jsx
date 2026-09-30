import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminFetchServices, adminCreateService, adminUpdateService, adminDeleteService } from '../api/admin';
import { SpinnerIcon } from '../../components/Icons';

const DEFAULT_FORM = { name: '', description: '', duration: 30, price: '', currency: 'GHS', maxConcurrent: 1 };

export default function ServicesAdminPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // null = add new, obj = edit existing
  const [showForm, setShowForm] = useState(false);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: adminFetchServices,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: DEFAULT_FORM });

  function openAdd() { reset(DEFAULT_FORM); setEditing(null); setShowForm(true); }
  function openEdit(svc) {
    reset({ name: svc.name, description: svc.description, duration: svc.duration, price: svc.price, currency: svc.currency, maxConcurrent: svc.maxConcurrent });
    setEditing(svc);
    setShowForm(true);
  }

  const saveMutation = useMutation({
    mutationFn: (body) => editing ? adminUpdateService(editing._id, body) : adminCreateService(body),
    onSuccess: () => {
      toast.success(editing ? 'Service updated' : 'Service created');
      qc.invalidateQueries(['admin-services']);
      setShowForm(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteService,
    onSuccess: () => { toast.success('Service deactivated'); qc.invalidateQueries(['admin-services']); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Services</h2>
        <button onClick={openAdd} className="btn-primary text-sm">+ Add Service</button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-brand-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">{editing ? 'Edit Service' : 'New Service'}</h3>
          <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Service Name *</label>
              <input {...register('name', { required: true })} className="input text-sm" placeholder="e.g. Haircut" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea {...register('description')} rows={2} className="input text-sm resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Duration (minutes) *</label>
              <input {...register('duration', { required: true, min: 15 })} type="number" className="input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price *</label>
              <input {...register('price', { required: true, min: 0 })} type="number" step="0.01" className="input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
              <input {...register('currency')} className="input text-sm" placeholder="GHS" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Concurrent Bookings</label>
              <input {...register('maxConcurrent', { min: 1 })} type="number" className="input text-sm" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm flex-1">Cancel</button>
              <button type="submit" disabled={saveMutation.isPending} className="btn-primary text-sm flex-1 flex items-center justify-center gap-2">
                {saveMutation.isPending && <SpinnerIcon className="w-4 h-4" />}
                {editing ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><SpinnerIcon className="w-7 h-7 text-brand-600" /></div>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No services yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Concurrent</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((svc) => (
                <tr key={svc._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{svc.name}</p>
                    {svc.description && <p className="text-xs text-gray-400 truncate max-w-xs">{svc.description}</p>}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{svc.duration} min</td>
                  <td className="px-5 py-3 font-semibold text-brand-600">{svc.currency} {svc.price.toFixed(2)}</td>
                  <td className="px-5 py-3 text-center text-gray-600">{svc.maxConcurrent}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${svc.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {svc.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3 flex gap-2">
                    <button onClick={() => openEdit(svc)} className="text-xs text-brand-600 hover:underline font-medium">Edit</button>
                    {svc.isActive && (
                      <button
                        onClick={() => { if (confirm(`Deactivate "${svc.name}"?`)) deleteMutation.mutate(svc._id); }}
                        className="text-xs text-red-500 hover:underline font-medium"
                      >
                        Deactivate
                      </button>
                    )}
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
