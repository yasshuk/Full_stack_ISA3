const express = require("express");

const {
    recordScan,
    recordTutorialView,
    getStudentStats
} = require("../controllers/activityController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Record QR scan
router.post(
    "/scan",
    authenticateToken,
    authorizeRoles("student"),
    recordScan
);


// Record tutorial view
router.post(
    "/tutorial",
    authenticateToken,
    authorizeRoles("student"),
    recordTutorialView
);


// Get student statistics
router.get(
    "/stats",
    authenticateToken,
    authorizeRoles("student"),
    getStudentStats
);


module.exports = router;