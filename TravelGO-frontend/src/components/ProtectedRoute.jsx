import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  console.log("Protected Route Check - isAdmin:", isAdmin); // 🟢 Debug
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;