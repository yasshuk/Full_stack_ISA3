const express = require("express");

const {
    createTutorial,
    getTutorialsByComponent,
    getTutorialById,
    updateTutorial,
    deleteTutorial
} = require("../controllers/tutorialController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// GET ALL TUTORIALS FOR A COMPONENT
router.get(
    "/component/:component_id",
    authenticateToken,
    authorizeRoles("student", "admin"),
    getTutorialsByComponent
);


// GET ONE TUTORIAL
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("student", "admin"),
    getTutorialById
);


// ADD TUTORIAL
// ADMIN ONLY
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    createTutorial
);


// UPDATE TUTORIAL
// ADMIN ONLY
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    updateTutorial
);


// DELETE TUTORIAL
// ADMIN ONLY
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    deleteTutorial
);


module.exports = router;