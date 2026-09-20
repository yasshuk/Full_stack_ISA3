const db = require("../db");


// ==========================================
// GET TOTAL STUDENTS
// ==========================================

const getTotalStudents = async (req, res, next) => {

    try {

        const [result] = await db.execute(
            `
            SELECT COUNT(*) AS totalStudents
            FROM users
            WHERE role = 'student'
            `
        );


        return res.status(200).json({

            success: true,

            totalStudents:
                Number(result[0].totalStudents)

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {
    getTotalStudents
};