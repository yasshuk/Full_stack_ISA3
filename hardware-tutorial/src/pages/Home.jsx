import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      <nav className="navbar">
        <div className="logo">
          <span>⚙</span> HardwareHub
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      <section className="hero">

        <div className="hero-content">
          <h1>Learn Hardware<br />Step by Step</h1>

          <p>
            Scan the QR code or click to watch
            tutorial videos for each component.
          </p>

          <Link to="/login" className="primary-btn">
            Get Started
          </Link>
        </div>

        <div className="hero-image">
          <div className="circle">
            <div className="hardware">🔵</div>
            <div className="qr">▦</div>
          </div>
        </div>

      </section>

    </div>
  );
}

export default Home;