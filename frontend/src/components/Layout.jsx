import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';

// Detect mobile via window width — updates on resize
function useIsMobile() {
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}

const NAV_LINKS = [
  { to: '/',         label: 'Home',       end: true  },
  { to: '/services', label: 'Services',   end: false },
  { to: '/lookup',   label: 'My Booking', end: false },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ─────────────────────────────────────── */}
      <header style={{
        background: '#1e3a8a',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
      }}>
        <div style={{
          maxWidth: '72rem', margin: '0 auto',
          padding: '0 1rem', height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: 14, letterSpacing: '0.04em', margin: 0 }}>
                AMPONSAH TECH
              </p>
              {!isMobile && (
                <p style={{ color: '#93c5fd', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                  CCTV · Network · Electrical
                </p>
              )}
            </div>
          </Link>

          {/* Desktop nav — shown when NOT mobile */}
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {NAV_LINKS.map(({ to, label, end }) => (
                <NavLink key={to} to={to} end={end}
                  style={({ isActive }) => ({
                    padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                    textDecoration: 'none', transition: 'all 0.15s',
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: isActive ? 'white' : '#bfdbfe',
                  })}
                >
                  {label}
                </NavLink>
              ))}
              <Link to="/book" style={{
                marginLeft: 8, background: 'white', color: '#1e3a8a',
                fontWeight: 800, fontSize: 13, padding: '8px 18px',
                borderRadius: 10, textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}>
                Book Now
              </Link>
            </nav>
          )}

          {/* Mobile right side — shown on mobile only */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to="/book" style={{
                background: 'white', color: '#1e3a8a', fontWeight: 800,
                fontSize: 12, padding: '7px 12px', borderRadius: 8,
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
                Book Now
              </Link>

              {/* Hamburger button */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                style={{
                  width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                  background: menuOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 5,
                  cursor: 'pointer',
                }}
              >
                <span style={{
                  display: 'block', width: 18, height: 2,
                  background: 'white', borderRadius: 2, transition: 'all 0.25s',
                  transform: menuOpen ? 'rotate(45deg) translate(0, 7px)' : 'none',
                }} />
                <span style={{
                  display: 'block', width: 18, height: 2,
                  background: 'white', borderRadius: 2, transition: 'all 0.25s',
                  opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'none',
                }} />
                <span style={{
                  display: 'block', width: 18, height: 2,
                  background: 'white', borderRadius: 2, transition: 'all 0.25s',
                  transform: menuOpen ? 'rotate(-45deg) translate(0, -7px)' : 'none',
                }} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile dropdown menu */}
        {isMobile && (
          <div style={{
            background: '#162d73',
            overflow: 'hidden',
            maxHeight: menuOpen ? 260 : 0,
            transition: 'max-height 0.3s ease',
            borderTop: menuOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}>
            <nav style={{ padding: '8px 12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {NAV_LINKS.map(({ to, label, end }) => (
                <NavLink key={to} to={to} end={end}
                  style={({ isActive }) => ({
                    display: 'block', padding: '12px 16px', borderRadius: 10,
                    fontSize: 15, fontWeight: 700, textDecoration: 'none',
                    color: isActive ? 'white' : '#bfdbfe',
                    background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  })}
                >
                  {label}
                </NavLink>
              ))}
              <Link to="/book" style={{
                display: 'block', margin: '8px 0 0',
                background: 'white', color: '#1e3a8a', fontWeight: 800,
                fontSize: 15, padding: '12px 16px', borderRadius: 10,
                textDecoration: 'none', textAlign: 'center',
              }}>
                📅 Book an Appointment
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ background: '#1e3a8a', marginTop: 64 }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '2rem', marginBottom: '2rem',
          }}>
            <div>
              <p style={{ color: 'white', fontWeight: 800, fontSize: 16, margin: '0 0 4px' }}>AMPONSAH TECH</p>
              <p style={{ color: '#93c5fd', fontSize: 12, margin: '0 0 8px' }}>Reliable · Professional · Trusted</p>
              <p style={{ color: '#60a5fa', fontSize: 12, margin: 0 }}>Serving Homes &amp; Businesses across Ghana</p>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Services</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#93c5fd' }}>
                <span>📷 CCTV Installation</span>
                <span>🌐 Internet &amp; Networking</span>
                <span>⚡ Electrical Services</span>
              </div>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Contact</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { href: 'tel:+233256287345',            icon: '📞', label: '0256287345' },
                  { href: 'https://wa.me/233256287345', icon: '💬', label: 'WhatsApp Us', external: true },
                  { href: 'mailto:josephamponsah91@gmail.com', icon: '✉', label: 'josephamponsah91@gmail.com' },
                ].map(({ href, icon, label, external }) => (
                  <a key={href} href={href} target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    style={{ color: '#93c5fd', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {icon} {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
            alignItems: 'center', gap: 8,
          }}>
            <p style={{ color: '#60a5fa', fontSize: 12, margin: 0 }}>
              © {new Date().getFullYear()} Amponsah Tech. All rights reserved.
            </p>
            <Link to="/book" style={{ color: '#93c5fd', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              Book an Appointment →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
