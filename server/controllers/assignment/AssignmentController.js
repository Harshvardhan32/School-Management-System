const Assignment = require('../../models/Assignment');
const Student = require('../../models/Student');

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

        // Update in Student schema
        await Student.updateMany(
            { classId: classId }, // Match all students with the given classId
            { $push: { assignments: assignmentResponse._id } } // Push the assignment ID to their assignments array
        );

        return res.status(200).json({
            success: true,
            data: assignmentResponse,
            message: 'Assignment Created Successfully!'
        });
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
            id,
            subject,
            classId,
            teacher,
            assignedDate,
            dueDate
        } = req.body;

        if (!id || !subject || !classId || !teacher || !assignedDate || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const existingAssignment = await Assignment.findById(id);

        if (!existingAssignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found with the id!'
            });
        }

        // Update the assignment with new data
        const updatedAssignment = await Assignment.findByIdAndUpdate(id,
            {
                subject,
                classId,
                teacher,
                assignedDate,
                dueDate
            }, { new: true });

        // If the classId has changed, update students
        if (existingAssignment.classId.toString() !== classId) {

            // Remove the assignment from students in the old class
            await Student.updateMany(
                { classId: existingAssignment.classId },
                { $pull: { assignments: id } }
            );

            // Add the assignment to students in the new class
            await Student.updateMany(
                { classId: classId },
                { $push: { assignments: id } }
            );
        }

        return res.status(200).json({
            success: true,
            data: updatedAssignment,
            message: 'Assignment Updated Successfully!'
        });
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

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Id is required!'
            });
        }

        // Fetch the assignment before deleting it to get the classId
        const existingAssignment = await Assignment.findById(_id);

        if (!existingAssignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found with the given ID!'
            });
        }

        // Delete the assignment
        const deletedAssignment = await Assignment.findByIdAndDelete(_id);

        // Remove the assignment from students' assignments array
        await Student.updateMany(
            { classId: existingAssignment.classId },
            { $pull: { assignments: _id } }
        );

        return res.status(200).json({
            success: true,
            data: deletedAssignment,
            message: 'Assignment Deleted Successfully!'
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        });
    }
}

exports.getAllAssignments = async (req, res) => {
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