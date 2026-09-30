import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { changePassword, createAdmin } from '../api/admin';
import { SpinnerIcon } from '../../components/Icons';

const S = {
  card:   { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  label:  { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input:  { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0.7rem 0.875rem', fontSize: 15, outline: 'none', boxSizing: 'border-box' },
  btn:    { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#1e3a8a', color: 'white', fontWeight: 700, fontSize: 14, padding: '0.75rem 1.5rem', borderRadius: 8, border: 'none', cursor: 'pointer' },
  errMsg: { fontSize: 12, color: '#dc2626', marginTop: 4 },
};

export default function SettingsPage() {
  const { admin } = useAuth();
  const [tab, setTab] = useState('password');

  const tabs = ['password', ...(admin?.role === 'superadmin' ? ['new-admin'] : [])];
  const tabLabels = { password: 'Change Password', 'new-admin': 'Add Admin' };

  return (
    <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>Settings</h2>

      {/* Tab pills */}
      <div style={{ display: 'flex', gap: 6, background: '#f1f5f9', padding: 4, borderRadius: 12, width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? '#0f172a' : '#64748b',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {tab === 'password'  && <ChangePasswordForm />}
      {tab === 'new-admin' && <CreateAdminForm />}
    </div>
  );
}

function ChangePasswordForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => { toast.success('Password changed'); reset(); },
    onError: e => toast.error(e.message),
  });

  return (
    <div style={S.card}>
      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', margin: '0 0 1.25rem' }}>Change Password</h3>
      <form onSubmit={handleSubmit(d => mutation.mutate(d))}>
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Current Password</label>
          <input {...register('currentPassword', { required: 'Required' })} type="password" style={S.input} placeholder="••••••••" />
          {errors.currentPassword && <p style={S.errMsg}>{errors.currentPassword.message}</p>}
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={S.label}>New Password</label>
          <input
            {...register('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
            type="password" style={S.input} placeholder="Min. 6 characters"
          />
          {errors.newPassword && <p style={S.errMsg}>{errors.newPassword.message}</p>}
        </div>
        <button type="submit" disabled={mutation.isPending}
          style={{ ...S.btn, opacity: mutation.isPending ? 0.7 : 1 }}>
          {mutation.isPending && <SpinnerIcon />}
          Update Password
        </button>
      </form>
    </div>
  );
}

function CreateAdminForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: adm => { toast.success(`Admin ${adm.email} created`); reset(); },
    onError: e => toast.error(e.message),
  });

  return (
    <div style={S.card}>
      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', margin: '0 0 1.25rem' }}>Create New Admin</h3>
      <form onSubmit={handleSubmit(d => mutation.mutate(d))}>
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Full Name</label>
          <input {...register('name', { required: 'Required' })} placeholder="Staff Name" style={S.input} />
          {errors.name && <p style={S.errMsg}>{errors.name.message}</p>}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Email Address</label>
          <input {...register('email', { required: 'Required' })} type="email" placeholder="staff@example.com" style={S.input} />
          {errors.email && <p style={S.errMsg}>{errors.email.message}</p>}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Password</label>
          <input
            {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
            type="password" placeholder="Min. 6 characters" style={S.input}
          />
          {errors.password && <p style={S.errMsg}>{errors.password.message}</p>}
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={S.label}>Role</label>
          <select {...register('role')} style={S.input}>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
        <button type="submit" disabled={mutation.isPending}
          style={{ ...S.btn, opacity: mutation.isPending ? 0.7 : 1 }}>
          {mutation.isPending && <SpinnerIcon />}
          Create Admin
        </button>
      </form>
    </div>
  );
}
