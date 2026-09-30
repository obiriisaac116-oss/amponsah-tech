import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '../api/services';
import ServiceCard from '../components/ServiceCard';
import { SpinnerIcon } from '../components/Icons';

const CATEGORIES = [
  { key: 'All',                    icon: '🔍' },
  { key: 'CCTV Installation',      icon: '📷' },
  { key: 'Internet & Networking',  icon: '🌐' },
  { key: 'Electrical Services',    icon: '⚡' },
];

export default function ServicesPage() {
  const [active, setActive] = useState('All');

  const { data: services = [], isLoading, isError } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  const filtered = active === 'All' ? services : services.filter(s => s.category === active);

  return (
    <div>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1e40af)', padding: '3rem 1rem 2rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 900, color: 'white', marginBottom: 8 }}>
            Our Services
          </h1>
          <p style={{ color: '#bfdbfe', fontSize: 14, marginBottom: '1.5rem' }}>
            Professional installation and support — book your appointment in minutes.
          </p>

          {/* Category pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {CATEGORIES.map(({ key, icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '0.5rem 1.1rem', borderRadius: 999, fontSize: 13, fontWeight: 700,
                  border: active === key ? '2px solid white' : '1.5px solid rgba(255,255,255,0.3)',
                  background: active === key ? 'white' : 'rgba(255,255,255,0.1)',
                  color: active === key ? '#1e3a8a' : 'white',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {icon} {key}
              </button>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div style={{ lineHeight: 0, marginTop: '1.5rem' }}>
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ width: '100%', height: 36, display: 'block' }}>
            <path d="M0,20 C360,50 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f8fafc"/>
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1rem 4rem' }}>

        {/* Result count */}
        {!isLoading && !isError && (
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: '1.5rem' }}>
            Showing <strong>{filtered.length}</strong> service{filtered.length !== 1 ? 's' : ''}
            {active !== 'All' ? ` in "${active}"` : ''}
          </p>
        )}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <SpinnerIcon className="w-10 h-10" style={{ color: '#1e3a8a' }} />
          </div>
        )}

        {isError && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>⚠️</p>
            <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: 8 }}>Could not load services</p>
            <p style={{ color: '#94a3b8', fontSize: 13 }}>Please check your connection and try again.</p>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
            <p style={{ color: '#64748b', fontWeight: 600 }}>No services in this category</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
          {filtered.map(s => <ServiceCard key={s._id} service={s} />)}
        </div>

        {/* Custom quote CTA */}
        <div style={{
          marginTop: '3rem', background: 'white', borderRadius: '1.5rem',
          padding: '2rem', textAlign: 'center', border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(30,58,138,0.06)',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💼</div>
          <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', marginBottom: 6 }}>
            Need a custom solution?
          </h3>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: '1.25rem', lineHeight: 1.6 }}>
            For large-scale projects, enterprise installations or custom quotes — contact us directly.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            <a href="tel:+233256287345" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#1e3a8a', color: 'white', fontWeight: 700, fontSize: 13,
              padding: '0.6rem 1.25rem', borderRadius: '0.625rem', textDecoration: 'none',
            }}>
              📞 Call 0256287345
            </a>
            <a href="https://wa.me/233256287345" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#16a34a', color: 'white', fontWeight: 700, fontSize: 13,
              padding: '0.6rem 1.25rem', borderRadius: '0.625rem', textDecoration: 'none',
            }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
