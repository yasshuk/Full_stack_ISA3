import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { apiRequest } from "../services/api";
import Footer from "../components/Footer";


function StudentDashboard() {

  const navigate = useNavigate();

  const [components, setComponents] = useState([]);

  const [scannedToday, setScannedToday] = useState(0);
  const [tutorialsWatched, setTutorialsWatched] = useState(0);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login");

  };


  // ==========================================
  // LOAD COMPONENTS AND STUDENT STATISTICS
  // ==========================================

  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        setLoading(true);
        setStatsLoading(true);

        setError("");
        setStatsError("");


        // ==========================================
        // LOAD COMPONENTS
        // ==========================================

        const componentData = await apiRequest(
          "/components"
        );

        setComponents(
          componentData.components || []
        );


        // ==========================================
        // LOAD STUDENT STATISTICS
        // ==========================================

        const statsData = await apiRequest(
          "/activity/stats"
        );

        setScannedToday(
          statsData.stats?.scannedToday || 0
        );

        setTutorialsWatched(
          statsData.stats?.tutorialsWatched || 0
        );

      } catch (error) {

        console.error(
          "Failed to load dashboard data:",
          error
        );

        setError(
          error.message ||
          "Failed to load dashboard data."
        );

        setStatsError(
          error.message ||
          "Failed to load student statistics."
        );

      } finally {

        setLoading(false);
        setStatsLoading(false);

      }

    };


    loadDashboardData();

  }, []);


  return (
    <div className="dashboard-page">

      {/* ==========================================
          SIDEBAR
          ========================================== */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          ⚙ HardwareHub
        </div>


        <div className="user-role">

          <div className="user-icon">
            S
          </div>

          <div>
            <b>Student</b>
            <small>Student</small>
          </div>

        </div>


        <nav>

          <Link
            to="/student/dashboard"
            className="active"
          >
            🏠 Dashboard
          </Link>


          <Link to="/components">
            ▦ Components
          </Link>


          <Link to="/scan-qr">
            ▣ Scan QR
          </Link>


          <button
            onClick={handleLogout}
            className="logout-button"
          >
            ⇥ Logout
          </button>

        </nav>

      </aside>


      {/* ==========================================
          MAIN CONTENT
          ========================================== */}

      <main className="dashboard-content">

        <header className="dashboard-header">

          <h2>
            Student Dashboard
          </h2>

          <span>
            Student
          </span>

        </header>


        <p className="welcome-text">
          Explore hardware components, simulations and tutorials.
        </p>


        {/* ==========================================
            STATISTICS
            ========================================== */}

        <div className="stats">


          {/* TOTAL COMPONENTS */}

          <div className="stat-card">

            <span>
              📦
            </span>

            <div>

              <small>
                Total Components
              </small>

              <h2>
                {loading
                  ? "..."
                  : components.length}
              </h2>

            </div>

          </div>


          {/* SCANNED TODAY */}

          <div className="stat-card">

            <span>
              ▣
            </span>

            <div>

              <small>
                Scanned Today
              </small>

              <h2>

                {statsLoading
                  ? "..."
                  : statsError
                    ? "0"
                    : scannedToday}

              </h2>

            </div>

          </div>


          {/* TUTORIALS WATCHED */}

          <div className="stat-card">

            <span>
              ★
            </span>

            <div>

              <small>
                Tutorials Watched
              </small>

              <h2>

                {statsLoading
                  ? "..."
                  : statsError
                    ? "0"
                    : tutorialsWatched}

              </h2>

            </div>

          </div>


        </div>


        {/* ==========================================
            COMPONENT SECTION
            ========================================== */}

        <div className="section-heading">

          <h3>
            Hardware Components
          </h3>

          <Link to="/components">
            View All
          </Link>

        </div>


        {/* ==========================================
            LOADING
            ========================================== */}

        {loading && (

          <div className="component-list">

            <p>
              Loading components...
            </p>

          </div>

        )}


        {/* ==========================================
            ERROR
            ========================================== */}

        {!loading && error && (

          <div className="component-list">

            <p>
              {error}
            </p>

          </div>

        )}


        {/* ==========================================
            COMPONENTS
            ========================================== */}

        {!loading && !error && (

          <div className="component-list">

            {components.length === 0 ? (

              <p>
                No components available.
              </p>

            ) : (

              components
                .slice(0, 3)
                .map((component) => (

                  <div
                    className="student-component"
                    key={component.id}
                  >

                    <div className="component-icon">
                      🔵
                    </div>


                    <div>

                      <b>
                        {component.name}
                      </b>

                      <small>
                        {component.description ||
                          "Hardware component"}
                      </small>

                    </div>


                    <Link
                      to={`/component-details?id=${component.id}`}
                    >
                      Explore
                    </Link>

                  </div>

                ))

            )}

          </div>

        )}
  <Footer />

      </main>

    </div>
  );
}

export default StudentDashboard;