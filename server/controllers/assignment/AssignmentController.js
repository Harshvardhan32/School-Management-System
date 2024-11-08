const Assignment = require('../../models/Assignment');

exports.createAssignment = async (req, res) => {
    try {

        const { subject, teacher, assignedDate, dueDate } = req.body;

        if (!subject || !teacher || !assignedDate || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const assignmentResponse = await Assignment.create({ subject, teacher, assignedDate, dueDate })

        return res.status(200).json({
            success: true,
            data: assignmentResponse,
            message: 'Assignment created successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

exports.updateAssignment = async (req, res) => {
    try {

        const { classId, subject, teacher, assignedDate, dueDate } = req.body;

        if (!classId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const updatedAssignment = await Assignment.findByIdAndUpdate(classId, { subject, teacher, assignedDate, dueDate }, { new: true })

        return res.status(200).json({
            success: true,
            data: updatedAssignment,
            message: 'Assignment updated successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

exports.deleteAssignment = async (req, res) => {
    try {

        const { assignmentId } = req.params;

        if (!assignmentId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const deletedResponse = await Assignment.findByIdAndDelete(assignmentId);

        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: 'Assignment deleted successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

exports.getAllAssignment = async (req, res) => {
    try {

        const allAssignments = await Assignment.find();

        return res.status(200).json({
            success: true,
            data: allAssignments,
            message: 'All assignment fetched successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}