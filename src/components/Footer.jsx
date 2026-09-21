import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="main-footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h3>⚙ HardwareHub</h3>

          <p>
            Learn hardware components through simple
            tutorials and QR codes.
          </p>
        </div>

        <div className="footer-links">

          <h4>Quick Links</h4>

          <Link to="/">Home</Link>
          <Link to="/components">Components</Link>
          <Link to="/login">Login</Link>

        </div>

        <div className="footer-links">

          <h4>Information</h4>

          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

        </div>

      </div>

      <div className="footer-bottom">
        © 2026 HardwareHub. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;