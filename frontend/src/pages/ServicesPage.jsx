import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '../api/services';
import ServiceCard from '../components/ServiceCard';
import { SpinnerIcon } from '../components/Icons';

const CATEGORIES = ['All', 'CCTV Installation', 'Internet & Networking', 'Electrical Services'];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: services = [], isLoading, isError } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  const filtered = activeCategory === 'All'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Our Services</h1>
        <p className="text-slate-500">Professional installation and support — choose a service to book your appointment.</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              activeCategory === cat
                ? 'border-blue-800 text-white'
                : 'border-slate-200 text-slate-600 bg-white hover:border-blue-400 hover:text-blue-700'
            }`}
            style={activeCategory === cat ? { background: '#1e3a8a' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <SpinnerIcon className="w-8 h-8 text-blue-700" />
        </div>
      )}

      {isError && (
        <p className="text-center text-red-500 py-10">Could not load services. Please try again.</p>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <p className="text-center text-slate-400 py-10">No services in this category.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(s => <ServiceCard key={s._id} service={s} />)}
      </div>

      {/* Contact nudge */}
      <div className="mt-16 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-slate-900 mb-1">Need something custom?</h3>
        <p className="text-slate-500 text-sm mb-4">Contact us directly for bespoke projects and enterprise installations.</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-blue-800">
          <a href="tel:+233256287345" className="hover:underline">📞 0256287345</a>
          <a href="mailto:josephamponsah91@gmail.com" className="hover:underline">✉ josephamponsah91@gmail.com</a>
        </div>
      </div>
    </div>
  );
}
