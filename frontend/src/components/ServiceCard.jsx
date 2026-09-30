import { Link } from 'react-router-dom';

const CATEGORY_META = {
  'CCTV Installation':     { icon: '📷', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  'Internet & Networking': { icon: '🌐', bg: '#ecfeff', color: '#0e7490', border: '#a5f3fc' },
  'Electrical Services':   { icon: '⚡', bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
};

function formatDuration(mins) {
  if (!mins) return '';
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins} min`;
}

export default function ServiceCard({ service }) {
  const meta = CATEGORY_META[service.category] || { icon: '🔧', bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '1.25rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(30,58,138,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
      }}
    >
      {/* Coloured top stripe */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${meta.color}, ${meta.border})` }} />

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          {/* Icon + category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '0.75rem', flexShrink: 0,
              background: meta.bg, border: `1px solid ${meta.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>
              {meta.icon}
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
              background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
            }}>
              {service.category || 'General'}
            </span>
          </div>
          {/* Price */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>from</p>
            <p style={{ fontSize: 17, fontWeight: 800, color: '#1e3a8a', lineHeight: 1.1 }}>
              GHS {service.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Name + description */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: 4 }}>
            {service.name}
          </h3>
          {service.description && (
            <p style={{
              fontSize: 13, color: '#64748b', lineHeight: 1.55,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {service.description}
            </p>
          )}
        </div>

        {/* Meta footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem',
          fontSize: 12, color: '#94a3b8',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/>
            </svg>
            {formatDuration(service.duration)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Onsite
          </span>
        </div>

        {/* CTA button */}
        <Link
          to={`/book/${service._id}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: '#1e3a8a', color: 'white', fontWeight: 700,
            fontSize: '0.875rem', padding: '0.65rem 1rem', borderRadius: '0.625rem',
            textDecoration: 'none', transition: 'background 0.15s, transform 0.1s',
            boxShadow: '0 1px 3px rgba(30,58,138,0.3)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1e2d6b';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#1e3a8a';
            e.currentTarget.style.transform = 'none';
          }}
        >
          Book This Service
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
