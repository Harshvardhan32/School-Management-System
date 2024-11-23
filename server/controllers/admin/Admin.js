const Teacher = require('../../models/Teacher');

exports.getAdminDetails = async (req, res) => {
    try {
        const { adminId } = req.body;

        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: 'Admin ID is required'
            })
        }

        const teacherDetails = await Teacher.findOne({ adminId })
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