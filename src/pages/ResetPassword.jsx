import { useState } from "react";
import {
  Link,
  useSearchParams,
  useNavigate
} from "react-router-dom";

import "./Auth.css";
import { apiRequest } from "../services/api";

function ResetPassword() {

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();


  const token =
    searchParams.get("token");


  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleResetPassword = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (!token) {

      setError(
        "Invalid or missing reset token"
      );

      return;

    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match"
      );

      return;

    }


    setLoading(true);


    try {

      const data = await apiRequest(
        "/auth/reset-password",
        {
          method: "POST",

          body: JSON.stringify({
            token: token,
            password: password
          })
        }
      );


      setSuccess(data.message);


      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (error) {

      console.error(
        "Reset password error:",
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
          Reset Password
        </h1>


        <p className="auth-subtitle">
          Create a new password for your account
        </p>


        <form onSubmit={handleResetPassword}>


          <label>
            New Password
          </label>


          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            required
          />


          <label>
            Confirm Password
          </label>


          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
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

            {loading
              ? "Resetting..."
              : "Reset Password"}

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

export default ResetPassword;