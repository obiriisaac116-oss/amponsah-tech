import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on navigation
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const navLinks = [
    { to: '/',        label: 'Home',       end: true  },
    { to: '/services',label: 'Services',   end: false },
    { to: '/lookup',  label: 'My Booking', end: false },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ─────────────────────────────────────── */}
      <header style={{ background: '#1e3a8a', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: 14, letterSpacing: '0.04em', margin: 0 }}>AMPONSAH TECH</p>
              <p style={{ color: '#93c5fd', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>CCTV · Network · Electrical</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {navLinks.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end}
                style={({ isActive }) => ({
                  padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  textDecoration: 'none', transition: 'all 0.15s',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: isActive ? 'white' : '#bfdbfe',
                })}
                onMouseEnter={e => { if (!e.currentTarget.style.background.includes('0.2')) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; } }}
                onMouseLeave={e => { if (!e.currentTarget.getAttribute('aria-current')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#bfdbfe'; } }}
              >
                {label}
              </NavLink>
            ))}
            <Link to="/book" style={{
              marginLeft: 8, background: 'white', color: '#1e3a8a', fontWeight: 800,
              fontSize: 13, padding: '8px 16px', borderRadius: 10, textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'none'; }}
            >
              Book Now
            </Link>
          </nav>

          {/* Mobile right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="mobile-nav">
            <Link to="/book" style={{
              background: 'white', color: '#1e3a8a', fontWeight: 800, fontSize: 12,
              padding: '7px 12px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Book Now
            </Link>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                width: 38, height: 38, borderRadius: 8, background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label="Menu"
            >
              <span style={{ display: 'block', width: 18, height: 2, background: 'white', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <span style={{ display: 'block', width: 18, height: 2, background: 'white', borderRadius: 2, transition: 'all 0.25s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: 18, height: 2, background: 'white', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div style={{
          background: '#1a3278', overflow: 'hidden',
          maxHeight: menuOpen ? 300 : 0, transition: 'max-height 0.3s ease',
        }}>
          <nav style={{ padding: '8px 1rem 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end}
                style={({ isActive }) => ({
                  padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', color: isActive ? 'white' : '#bfdbfe',
                  background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Responsive show/hide via CSS */}
      <style>{`
        .desktop-nav { display: none; }
        .mobile-nav  { display: flex;  }
        @media (min-width: 640px) {
          .desktop-nav { display: flex; }
          .mobile-nav  { display: none; }
        }
      `}</style>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ background: '#1e3a8a', marginTop: 64 }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Brand */}
            <div>
              <p style={{ color: 'white', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>AMPONSAH TECH</p>
              <p style={{ color: '#93c5fd', fontSize: 12, marginBottom: 8 }}>Reliable · Professional · Trusted</p>
              <p style={{ color: '#60a5fa', fontSize: 12 }}>Serving Homes &amp; Businesses<br />across Ghana</p>
            </div>
            {/* Services */}
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Services</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#93c5fd' }}>
                <span>📷 CCTV Installation</span>
                <span>🌐 Internet &amp; Networking</span>
                <span>⚡ Electrical Services</span>
              </div>
            </div>
            {/* Contact */}
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Contact</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="tel:+233256287345" style={{ color: '#93c5fd', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  📞 0256287345
                </a>
                <a href="https://wa.me/233256287345" target="_blank" rel="noopener noreferrer" style={{ color: '#93c5fd', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  💬 WhatsApp Us
                </a>
                <a href="mailto:josephamponsah91@gmail.com" style={{ color: '#93c5fd', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  ✉ josephamponsah91@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <p style={{ color: '#60a5fa', fontSize: 12 }}>© {new Date().getFullYear()} Amponsah Tech. All rights reserved.</p>
            <Link to="/book" style={{ color: '#93c5fd', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Book an Appointment →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
