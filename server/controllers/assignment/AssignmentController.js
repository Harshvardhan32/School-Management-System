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

        const assignmentResponse = await Assignment.create({
            subject,
            classId,
            teacher,
            assignedDate,
            dueDate
        });

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
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Assignment.find()
            .populate('subject')
            .populate('classId')
            .populate('teacher');

        if (!allData) {
            query = query.skip(skip).limit(limit); // Apply pagination if allData is false
        }

        const data = await query;
        const total = allData ? data.length : await Assignment.countDocuments();

        return res.status(200).json({
            success: true,
            data,
            total,
            totalPages: allData ? 1 : Math.ceil(total / limit), // Only 1 page for allData
            currentPage: allData ? 1 : page,
            message: 'Assignments fetched successfully!',
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!',
        });
    }
};