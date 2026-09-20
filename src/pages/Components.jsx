import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Components.css";
import { apiRequest } from "../services/api";

function Components() {

  const navigate = useNavigate();

  const [components, setComponents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  let user = null;

  try {

    if (storedUser) {
      user = JSON.parse(storedUser);
    }

  } catch (error) {

    console.error(
      "Invalid stored user data:",
      error
    );

  }


  // ==========================================
  // CHECK WHETHER USER IS ADMIN
  // ==========================================

  const isAdmin =
    user?.role === "admin";


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
  // LOAD COMPONENTS
  // ==========================================

  useEffect(() => {

    const loadComponents = async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await apiRequest("/components");


        setComponents(
          data.components || []
        );


      } catch (error) {

        console.error(
          "Failed to load components:",
          error
        );

        setError(
          error.message ||
          "Failed to load components."
        );


      } finally {

        setLoading(false);

      }

    };


    loadComponents();

  }, []);


  return (

    <div className="components-page">


      {/* ==========================================
          HEADER
          ========================================== */}

      <header className="simple-header">


        <Link
          to="/"
          className="brand"
        >
          ⚙ HardwareHub
        </Link>


        <button
          onClick={handleLogout}
          className="header-login"
        >
          Logout
        </button>


      </header>


      {/* ==========================================
          MAIN CONTENT
          ========================================== */}

      <main className="components-content">


        {/* ==========================================
            PAGE TITLE
            ========================================== */}

        <div className="page-title">

          <div>

            <h1>
              Hardware Components
            </h1>

            <p>
              Explore hardware components, Tinkercad simulations and tutorials.
            </p>

          </div>


          {/* ==========================================
              ADMIN ONLY
              ========================================== */}

          {isAdmin && (

            <Link
              to="/add-component"
              className="add-button"
            >
              + Add Component
            </Link>

          )}

        </div>


        {/* ==========================================
            LOADING
            ========================================== */}

        {loading && (

          <div className="components-grid">

            <p>
              Loading components...
            </p>

          </div>

        )}


        {/* ==========================================
            ERROR
            ========================================== */}

        {!loading && error && (

          <div className="components-grid">

            <p>
              {error}
            </p>

          </div>

        )}


        {/* ==========================================
            COMPONENT LIST
            ========================================== */}

        {!loading && !error && (

          <div className="components-grid">


            {components.length === 0 ? (

              <p>
                No components available.
              </p>

            ) : (

              components.map((component) => (

                <div
                  className="component-card"
                  key={component.id}
                >


                  {/* COMPONENT ICON */}

                  <div className="component-picture">
                    🔵
                  </div>


                  {/* COMPONENT NAME */}

                  <h3>
                    {component.name}
                  </h3>


                  {/* COMPONENT DESCRIPTION */}

                  <p>
                    {component.description ||
                      "No description available."}
                  </p>


                  {/* TINKERCAD STATUS */}

                  {component.tinkercad_url && (

                    <small>
                      🧪 Tinkercad Simulation Available
                    </small>

                  )}


                  {/* VIEW COMPONENT */}

                  <Link
                    to={`/component-details?id=${component.id}`}
                  >
                    View Component
                  </Link>


                </div>

              ))

            )}

          </div>

        )}

      </main>

    </div>

  );
}

export default Components;