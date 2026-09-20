import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { apiRequest } from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    // Check password confirmation
    if (password !== confirmPassword) {

      setError("Passwords do not match");

      return;
    }


    setLoading(true);


    try {

      const data = await apiRequest("/auth/register", {

        method: "POST",

        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })

      });


      setSuccess(data.message);


      // Go to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1000);


    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card register-card">

        <div className="auth-icon">⚙</div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Create your HardwareHub account
        </p>


        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />


          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />


          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />


          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            required
          />


          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {success && (
            <p className="success-message">
              {success}
            </p>
          )}


          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>


        <p className="bottom-text">

          Already have an account?

          <Link to="/login">
            {" "}Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;