const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("../db");
const { generateToken } = require("../utils/jwt");


// ==========================================
// PASSWORD VALIDATION
// ==========================================

const validatePassword = (password) => {

    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }

    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }

    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
    }

    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number";
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]`~;'+=/]/.test(password)) {
        return "Password must contain at least one special character";
    }

    return null;
};


// ==========================================
// REGISTER USER
// ==========================================

const register = async (req, res, next) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });

        }


        const trimmedName = name.trim();


        if (trimmedName.length < 2) {

            return res.status(400).json({
                success: false,
                message:
                    "Name must contain at least 2 characters"
            });

        }


        if (trimmedName.length > 100) {

            return res.status(400).json({
                success: false,
                message:
                    "Name cannot exceed 100 characters"
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(normalizedEmail)) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid email address"
            });

        }


        const passwordError =
            validatePassword(password);


        if (passwordError) {

            return res.status(400).json({
                success: false,
                message: passwordError
            });

        }


        const [existingUsers] =
            await db.execute(
                `
                SELECT id
                FROM users
                WHERE email = ?
                LIMIT 1
                `,
                [normalizedEmail]
            );


        if (existingUsers.length > 0) {

            return res.status(409).json({
                success: false,
                message:
                    "An account with this email already exists"
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 12);


        // Public registration creates student accounts
        const role = "student";


        const [result] =
            await db.execute(
                `
                INSERT INTO users
                (name, email, password, role)
                VALUES (?, ?, ?, ?)
                `,
                [
                    trimmedName,
                    normalizedEmail,
                    hashedPassword,
                    role
                ]
            );


        const [users] =
            await db.execute(
                `
                SELECT
                    id,
                    name,
                    email,
                    role,
                    created_at
                FROM users
                WHERE id = ?
                `,
                [result.insertId]
            );


        const user = users[0];


        return res.status(201).json({

            success: true,

            message:
                "Registration successful",

            user

        });


    } catch (error) {

        next(error);

    }

};


// ==========================================
// LOGIN USER
// ==========================================

const login = async (req, res, next) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        const [users] =
            await db.execute(
                `
                SELECT
                    id,
                    name,
                    email,
                    password,
                    role,
                    created_at
                FROM users
                WHERE email = ?
                LIMIT 1
                `,
                [normalizedEmail]
            );


        if (users.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Email is invalid"
            });

        }


        const user = users[0];


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Password is invalid"
            });

        }


        delete user.password;


        const token =
            generateToken(user);


        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            token,

            user

        });


    } catch (error) {

        next(error);

    }

};


// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword = async (req, res, next) => {

    try {

        const { email } = req.body;


        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Email is required"
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(normalizedEmail)) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid email address"
            });

        }


        const [users] =
            await db.execute(
                `
                SELECT
                    id,
                    email
                FROM users
                WHERE email = ?
                LIMIT 1
                `,
                [normalizedEmail]
            );


        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "No account found with this email"
            });

        }


        const user = users[0];


        // ==========================================
        // REMOVE OLD RESET TOKENS
        // ==========================================

        await db.execute(
            `
            DELETE FROM password_reset_tokens
            WHERE user_id = ?
            `,
            [user.id]
        );


        // ==========================================
        // GENERATE RESET TOKEN
        // ==========================================

        const resetToken =
            crypto
                .randomBytes(32)
                .toString("hex");


        // Store only the hash in database
        const tokenHash =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");


        // Token valid for 15 minutes
        const expiresAt =
            new Date(
                Date.now() + 15 * 60 * 1000
            );


        await db.execute(
            `
            INSERT INTO password_reset_tokens
            (user_id, token_hash, expires_at)
            VALUES (?, ?, ?)
            `,
            [
                user.id,
                tokenHash,
                expiresAt
            ]
        );


        /*
         * DEVELOPMENT ONLY:
         *
         * In a production application this token
         * would be sent through email.
         *
         * For our current project we return the
         * reset URL so we can test the complete
         * reset-password flow locally.
         */

        const resetLink =
            `http://localhost:5173/reset-password?token=${resetToken}`;


        return res.status(200).json({

            success: true,

            message:
                "Password reset link generated successfully",

            resetLink

        });


    } catch (error) {

        next(error);

    }

};


// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = async (req, res, next) => {

    try {

        const {
            token,
            password
        } = req.body;


        // ==========================================
        // REQUIRED FIELDS
        // ==========================================

        if (!token || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Reset token and new password are required"
            });

        }


        // ==========================================
        // PASSWORD VALIDATION
        // ==========================================

        const passwordError =
            validatePassword(password);


        if (passwordError) {

            return res.status(400).json({
                success: false,
                message: passwordError
            });

        }


        // ==========================================
        // HASH TOKEN
        // ==========================================

        const tokenHash =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");


        // ==========================================
        // FIND VALID TOKEN
        // ==========================================

        const [resetTokens] =
            await db.execute(
                `
                SELECT
                    id,
                    user_id
                FROM password_reset_tokens
                WHERE token_hash = ?
                  AND used = FALSE
                  AND expires_at > NOW()
                LIMIT 1
                `,
                [tokenHash]
            );


        if (resetTokens.length === 0) {

            return res.status(400).json({
                success: false,
                message:
                    "Reset link is invalid or has expired"
            });

        }


        const resetToken =
            resetTokens[0];


        // ==========================================
        // HASH NEW PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(password, 12);


        // ==========================================
        // UPDATE PASSWORD
        // ==========================================

        await db.execute(
            `
            UPDATE users
            SET password = ?
            WHERE id = ?
            `,
            [
                hashedPassword,
                resetToken.user_id
            ]
        );


        // ==========================================
        // MARK TOKEN AS USED
        // ==========================================

        await db.execute(
            `
            UPDATE password_reset_tokens
            SET used = TRUE
            WHERE id = ?
            `,
            [resetToken.id]
        );


        // ==========================================
        // SUCCESS
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Password reset successfully"

        });


    } catch (error) {

        next(error);

    }

};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
};