import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { apiRequest } from "../services/api";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function AdminDashboard() {

  const [components, setComponents] = useState([]);

  const [totalStudents, setTotalStudents] = useState(0);

  const [loading, setLoading] = useState(true);

  const [studentsLoading, setStudentsLoading] = useState(true);

  const [error, setError] = useState("");

  const [studentsError, setStudentsError] = useState("");

  const [deleteLoading, setDeleteLoading] = useState(null);


  // ==========================================
  // LOAD COMPONENTS
  // ==========================================

  const loadComponents = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await apiRequest(
        "/components"
      );

      setComponents(
        data.components || []
      );

    } catch (error) {

      console.error(
        "Failed to load components:",
        error
      );

      setError(error.message);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD TOTAL STUDENTS
  // ==========================================

  const loadTotalStudents = async () => {

    try {

      setStudentsLoading(true);
      setStudentsError("");

      const data = await apiRequest(
        "/admin/stats"
      );

      setTotalStudents(
        data.totalStudents || 0
      );

    } catch (error) {

      console.error(
        "Failed to load student count:",
        error
      );

      setStudentsError(
        error.message
      );

    } finally {

      setStudentsLoading(false);

    }

  };


  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {

    loadComponents();
    loadTotalStudents();

  }, []);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.location.href = "/login";

  };


  // ==========================================
  // DELETE COMPONENT
  // ==========================================

  const handleDelete = async (component) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${component.name}"?`
    );


    if (!confirmDelete) {
      return;
    }


    try {

      setDeleteLoading(component.id);

      await apiRequest(
        `/components/${component.id}`,
        {
          method: "DELETE"
        }
      );


      setComponents((currentComponents) =>
        currentComponents.filter(
          (item) =>
            item.id !== component.id
        )
      );


    } catch (error) {

      console.error(
        "Failed to delete component:",
        error
      );

      setError(error.message);

    } finally {

      setDeleteLoading(null);

    }

  };


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
            A
          </div>


          <div>

            <b>
              Admin
            </b>

            <small>
              Administrator
            </small>

          </div>

        </div>


        <nav>

          <Link
            to="/admin/dashboard"
            className="active"
          >
            🏠 Dashboard
          </Link>


          <Link to="/components">
            ▦ Components
          </Link>


          <Link to="/add-component">
            ＋ Add Component
          </Link>


          <button
            type="button"
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
            Admin Dashboard
          </h2>


          <span>
            Admin
          </span>

        </header>


        <p className="welcome-text">

          Manage hardware components, simulations and tutorial QR codes.

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


          {/* TOTAL STUDENTS */}

          <div className="stat-card">

            <span>
              👤
            </span>


            <div>

              <small>
                Total Students
              </small>


              <h2>

                {studentsLoading
                  ? "..."
                  : studentsError
                    ? "0"
                    : totalStudents}

              </h2>

            </div>

          </div>


          {/* QR CODES */}

          <div className="stat-card">

            <span>
              ▦
            </span>


            <div>

              <small>
                QR Codes
              </small>


              <h2>

                {loading
                  ? "..."
                  : components.length}

              </h2>

            </div>

          </div>


        </div>


        {/* ==========================================
            RECENT COMPONENTS
            ========================================== */}

        <div className="section-heading">

          <h3>
            Recent Components
          </h3>


          <Link to="/components">
            View All
          </Link>

        </div>


        <div className="table-card">


          {loading && (

            <p>
              Loading components...
            </p>

          )}


          {!loading && error && (

            <p>
              {error}
            </p>

          )}


          {!loading && !error && (

            <table>

              <thead>

                <tr>

                  <th>
                    Name
                  </th>


                  <th>
                    Description
                  </th>


                  <th>
                    Tinkercad
                  </th>


                  <th>
                    YouTube
                  </th>


                  <th>
                    QR Code
                  </th>


                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>


                {components.length === 0 ? (

                  <tr>

                    <td colSpan="6">

                      No components available.

                    </td>

                  </tr>

                ) : (

                  components
                    .slice(0, 5)
                    .map((component) => (

                      <tr
                        key={component.id}
                      >


                        {/* NAME */}

                        <td>

                          {component.name}

                        </td>


                        {/* DESCRIPTION */}

                        <td>

                          {component.description ||
                            "No description"}

                        </td>


                        {/* TINKERCAD */}

                        <td>

                          {component.tinkercad_url ? (

                            <a
                              href={component.tinkercad_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open
                            </a>

                          ) : (

                            "—"

                          )}

                        </td>


                        {/* YOUTUBE */}

                        <td>

                          {component.youtube_url ? (

                            <a
                              href={component.youtube_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              ▶
                            </a>

                          ) : (

                            "—"

                          )}

                        </td>


                        {/* QR CODE */}

                        <td>

                          {component.qr_code ? (

                            <img
                              src={component.qr_code}
                              alt={`QR Code for ${component.name}`}
                              width="40"
                              height="40"
                            />

                          ) : (

                            "—"

                          )}

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="action-buttons">


                            {/* VIEW */}

                            <Link
                              to={`/component-details?id=${component.id}`}
                              className="view-button"
                            >
                              View
                            </Link>


                            {/* EDIT */}

                            <Link
                              to={`/edit-component?id=${component.id}`}
                              className="edit-button"
                            >
                              Edit
                            </Link>


                            {/* DELETE */}

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() =>
                                handleDelete(component)
                              }
                              disabled={
                                deleteLoading ===
                                component.id
                              }
                            >

                              {deleteLoading ===
                              component.id
                                ? "Deleting..."
                                : "Delete"}

                            </button>


                          </div>

                        </td>


                      </tr>

                    ))

                )}

              </tbody>

            </table>

          )}

        </div>

    <Footer />
      </main>

    </div>

  );

}


export default AdminDashboard;