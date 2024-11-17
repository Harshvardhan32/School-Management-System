const Student = require("../../models/Student");

exports.getAllStudents = async (req, res) => {
    try {
        const allStudents = await Student.find()
            .populate('userId')
            .populate('classId')
            .populate('parent')
            .populate('attendance')
            .populate('subjects')
            .populate('exams')
            .populate('assignments');

        return res.status(200).json({
            success: true,
            data: allStudents,
            message: 'All student fetched successfully!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}