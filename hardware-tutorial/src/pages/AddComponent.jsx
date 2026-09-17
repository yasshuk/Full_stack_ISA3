import { Link } from "react-router-dom";
import "./AddComponent.css";

function AddComponent() {
  return (
    <div className="add-page">

      <header className="simple-header">

        <Link to="/admin/dashboard" className="brand">
          ⚙ HardwareHub
        </Link>

        <span>Admin</span>

      </header>

      <main className="add-content">

        <div className="form-card">

          <h1>Add Component</h1>

          <p>
            Add a hardware component and its tutorial.
          </p>

          <form>

            <label>Component Name</label>

            <input
              type="text"
              placeholder="Enter component name"
            />

            <label>Description</label>

            <textarea
              placeholder="Enter component description"
            ></textarea>

            <label>YouTube Link</label>

            <input
              type="text"
              placeholder="Paste YouTube tutorial link"
            />

            <div className="form-buttons">

              <Link
                to="/admin/dashboard"
                className="cancel-button"
              >
                Cancel
              </Link>

              <button type="submit">
                Save Component
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default AddComponent;