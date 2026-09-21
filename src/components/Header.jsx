import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="main-header">

      <div className="header-container">

        <Link to="/" className="header-logo">
          ⚙ HardwareHub
        </Link>

        <nav className="header-nav">

          <Link to="/">Home</Link>

          <Link to="/components">Components</Link>

          <Link to="/login">Login</Link>

          <Link to="/register">Register</Link>

        </nav>

      </div>

    </header>
  );
}

export default Header;