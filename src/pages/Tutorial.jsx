import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Tutorial.css";
import { apiRequest } from "../services/api";

function Tutorial() {

  const { id } = useParams();

  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  let user = null;

  try {
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error(
      "Invalid stored user data:",
      error
    );
  }


  // ==========================================
  // LOAD TUTORIAL
  // ==========================================

  useEffect(() => {

    const loadTutorial = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await apiRequest(
          `/tutorials/${id}`
        );

        setTutorial(
          data.tutorial
        );


        // ==========================================
        // RECORD TUTORIAL VIEW
        // ONLY FOR STUDENTS
        // ==========================================

        if (user?.role === "student") {

          try {

            await apiRequest(
              "/activity/tutorial",
              {
                method: "POST",
                body: JSON.stringify({
                  tutorial_id: Number(id)
                })
              }
            );

          } catch (activityError) {

            // Activity tracking should not
            // stop the tutorial page.

            console.error(
              "Failed to record tutorial view:",
              activityError
            );

          }

        }

      } catch (error) {

        console.error(
          "Failed to load tutorial:",
          error
        );

        setError(
          error.message ||
          "Failed to load tutorial."
        );

      } finally {

        setLoading(false);

      }

    };

    loadTutorial();

  }, [id]);


  // ==========================================
  // CREATE YOUTUBE EMBED URL
  // ==========================================

  const getYoutubeEmbedUrl = (url) => {

    if (!url) {
      return "";
    }

    try {

      const youtubeUrl =
        new URL(url);

      // Normal YouTube URL
      // https://www.youtube.com/watch?v=VIDEO_ID

      if (
        youtubeUrl.hostname === "youtube.com" ||
        youtubeUrl.hostname === "www.youtube.com"
      ) {

        const videoId =
          youtubeUrl.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }

        // Already an embed URL
        if (
          youtubeUrl.pathname.startsWith(
            "/embed/"
          )
        ) {
          return url;
        }

      }


      // Short YouTube URL
      // https://youtu.be/VIDEO_ID

      if (
        youtubeUrl.hostname === "youtu.be" ||
        youtubeUrl.hostname === "www.youtu.be"
      ) {

        const videoId =
          youtubeUrl.pathname.substring(1);

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }

      }

    } catch (error) {

      console.error(
        "Invalid YouTube URL:",
        error
      );

    }

    return "";
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="tutorial-page">

        <header className="simple-header">

          <Link
            to="/"
            className="brand"
          >
            ⚙ HardwareHub
          </Link>

        </header>

        <main className="tutorial-content">

          <div className="tutorial-card">

            <p>
              Loading tutorial...
            </p>

          </div>

        </main>

      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
      <div className="tutorial-page">

        <header className="simple-header">

          <Link
            to="/"
            className="brand"
          >
            ⚙ HardwareHub
          </Link>

        </header>

        <main className="tutorial-content">

          <div className="tutorial-card">

            <h1>
              Tutorial Not Found
            </h1>

            <p className="error-message">
              {error}
            </p>

            <Link
              to="/components"
              className="back-button"
            >
              Back to Components
            </Link>

          </div>

        </main>

      </div>
    );

  }


  // ==========================================
  // TUTORIAL NOT FOUND
  // ==========================================

  if (!tutorial) {

    return (
      <div className="tutorial-page">

        <header className="simple-header">

          <Link
            to="/"
            className="brand"
          >
            ⚙ HardwareHub
          </Link>

        </header>

        <main className="tutorial-content">

          <div className="tutorial-card">

            <h1>
              Tutorial Not Found
            </h1>

            <p>
              The requested tutorial could not be found.
            </p>

            <Link
              to="/components"
              className="back-button"
            >
              Back to Components
            </Link>

          </div>

        </main>

      </div>
    );

  }


  // ==========================================
  // YOUTUBE EMBED URL
  // ==========================================

  const embedUrl =
    getYoutubeEmbedUrl(
      tutorial.youtube_url
    );


  // ==========================================
  // TUTORIAL PAGE
  // ==========================================

  return (
    <div className="tutorial-page">

      <header className="simple-header">

        <Link
          to="/"
          className="brand"
        >
          ⚙ HardwareHub
        </Link>

        <Link to="/components">
          Components
        </Link>

      </header>


      <main className="tutorial-content">

        <div className="tutorial-card">

          <h1>
            {tutorial.title}
          </h1>

          <p>
            Your tutorial is ready. Follow the video to learn more about this hardware component.
          </p>


          {/* ==========================================
              YOUTUBE VIDEO
              ========================================== */}

          {embedUrl ? (

            <div className="video-container">

              <iframe
                width="100%"
                height="315"
                src={embedUrl}
                title={tutorial.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

            </div>

          ) : (

            <p className="error-message">
              Invalid YouTube tutorial link.
            </p>

          )}


          {/* ==========================================
              BUTTONS
              ========================================== */}

          <div className="tutorial-buttons">

            <a
              href={tutorial.youtube_url}
              target="_blank"
              rel="noreferrer"
              className="watch-button"
            >
              Watch on YouTube
            </a>

            <Link
              to="/components"
              className="back-button"
            >
              Back to Components
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Tutorial;