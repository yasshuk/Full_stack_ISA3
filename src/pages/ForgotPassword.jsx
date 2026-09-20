import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { apiRequest } from "../services/api";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resetLink, setResetLink] = useState("");

  const [loading, setLoading] = useState(false);


  const handleForgotPassword = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");
    setResetLink("");

    setLoading(true);


    try {

      const data = await apiRequest(
        "/auth/forgot-password",
        {
          method: "POST",

          body: JSON.stringify({
            email: email
          })
        }
      );


      setSuccess(data.message);

      setResetLink(data.resetLink);


    } catch (error) {

      console.error(
        "Forgot password error:",
        error
      );

      setError(error.message);

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          ⚙
        </div>


        <h1>
          Forgot Password?
        </h1>


        <p className="auth-subtitle">
          Enter your email to reset your password
        </p>


        <form onSubmit={handleForgotPassword}>

          <label>
            Email
          </label>


          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
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


          {resetLink && (

            <p className="success-message">

              Reset link generated.

              <br />

              <a href={resetLink}>
                Open Reset Password
              </a>

            </p>

          )}


          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Generating..."
              : "Send Reset Link"}

          </button>

        </form>


        <p className="bottom-text">

          Remember your password?

          <Link to="/login">
            {" "}Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;