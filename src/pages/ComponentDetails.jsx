import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
  useNavigate
} from "react-router-dom";

import "./ComponentDetails.css";
import { apiRequest } from "../services/api";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function ComponentDetails() {

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const componentId = searchParams.get("id");

  // ==========================================
  // COMPONENT STATE
  // ==========================================

  const [component, setComponent] = useState(null);

  const [tutorials, setTutorials] = useState([]);

  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(true);

  const [tutorialsLoading, setTutorialsLoading] =
    useState(true);

  // ==========================================
  // ERROR
  // ==========================================

  const [error, setError] = useState("");

  const [tutorialError, setTutorialError] =
    useState("");

  // ==========================================
  // LOAD COMPONENT
  // ==========================================

  useEffect(() => {

    const loadComponent = async () => {

      if (!componentId) {

        setError("Component ID is missing.");

        setLoading(false);

        return;
      }

      try {

        setLoading(true);

        setError("");

        const data = await apiRequest(
          `/components/${componentId}`
        );

        if (!data.component) {

          throw new Error(
            "Component not found."
          );

        }

        setComponent(data.component);

      } catch (error) {

        console.error(
          "Failed to load component:",
          error
        );

        setError(
          error.message ||
          "Failed to load component."
        );

      } finally {

        setLoading(false);

      }

    };

    loadComponent();

  }, [componentId]);

  // ==========================================
  // LOAD TUTORIALS
  // ==========================================

  useEffect(() => {

    const loadTutorials = async () => {

      if (!componentId) {

        setTutorialsLoading(false);

        return;
      }

      try {

        setTutorialsLoading(true);

        setTutorialError("");

        const data = await apiRequest(
          `/tutorials/component/${componentId}`
        );

        setTutorials(
          data.tutorials || []
        );

      } catch (error) {

        console.error(
          "Failed to load tutorials:",
          error
        );

        setTutorialError(
          error.message ||
          "Failed to load tutorials."
        );

      } finally {

        setTutorialsLoading(false);

      }

    };

    loadTutorials();

  }, [componentId]);

  // ==========================================
  // OPEN TINKERCAD
  // ==========================================

  const openTinkercad = () => {

    if (!component?.tinkercad_url) {
      return;
    }

    window.open(
      component.tinkercad_url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================
  // OPEN TUTORIAL
  // ==========================================

  const openTutorial = (tutorial) => {

    if (!tutorial?.id) {
      return;
    }

    navigate(
      `/tutorial/${tutorial.id}`
    );
  };

  // ==========================================
  // DOWNLOAD QR
  // ==========================================

  const downloadQR = () => {

    if (!component?.qr_code) {
      return;
    }

    const link = document.createElement("a");

    link.href = component.qr_code;

    link.download =
      `${component.name || "component"}-QR.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="details-page">

        <Sidebar role="Student" />

        <div className="details-main">

          <header className="details-header">

            <Link
              to="/components"
              className="details-brand"
            >
              ⚙ HardwareHub
            </Link>

          </header>

          <main className="details-content">

            <div className="details-card loading-card">

              <div className="loading-icon">
                🔧
              </div>

              <p>
                Loading component...
              </p>

            </div>

          </main>

          <Footer />

        </div>

      </div>

    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="details-page">

        <Sidebar role="Student" />

        <div className="details-main">

          <header className="details-header">

            <Link
              to="/components"
              className="details-brand"
            >
              ⚙ HardwareHub
            </Link>

          </header>

          <main className="details-content">

            <div className="details-card error-card">

              <div className="error-icon">
                !
              </div>

              <h2>
                Something went wrong
              </h2>

              <p className="error-message">
                {error}
              </p>

              <Link
                to="/components"
                className="back-button"
              >
                ← Back to Components
              </Link>

            </div>

          </main>

          <Footer />

        </div>

      </div>

    );
  }

  // ==========================================
  // COMPONENT NOT FOUND
  // ==========================================

  if (!component) {

    return (

      <div className="details-page">

        <Sidebar role="Student" />

        <div className="details-main">

          <header className="details-header">

            <Link
              to="/components"
              className="details-brand"
            >
              ⚙ HardwareHub
            </Link>
          </header>

          <main className="details-content">

            <div className="details-card error-card">

              <div className="error-icon">
                ?
              </div>

              <h2>
                Component not found
              </h2>

              <p>
                The requested component could not be found.
              </p>

              <Link
                to="/components"
                className="back-button"
              >
                ← Back to Components
              </Link>

            </div>

          </main>

          <Footer />

        </div>

      </div>

    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (

    <div className="details-page">

      {/* SIDEBAR */}

      <Sidebar role="Student" />

      {/* MAIN AREA */}

      <div className="details-main">

        {/* HEADER */}

        <header className="details-header">

          <Link
            to="/components"
            className="details-brand"
          >
            ⚙ HardwareHub
          </Link>

          <Link
            to="/components"
            className="back-components"
          >
            ← Back to Components
          </Link>

        </header>

        {/* CONTENT */}

        <main className="details-content">

          <div className="details-layout">

            {/* COMPONENT INFORMATION */}

            <section className="component-info-card">

              <div className="details-image">
                🔵
              </div>

              <div className="details-info">

                <span className="component-label">
                  Hardware Component
                </span>

                <h1>
                  {component.name}
                </h1>

                <p className="component-description">
                  {component.description ||
                    "No description available."}
                </p>

                {component.tinkercad_url && (

                  <div className="simulation-box">

                    <div className="simulation-icon">
                      🧪
                    </div>

                    <div>
                      <strong>
                        Tinkercad Simulation
                      </strong>

                      <span>
                        Simulation available for this component
                      </span>
                    </div>

                  </div>

                )}

                {component.tinkercad_url && (

                  <button
                    type="button"
                    onClick={openTinkercad}
                    className="tinkercad-button"
                  >
                    🛠 Open Tinkercad Simulation
                  </button>

                )}

              </div>

            </section>

            {/* TUTORIALS */}

            <section className="tutorial-section">

              <div className="section-heading">

                <div>
                  <h2>
                    Tutorials
                  </h2>

                  <p>
                    Learn how to use this component.
                  </p>
                </div>

                <span className="tutorial-count">
                  {tutorials.length} Tutorial
                  {tutorials.length !== 1 ? "s" : ""}
                </span>

              </div>

              {tutorialsLoading && (

                <div className="tutorial-message">
                  Loading tutorials...
                </div>

              )}

              {!tutorialsLoading &&
                tutorialError && (

                  <p className="error-message">
                    {tutorialError}
                  </p>

                )}

              {!tutorialsLoading &&
                !tutorialError &&
                tutorials.length === 0 && (

                  <div className="tutorial-message">
                    No tutorials available.
                  </div>

                )}

              {!tutorialsLoading &&
                !tutorialError &&
                tutorials.map((tutorial) => (

                  <div
                    className="tutorial-card"
                    key={tutorial.id}
                  >

                    <div className="tutorial-number">
                      ▶
                    </div>

                    <div className="tutorial-card-content">

                      <h3>
                        {tutorial.title}
                      </h3>

                      <p>
                        YouTube Tutorial
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          openTutorial(tutorial)
                        }
                        className="watch-tutorial-button"
                      >
                        ▶ Watch Tutorial
                      </button>

                    </div>

                  </div>

                ))}

            </section>

            {/* QR CODE */}

            <aside className="qr-box">

              <div className="qr-icon">
                ▣
              </div>

              <h3>
                Component QR Code
              </h3>

              <p>
                Scan or download this QR code
                to access the component.
              </p>

              {component.qr_code ? (

                <>
                  <div className="qr-image-container">

                    <img
                      src={component.qr_code}
                      alt={`QR Code for ${component.name}`}
                      className="qr-image"
                    />

                  </div>

                  <button
                    type="button"
                    onClick={downloadQR}
                    className="download-qr-button"
                  >
                    ↓ Download QR
                  </button>

                </>

              ) : (

                <p>
                  QR code not available.
                </p>

              )}

            </aside>

          </div>

        </main>

        {/* FOOTER */}

        <Footer />

      </div>

    </div>

  );
}

export default ComponentDetails;