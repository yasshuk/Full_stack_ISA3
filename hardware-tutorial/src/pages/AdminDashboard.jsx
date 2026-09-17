import { Link } from "react-router-dom";
import "./Dashboard.css";

function AdminDashboard() {
  return (
    <div className="dashboard-page">

      <aside className="sidebar">
        <div className="sidebar-logo">⚙ HardwareHub</div>

        <div className="user-role">
          <div className="user-icon">A</div>
          <div>
            <b>Admin</b>
            <small>Administrator</small>
          </div>
        </div>

        <nav>
          <Link to="/admin/dashboard" className="active">
            🏠 Dashboard
          </Link>

          <Link to="/components">
            ▦ Components
          </Link>

          <Link to="/add-component">
            ＋ Add Component
          </Link>

          <Link to="/login">
            ⇥ Logout
          </Link>
        </nav>
      </aside>

      <main className="dashboard-content">

        <header className="dashboard-header">
          <h2>Admin Dashboard</h2>
          <span>Admin</span>
        </header>

        <p className="welcome-text">
          Manage hardware components and tutorial QR codes.
        </p>

        <div className="stats">

          <div className="stat-card">
            <span>📦</span>
            <div>
              <small>Total Components</small>
              <h2>5</h2>
            </div>
          </div>

          <div className="stat-card">
            <span>👤</span>
            <div>
              <small>Total Students</small>
              <h2>10</h2>
            </div>
          </div>

          <div className="stat-card">
            <span>▦</span>
            <div>
              <small>QR Codes</small>
              <h2>5</h2>
            </div>
          </div>

        </div>

        <div className="section-heading">
          <h3>Recent Components</h3>
          <Link to="/components">View All</Link>
        </div>

        <div className="table-card">

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>YouTube</th>
                <th>QR Code</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Arduino Uno</td>
                <td>Microcontroller board</td>
                <td>▶</td>
                <td>▦</td>
              </tr>

              <tr>
                <td>Ultrasonic Sensor</td>
                <td>Distance measurement</td>
                <td>▶</td>
                <td>▦</td>
              </tr>

              <tr>
                <td>DHT11 Sensor</td>
                <td>Temperature & humidity</td>
                <td>▶</td>
                <td>▦</td>
              </tr>
            </tbody>
          </table>

        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;