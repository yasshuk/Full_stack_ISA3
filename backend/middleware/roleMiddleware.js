// ==========================================
// ROLE AUTHORIZATION MIDDLEWARE
// ==========================================

const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {


        // ==========================================
        // CHECK AUTHENTICATION
        // ==========================================

        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }


        // ==========================================
        // CHECK USER ROLE
        // ==========================================

        if (!allowedRoles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "Access denied. You do not have permission to access this resource."
            });
        }


        // ==========================================
        // ROLE IS ALLOWED
        // ==========================================

        next();

    };

};


module.exports = authorizeRoles;