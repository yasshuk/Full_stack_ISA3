import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ role = "Admin" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Keep your existing logout/authentication logic here if your project already has one.
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <div className="brand-icon">⚙</div>
        <div>
          <h2>HardwareHub</h2>
          <span>Hardware Tutorials</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {role === "Admin" ? "A" : "S"}
        </div>

        <div>
          <strong>{role}</strong>
          <small>
            {role === "Admin" ? "Administrator" : "Student"}
          </small>
        </div>
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to={role === "Admin" ? "/admin/dashboard" : "/student/dashboard"}
        >
          <span>🏠</span>
          Dashboard
        </NavLink>

        <NavLink to="/components">
          <span>🔧</span>
          Components
        </NavLink>

        {role === "Admin" && (
          <NavLink to="/add-component">
            <span>➕</span>
            Add Component
          </NavLink>
        )}

        {role !== "Admin" && (
          <NavLink to="/scan-qr">
            <span>▣</span>
            Scan QR
          </NavLink>
        )}


      </nav>

      <div className="sidebar-bottom">
        <button onClick={handleLogout}>
          <span>↪</span>
          Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;