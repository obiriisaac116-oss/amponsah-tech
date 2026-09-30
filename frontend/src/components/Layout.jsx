import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <header style={{ background: '#1e3a8a' }} className="sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="text-white font-bold text-sm sm:text-base tracking-wide">AMPONSAH TECH</p>
              <p className="text-blue-200 text-[9px] tracking-widest uppercase hidden sm:block">CCTV · Networking · Electrical</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[['/', 'Home', true], ['/services', 'Services', false], ['/lookup', 'My Booking', false]].map(([to, label, end]) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/book"
              className="ml-2 bg-white text-blue-900 font-bold text-sm py-2 px-5 rounded-xl hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
            >
              Book Now
            </Link>
          </nav>

          {/* Mobile: Book Now + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/book"
              className="bg-white text-blue-900 font-bold text-xs py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/15"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ background: '#1a3278' }}
        >
          <nav className="px-4 pb-4 pt-2 flex flex-col gap-1">
            {[['/', 'Home', true], ['/services', 'Services', false], ['/lookup', 'My Booking', false]].map(([to, label, end]) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: '#1e3a8a' }} className="mt-16">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <p className="text-white font-bold text-lg mb-1">AMPONSAH TECH</p>
              <p className="text-blue-200 text-sm mb-3">Reliable · Professional · Trusted</p>
              <p className="text-blue-300 text-xs">Serving Homes &amp; Businesses across Ghana</p>
            </div>
            {/* Services */}
            <div>
              <p className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Services</p>
              <ul className="space-y-1.5 text-sm text-blue-200">
                <li>📷 CCTV Installation</li>
                <li>🌐 Internet &amp; Networking</li>
                <li>⚡ Electrical Services</li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <p className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Contact</p>
              <div className="space-y-2 text-sm">
                <a href="mailto:josephamponsah91@gmail.com" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
                  <span>✉</span> josephamponsah91@gmail.com
                </a>
                <a href="tel:+233256287345" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
                  <span>📞</span> 0256287345
                </a>
                <a href="https://wa.me/233256287345" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
                  <span>💬</span> WhatsApp Us
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-400">
            <p>© {new Date().getFullYear()} Amponsah Tech. All rights reserved.</p>
            <Link to="/book" className="text-blue-300 hover:text-white font-medium transition-colors">
              Book an Appointment →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
