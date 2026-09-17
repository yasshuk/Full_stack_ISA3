import { Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">⚙</div>

        <h1>Login</h1>

        <p className="auth-subtitle">
          Login to your account
        </p>

        <form>

          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
          />

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <Link to="/forgot-password">
  Forgot password?
</Link>
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>

        </form>

        <p className="bottom-text">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

      </div>

    </div>
  );
}

export default Login;