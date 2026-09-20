import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Splash.css";

function Splash() {

  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {
      navigate("/home");
    }, 2500);

    return () => {
      clearTimeout(timer);
    };

  }, [navigate]);


  return (
    <div className="splash-page">

      <div className="splash-content">

        <div className="splash-icon">
          ⚙
        </div>

        <h1>
          HardwareHub
        </h1>

        <p>
          Learn Hardware Step by Step
        </p>

        <div className="splash-loader">
          <span></span>
        </div>

        <small>
          Getting things ready...
        </small>

      </div>

    </div>
  );
}

export default Splash;