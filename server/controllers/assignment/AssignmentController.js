const Assignment = require('../../models/Assignment');

exports.createAssignment = async (req, res) => {
    try {

        const {
            subject,
            classId,
            teacher,
            assignedDate,
            dueDate
        } = req.body;

        if (!subject || !classId || !teacher || !assignedDate || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const assignmentRecord = await Assignment.create({
            subject,
            classId,
            teacher,
            assignedDate,
            dueDate
        });

        const assignmentResponse = await Assignment.findById(assignmentRecord?._id)
        // .populate('subject')
        // .populate('classId')
        // .populate('teacher');

        return res.status(200).json({
            success: true,
            data: assignmentResponse,
            message: 'Assignment created successfully!'
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

exports.updateAssignment = async (req, res) => {
    try {

        const {
            assignmentId,
            classId,
            subject,
            teacher,
            assignedDate,
            dueDate
        } = req.body;

        if (!assignmentId) {
            return res.status(400).json({
                success: false,
                message: 'Assignment ID is required!'
            })
        }

        const assignmentData = await Assignment.findById(assignmentId);

        if (!assignmentData) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found with the given ID!'
            })
        }

        const updatedResponse = await Assignment.findByIdAndUpdate(assignmentId,
            {
                subject,
                classId,
                teacher,
                assignedDate,
                dueDate
            },
            { new: true })
        // .populate('subject')
        // .populate('classId')
        // .populate('teacher');

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: 'Assignment updated successfully!'
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

        const allAssignments = await Assignment.find()
        // .populate('subject')
        // .populate('classId')
        // .populate('teacher');

        return res.status(200).json({
            success: true,
            data: allAssignments,
            message: 'All assignment fetched successfully!'
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