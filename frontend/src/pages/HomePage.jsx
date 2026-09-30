import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '../api/services';
import ServiceCard from '../components/ServiceCard';

const WHAT_WE_DO = [
  {
    icon: '📷',
    title: 'CCTV Installation',
    body: 'HD cameras, DVR/NVR setup, night vision, remote viewing and motion alerts — for homes and businesses.',
    bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe',
  },
  {
    icon: '🌐',
    title: 'Internet & Networking',
    body: 'Wi-Fi setup, office LAN, structured cabling, switches, access points and network troubleshooting.',
    bg: '#ecfeff', color: '#0e7490', border: '#a5f3fc',
  },
  {
    icon: '⚡',
    title: 'Electrical Services',
    body: 'Wiring, distribution boards, fault diagnosis, security lighting, solar and inverter installations.',
    bg: '#fffbeb', color: '#b45309', border: '#fde68a',
  },
];

const WHY_US = [
  { icon: '🏆', label: 'Experienced Team',    sub: 'Years of hands-on expertise' },
  { icon: '⚡', label: 'Fast Response',        sub: 'We arrive when you need us' },
  { icon: '🛡️', label: 'Trusted & Reliable',  sub: 'Hundreds of happy clients' },
  { icon: '🔧', label: 'After-Sales Support', sub: 'We stand behind our work' },
];

export default function HomePage() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#1e40af 55%,#2563eb 100%)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '4rem 1rem 5rem' }}>
          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999, padding: '6px 14px', fontSize: 12, color: '#bfdbfe', marginBottom: 24,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Now accepting online bookings
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(2rem,5vw,3.25rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                Professional Tech<br />
                <span style={{ color: '#93c5fd' }}>Services You Can Trust</span>
              </h1>
              <p style={{ color: '#bfdbfe', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                CCTV Installation · Internet &amp; Networking · Electrical Services
              </p>
              <p style={{ color: '#93c5fd', fontSize: 13, marginBottom: '2rem' }}>
                Reliable · Professional · Trusted — Serving Homes &amp; Businesses across Ghana
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: '2rem' }}>
                <Link to="/book" style={{
                  background: 'white', color: '#1e3a8a', fontWeight: 800, fontSize: 15,
                  padding: '0.8rem 2rem', borderRadius: '0.75rem', textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'transform 0.15s',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  📅 Book a Service
                </Link>
                <Link to="/services" style={{
                  border: '1.5px solid rgba(255,255,255,0.35)', color: 'white', fontWeight: 700,
                  fontSize: 15, padding: '0.8rem 2rem', borderRadius: '0.75rem', textDecoration: 'none',
                  background: 'rgba(255,255,255,0.08)', transition: 'background 0.15s',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  View Services →
                </Link>
              </div>

              {/* Quick contact */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
                <a href="tel:+233256287345" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#bfdbfe', fontSize: 13, textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#bfdbfe'}
                >
                  <span style={{ background: 'rgba(255,255,255,0.12)', padding: '6px', borderRadius: '0.5rem', fontSize: 16 }}>📞</span>
                  0256287345
                </a>
                <a href="https://wa.me/233256287345" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#bfdbfe', fontSize: 13, textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#bfdbfe'}
                >
                  <span style={{ background: 'rgba(255,255,255,0.12)', padding: '6px', borderRadius: '0.5rem', fontSize: 16 }}>💬</span>
                  WhatsApp Us
                </a>
                <a href="mailto:josephamponsah91@gmail.com"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#bfdbfe', fontSize: 13, textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#bfdbfe'}
                >
                  <span style={{ background: 'rgba(255,255,255,0.12)', padding: '6px', borderRadius: '0.5rem', fontSize: 16 }}>✉</span>
                  josephamponsah91@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 48, display: 'block' }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* ── What we do ───────────────────────────────────── */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '4rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>What We Do</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>Expert installation and ongoing support for all your tech needs.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.5rem' }}>
          {WHAT_WE_DO.map(({ icon, title, body, bg, color, border }) => (
            <div key={title} style={{
              background: 'white', borderRadius: '1.25rem', padding: '1.75rem',
              border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              textAlign: 'center', transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(30,58,138,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; }}
            >
              <div style={{
                width: 60, height: 60, borderRadius: '1rem', margin: '0 auto 1rem',
                background: bg, border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
              }}>{icon}</div>
              <h3 style={{ fontWeight: 800, color: '#0f172a', marginBottom: 8, fontSize: '1rem' }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured services ────────────────────────────── */}
      <section style={{ background: '#f1f5f9', padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Our Services</h2>
              <p style={{ color: '#64748b', fontSize: 14 }}>Choose a service and book your appointment instantly.</p>
            </div>
            <Link to="/services" style={{ color: '#1e3a8a', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              View all services →
            </Link>
          </div>

          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: '#e2e8f0', borderRadius: '1.25rem', height: 240, animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
              {services.slice(0, 6).map(s => <ServiceCard key={s._id} service={s} />)}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/services" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'white', color: '#1e3a8a', fontWeight: 700,
              fontSize: 14, padding: '0.75rem 2rem', borderRadius: '0.75rem',
              border: '1.5px solid #cbd5e1', textDecoration: 'none', transition: 'all 0.15s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1e3a8a'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#1e3a8a'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1e3a8a'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why choose us ────────────────────────────────── */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '4rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Why Choose Amponsah Tech?</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>We don't just install — we build lasting partnerships.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.25rem' }}>
          {WHY_US.map(({ icon, label, sub }) => (
            <div key={label} style={{
              background: 'white', borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center',
              border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,58,138,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
              <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14, marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg,#1e3a8a,#1e40af)', padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: 10 }}>Ready to get started?</h2>
          <p style={{ color: '#bfdbfe', fontSize: 14, marginBottom: '2rem', lineHeight: 1.6 }}>
            Book online in minutes. We come to you — homes and businesses across Ghana.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            <Link to="/book" style={{
              background: 'white', color: '#1e3a8a', fontWeight: 800, fontSize: 15,
              padding: '0.85rem 2.25rem', borderRadius: '0.75rem', textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)', transition: 'transform 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              📅 Book Now
            </Link>
            <a href="tel:+233256287345" style={{
              border: '1.5px solid rgba(255,255,255,0.4)', color: 'white', fontWeight: 700,
              fontSize: 15, padding: '0.85rem 2.25rem', borderRadius: '0.75rem', textDecoration: 'none',
              background: 'rgba(255,255,255,0.08)', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              📞 Call 0256287345
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
