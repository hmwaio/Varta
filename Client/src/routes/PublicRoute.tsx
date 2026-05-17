import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/Auth.js';

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If logged in, redirect to home
  return user ? <Navigate to="/" replace /> : <Outlet />;
}