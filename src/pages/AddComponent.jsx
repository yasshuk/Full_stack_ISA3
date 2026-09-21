import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddComponent.css";
import { apiRequest } from "../services/api";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function AddComponent() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tinkercad_url, setTinkercadUrl] = useState("");

  const [tutorials, setTutorials] = useState([
    {
      title: "",
      youtube_url: ""
    }
  ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // VALIDATE YOUTUBE URL
  // ==========================================

  const isValidYoutubeUrl = (url) => {
    try {
      const parsedUrl = new URL(url.trim());

      const allowedHosts = [
        "youtube.com",
        "www.youtube.com",
        "youtu.be",
        "www.youtu.be"
      ];

      return allowedHosts.includes(
        parsedUrl.hostname.toLowerCase()
      );
    } catch (error) {
      return false;
    }
  };

  // ==========================================
  // VALIDATE TINKERCAD URL
  // ==========================================

  const isValidTinkercadUrl = (url) => {
    try {
      const parsedUrl = new URL(url.trim());

      return parsedUrl.hostname
        .toLowerCase()
        .includes("tinkercad.com");
    } catch (error) {
      return false;
    }
  };

  // ==========================================
  // HANDLE TUTORIAL CHANGE
  // ==========================================

  const handleTutorialChange = (index, field, value) => {
    setTutorials((currentTutorials) => {
      const updatedTutorials = [...currentTutorials];

      updatedTutorials[index] = {
        ...updatedTutorials[index],
        [field]: value
      };

      return updatedTutorials;
    });
  };

  // ==========================================
  // ADD TUTORIAL
  // ==========================================

  const addTutorial = () => {
    setTutorials((currentTutorials) => [
      ...currentTutorials,
      {
        title: "",
        youtube_url: ""
      }
    ]);
  };

  // ==========================================
  // REMOVE TUTORIAL
  // ==========================================

  const removeTutorial = (index) => {
    setTutorials((currentTutorials) => {
      if (currentTutorials.length === 1) {
        return currentTutorials;
      }

      return currentTutorials.filter(
        (_, tutorialIndex) => tutorialIndex !== index
      );
    });
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {
    const trimmedName = name.trim();
    const trimmedTinkercadUrl = tinkercad_url.trim();

    if (!trimmedName) {
      return "Component name is required.";
    }

    if (trimmedName.length < 2) {
      return "Component name must contain at least 2 characters.";
    }

    if (!trimmedTinkercadUrl) {
      return "Tinkercad simulation link is required.";
    }

    if (!isValidTinkercadUrl(trimmedTinkercadUrl)) {
      return "Please provide a valid Tinkercad URL.";
    }

    if (tutorials.length === 0) {
      return "At least one tutorial is required.";
    }

    for (let i = 0; i < tutorials.length; i++) {
      const tutorial = tutorials[i];

      const tutorialTitle = tutorial.title.trim();
      const youtubeUrl = tutorial.youtube_url.trim();

      if (!tutorialTitle) {
        return `Tutorial ${i + 1} title is required.`;
      }

      if (tutorialTitle.length < 2) {
        return `Tutorial ${i + 1} title must contain at least 2 characters.`;
      }

      if (!youtubeUrl) {
        return `YouTube link for Tutorial ${i + 1} is required.`;
      }

      if (!isValidYoutubeUrl(youtubeUrl)) {
        return `Please provide a valid YouTube URL for Tutorial ${i + 1}.`;
      }
    }

    return "";
  };

  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const cleanName = name.trim();
      const cleanDescription = description.trim();
      const cleanTinkercadUrl = tinkercad_url.trim();

      const cleanTutorials = tutorials.map((tutorial) => ({
        title: tutorial.title.trim(),
        youtube_url: tutorial.youtube_url.trim()
      }));

      // DO NOT CHANGE THIS API CALL

      await apiRequest(
        "/components/with-tutorials",
        {
          method: "POST",

          body: JSON.stringify({
            name: cleanName,
            description: cleanDescription,
            tinkercad_url: cleanTinkercadUrl,
            tutorials: cleanTutorials
          })
        }
      );

      navigate("/admin/dashboard");

    } catch (error) {
      console.error(
        "Failed to create component:",
        error
      );

      setError(
        error.message ||
        "Failed to create component. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="add-page">

      {/* SIDEBAR */}

      <Sidebar role="Admin" />

      {/* MAIN AREA */}

      <div className="add-main">

        {/* HEADER */}

        <header className="add-header">

          <div>
            <h2>Add Component</h2>
            <span>
              Add a new hardware component to HardwareHub
            </span>
          </div>

          <Link
            to="/admin/dashboard"
            className="back-dashboard"
          >
            ← Dashboard
          </Link>

        </header>

        {/* CONTENT */}

        <main className="add-content">

          <div className="add-form-card">

            <div className="form-title">

              <div className="form-icon">
                🔧
              </div>

              <div>
                <h1>Add Component</h1>

                <p>
                  Add a hardware component, simulation and its tutorials.
                </p>
              </div>

            </div>

            <form onSubmit={handleSubmit}>

              {/* COMPONENT NAME */}

              <div className="form-group">

                <label>
                  Component Name
                </label>

                <input
                  type="text"
                  placeholder="Enter component name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  disabled={loading}
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  placeholder="Enter component description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  disabled={loading}
                />

              </div>

              {/* TINKERCAD */}

              <div className="form-group">

                <label>
                  Tinkercad Simulation
                </label>

                <input
                  type="url"
                  placeholder="Paste Tinkercad simulation link"
                  value={tinkercad_url}
                  onChange={(event) =>
                    setTinkercadUrl(event.target.value)
                  }
                  disabled={loading}
                  required
                />

                <small className="input-help">
                  Add the shared Tinkercad circuit link for this component.
                </small>

              </div>

              {/* TUTORIALS */}

              <div className="tutorial-section">

                <div className="section-title">
                  <h3>Tutorials</h3>

                  <span>
                    Add one or more YouTube tutorials
                  </span>
                </div>

                {tutorials.map((tutorial, index) => (

                  <div
                    className="tutorial-item"
                    key={index}
                  >

                    <div className="tutorial-heading">

                      <label>
                        Tutorial {index + 1}
                      </label>

                      {tutorials.length > 1 && (

                        <button
                          type="button"
                          className="remove-button"
                          onClick={() =>
                            removeTutorial(index)
                          }
                          disabled={loading}
                        >
                          Remove
                        </button>

                      )}

                    </div>

                    <input
                      type="text"
                      placeholder="Enter tutorial title"
                      value={tutorial.title}
                      onChange={(event) =>
                        handleTutorialChange(
                          index,
                          "title",
                          event.target.value
                        )
                      }
                      disabled={loading}
                      required
                    />

                    <input
                      type="url"
                      placeholder="Paste YouTube tutorial link"
                      value={tutorial.youtube_url}
                      onChange={(event) =>
                        handleTutorialChange(
                          index,
                          "youtube_url",
                          event.target.value
                        )
                      }
                      disabled={loading}
                      required
                    />

                  </div>

                ))}

                <button
                  type="button"
                  className="add-tutorial-button"
                  onClick={addTutorial}
                  disabled={loading}
                >
                  + Add Another Tutorial
                </button>

              </div>

              {/* ERROR */}

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}

              {/* BUTTONS */}

              <div className="form-buttons">

                <Link
                  to="/admin/dashboard"
                  className="cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : "Save Component"}
                </button>

              </div>

            </form>

          </div>

        </main>

        {/* FOOTER */}

        <Footer />

      </div>

    </div>
  );
}

export default AddComponent;