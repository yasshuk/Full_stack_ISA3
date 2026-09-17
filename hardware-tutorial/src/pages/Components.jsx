import { Link } from "react-router-dom";
import "./Components.css";

function Components() {
  const components = [
    {
      name: "Arduino Uno",
      description: "Microcontroller board"
    },
    {
      name: "Ultrasonic Sensor",
      description: "Distance measurement"
    },
    {
      name: "DHT11 Sensor",
      description: "Temperature & humidity"
    },
    {
      name: "Servo Motor",
      description: "Rotational movement"
    }
  ];

  return (
    <div className="components-page">

      <header className="simple-header">

        <Link to="/" className="brand">
          ⚙ HardwareHub
        </Link>

        <Link to="/login" className="header-login">
          Logout
        </Link>

      </header>

      <main className="components-content">

        <div className="page-title">
          <div>
            <h1>Components</h1>
            <p>Browse hardware components and tutorials.</p>
          </div>

          <Link
            to="/add-component"
            className="add-button"
          >
            + Add Component
          </Link>
        </div>

        <div className="components-grid">

          {components.map((component, index) => (
            <div className="component-card" key={index}>

              <div className="component-picture">
                🔵
              </div>

              <h3>{component.name}</h3>

              <p>{component.description}</p>

              <Link to="/component-details">
                View Tutorial
              </Link>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}

export default Components;