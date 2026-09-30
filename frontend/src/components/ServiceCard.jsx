import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  'CCTV Installation':    { bg: 'bg-blue-50',   text: 'text-blue-700',  border: 'border-blue-200' },
  'Internet & Networking': { bg: 'bg-cyan-50',   text: 'text-cyan-700',  border: 'border-cyan-200' },
  'Electrical Services':  { bg: 'bg-amber-50',  text: 'text-amber-700', border: 'border-amber-200' },
};

const CATEGORY_ICONS = {
  'CCTV Installation':    '📷',
  'Internet & Networking': '🌐',
  'Electrical Services':  '⚡',
};

export default function ServiceCard({ service }) {
  const colors = CATEGORY_COLORS[service.category] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  const icon = CATEGORY_ICONS[service.category] || '🔧';

  return (
    <div className="card hover:shadow-lg transition-shadow flex flex-col gap-4 group">
      {/* Category badge */}
      <div className="flex items-start justify-between">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
          <span>{icon}</span>
          {service.category || 'General'}
        </span>
        <span className="text-lg font-bold text-blue-900">
          GHS {service.price.toFixed(2)}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
          {service.name}
        </h3>
        {service.description && (
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
            {service.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
          </svg>
          Est. {service.duration >= 60
            ? `${Math.floor(service.duration / 60)}h ${service.duration % 60 > 0 ? service.duration % 60 + 'm' : ''}`.trim()
            : `${service.duration} min`}
        </span>
        <span className="text-xs text-slate-400">Onsite service</span>
      </div>

      <Link to={`/book/${service._id}`} className="btn-primary text-sm py-2.5">
        Book This Service
      </Link>
    </div>
  );
}
