import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) => `navbar-link ${isActive ? "active" : ""}`;

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="login-brandmark-mark small">BU</span>
        <span>BNY University</span>
      </div>

      <nav className="navbar-links">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/training" className={linkClass}>Training</NavLink>
        <NavLink to="/programs" className={linkClass}>Programs</NavLink>
        {currentUser?.role?.toLowerCase() === "admin" && (
          <NavLink to="/admin" className={linkClass}>Admin</NavLink>
        )}
      </nav>

      <div className="navbar-user">
        <div className="navbar-user-id">
          <span className="navbar-user-name">{currentUser?.name}</span>
          
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
}
