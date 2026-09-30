import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="text-7xl font-bold text-brand-600 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  );
}
