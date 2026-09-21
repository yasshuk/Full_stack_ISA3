const jwt = require("jsonwebtoken");


// ==========================================
// GENERATE JWT
// ==========================================

const generateToken = (user) => {

    return jwt.sign(

        {
            id: user.id,
            email: user.email,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn:
                process.env.JWT_EXPIRES_IN || "1h"
        }
    );
};


// ==========================================
// VERIFY JWT
// ==========================================

const verifyToken = (token) => {

    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    generateToken,
    verifyToken
};