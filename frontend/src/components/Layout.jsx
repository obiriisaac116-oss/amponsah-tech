import { Outlet, Link, NavLink } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header style={{ background: '#1e3a8a' }} className="sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            {/* Shield/wifi icon to match flyer */}
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a.75.75 0 0 1 .53.22l6.75 6.75a.75.75 0 0 1 .22.53v7.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18.75v-7.5c0-.2.08-.39.22-.53l6.75-6.75a.75.75 0 0 1 .53-.22z" />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="text-white font-bold text-base tracking-wide">AMPONSAH TECH</p>
              <p className="text-blue-200 text-[10px] tracking-widest uppercase">CCTV · Networking · Electrical</p>
            </div>
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'text-white' : 'text-blue-200 hover:text-white transition-colors'}>Home</NavLink>
            <NavLink to="/services" className={({ isActive }) => isActive ? 'text-white' : 'text-blue-200 hover:text-white transition-colors'}>Services</NavLink>
            <NavLink to="/lookup" className={({ isActive }) => isActive ? 'text-white' : 'text-blue-200 hover:text-white transition-colors'}>My Booking</NavLink>
            <Link to="/book" className="bg-white text-blue-900 font-semibold text-sm py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
              Book Now
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer style={{ background: '#1e3a8a' }} className="py-10 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white font-bold text-lg">AMPONSAH TECH</p>
              <p className="text-blue-200 text-sm">Reliable · Professional · Trusted Installation Services</p>
              <p className="text-blue-300 text-xs mt-1">Serving Homes & Businesses</p>
            </div>
            <div className="text-right text-sm space-y-1">
              <p className="text-blue-200 flex items-center gap-2 justify-end">
                <span>✉</span>
                <a href="mailto:josephamponsah91@gmail.com" className="text-white hover:underline">josephamponsah91@gmail.com</a>
              </p>
              <p className="text-blue-200 flex items-center gap-2 justify-end">
                <span>📞</span>
                <a href="tel:+233256287345" className="text-white hover:underline">0256287345</a>
              </p>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-6 pt-4 text-center text-xs text-blue-400">
            © {new Date().getFullYear()} Amponsah Tech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
