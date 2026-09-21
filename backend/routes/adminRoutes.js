const express = require("express");

const {
    getTotalStudents
} = require("../controllers/adminController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// GET TOTAL STUDENTS
// ADMIN ONLY
// ==========================================

router.get(
    "/stats",
    authenticateToken,
    authorizeRoles("admin"),
    getTotalStudents
);


module.exports = router;