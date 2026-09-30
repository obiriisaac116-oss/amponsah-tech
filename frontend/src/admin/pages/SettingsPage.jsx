import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { changePassword, createAdmin } from '../api/admin';
import { SpinnerIcon } from '../../components/Icons';

export default function SettingsPage() {
  const { admin } = useAuth();
  const [tab, setTab] = useState('password');

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Settings</h2>

      {/* Tab switcher */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {['password', ...(admin?.role === 'superadmin' ? ['new-admin'] : [])].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'password' ? 'Change Password' : 'Add Admin'}
          </button>
        ))}
      </div>

      {tab === 'password' && <ChangePasswordForm />}
      {tab === 'new-admin' && <CreateAdminForm />}
    </div>
  );
}

function ChangePasswordForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => { toast.success('Password changed'); reset(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
          <input
            {...register('currentPassword', { required: true })}
            type="password"
            className="input text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
          <input
            {...register('newPassword', { required: true, minLength: { value: 6, message: 'Min 6 characters' } })}
            type="password"
            className="input text-sm"
          />
          {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn-primary text-sm flex items-center gap-2"
        >
          {mutation.isPending && <SpinnerIcon className="w-4 h-4" />}
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
    onSuccess: (admin) => {
      toast.success(`Admin ${admin.email} created`);
      reset();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Create New Admin</h3>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
          <input {...register('name', { required: true })} className="input text-sm" placeholder="Staff Name" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input {...register('email', { required: true })} type="email" className="input text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
          <input
            {...register('password', { required: true, minLength: { value: 6, message: 'Min 6 characters' } })}
            type="password"
            className="input text-sm"
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
          <select {...register('role')} className="input text-sm">
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn-primary text-sm flex items-center gap-2"
        >
          {mutation.isPending && <SpinnerIcon className="w-4 h-4" />}
          Create Admin
        </button>
      </form>
    </div>
  );
}
