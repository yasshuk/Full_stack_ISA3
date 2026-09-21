import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { apiRequest } from "../services/api";

function Login() {

  const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);


    try {

      const data = await apiRequest(
        "/auth/login",
        {
          method: "POST",

          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );


      console.log(
        "Login response:",
        data
      );


      /*
        Clear any previous login information.

        This prevents an old token from another
        login from remaining in the browser.
      */

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");


      /*
        Remember Me checked:
        Store login in localStorage.

        Remember Me unchecked:
        Store login in sessionStorage.
      */

      if (rememberMe) {

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

      } else {

        sessionStorage.setItem(
          "token",
          data.token
        );

        sessionStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

      }


      /*
        Redirect according to user role.
      */

      if (data.user.role === "admin") {

        navigate("/admin/dashboard");

      } else {

        navigate("/student/dashboard");

      }


    } catch (error) {

      console.error(
        "Login error:",
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
          Login
        </h1>


        <p className="auth-subtitle">
          Login to your account
        </p>


        <form onSubmit={handleLogin}>


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


          <label>
            Password
          </label>


          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />


          <div className="login-options">

            <label className="remember">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked
                  )
                }
              />

              Remember me

            </label>


            <Link to="/forgot-password">
              Forgot password?
            </Link>

          </div>


          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>


        </form>


        <p className="bottom-text">

          Don't have an account?

          <Link to="/register">
            {" "}Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;