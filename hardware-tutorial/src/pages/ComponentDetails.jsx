import { Link } from "react-router-dom";
import "./ComponentDetails.css";

function ComponentDetails() {
  return (
    <div className="details-page">

      <header className="simple-header">

        <Link to="/components" className="brand">
          ← HardwareHub
        </Link>

      </header>

      <main className="details-content">

        <div className="details-card">

          <div className="details-image">
            🔵
          </div>

          <div className="details-info">

            <h1>Arduino Uno</h1>

            <p>
              Microcontroller board used to build
              and control electronic projects.
            </p>

            <button
              onClick={() =>
                window.open(
                  "https://www.youtube.com",
                  "_blank"
                )
              }
            >
              ▶ Watch Tutorial
            </button>

          </div>

          <div className="qr-box">

            <h3>QR Code</h3>

            <div className="fake-qr">
              ▦
            </div>

            <button>
              Download QR
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ComponentDetails;