import { Link } from "react-router-dom";
import "./Dashboard.css";

function StudentDashboard() {
  return (
    <div className="dashboard-page">

      <aside className="sidebar">

        <div className="sidebar-logo">
          ⚙ HardwareHub
        </div>

        <div className="user-role">
          <div className="user-icon">S</div>

          <div>
            <b>Student</b>
            <small>Student</small>
          </div>
        </div>

        <nav>

          <Link to="/student/dashboard" className="active">
            🏠 Dashboard
          </Link>

          <Link to="/components">
            ▦ Components
          </Link>

          <Link to="/scan-qr">
            ▣ Scan QR
          </Link>

          <Link to="/login">
            ⇥ Logout
          </Link>

        </nav>

      </aside>

      <main className="dashboard-content">

        <header className="dashboard-header">
          <h2>Student Dashboard</h2>
          <span>Student</span>
        </header>

        <p className="welcome-text">
          Browse hardware components and learn through tutorials.
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
            <span>▣</span>
            <div>
              <small>Scanned Today</small>
              <h2>3</h2>
            </div>
          </div>

          <div className="stat-card">
            <span>★</span>
            <div>
              <small>Tutorials Watched</small>
              <h2>4</h2>
            </div>
          </div>

        </div>

        <div className="section-heading">
          <h3>Hardware Components</h3>
          <Link to="/components">View All</Link>
        </div>

        <div className="component-list">

          <div className="student-component">
            <div className="component-icon">🔵</div>

            <div>
              <b>Arduino Uno</b>
              <small>Microcontroller board</small>
            </div>

            <Link to="/component-details">
              View / Scan
            </Link>
          </div>

          <div className="student-component">
            <div className="component-icon">⚫</div>

            <div>
              <b>Ultrasonic Sensor</b>
              <small>Distance measurement</small>
            </div>

            <Link to="/component-details">
              View / Scan
            </Link>
          </div>

          <div className="student-component">
            <div className="component-icon">🔷</div>

            <div>
              <b>DHT11 Sensor</b>
              <small>Temperature & humidity</small>
            </div>

            <Link to="/component-details">
              View / Scan
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}

export default StudentDashboard;