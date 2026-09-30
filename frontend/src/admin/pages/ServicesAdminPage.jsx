import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminFetchServices, adminCreateService, adminUpdateService, adminDeleteService } from '../api/admin';
import { SpinnerIcon } from '../../components/Icons';

const CATEGORY_META = {
  'CCTV Installation':     { icon: '📷', color: '#1d4ed8' },
  'Internet & Networking': { icon: '🌐', color: '#0e7490' },
  'Electrical Services':   { icon: '⚡', color: '#b45309' },
};

const DEFAULT = { name: '', description: '', duration: 30, price: '', currency: 'GHS', maxConcurrent: 1, category: 'CCTV Installation' };

const S = {
  card:   { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  label:  { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 },
  input:  { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0.65rem 0.875rem', fontSize: 15, outline: 'none', boxSizing: 'border-box' },
};

export default function ServicesAdminPage() {
  const qc = useQueryClient();
  const [editing, setEditing]   = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: adminFetchServices,
  });

  const { register, handleSubmit, reset } = useForm({ defaultValues: DEFAULT });

  function openAdd()      { reset(DEFAULT); setEditing(null); setShowForm(true); }
  function openEdit(svc)  {
    reset({ name: svc.name, description: svc.description, duration: svc.duration, price: svc.price, currency: svc.currency, maxConcurrent: svc.maxConcurrent, category: svc.category });
    setEditing(svc);
    setShowForm(true);
  }
  function cancelForm()   { setShowForm(false); setEditing(null); }

  const saveMutation = useMutation({
    mutationFn: body => editing ? adminUpdateService(editing._id, body) : adminCreateService(body),
    onSuccess: () => { toast.success(editing ? 'Service updated' : 'Service created'); qc.invalidateQueries(['admin-services']); setShowForm(false); },
    onError: e => toast.error(e.message),
  });

  const deactivateMutation = useMutation({
    mutationFn: adminDeleteService,
    onSuccess: () => { toast.success('Service deactivated'); qc.invalidateQueries(['admin-services']); },
    onError: e => toast.error(e.message),
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>Services</h2>
        <button onClick={openAdd}
          style={{ background: '#1e3a8a', color: 'white', fontWeight: 700, fontSize: 13, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
          + Add Service
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ ...S.card, border: '2px solid #bfdbfe' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', margin: '0 0 1rem' }}>
            {editing ? 'Edit Service' : 'New Service'}
          </h3>
          <form onSubmit={handleSubmit(d => saveMutation.mutate(d))}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={S.label}>Service Name *</label>
                <input {...register('name', { required: true })} placeholder="e.g. CCTV Basic Package" style={S.input} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={S.label}>Description</label>
                <textarea {...register('description')} rows={2} style={{ ...S.input, resize: 'vertical' }} />
              </div>
              <div>
                <label style={S.label}>Category *</label>
                <select {...register('category')} style={S.input}>
                  <option value="CCTV Installation">CCTV Installation</option>
                  <option value="Internet & Networking">Internet &amp; Networking</option>
                  <option value="Electrical Services">Electrical Services</option>
                </select>
              </div>
              <div>
                <label style={S.label}>Duration (minutes) *</label>
                <input {...register('duration', { required: true, min: 15 })} type="number" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Price *</label>
                <input {...register('price', { required: true, min: 0 })} type="number" step="0.01" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Currency</label>
                <input {...register('currency')} style={S.input} placeholder="GHS" />
              </div>
              <div>
                <label style={S.label}>Max Concurrent</label>
                <input {...register('maxConcurrent', { min: 1 })} type="number" style={S.input} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={cancelForm}
                style={{ flex: 1, padding: '0.7rem', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#1e3a8a', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={saveMutation.isPending}
                style={{ flex: 1, padding: '0.7rem', borderRadius: 8, background: '#1e3a8a', color: 'white', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: saveMutation.isPending ? 0.7 : 1 }}>
                {saveMutation.isPending && <SpinnerIcon />}
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Service cards */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}><SpinnerIcon /></div>
      ) : services.length === 0 ? (
        <div style={{ ...S.card, textAlign: 'center', color: '#94a3b8', fontSize: 14, padding: '3rem' }}>No services yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {services.map(svc => {
            const meta = CATEGORY_META[svc.category] || { icon: '🔧', color: '#64748b' };
            return (
              <div key={svc._id} style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                {/* Top accent line */}
                <div style={{ height: 3, background: meta.color }} />
                <div style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{meta.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: 0 }}>{svc.name}</p>
                      <p style={{ fontWeight: 800, fontSize: 14, color: '#1e3a8a', margin: 0, flexShrink: 0 }}>GHS {svc.price.toFixed(2)}</p>
                    </div>
                    {svc.description && (
                      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {svc.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>⏱ {svc.duration >= 60 ? `${Math.floor(svc.duration/60)}h${svc.duration%60>0?` ${svc.duration%60}m`:''}` : `${svc.duration}m`}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: svc.isActive ? '#f0fdf4' : '#f8fafc', color: svc.isActive ? '#15803d' : '#64748b' }}>
                        {svc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '0.625rem 1rem', display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(svc)}
                    style={{ fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 6, background: '#eff6ff', color: '#1d4ed8', border: 'none', cursor: 'pointer' }}>
                    Edit
                  </button>
                  {svc.isActive && (
                    <button
                      onClick={() => { if (window.confirm(`Deactivate "${svc.name}"?`)) deactivateMutation.mutate(svc._id); }}
                      style={{ fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 6, background: '#fef2f2', color: '#dc2626', border: 'none', cursor: 'pointer' }}>
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
