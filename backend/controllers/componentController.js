const db = require("../db");
const QRCode = require("qrcode");

// ==========================================
// CREATE COMPONENT
// ==========================================

const createComponent = async (req, res, next) => {
    try {
        const {
            name,
            description,
            tinkercad_url,
            youtube_url
        } = req.body;

        // ------------------------------
        // Validation
        // ------------------------------

        if (!name || !youtube_url) {
            return res.status(400).json({
                success: false,
                message: "Name and YouTube URL are required"
            });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Component name must contain at least 2 characters"
            });
        }

        // ------------------------------
        // Validate YouTube URL
        // ------------------------------

        let youtubeUrl;

        try {
            youtubeUrl = new URL(youtube_url.trim());
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid YouTube URL"
            });
        }

        const allowedYoutubeHosts = [
            "youtube.com",
            "www.youtube.com",
            "youtu.be",
            "www.youtu.be"
        ];

        if (
            !allowedYoutubeHosts.includes(
                youtubeUrl.hostname.toLowerCase()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "URL must be a valid YouTube URL"
            });
        }

        // ------------------------------
        // Validate Tinkercad URL
        // ------------------------------

        if (tinkercad_url && tinkercad_url.trim()) {
            try {
                const tinkercadUrl = new URL(
                    tinkercad_url.trim()
                );

                if (
                    !tinkercadUrl.hostname
                        .toLowerCase()
                        .includes("tinkercad.com")
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "URL must be a valid Tinkercad URL"
                    });
                }

            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid Tinkercad URL"
                });
            }
        }

        // ------------------------------
        // Insert Component First
        // ------------------------------

        const [result] = await db.execute(
            `
            INSERT INTO components
            (
                name,
                description,
                tinkercad_url,
                youtube_url,
                qr_code
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                name.trim(),
                description
                    ? description.trim()
                    : null,
                tinkercad_url
                    ? tinkercad_url.trim()
                    : null,
                youtube_url.trim(),
                null
            ]
        );

        const componentId = result.insertId;

        // ------------------------------
        // Generate QR Code
        // ------------------------------
        // QR opens the YouTube tutorial directly

        const qr_code = await QRCode.toDataURL(
            youtube_url.trim()
        );

        // ------------------------------
        // Save QR Code
        // ------------------------------

        await db.execute(
            `
            UPDATE components
            SET qr_code = ?
            WHERE id = ?
            `,
            [
                qr_code,
                componentId
            ]
        );

        // ------------------------------
        // Get Created Component
        // ------------------------------

        const [components] = await db.execute(
            `
            SELECT
                id,
                name,
                description,
                tinkercad_url,
                youtube_url,
                qr_code,
                created_at,
                updated_at
            FROM components
            WHERE id = ?
            `,
            [componentId]
        );

        return res.status(201).json({
            success: true,
            message: "Component created successfully",
            component: components[0]
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// GET ALL COMPONENTS
// ==========================================

const getAllComponents = async (req, res, next) => {
    try {

        const [components] = await db.execute(
            `
            SELECT
                id,
                name,
                description,
                tinkercad_url,
                youtube_url,
                qr_code,
                created_at,
                updated_at
            FROM components
            ORDER BY created_at DESC
            `
        );

        return res.status(200).json({
            success: true,
            count: components.length,
            components
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// GET COMPONENT BY ID
// ==========================================

const getComponentById = async (req, res, next) => {
    try {

        const { id } = req.params;

        // ------------------------------
        // Validate ID
        // ------------------------------

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid component ID"
            });
        }

        // ------------------------------
        // Get Component
        // ------------------------------

        const [components] = await db.execute(
            `
            SELECT
                id,
                name,
                description,
                tinkercad_url,
                youtube_url,
                qr_code,
                created_at,
                updated_at
            FROM components
            WHERE id = ?
            `,
            [id]
        );

        if (components.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Component not found"
            });
        }

        return res.status(200).json({
            success: true,
            component: components[0]
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// UPDATE COMPONENT
// ==========================================

const updateComponent = async (req, res, next) => {
    try {

        const { id } = req.params;

        const {
            name,
            description,
            tinkercad_url,
            youtube_url
        } = req.body;

        // ------------------------------
        // Validate ID
        // ------------------------------

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid component ID"
            });
        }

        // ------------------------------
        // Check Component Exists
        // ------------------------------

        const [existingComponents] = await db.execute(
            `
            SELECT *
            FROM components
            WHERE id = ?
            `,
            [id]
        );

        if (existingComponents.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Component not found"
            });
        }

        const existingComponent =
            existingComponents[0];

        // ------------------------------
        // Prepare Updated Values
        // ------------------------------

        const updatedName =
            name !== undefined
                ? name.trim()
                : existingComponent.name;

        const updatedDescription =
            description !== undefined
                ? description.trim()
                : existingComponent.description;

        const updatedTinkercadUrl =
            tinkercad_url !== undefined
                ? tinkercad_url.trim()
                : existingComponent.tinkercad_url;

        const updatedYoutubeUrl =
            youtube_url !== undefined
                ? youtube_url.trim()
                : existingComponent.youtube_url;

        // ------------------------------
        // Validate Name
        // ------------------------------

        if (updatedName.length < 2) {
            return res.status(400).json({
                success: false,
                message:
                    "Component name must contain at least 2 characters"
            });
        }

        // ------------------------------
        // Validate YouTube URL
        // ------------------------------

        let youtubeUrl;

        try {
            youtubeUrl = new URL(
                updatedYoutubeUrl
            );
        } catch (error) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid YouTube URL"
            });
        }

        const allowedYoutubeHosts = [
            "youtube.com",
            "www.youtube.com",
            "youtu.be",
            "www.youtu.be"
        ];

        if (
            !allowedYoutubeHosts.includes(
                youtubeUrl.hostname.toLowerCase()
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "URL must be a valid YouTube URL"
            });
        }

        // ------------------------------
        // Validate Tinkercad URL
        // ------------------------------

        if (
            updatedTinkercadUrl &&
            updatedTinkercadUrl.trim()
        ) {
            try {

                const tinkercadUrl = new URL(
                    updatedTinkercadUrl
                );

                if (
                    !tinkercadUrl.hostname
                        .toLowerCase()
                        .includes("tinkercad.com")
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "URL must be a valid Tinkercad URL"
                    });
                }

            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please provide a valid Tinkercad URL"
                });
            }
        }

        // ------------------------------
        // Generate QR Code
        // ------------------------------
        // QR opens the YouTube tutorial directly

        const qr_code = await QRCode.toDataURL(
            updatedYoutubeUrl
        );

        // ------------------------------
        // Update Database
        // ------------------------------

        await db.execute(
            `
            UPDATE components
            SET
                name = ?,
                description = ?,
                tinkercad_url = ?,
                youtube_url = ?,
                qr_code = ?
            WHERE id = ?
            `,
            [
                updatedName,
                updatedDescription || null,
                updatedTinkercadUrl || null,
                updatedYoutubeUrl,
                qr_code,
                id
            ]
        );

        // ------------------------------
        // Get Updated Component
        // ------------------------------

        const [updatedComponents] =
            await db.execute(
                `
                SELECT
                    id,
                    name,
                    description,
                    tinkercad_url,
                    youtube_url,
                    qr_code,
                    created_at,
                    updated_at
                FROM components
                WHERE id = ?
                `,
                [id]
            );

        return res.status(200).json({
            success: true,
            message: "Component updated successfully",
            component: updatedComponents[0]
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// DELETE COMPONENT
// ==========================================

const deleteComponent = async (req, res, next) => {
    try {

        const { id } = req.params;

        // ------------------------------
        // Validate ID
        // ------------------------------

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid component ID"
            });
        }

        // ------------------------------
        // Check Component Exists
        // ------------------------------

        const [components] = await db.execute(
            `
            SELECT id
            FROM components
            WHERE id = ?
            `,
            [id]
        );

        if (components.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Component not found"
            });
        }

        // ------------------------------
        // Delete Component
        // ------------------------------

        await db.execute(
            `
            DELETE FROM components
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Component deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// CREATE COMPONENT WITH ALL TUTORIALS
// TRANSACTIONAL
// ==========================================

const createComponentWithTutorials = async (req, res, next) => {

    let connection;

    try {

        const {
            name,
            description,
            tinkercad_url,
            tutorials
        } = req.body;

        // ==========================================
        // BASIC VALIDATION
        // ==========================================

        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Component name is required"
            });

        }

        if (name.trim().length < 2) {

            return res.status(400).json({
                success: false,
                message:
                    "Component name must contain at least 2 characters"
            });

        }

        if (!tinkercad_url || !tinkercad_url.trim()) {

            return res.status(400).json({
                success: false,
                message:
                    "Tinkercad simulation link is required"
            });

        }

        // ==========================================
        // VALIDATE TINKERCAD URL
        // ==========================================

        try {

            const tinkercadUrl =
                new URL(
                    tinkercad_url.trim()
                );

            if (
                !tinkercadUrl.hostname
                    .toLowerCase()
                    .includes("tinkercad.com")
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "URL must be a valid Tinkercad URL"
                });

            }

        } catch (error) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid Tinkercad URL"
            });

        }

        // ==========================================
        // VALIDATE TUTORIALS
        // ==========================================

        if (
            !Array.isArray(tutorials) ||
            tutorials.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "At least one tutorial is required"
            });

        }

        for (
            let i = 0;
            i < tutorials.length;
            i++
        ) {

            const tutorial =
                tutorials[i];

            if (
                !tutorial.title ||
                !tutorial.title.trim()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Tutorial ${i + 1} title is required`
                });

            }

            if (
                tutorial.title.trim().length < 2
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Tutorial ${i + 1} title must contain at least 2 characters`
                });

            }

            if (
                !tutorial.youtube_url ||
                !tutorial.youtube_url.trim()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `YouTube URL for Tutorial ${i + 1} is required`
                });

            }

            // Validate YouTube URL

            try {

                const youtubeUrl =
                    new URL(
                        tutorial.youtube_url.trim()
                    );

                const allowedYoutubeHosts = [
                    "youtube.com",
                    "www.youtube.com",
                    "youtu.be",
                    "www.youtu.be"
                ];

                if (
                    !allowedYoutubeHosts.includes(
                        youtubeUrl.hostname.toLowerCase()
                    )
                ) {

                    return res.status(400).json({
                        success: false,
                        message:
                            `Tutorial ${i + 1} must contain a valid YouTube URL`
                    });

                }

            } catch (error) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Tutorial ${i + 1} contains an invalid YouTube URL`
                });

            }

        }

        // ==========================================
        // GET DATABASE CONNECTION
        // ==========================================

        connection =
            await db.getConnection();

        // ==========================================
        // START TRANSACTION
        // ==========================================

        await connection.beginTransaction();

        // ==========================================
        // CREATE COMPONENT
        // ==========================================

        const firstYoutubeUrl =
            tutorials[0]
                .youtube_url
                .trim();

        const [componentResult] =
            await connection.execute(
                `
                INSERT INTO components
                (
                    name,
                    description,
                    tinkercad_url,
                    youtube_url,
                    qr_code
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    name.trim(),
                    description
                        ? description.trim()
                        : null,
                    tinkercad_url.trim(),
                    firstYoutubeUrl,
                    null
                ]
            );

        const componentId =
            componentResult.insertId;

        // ==========================================
        // COMPONENT QR CODE
        // ==========================================
        // QR opens the first YouTube tutorial directly

        const componentQrCode =
            await QRCode.toDataURL(
                firstYoutubeUrl
            );

        await connection.execute(
            `
            UPDATE components
            SET qr_code = ?
            WHERE id = ?
            `,
            [
                componentQrCode,
                componentId
            ]
        );

        // ==========================================
        // CREATE ALL TUTORIALS
        // ==========================================

        const createdTutorials = [];

        for (
            const tutorial
            of tutorials
        ) {

            const [tutorialResult] =
                await connection.execute(
                    `
                    INSERT INTO component_tutorials
                    (
                        component_id,
                        title,
                        youtube_url,
                        qr_code
                    )
                    VALUES (?, ?, ?, ?)
                    `,
                    [
                        componentId,
                        tutorial.title.trim(),
                        tutorial.youtube_url.trim(),
                        null
                    ]
                );

            const tutorialId =
                tutorialResult.insertId;

            // ======================================
            // TUTORIAL QR CODE
            // ======================================
            // QR opens YouTube tutorial directly

            const tutorialQrCode =
                await QRCode.toDataURL(
                    tutorial.youtube_url.trim()
                );

            await connection.execute(
                `
                UPDATE component_tutorials
                SET qr_code = ?
                WHERE id = ?
                `,
                [
                    tutorialQrCode,
                    tutorialId
                ]
            );

            createdTutorials.push({
                id: tutorialId,
                component_id: componentId,
                title: tutorial.title.trim(),
                youtube_url: tutorial.youtube_url.trim(),
                qr_code: tutorialQrCode
            });

        }

        // ==========================================
        // COMMIT
        // ==========================================

        await connection.commit();

        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(201).json({

            success: true,

            message:
                "Component and tutorials created successfully",

            component: {
                id: componentId,
                name: name.trim(),
                description:
                    description
                        ? description.trim()
                        : null,
                tinkercad_url:
                    tinkercad_url.trim(),
                youtube_url:
                    firstYoutubeUrl,
                qr_code:
                    componentQrCode
            },

            tutorials:
                createdTutorials

        });

    } catch (error) {

        // ==========================================
        // ROLLBACK
        // ==========================================

        if (connection) {

            try {

                await connection.rollback();

            } catch (rollbackError) {

                console.error(
                    "Rollback failed:",
                    rollbackError
                );

            }

        }

        console.error(
            "Create component transaction failed:",
            error
        );

        next(error);

    } finally {

        // ==========================================
        // RELEASE CONNECTION
        // ==========================================

        if (connection) {
            connection.release();
        }

    }

};


// ==========================================
// UPDATE COMPONENT WITH ALL TUTORIALS
// TRANSACTIONAL
// ==========================================

const updateComponentWithTutorials = async (req, res, next) => {

    let connection;

    try {

        const { id } = req.params;

        const {
            name,
            description,
            tinkercad_url,
            tutorials
        } = req.body;

        // ==========================================
        // VALIDATE COMPONENT ID
        // ==========================================

        if (!/^\d+$/.test(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid component ID"
            });

        }

        // ==========================================
        // VALIDATE NAME
        // ==========================================

        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Component name is required"
            });

        }

        if (name.trim().length < 2) {

            return res.status(400).json({
                success: false,
                message:
                    "Component name must contain at least 2 characters"
            });

        }

        // ==========================================
        // VALIDATE TINKERCAD URL
        // ==========================================

        if (!tinkercad_url || !tinkercad_url.trim()) {

            return res.status(400).json({
                success: false,
                message:
                    "Tinkercad simulation link is required"
            });

        }

        try {

            const tinkercadUrl =
                new URL(
                    tinkercad_url.trim()
                );

            if (
                !tinkercadUrl.hostname
                    .toLowerCase()
                    .includes("tinkercad.com")
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "URL must be a valid Tinkercad URL"
                });

            }

        } catch (error) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid Tinkercad URL"
            });

        }

        // ==========================================
        // VALIDATE TUTORIALS
        // ==========================================

        if (
            !Array.isArray(tutorials) ||
            tutorials.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "At least one tutorial is required"
            });

        }

        const activeTutorials =
            tutorials.filter(
                (tutorial) =>
                    !tutorial.isDeleted
            );

        if (activeTutorials.length === 0) {

            return res.status(400).json({
                success: false,
                message:
                    "At least one tutorial is required"
            });

        }

        // ==========================================
        // VALIDATE EACH TUTORIAL
        // ==========================================

        for (
            let i = 0;
            i < activeTutorials.length;
            i++
        ) {

            const tutorial =
                activeTutorials[i];

            if (
                !tutorial.title ||
                !tutorial.title.trim()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Tutorial ${i + 1} title is required`
                });

            }

            if (
                tutorial.title.trim().length < 2
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Tutorial ${i + 1} title must contain at least 2 characters`
                });

            }

            if (
                !tutorial.youtube_url ||
                !tutorial.youtube_url.trim()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `YouTube URL for Tutorial ${i + 1} is required`
                });

            }

            try {

                const youtubeUrl =
                    new URL(
                        tutorial.youtube_url.trim()
                    );

                const allowedYoutubeHosts = [
                    "youtube.com",
                    "www.youtube.com",
                    "youtu.be",
                    "www.youtu.be"
                ];

                if (
                    !allowedYoutubeHosts.includes(
                        youtubeUrl.hostname.toLowerCase()
                    )
                ) {

                    return res.status(400).json({
                        success: false,
                        message:
                            `Tutorial ${i + 1} must contain a valid YouTube URL`
                    });

                }

            } catch (error) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Tutorial ${i + 1} contains an invalid YouTube URL`
                });

            }

        }

        // ==========================================
        // GET DATABASE CONNECTION
        // ==========================================

        connection =
            await db.getConnection();

        // ==========================================
        // START TRANSACTION
        // ==========================================

        await connection.beginTransaction();

        // ==========================================
        // CHECK COMPONENT EXISTS
        // ==========================================

        const [existingComponents] =
            await connection.execute(
                `
                SELECT id
                FROM components
                WHERE id = ?
                `,
                [id]
            );

        if (existingComponents.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Component not found"
            });

        }

        // ==========================================
        // FIRST ACTIVE TUTORIAL
        // ==========================================

        const firstYoutubeUrl =
            activeTutorials[0]
                .youtube_url
                .trim();

        // ==========================================
        // COMPONENT QR CODE
        // ==========================================
        // QR opens the first YouTube tutorial directly

        const componentQrCode =
            await QRCode.toDataURL(
                firstYoutubeUrl
            );

        // ==========================================
        // UPDATE COMPONENT
        // ==========================================

        await connection.execute(
            `
            UPDATE components
            SET
                name = ?,
                description = ?,
                tinkercad_url = ?,
                youtube_url = ?,
                qr_code = ?
            WHERE id = ?
            `,
            [
                name.trim(),
                description
                    ? description.trim()
                    : null,
                tinkercad_url.trim(),
                firstYoutubeUrl,
                componentQrCode,
                id
            ]
        );

        // ==========================================
        // DELETE REMOVED TUTORIALS
        // ==========================================

        const deletedTutorials =
            tutorials.filter(
                (tutorial) =>
                    tutorial.id &&
                    tutorial.isDeleted
            );

        for (
            const tutorial
            of deletedTutorials
        ) {

            await connection.execute(
                `
                DELETE FROM component_tutorials
                WHERE id = ?
                AND component_id = ?
                `,
                [
                    tutorial.id,
                    id
                ]
            );

        }

        // ==========================================
        // CREATE / UPDATE TUTORIALS
        // ==========================================

        const updatedTutorials = [];

        for (
            const tutorial
            of activeTutorials
        ) {

            // ======================================
            // EXISTING TUTORIAL
            // ======================================

            if (tutorial.id) {

                const [existingTutorials] =
                    await connection.execute(
                        `
                        SELECT id
                        FROM component_tutorials
                        WHERE id = ?
                        AND component_id = ?
                        `,
                        [
                            tutorial.id,
                            id
                        ]
                    );

                if (
                    existingTutorials.length === 0
                ) {

                    throw new Error(
                        `Tutorial ${tutorial.id} does not belong to this component`
                    );

                }

                // ==================================
                // TUTORIAL QR CODE
                // ==================================
                // QR opens YouTube directly

                const tutorialQrCode =
                    await QRCode.toDataURL(
                        tutorial.youtube_url.trim()
                    );

                await connection.execute(
                    `
                    UPDATE component_tutorials
                    SET
                        title = ?,
                        youtube_url = ?,
                        qr_code = ?
                    WHERE id = ?
                    AND component_id = ?
                    `,
                    [
                        tutorial.title.trim(),
                        tutorial.youtube_url.trim(),
                        tutorialQrCode,
                        tutorial.id,
                        id
                    ]
                );

                updatedTutorials.push({
                    id: tutorial.id,
                    component_id: Number(id),
                    title:
                        tutorial.title.trim(),
                    youtube_url:
                        tutorial.youtube_url.trim(),
                    qr_code:
                        tutorialQrCode
                });

            }

            // ======================================
            // NEW TUTORIAL
            // ======================================

            else {

                const [tutorialResult] =
                    await connection.execute(
                        `
                        INSERT INTO component_tutorials
                        (
                            component_id,
                            title,
                            youtube_url,
                            qr_code
                        )
                        VALUES (?, ?, ?, ?)
                        `,
                        [
                            id,
                            tutorial.title.trim(),
                            tutorial.youtube_url.trim(),
                            null
                        ]
                    );

                const tutorialId =
                    tutorialResult.insertId;

                // ==================================
                // TUTORIAL QR CODE
                // ==================================
                // QR opens YouTube directly

                const tutorialQrCode =
                    await QRCode.toDataURL(
                        tutorial.youtube_url.trim()
                    );

                await connection.execute(
                    `
                    UPDATE component_tutorials
                    SET qr_code = ?
                    WHERE id = ?
                    `,
                    [
                        tutorialQrCode,
                        tutorialId
                    ]
                );

                updatedTutorials.push({
                    id: tutorialId,
                    component_id: Number(id),
                    title:
                        tutorial.title.trim(),
                    youtube_url:
                        tutorial.youtube_url.trim(),
                    qr_code:
                        tutorialQrCode
                });

            }

        }

        // ==========================================
        // COMMIT TRANSACTION
        // ==========================================

        await connection.commit();

        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Component and tutorials updated successfully",

            component: {
                id: Number(id),
                name: name.trim(),
                description:
                    description
                        ? description.trim()
                        : null,
                tinkercad_url:
                    tinkercad_url.trim(),
                youtube_url:
                    firstYoutubeUrl,
                qr_code:
                    componentQrCode
            },

            tutorials:
                updatedTutorials

        });

    } catch (error) {

        // ==========================================
        // ROLLBACK
        // ==========================================

        if (connection) {

            try {

                await connection.rollback();

            } catch (rollbackError) {

                console.error(
                    "Rollback failed:",
                    rollbackError
                );

            }

        }

        console.error(
            "Update component transaction failed:",
            error
        );

        next(error);

    } finally {

        if (connection) {
            connection.release();
        }

    }

};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    createComponent,
    createComponentWithTutorials,
    updateComponentWithTutorials,
    getAllComponents,
    getComponentById,
    updateComponent,
    deleteComponent
};