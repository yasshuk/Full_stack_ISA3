import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./ScanQR.css";

function ScanQR() {

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250
      },
      false
    );

    scanner.render(
      (decodedText) => {
        window.location.href = decodedText;
      },
      () => {
        // Ignore scanning errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };

  }, []);

  return (
    <div className="scan-page">

      <header className="simple-header">

        <Link to="/student/dashboard" className="brand">
          ⚙ HardwareHub
        </Link>

        <Link to="/components">
          Components
        </Link>

      </header>

      <main className="scan-content">

        <div className="scan-card">

          <h1>Scan QR Code</h1>

          <p>
            Point your camera at the QR code on the hardware kit.
          </p>

          <div id="qr-reader"></div>

          <p className="scan-note">
            Allow camera access when your browser asks.
          </p>

          <Link to="/components" className="back-button">
            Back to Components
          </Link>

        </div>

      </main>

    </div>
  );
}

export default ScanQR;