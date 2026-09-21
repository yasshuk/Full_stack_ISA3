const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const componentRoutes = require("./routes/componentRoutes");
const activityRoutes = require("./routes/activityRoutes");
const adminRoutes = require("./routes/adminRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");

// ==========================================
// MIDDLEWARE
// ==========================================

const authenticateToken = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");

// ==========================================
// EXPRESS APP
// ==========================================

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

// Allow frontend to communicate with backend
app.use(cors());

// Parse JSON request bodies
app.use(express.json());


// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.use("/api/auth", authRoutes);


// ==========================================
// COMPONENT ROUTES
// ==========================================

// Component CRUD routes
app.use("/api/components", componentRoutes);


// ==========================================
// STUDENT ACTIVITY ROUTES
// ==========================================

// QR scan and tutorial activity routes
app.use("/api/activity", activityRoutes);


// ==========================================
// ADMIN ROUTES
// ==========================================

// Admin statistics and admin-only features
app.use("/api/admin", adminRoutes);


// ==========================================
// TUTORIAL ROUTES
// ==========================================

// Multiple tutorials for each hardware component
app.use("/api/tutorials", tutorialRoutes);


// ==========================================
// BASIC TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Hardware Tutorial API is running"
    });

});


// ==========================================
// DATABASE HEALTH CHECK
// ==========================================

app.get("/api/health", async (req, res) => {

    try {

        const [result] = await db.query(
            "SELECT 1 AS connected"
        );

        res.status(200).json({
            success: true,
            message: "Server and database are working",
            database: result[0].connected === 1
        });

    } catch (error) {

        console.error(
            "Database connection error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });

    }

});


// ==========================================
// JWT PROTECTED TEST ROUTE
// ==========================================

app.get(
    "/api/protected",
    authenticateToken,
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "You are authenticated",
            user: req.user
        });

    }
);


// ==========================================
// ADMIN ONLY TEST ROUTE
// ==========================================

app.get(
    "/api/admin-test",
    authenticateToken,
    authorizeRoles("admin"),
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Admin access granted",
            user: req.user
        });

    }
);


// ==========================================
// STUDENT ONLY TEST ROUTE
// ==========================================

app.get(
    "/api/student-test",
    authenticateToken,
    authorizeRoles("student"),
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Student access granted",
            user: req.user
        });

    }
);


// ==========================================
// 404 - ROUTE NOT FOUND
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {

    console.error("Server Error:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});