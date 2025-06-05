import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  role: string;
  children: React.ReactNode;
}

function ProtectedRoute({ isAuthenticated, role, children }: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export default ProtectedRoute;