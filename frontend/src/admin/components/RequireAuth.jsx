import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SpinnerIcon } from '../../components/Icons';

export default function RequireAuth({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerIcon className="w-8 h-8 text-brand-600" />
      </div>
    );
  }

  if (!admin) return <Navigate to="/admin/login" replace />;

  return children;
}
