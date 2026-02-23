import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { loggedIn, user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !requiredRole.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return element;
};

export default ProtectedRoute;
