import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "./Navbar.jsx";

export function ProtectedLayout() {
  const { currentUser, initializing } = useAuth();

  if (initializing) return null;
  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminRoute() {
  const { currentUser } = useAuth();
  if (currentUser?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
