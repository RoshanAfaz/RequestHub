import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(user.role?.toLowerCase())) {
    // Redirect to appropriate dashboard based on role
    const lowRole = user.role?.toLowerCase();
    return <Navigate to={lowRole === "admin" || lowRole === "hr" ? "/hr-dashboard" : "/dashboard"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
