const db = require("../db");
const QRCode = require("qrcode");


// ==========================================
// ADD TUTORIAL
// ==========================================

const createTutorial = async (req, res, next) => {

    try {

        const {
            component_id,
            title,
            youtube_url
        } = req.body;


        // ======================================
        // VALIDATE COMPONENT ID
        // ======================================

        if (!component_id) {

            return res.status(400).json({
                success: false,
                message: "Component ID is required"
            });

        }


        // ======================================
        // VALIDATE TITLE
        // ======================================

        if (!title || !title.trim()) {

            return res.status(400).json({
                success: false,
                message: "Tutorial title is required"
            });

        }


        // ======================================
        // VALIDATE YOUTUBE URL
        // ======================================

        if (!youtube_url || !youtube_url.trim()) {

            return res.status(400).json({
                success: false,
                message: "YouTube URL is required"
            });

        }


        // ======================================
        // CHECK COMPONENT
        // ======================================

        const [components] = await db.execute(
            `
            SELECT id, name
            FROM components
            WHERE id = ?
            `,
            [component_id]
        );


        if (components.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Component not found"
            });

        }


        // ======================================
        // INSERT TUTORIAL FIRST
        // ======================================

        const [result] = await db.execute(
            `
            INSERT INTO component_tutorials
            (
                component_id,
                title,
                youtube_url
            )
            VALUES (?, ?, ?)
            `,
            [
                component_id,
                title.trim(),
                youtube_url.trim()
            ]
        );


        // ======================================
        // GET NEW TUTORIAL ID
        // ======================================

        const tutorialId = result.insertId;


        // ======================================
        // CREATE QR DATA
        // ======================================
        //
        // The QR identifies the tutorial.
        //
        // Example:
        // http://localhost:5173/tutorial/1
        //
        // Later ScanQR.jsx will read this
        // tutorial ID.
        //
        // FRONTEND_URL can be changed in .env
        // when the project is deployed.
        // ======================================

        const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";

        const qrUrl =
            `${frontendUrl}/tutorial/${tutorialId}`;


        // ======================================
        // GENERATE QR CODE
        // ======================================

        const qr_code = await QRCode.toDataURL(
            qrUrl
        );


        // ======================================
        // SAVE QR CODE
        // ======================================

        await db.execute(
            `
            UPDATE component_tutorials
            SET qr_code = ?
            WHERE id = ?
            `,
            [
                qr_code,
                tutorialId
            ]
        );


        // ======================================
        // GET CREATED TUTORIAL
        // ======================================

        const [tutorials] = await db.execute(
            `
            SELECT
                id,
                component_id,
                title,
                youtube_url,
                qr_code,
                created_at,
                updated_at
            FROM component_tutorials
            WHERE id = ?
            `,
            [tutorialId]
        );


        // ======================================
        // RESPONSE
        // ======================================

        return res.status(201).json({

            success: true,

            message: "Tutorial added successfully",

            tutorial: tutorials[0]

        });

    } catch (error) {

        next(error);

    }

};



// ==========================================
// GET ALL TUTORIALS FOR A COMPONENT
// ==========================================

const getTutorialsByComponent = async (req, res, next) => {

    try {

        const { component_id } = req.params;


        // ======================================
        // CHECK COMPONENT
        // ======================================

        const [components] = await db.execute(
            `
            SELECT id, name
            FROM components
            WHERE id = ?
            `,
            [component_id]
        );


        if (components.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Component not found"
            });

        }


        // ======================================
        // GET TUTORIALS
        // ======================================

        const [tutorials] = await db.execute(
            `
            SELECT
                id,
                component_id,
                title,
                youtube_url,
                qr_code,
                created_at,
                updated_at
            FROM component_tutorials
            WHERE component_id = ?
            ORDER BY id ASC
            `,
            [component_id]
        );


        return res.status(200).json({

            success: true,

            tutorials

        });

    } catch (error) {

        next(error);

    }

};



// ==========================================
// GET ONE TUTORIAL
// ==========================================

const getTutorialById = async (req, res, next) => {

    try {

        const { id } = req.params;


        // ======================================
        // GET TUTORIAL
        // ======================================

        const [tutorials] = await db.execute(
            `
            SELECT
                id,
                component_id,
                title,
                youtube_url,
                qr_code,
                created_at,
                updated_at
            FROM component_tutorials
            WHERE id = ?
            `,
            [id]
        );


        if (tutorials.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Tutorial not found"
            });

        }


        return res.status(200).json({

            success: true,

            tutorial: tutorials[0]

        });

    } catch (error) {

        next(error);

    }

};



// ==========================================
// UPDATE TUTORIAL
// ==========================================

const updateTutorial = async (req, res, next) => {

    try {

        const { id } = req.params;

        const {
            title,
            youtube_url
        } = req.body;


        // ======================================
        // VALIDATE TITLE
        // ======================================

        if (!title || !title.trim()) {

            return res.status(400).json({
                success: false,
                message: "Tutorial title is required"
            });

        }


        // ======================================
        // VALIDATE YOUTUBE URL
        // ======================================

        if (!youtube_url || !youtube_url.trim()) {

            return res.status(400).json({
                success: false,
                message: "YouTube URL is required"
            });

        }


        // ======================================
        // CHECK TUTORIAL
        // ======================================

        const [existing] = await db.execute(
            `
            SELECT id
            FROM component_tutorials
            WHERE id = ?
            `,
            [id]
        );


        if (existing.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Tutorial not found"
            });

        }


        // ======================================
        // QR SHOULD STILL IDENTIFY
        // THE SAME TUTORIAL
        // ======================================

        const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";

        const qrUrl =
            `${frontendUrl}/tutorial/${id}`;


        // ======================================
        // GENERATE NEW QR
        // ======================================

        const qr_code = await QRCode.toDataURL(
            qrUrl
        );


        // ======================================
        // UPDATE TUTORIAL
        // ======================================

        await db.execute(
            `
            UPDATE component_tutorials
            SET
                title = ?,
                youtube_url = ?,
                qr_code = ?
            WHERE id = ?
            `,
            [
                title.trim(),
                youtube_url.trim(),
                qr_code,
                id
            ]
        );


        // ======================================
        // GET UPDATED TUTORIAL
        // ======================================

        const [tutorials] = await db.execute(
            `
            SELECT
                id,
                component_id,
                title,
                youtube_url,
                qr_code,
                created_at,
                updated_at
            FROM component_tutorials
            WHERE id = ?
            `,
            [id]
        );


        return res.status(200).json({

            success: true,

            message: "Tutorial updated successfully",

            tutorial: tutorials[0]

        });

    } catch (error) {

        next(error);

    }

};



// ==========================================
// DELETE TUTORIAL
// ==========================================

const deleteTutorial = async (req, res, next) => {

    try {

        const { id } = req.params;


        // ======================================
        // CHECK TUTORIAL
        // ======================================

        const [existing] = await db.execute(
            `
            SELECT id
            FROM component_tutorials
            WHERE id = ?
            `,
            [id]
        );


        if (existing.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Tutorial not found"
            });

        }


        // ======================================
        // DELETE TUTORIAL
        // ======================================

        await db.execute(
            `
            DELETE FROM component_tutorials
            WHERE id = ?
            `,
            [id]
        );


        return res.status(200).json({

            success: true,

            message: "Tutorial deleted successfully"

        });

    } catch (error) {

        next(error);

    }

};



module.exports = {

    createTutorial,

    getTutorialsByComponent,

    getTutorialById,

    updateTutorial,

    deleteTutorial

};