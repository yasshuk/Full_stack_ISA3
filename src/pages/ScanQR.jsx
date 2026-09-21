import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./ScanQR.css";
import { apiRequest } from "../services/api";
import Footer from "../components/Footer";

function ScanQR() {

  const navigate = useNavigate();

  const [error, setError] = useState("");

  const isProcessing = useRef(false);


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
  // QR SCANNER
  // ==========================================

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250
      },
      false
    );


    // ==========================================
    // SUCCESSFUL QR SCAN
    // ==========================================

    const handleScanSuccess = async (
      decodedText
    ) => {

      console.log(
        "QR Code scanned:",
        decodedText
      );


      // Prevent duplicate scan events
      if (isProcessing.current) {
        return;
      }

      isProcessing.current = true;

      setError("");


      // ==========================================
      // CHECK QR CONTENT
      // ==========================================

      try {

        const scannedUrl =
          new URL(decodedText);

        const pathParts =
          scannedUrl.pathname
            .split("/")
            .filter(Boolean);


        // ==========================================
        // TUTORIAL QR
        // ==========================================

        /*
          Expected tutorial QR:

          http://localhost:5173/tutorial/1

          pathParts:

          ["tutorial", "1"]
        */

        if (
          pathParts.length === 2 &&
          pathParts[0] === "tutorial"
        ) {

          const tutorialId =
            Number(pathParts[1]);


          if (
            !tutorialId ||
            !Number.isInteger(tutorialId) ||
            tutorialId <= 0
          ) {

            throw new Error(
              "Invalid tutorial QR code."
            );

          }


          // ========================================
          // RECORD TUTORIAL QR SCAN
          // ONLY FOR STUDENTS
          // ========================================

          if (user?.role === "student") {

            try {

              const data =
                await apiRequest(
                  "/activity/scan",
                  {
                    method: "POST",

                    body: JSON.stringify({
                      tutorial_id:
                        tutorialId
                    })
                  }
                );

              console.log(
                "Tutorial scan recorded successfully:",
                data
              );

            } catch (activityError) {

              /*
                Activity tracking should not
                prevent the student from
                opening the tutorial.
              */

              console.error(
                "Failed to record QR scan:",
                activityError
              );

            }

          }


          // ========================================
          // OPEN TUTORIAL PAGE
          // ========================================

          navigate(
            `/tutorial/${tutorialId}`
          );

          return;
        }


        // ==========================================
        // COMPONENT QR
        // ==========================================

        /*
          Expected component QR:

          http://localhost:5173/component-details?id=1

          OR:

          http://localhost:5173/component-details/1
        */

        if (
          pathParts.length === 1 &&
          pathParts[0] === "component-details"
        ) {

          const componentId =
            scannedUrl.searchParams.get(
              "id"
            );


          if (
            !componentId ||
            !Number.isInteger(
              Number(componentId)
            ) ||
            Number(componentId) <= 0
          ) {

            throw new Error(
              "Invalid component QR code."
            );

          }


          // ========================================
          // OPEN COMPONENT PAGE
          // ========================================

          navigate(
            `/component-details?id=${componentId}`
          );

          return;
        }


        // ==========================================
        // COMPONENT QR - PATH VERSION
        // ==========================================

        if (
          pathParts.length === 2 &&
          pathParts[0] === "component-details"
        ) {

          const componentId =
            Number(pathParts[1]);


          if (
            !componentId ||
            !Number.isInteger(componentId) ||
            componentId <= 0
          ) {

            throw new Error(
              "Invalid component QR code."
            );

          }


          navigate(
            `/component-details?id=${componentId}`
          );

          return;
        }


        // ==========================================
        // INVALID QR
        // ==========================================

        throw new Error(
          "Invalid QR code. Please scan a HardwareHub component or tutorial QR code."
        );


      } catch (error) {

        console.error(
          "QR processing error:",
          error
        );


        setError(
          error.message ||
          "Unable to process QR code."
        );


        isProcessing.current = false;

      }

    };


    // ==========================================
    // SCANNER ERROR
    // ==========================================

    const handleScanError = () => {

      // Normal scanning errors are ignored.

    };


    // ==========================================
    // START SCANNER
    // ==========================================

    scanner.render(
      handleScanSuccess,
      handleScanError
    );


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      scanner
        .clear()
        .catch(() => {});

    };

  }, [navigate, user?.role]);


  // ==========================================
  // PAGE UI
  // ==========================================

  return (

    <div className="scan-page">


      {/* ==========================================
          HEADER
          ========================================== */}

      <header className="simple-header">

        <Link
          to="/student/dashboard"
          className="brand"
        >
          ⚙ HardwareHub
        </Link>


        <Link to="/components">
          Components
        </Link>

      </header>


      {/* ==========================================
          MAIN CONTENT
          ========================================== */}

      <main className="scan-content">

        <div className="scan-card">


          <h1>
            Scan QR Code
          </h1>


          <p>
            Point your camera at the QR code on the hardware kit.
          </p>


          {/* ==========================================
              QR SCANNER
              ========================================== */}

          <div id="qr-reader"></div>


          {/* ==========================================
              ERROR
              ========================================== */}

          {error && (

            <p className="error-message">
              {error}
            </p>

          )}


          <p className="scan-note">
            Allow camera access when your browser asks.
          </p>


          {/* ==========================================
              BACK BUTTON
              ========================================== */}

          <Link
            to="/components"
            className="back-button"
          >
            Back to Components
          </Link>

  <Footer />

        </div>

      </main>

    </div>

  );
}

export default ScanQR;