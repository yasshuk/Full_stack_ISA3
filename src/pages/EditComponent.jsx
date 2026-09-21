import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams
} from "react-router-dom";

import "./AddComponent.css";
import { apiRequest } from "../services/api";


function EditComponent() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const componentId =
    searchParams.get("id");


  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [tinkercad_url, setTinkercadUrl] =
    useState("");


  const [tutorials, setTutorials] =
    useState([]);


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // VALIDATE YOUTUBE URL
  // ==========================================

  const isValidYoutubeUrl = (url) => {

    try {

      const parsedUrl =
        new URL(url.trim());

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

      const parsedUrl =
        new URL(url.trim());

      return parsedUrl.hostname
        .toLowerCase()
        .includes("tinkercad.com");

    } catch (error) {

      return false;

    }

  };


  // ==========================================
  // LOAD COMPONENT + TUTORIALS
  // ==========================================

  useEffect(() => {

    const loadComponent = async () => {

      if (!componentId) {

        setError(
          "Component ID is missing."
        );

        setLoading(false);

        return;

      }


      try {

        setLoading(true);
        setError("");


        // --------------------------------------
        // LOAD COMPONENT
        // --------------------------------------

        const componentData =
          await apiRequest(
            `/components/${componentId}`
          );


        if (!componentData.component) {

          throw new Error(
            "Component data was not returned."
          );

        }


        const component =
          componentData.component;


        setName(
          component.name || ""
        );


        setDescription(
          component.description || ""
        );


        setTinkercadUrl(
          component.tinkercad_url || ""
        );


        // --------------------------------------
        // LOAD TUTORIALS
        // --------------------------------------

        const tutorialData =
          await apiRequest(
            `/tutorials/component/${componentId}`
          );


        const loadedTutorials =
          (tutorialData.tutorials || [])
            .map((tutorial) => ({
              ...tutorial,
              isNew: false,
              isDeleted: false
            }));


        setTutorials(
          loadedTutorials
        );

      } catch (error) {

        console.error(
          "Failed to load component:",
          error
        );

        setError(
          error.message ||
          "Failed to load component."
        );

      } finally {

        setLoading(false);

      }

    };


    loadComponent();

  }, [componentId]);


  // ==========================================
  // CHANGE TUTORIAL FIELD
  // ==========================================

  const handleTutorialChange = (
    index,
    field,
    value
  ) => {

    setTutorials(
      (currentTutorials) => {

        const updatedTutorials =
          [...currentTutorials];


        updatedTutorials[index] = {
          ...updatedTutorials[index],
          [field]: value
        };


        return updatedTutorials;

      }
    );

  };


  // ==========================================
  // ADD NEW TUTORIAL
  // ==========================================

  const addTutorial = () => {

    setError("");


    setTutorials(
      (currentTutorials) => [

        ...currentTutorials,

        {
          id: null,
          component_id:
            Number(componentId),
          title: "",
          youtube_url: "",
          qr_code: null,
          isNew: true,
          isDeleted: false
        }

      ]
    );

  };


  // ==========================================
  // REMOVE TUTORIAL
  // ==========================================

  const removeTutorial = (index) => {

    setError("");


    const visibleTutorials =
      tutorials.filter(
        (tutorial) =>
          !tutorial.isDeleted
      );


    // ----------------------------------------
    // DO NOT REMOVE LAST TUTORIAL
    // ----------------------------------------

    if (visibleTutorials.length <= 1) {

      setError(
        "At least one tutorial is required."
      );

      return;

    }


    setTutorials(
      (currentTutorials) => {

        const tutorial =
          currentTutorials[index];


        // --------------------------------------
        // NEW TUTORIAL
        // --------------------------------------

        if (!tutorial.id) {

          return currentTutorials.filter(
            (_, tutorialIndex) =>
              tutorialIndex !== index
          );

        }


        // --------------------------------------
        // EXISTING TUTORIAL
        // --------------------------------------

        return currentTutorials.map(
          (item, tutorialIndex) => {

            if (
              tutorialIndex !== index
            ) {

              return item;

            }


            return {
              ...item,
              isDeleted: true
            };

          }
        );

      }
    );

  };


  // ==========================================
  // DOWNLOAD QR
  // ==========================================

  const downloadQR = (
    qrCode,
    tutorialTitle
  ) => {

    if (!qrCode) {
      return;
    }


    const link =
      document.createElement("a");


    link.href =
      qrCode;


    link.download =
      `${tutorialTitle || "tutorial"}-qr.png`;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };


  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {

    if (!componentId) {

      return (
        "Component ID is missing."
      );

    }


    // ----------------------------------------
    // COMPONENT NAME
    // ----------------------------------------

    const cleanName =
      name.trim();


    if (!cleanName) {

      return (
        "Component name is required."
      );

    }


    if (cleanName.length < 2) {

      return (
        "Component name must contain at least 2 characters."
      );

    }


    // ----------------------------------------
    // TINKERCAD
    // ----------------------------------------

    const cleanTinkercadUrl =
      tinkercad_url.trim();


    if (!cleanTinkercadUrl) {

      return (
        "Tinkercad simulation link is required."
      );

    }


    if (
      !isValidTinkercadUrl(
        cleanTinkercadUrl
      )
    ) {

      return (
        "Please provide a valid Tinkercad URL."
      );

    }


    // ----------------------------------------
    // VISIBLE TUTORIALS
    // ----------------------------------------

    const visibleTutorials =
      tutorials.filter(
        (tutorial) =>
          !tutorial.isDeleted
      );


    if (
      visibleTutorials.length === 0
    ) {

      return (
        "At least one tutorial is required."
      );

    }


    // ----------------------------------------
    // VALIDATE TUTORIALS
    // ----------------------------------------

    for (
      let i = 0;
      i < visibleTutorials.length;
      i++
    ) {

      const tutorial =
        visibleTutorials[i];


      const tutorialTitle =
        (tutorial.title || "").trim();


      const youtubeUrl =
        (tutorial.youtube_url || "").trim();


      if (!tutorialTitle) {

        return (
          `Tutorial ${i + 1} title is required.`
        );

      }


      if (tutorialTitle.length < 2) {

        return (
          `Tutorial ${i + 1} title must contain at least 2 characters.`
        );

      }


      if (!youtubeUrl) {

        return (
          `YouTube link for Tutorial ${i + 1} is required.`
        );

      }


      if (
        !isValidYoutubeUrl(
          youtubeUrl
        )
      ) {

        return (
          `Please provide a valid YouTube URL for Tutorial ${i + 1}.`
        );

      }

    }


    return "";

  };


  // ==========================================
  // UPDATE COMPONENT + TUTORIALS
  // ==========================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      if (saving) {
        return;
      }


      setError("");


      // ----------------------------------------
      // VALIDATE EVERYTHING FIRST
      // ----------------------------------------

      const validationError =
        validateForm();


      if (validationError) {

        setError(
          validationError
        );

        return;

      }


      setSaving(true);


      try {

        const cleanName =
          name.trim();


        const cleanDescription =
          description.trim();


        const cleanTinkercadUrl =
          tinkercad_url.trim();


        // ======================================
        // ONE REQUEST FOR EVERYTHING
        // ======================================

        await apiRequest(
          `/components/${componentId}/with-tutorials`,
          {
            method: "PUT",

            body: JSON.stringify({

              name:
                cleanName,

              description:
                cleanDescription,

              tinkercad_url:
                cleanTinkercadUrl,

              tutorials:
                tutorials.map(
                  (tutorial) => ({

                    id:
                      tutorial.id ||
                      null,

                    title:
                      (tutorial.title || "")
                        .trim(),

                    youtube_url:
                      (tutorial.youtube_url || "")
                        .trim(),

                    isDeleted:
                      tutorial.isDeleted ||
                      false

                  })
                )

            })

          }
        );


        // ======================================
        // SUCCESS
        // ======================================

        navigate(
          "/admin/dashboard"
        );

      } catch (error) {

        console.error(
          "Failed to update component:",
          error
        );


        setError(
          error.message ||
          "Failed to update component. Please try again."
        );

      } finally {

        setSaving(false);

      }

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="add-page">

        <header className="simple-header">

          <Link
            to="/admin/dashboard"
            className="brand"
          >
            ⚙ HardwareHub
          </Link>

          <span>
            Admin
          </span>

        </header>


        <main className="add-content">

          <div className="form-card">

            <p>
              Loading component...
            </p>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // ERROR WHILE LOADING
  // ==========================================

  if (
    error &&
    !name &&
    !loading
  ) {

    return (

      <div className="add-page">

        <header className="simple-header">

          <Link
            to="/admin/dashboard"
            className="brand"
          >
            ⚙ HardwareHub
          </Link>

          <span>
            Admin
          </span>

        </header>


        <main className="add-content">

          <div className="form-card">

            <p className="error-message">
              {error}
            </p>


            <Link
              to="/admin/dashboard"
              className="cancel-button"
            >
              Back to Dashboard
            </Link>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="add-page">

      <header className="simple-header">

        <Link
          to="/admin/dashboard"
          className="brand"
        >
          ⚙ HardwareHub
        </Link>

        <span>
          Admin
        </span>

      </header>


      <main className="add-content">

        <div className="form-card">

          <h1>
            Edit Component
          </h1>


          <p>
            Update the hardware component, simulation and its tutorials.
          </p>


          <form
            onSubmit={handleSubmit}
          >

            {/* ==================================
                COMPONENT NAME
                ================================== */}

            <label>
              Component Name
            </label>

            <input
              type="text"
              placeholder="Enter component name"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              disabled={saving}
              required
            />


            {/* ==================================
                DESCRIPTION
                ================================== */}

            <label>
              Description
            </label>

            <textarea
              placeholder="Enter component description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              disabled={saving}
            />


            {/* ==================================
                TINKERCAD
                ================================== */}

            <label>
              Tinkercad Simulation
            </label>

            <input
              type="url"
              placeholder="Paste Tinkercad simulation link"
              value={tinkercad_url}
              onChange={(event) =>
                setTinkercadUrl(
                  event.target.value
                )
              }
              disabled={saving}
              required
            />


            {/* ==================================
                TUTORIALS
                ================================== */}

            <div className="tutorial-list">

              {tutorials.filter(
                (tutorial) =>
                  !tutorial.isDeleted
              ).length === 0 && (

                <p>
                  No tutorials added yet.
                </p>

              )}


              {tutorials.map(
                (tutorial, index) => {

                  if (tutorial.isDeleted) {
                    return null;
                  }


                  const tutorialNumber =
                    tutorials
                      .filter(
                        (item) =>
                          !item.isDeleted
                      )
                      .indexOf(
                        tutorial
                      ) + 1;


                  return (

                    <div
                      className="tutorial-item"
                      key={
                        tutorial.id ||
                        `new-${index}`
                      }
                    >

                      <div className="tutorial-heading">

                        <label>
                          Tutorial {
                            tutorialNumber
                          }
                        </label>


                        <button
                          type="button"
                          className="remove-button"
                          onClick={() =>
                            removeTutorial(
                              index
                            )
                          }
                          disabled={saving}
                        >
                          Remove
                        </button>

                      </div>


                      {/* TITLE */}

                      <input
                        type="text"
                        placeholder="Enter tutorial title"
                        value={
                          tutorial.title || ""
                        }
                        onChange={(event) =>
                          handleTutorialChange(
                            index,
                            "title",
                            event.target.value
                          )
                        }
                        disabled={saving}
                        required
                      />


                      {/* YOUTUBE */}

                      <input
                        type="url"
                        placeholder="Paste YouTube tutorial link"
                        value={
                          tutorial.youtube_url ||
                          ""
                        }
                        onChange={(event) =>
                          handleTutorialChange(
                            index,
                            "youtube_url",
                            event.target.value
                          )
                        }
                        disabled={saving}
                        required
                      />


                      {/* QR CODE */}

                      {tutorial.qr_code && (

                        <div className="tutorial-qr">

                          <label>
                            Tutorial QR Code
                          </label>


                          <img
                            src={
                              tutorial.qr_code
                            }
                            alt={
                              `${tutorial.title} QR Code`
                            }
                            className="qr-image"
                          />


                          <button
                            type="button"
                            className="download-qr-button"
                            onClick={() =>
                              downloadQR(
                                tutorial.qr_code,
                                tutorial.title
                              )
                            }
                            disabled={saving}
                          >
                            Download QR
                          </button>

                        </div>

                      )}

                    </div>

                  );

                }
              )}

            </div>


            {/* ==================================
                ADD TUTORIAL
                ================================== */}

            <button
              type="button"
              className="add-tutorial-button"
              onClick={addTutorial}
              disabled={saving}
            >
              + Add Another Tutorial
            </button>


            {/* ==================================
                ERROR
                ================================== */}

            {error && (

              <p className="error-message">
                {error}
              </p>

            )}


            {/* ==================================
                BUTTONS
                ================================== */}

            <div className="form-buttons">

              <Link
                to="/admin/dashboard"
                className="cancel-button"
              >
                Cancel
              </Link>


              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Updating..."
                  : "Update Component"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>

  );

}


export default EditComponent;