import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '../api/services';
import ServiceCard from '../components/ServiceCard';

const SERVICES_INFO = [
  {
    icon: '📷',
    title: 'CCTV Installation',
    body: 'HD cameras, DVR/NVR setup, night vision, remote viewing, and motion alerts for homes and businesses.',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    icon: '🌐',
    title: 'Internet & Networking',
    body: 'Wi-Fi setup, office LAN, structured cabling, switches, access points, and network troubleshooting.',
    color: 'bg-cyan-50 text-cyan-700',
  },
  {
    icon: '⚡',
    title: 'Electrical Services',
    body: 'Wiring, distribution boards, fault diagnosis, security lighting, solar, and inverter installation.',
    color: 'bg-amber-50 text-amber-700',
  },
];

export default function HomePage() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  // Group by category for a structured display
  const featured = services.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)' }} className="text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-100 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"></span>
              Now accepting online bookings
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Professional Tech<br />Services You Can Trust
            </h1>
            <p className="text-lg text-blue-100 mb-4">
              CCTV Installation · Internet & Networking · Electrical Services
            </p>
            <p className="text-blue-200 mb-8 text-sm">
              Reliable · Professional · Trusted — Serving Homes &amp; Businesses across Ghana
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/book" className="bg-white text-blue-900 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
                Book a Service
              </Link>
              <Link to="/services" className="border border-white/40 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
                View All Services
              </Link>
            </div>
            {/* Contact strip */}
            <div className="flex flex-wrap gap-6 mt-10 text-sm text-blue-200">
              <a href="tel:+233256287345" className="flex items-center gap-2 hover:text-white">
                <span>📞</span> 0256287345
              </a>
              <a href="mailto:josephamponsah91@gmail.com" className="flex items-center gap-2 hover:text-white">
                <span>✉</span> josephamponsah91@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">What We Do</h2>
        <p className="text-slate-500 text-center text-sm mb-10">Expert installation and support for all your tech needs.</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {SERVICES_INFO.map(({ icon, title, body, color }) => (
            <div key={title} className="card text-center hover:shadow-md transition-shadow">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl ${color} mb-4`}>
                {icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured services */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Our Services</h2>
            <p className="text-slate-500 text-sm mt-1">Choose a service and book your appointment online.</p>
          </div>
          <Link to="/services" className="text-sm font-medium text-blue-700 hover:underline hidden sm:block">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="card animate-pulse h-56 bg-slate-100" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(s => <ServiceCard key={s._id} service={s} />)}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/services" className="btn-secondary">View All Services</Link>
        </div>
      </section>

      {/* Why choose us */}
      <section style={{ background: '#f1f5f9' }} className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-10">Why Choose Amponsah Tech?</h2>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { icon: '🏆', label: 'Experienced Team' },
              { icon: '⚡', label: 'Fast Response' },
              { icon: '🛡️', label: 'Trusted & Reliable' },
              { icon: '🔧', label: 'After-Sales Support' },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{icon}</div>
                <p className="font-semibold text-slate-800 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ background: '#1e3a8a' }} className="py-14">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
          <p className="text-blue-200 mb-6 text-sm">Book online in minutes. We come to you — homes and businesses across Ghana.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/book" className="bg-white text-blue-900 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
              Book Now
            </Link>
            <a href="tel:+233256287345" className="border border-white/40 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
              Call 0256287345
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
