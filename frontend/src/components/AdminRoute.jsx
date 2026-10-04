import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // Belum login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Data user tidak ditemukan
  if (!userData) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userData);

  // Bukan admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin
  return children;
}

export default AdminRoute;