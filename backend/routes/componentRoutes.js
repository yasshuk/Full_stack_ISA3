const express = require("express");

const {
    createComponent,
    createComponentWithTutorials,
    updateComponentWithTutorials,
    getAllComponents,
    getComponentById,
    updateComponent,
    deleteComponent
} = require("../controllers/componentController");

const authenticateToken = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// GET ALL COMPONENTS
// ==========================================

// Students and admins can view components

router.get(
    "/",
    authenticateToken,
    authorizeRoles("student", "admin"),
    getAllComponents
);


// ==========================================
// CREATE COMPONENT WITH TUTORIALS
// ==========================================

// Admin only
// Creates component + all tutorials
// inside one database transaction

router.post(
    "/with-tutorials",
    authenticateToken,
    authorizeRoles("admin"),
    createComponentWithTutorials
);


// ==========================================
// UPDATE COMPONENT WITH TUTORIALS
// ==========================================

// Admin only
// Updates component + tutorials
// inside one database transaction

router.put(
    "/:id/with-tutorials",
    authenticateToken,
    authorizeRoles("admin"),
    updateComponentWithTutorials
);


// ==========================================
// GET COMPONENT BY ID
// ==========================================

// Students and admins can view one component

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("student", "admin"),
    getComponentById
);


// ==========================================
// CREATE COMPONENT
// ==========================================

// Admin only
// Kept for backward compatibility

router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    createComponent
);


// ==========================================
// UPDATE COMPONENT
// ==========================================

// Admin only
// Kept for backward compatibility

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    updateComponent
);


// ==========================================
// DELETE COMPONENT
// ==========================================

// Admin only

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    deleteComponent
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;