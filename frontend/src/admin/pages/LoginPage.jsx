import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { SpinnerIcon } from '../../components/Icons';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit(data) {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/admin');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 400, background: 'white', borderRadius: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

        {/* Header band */}
        <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1e40af)', padding: '2rem 2rem 1.75rem', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 24 }}>
            🛡️
          </div>
          <h1 style={{ color: 'white', fontWeight: 900, fontSize: '1.25rem', margin: '0 0 4px' }}>Amponsah Tech</h1>
          <p style={{ color: '#bfdbfe', fontSize: 13, margin: 0 }}>Admin Dashboard</p>
        </div>

        {/* Form */}
        <div style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email Address</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                autoComplete="email"
                placeholder="josephamponsah91@gmail.com"
                style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0.75rem 1rem', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.email && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0.75rem 1rem', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.password && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#94a3b8' : '#1e3a8a', color: 'white',
                fontWeight: 800, fontSize: 15, padding: '0.875rem',
                borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading && <SpinnerIcon />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 20 }}>
            Admin access only. Contact support if you need help.
          </p>
        </div>
      </div>
    </div>
  );
}
