const { verifyToken } = require("../utils/jwt");

// ==========================================
// JWT AUTHENTICATION MIDDLEWARE
// ==========================================

const authenticateToken = (req, res, next) => {

    try {

        // ==========================================
        // GET AUTHORIZATION HEADER
        // ==========================================

        const authHeader = req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Access token is required"
            });
        }


        // ==========================================
        // CHECK BEARER FORMAT
        // ==========================================

        const parts = authHeader.split(" ");


        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {

            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }


        // ==========================================
        // GET TOKEN
        // ==========================================

        const token = parts[1];


        // ==========================================
        // VERIFY JWT
        // ==========================================

        const decoded = verifyToken(token);


        // ==========================================
        // STORE USER INFORMATION
        // ==========================================

        req.user = decoded;


        // ==========================================
        // CONTINUE TO ROUTE
        // ==========================================

        next();


    } catch (error) {


        // ==========================================
        // TOKEN EXPIRED
        // ==========================================

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({
                success: false,
                message: "Access token has expired"
            });
        }


        // ==========================================
        // INVALID TOKEN
        // ==========================================

        if (error.name === "JsonWebTokenError") {

            return res.status(401).json({
                success: false,
                message: "Invalid access token"
            });
        }


        // ==========================================
        // OTHER AUTHENTICATION ERROR
        // ==========================================

        return res.status(500).json({
            success: false,
            message: "Authentication failed"
        });

    }

};


module.exports = authenticateToken;