const db = require("../db");


// ==========================================
// RECORD QR SCAN
// ==========================================

const recordScan = async (req, res, next) => {

    try {

        const { tutorial_id } = req.body;


        // ======================================
        // VALIDATE TUTORIAL ID
        // ======================================

        if (!tutorial_id) {

            return res.status(400).json({
                success: false,
                message: "Tutorial ID is required"
            });

        }


        // ======================================
        // FIND TUTORIAL
        // ======================================

        const [tutorials] = await db.execute(
            `
            SELECT
                t.id,
                t.component_id,
                t.title,
                t.youtube_url,
                c.name AS component_name
            FROM component_tutorials t
            INNER JOIN components c
                ON t.component_id = c.id
            WHERE t.id = ?
            `,
            [tutorial_id]
        );


        if (tutorials.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Tutorial not found"
            });

        }


        const tutorial = tutorials[0];


        // ======================================
        // RECORD SCAN
        // ======================================

        await db.execute(
            `
            INSERT INTO student_activity
            (
                user_id,
                component_id,
                tutorial_id,
                activity_type
            )
            VALUES (?, ?, ?, 'scan')
            `,
            [
                req.user.id,
                tutorial.component_id,
                tutorial.id
            ]
        );


        // ======================================
        // RESPONSE
        // ======================================

        return res.status(201).json({

            success: true,

            message: "QR scan recorded successfully",

            tutorial: {
                id: tutorial.id,
                title: tutorial.title,
                youtube_url: tutorial.youtube_url
            },

            component: {
                id: tutorial.component_id,
                name: tutorial.component_name
            }

        });

    } catch (error) {

        next(error);

    }

};



// ==========================================
// RECORD TUTORIAL VIEW
// ==========================================

const recordTutorialView = async (req, res, next) => {

    try {

        const { tutorial_id } = req.body;


        // ======================================
        // VALIDATE TUTORIAL ID
        // ======================================

        if (!tutorial_id) {

            return res.status(400).json({
                success: false,
                message: "Tutorial ID is required"
            });

        }


        // ======================================
        // FIND TUTORIAL
        // ======================================

        const [tutorials] = await db.execute(
            `
            SELECT
                t.id,
                t.component_id,
                t.title,
                t.youtube_url,
                c.name AS component_name
            FROM component_tutorials t
            INNER JOIN components c
                ON t.component_id = c.id
            WHERE t.id = ?
            `,
            [tutorial_id]
        );


        if (tutorials.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Tutorial not found"
            });

        }


        const tutorial = tutorials[0];


        // ======================================
        // RECORD TUTORIAL VIEW
        // ======================================

        await db.execute(
            `
            INSERT INTO student_activity
            (
                user_id,
                component_id,
                tutorial_id,
                activity_type
            )
            VALUES (?, ?, ?, 'tutorial')
            `,
            [
                req.user.id,
                tutorial.component_id,
                tutorial.id
            ]
        );


        // ======================================
        // RESPONSE
        // ======================================

        return res.status(201).json({

            success: true,

            message: "Tutorial view recorded successfully",

            tutorial: {
                id: tutorial.id,
                title: tutorial.title,
                youtube_url: tutorial.youtube_url
            },

            component: {
                id: tutorial.component_id,
                name: tutorial.component_name
            }

        });

    } catch (error) {

        next(error);

    }

};



// ==========================================
// GET STUDENT STATISTICS
// ==========================================

const getStudentStats = async (req, res, next) => {

    try {


        // ======================================
        // SCANS TODAY
        // ======================================

        const [scanResult] = await db.execute(
            `
            SELECT COUNT(*) AS count
            FROM student_activity
            WHERE user_id = ?
            AND activity_type = 'scan'
            AND DATE(created_at) = CURDATE()
            `,
            [req.user.id]
        );


        // ======================================
        // TUTORIALS WATCHED
        // ======================================

        const [tutorialResult] = await db.execute(
            `
            SELECT COUNT(*) AS count
            FROM student_activity
            WHERE user_id = ?
            AND activity_type = 'tutorial'
            `,
            [req.user.id]
        );


        // ======================================
        // RESPONSE
        // ======================================

        return res.status(200).json({

            success: true,

            stats: {

                scannedToday:
                    Number(scanResult[0].count),

                tutorialsWatched:
                    Number(tutorialResult[0].count)

            }

        });

    } catch (error) {

        next(error);

    }

};



module.exports = {

    recordScan,

    recordTutorialView,

    getStudentStats

};