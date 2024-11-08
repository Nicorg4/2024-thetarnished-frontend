import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: ReactElement;
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component, roles }) => {
  const user = localStorage.getItem('user');
  const userObj = user ? JSON.parse(user) : null;
  const hasAccess = roles.some(role => userObj?.role?.includes(role));

  return hasAccess ? Component : <Navigate to="/access-denied" replace />;
};

export default ProtectedRoute;
