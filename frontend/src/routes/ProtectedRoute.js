import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { loading } = useSelector((state) => state.user);
  const isAuthenticated = localStorage.getItem('isauth')
  if (loading === false) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }
};

export default ProtectedRoute;
