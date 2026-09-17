import { Link } from "react-router-dom";
import "./Auth.css";

function ForgotPassword() {
  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">⚙</div>

        <h1>Forgot Password?</h1>

        <p className="auth-subtitle">
          Enter your username to reset your password
        </p>

        <form>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter your username"
          />

          <button type="submit" className="auth-button">
            Send Reset Link
          </button>

        </form>

        <p className="bottom-text">
          Remember your password?
          <Link to="/login"> Login</Link>
        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;