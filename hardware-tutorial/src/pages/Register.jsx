import { Link } from "react-router-dom";
import "./Auth.css";

function Register() {
  return (
    <div className="auth-page">

      <div className="auth-card register-card">

        <div className="auth-icon">⚙</div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Create your HardwareHub account
        </p>

        <form>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
          />

          <label>Username</label>
          <input
            type="text"
            placeholder="Choose a username"
          />

          <label>Contact Number</label>
          <input
            type="text"
            placeholder="Enter contact number"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
          />

          <label>Role</label>

          <select>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="auth-button">
            Register
          </button>

        </form>

        <p className="bottom-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;