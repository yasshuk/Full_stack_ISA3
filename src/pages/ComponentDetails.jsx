import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
  useNavigate
} from "react-router-dom";

import "./ComponentDetails.css";
import { apiRequest } from "../services/api";


function ComponentDetails() {

  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();

  const componentId =
    searchParams.get("id");


  // ==========================================
  // COMPONENT STATE
  // ==========================================

  const [component, setComponent] =
    useState(null);

  const [tutorials, setTutorials] =
    useState([]);


  // ==========================================
  // LOADING STATE
  // ==========================================

  const [loading, setLoading] =
    useState(true);

  const [tutorialsLoading, setTutorialsLoading] =
    useState(true);


  // ==========================================
  // ERROR STATE
  // ==========================================

  const [error, setError] =
    useState("");

  const [tutorialError, setTutorialError] =
    useState("");


  // ==========================================
  // LOAD COMPONENT
  // ==========================================

  useEffect(() => {

    const loadComponent = async () => {

      if (!componentId) {

        setError(
          "Component ID is missing."
        );

        setLoading(false);

        return;

      }


      try {

        setLoading(true);
        setError("");


        const data =
          await apiRequest(
            `/components/${componentId}`
          );


        if (!data.component) {

          throw new Error(
            "Component not found."
          );

        }


        setComponent(
          data.component
        );

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


        const data =
          await apiRequest(
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
  // DOWNLOAD COMPONENT QR
  // ==========================================

  const downloadQR = () => {

    if (!component?.qr_code) {
      return;
    }


    const link =
      document.createElement("a");


    link.href =
      component.qr_code;


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

        <header className="simple-header">

          <Link
            to="/components"
            className="brand"
          >
            ← HardwareHub
          </Link>

        </header>


        <main className="details-content">

          <div className="details-card">

            <p>
              Loading component...
            </p>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="details-page">

        <header className="simple-header">

          <Link
            to="/components"
            className="brand"
          >
            ← HardwareHub
          </Link>

        </header>


        <main className="details-content">

          <div className="details-card">

            <p className="error-message">
              {error}
            </p>


            <Link
              to="/components"
              className="back-button"
            >
              Back to Components
            </Link>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // COMPONENT NOT FOUND
  // ==========================================

  if (!component) {

    return (

      <div className="details-page">

        <header className="simple-header">

          <Link
            to="/components"
            className="brand"
          >
            ← HardwareHub
          </Link>

        </header>


        <main className="details-content">

          <div className="details-card">

            <p>
              Component not found.
            </p>


            <Link
              to="/components"
              className="back-button"
            >
              Back to Components
            </Link>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (

    <div className="details-page">

      {/* ======================================
          HEADER
          ====================================== */}

      <header className="simple-header">

        <Link
          to="/components"
          className="brand"
        >
          ← HardwareHub
        </Link>

      </header>


      {/* ======================================
          MAIN CONTENT
          ====================================== */}

      <main className="details-content">

        <div className="details-card">


          {/* ==================================
              COMPONENT ICON
              ================================== */}

          <div className="details-image">
            🔵
          </div>


          {/* ==================================
              COMPONENT INFORMATION
              ================================== */}

          <div className="details-info">

            <h1>
              {component.name}
            </h1>


            <p>
              {component.description ||
                "No description available."}
            </p>


            {/* ==================================
                TINKERCAD
                ================================== */}

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


          {/* ==================================
              TUTORIALS
              ================================== */}

          <div className="tutorial-section">

            <h2>
              Tutorials
            </h2>


            {/* LOADING */}

            {tutorialsLoading && (

              <p>
                Loading tutorials...
              </p>

            )}


            {/* ERROR */}

            {!tutorialsLoading &&
              tutorialError && (

                <p className="error-message">
                  {tutorialError}
                </p>

            )}


            {/* NO TUTORIALS */}

            {!tutorialsLoading &&
              !tutorialError &&
              tutorials.length === 0 && (

                <p>
                  No tutorials available.
                </p>

            )}


            {/* TUTORIAL LIST */}

            {!tutorialsLoading &&
              !tutorialError &&
              tutorials.map(
                (tutorial) => (

                  <div
                    className="tutorial-card"
                    key={tutorial.id}
                  >

                    <div className="tutorial-card-content">

                      <h3>
                        {tutorial.title}
                      </h3>


                      <button
                        type="button"
                        onClick={() =>
                          openTutorial(
                            tutorial
                          )
                        }
                        className="watch-tutorial-button"
                      >
                        ▶ Watch Tutorial
                      </button>

                    </div>

                  </div>

                )
              )}

          </div>


          {/* ==================================
              COMPONENT QR CODE
              ================================== */}

          <div className="qr-box">

            <h3>
              Component QR Code
            </h3>


            {component.qr_code ? (

              <>

                <img
                  src={
                    component.qr_code
                  }
                  alt={
                    `QR Code for ${component.name}`
                  }
                  className="qr-image"
                />


                <button
                  type="button"
                  onClick={downloadQR}
                >
                  Download QR
                </button>

              </>

            ) : (

              <p>
                QR code not available.
              </p>

            )}

          </div>


        </div>

      </main>

    </div>

  );

}


export default ComponentDetails;