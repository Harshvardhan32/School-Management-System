const Teacher = require('../../models/Teacher');

exports.getAllTeachers = async (req, res) => {
    try {
        const allTeachers = await Teacher.find();

        return res.status(200).json({
            success: true,
            data: allTeachers,
            message: 'All teacher fetched successfully!'
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

exports.getTeacherDetails = async (req, res) => {
    try {
        const { teacherId } = req.body;

        if (!teacherId) {
            return res.status(400).json({
                success: false,
                message: 'Teacher ID is required'
            })
        }

        const teacherDetails = await Teacher.findOne({ teacherId })
            .populate('userId')
            .populate('classes')
            .populate('subjects')
            .exec();

        if (!teacherDetails) {
            return res.status(404).json({
                success: false,
                message: 'Teacher is not found with the given ID.'
            })
        }

        return res.status(200).json({
            success: true,
            data: teacherDetails,
            message: 'Teacher details fetched successfully!'
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