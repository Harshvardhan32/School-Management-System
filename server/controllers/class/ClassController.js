const Class = require('../../models/Class');
const Subject = require('../../models/Subject');
const Teacher = require('../../models/Teacher');

// Function to create class
exports.createClass = async (req, res) => {
    try {
        const {
            className,
            capacity,
            supervisor,
            teachers,
            subjects
        } = req.body;

        if (!className || !capacity) {
            return res.status(400).json({
                success: true,
                message: 'Please fill all required details!'
            })
        }

        const classResponse = await Class.create({
            className,
            capacity,
            supervisor,
            teachers,
            subjects
        });

        // Update classes in Teacher Schema
        if (teachers?.length > 0) {
            await Teacher.updateMany(
                { _id: { $in: teachers } }, // Match all teachers in the teachers array
                { $push: { classes: classResponse?._id } } // Add class ID to the classes array
            );
        }

        // Update classes in Subject Schema
        if (subjects?.length > 0) {
            await Subject.updateMany(
                { _id: { $in: subjects } }, // Match all subjects in the subjects array
                { $push: { classes: classResponse?._id } } // Add class ID to the classes array
            );
        }

        return res.status(200).json({
            success: true,
            data: classResponse,
            message: 'Class created successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
};

// Function to update class
exports.updateClass = async (req, res) => {
    try {

        const {
            id,
            className,
            capacity,
            supervisor,
            teachers,
            subjects
        } = req.body;

        if (!id || !className ||
            !capacity) {
            return res.status(400).json({
                success: true,
                message: 'Please fill all required details!'
            });
        }

        // Check for existing Class by id
        const existingClass = await Class.findById(id);

        if (!existingClass) {
            return res.status(404).json({
                success: false,
                message: 'Class not found with the given ID!'
            });
        }

        const updatedResponse = await Class.findByIdAndUpdate(id,
            {
                className,
                capacity,
                supervisor,
                teachers,
                subjects
            }, { new: true });

        // Handle added and removed teachers
        const addedTeachers = teachers.filter(teacherId =>
            !existingClass.teachers.includes(teacherId));

        const removedTeachers = existingClass.teachers.filter(teacherId =>
            !teachers.includes(teacherId));

        // Update teacher relationships
        if (addedTeachers?.length > 0) {
            await Teacher.updateMany(
                { _id: { $in: addedTeachers } }, // Match all teachers in the addedTeachers array
                { $push: { classes: id } } // Add the class ID to the classes array for each matched teacher
            );
        }

        if (removedTeachers?.length > 0) {
            await Teacher.updateMany(
                { _id: { $in: removedTeachers } }, // Match all teachers in the removedTeachers array
                { $pull: { classes: id } } // Remove the class ID from the classes array for each matched teacher
            );
        }

        // Handle added and removed subjects
        const addedSubjects = subjects.filter(subjectId =>
            !existingClass.subjects.includes(subjectId));

        const removedSubjects = existingClass.subjects.filter(subjectId =>
            !subjects.includes(subjectId));

        // Update subject relationships
        if (addedSubjects?.length > 0) {
            await Subject.updateMany(
                { _id: { $in: addedSubjects } }, // Match all subjects in the addedSubjects array
                { $push: { classes: id } } // Add the class ID to the classes array for each matched subject
            );
        }

        if (removedSubjects?.length > 0) {
            await Subject.updateMany(
                { _id: { $in: removedSubjects } }, // Match all subjects in the removedSubjects array
                { $pull: { classes: id } } // Remove the class ID from the classes array for each matched subject
            );
        }

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: 'Class Update Successfully!'
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
};

// Function to delete class
exports.deleteClass = async (req, res) => {
    try {

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Class ID is required!'
            })
        }

        // Fetch the existing lesson
        const existingClass = await Class.findById(_id);

        if (!existingClass) {
            return res.status(404).json({
                success: false,
                message: 'Class not found with the given ID!'
            })
        }

        // Delete the class
        const deletedClass = await Class.findByIdAndDelete(_id);

        // Remove the class from the Assignment
        // Remove the class from the Attendance
        // Remove the class from the Event
        // Remove the class from the Exam
        // Remove the class from the Result
        // Remove the class from the Student
        // Remove the class from the Subject
        // Remove the class from the Teacher

        return res.status(200).json({
            success: true,
            data: deletedClass,
            message: 'Class deleted successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
};

// Function to get all class
exports.getAllClasses = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Class.find()
            .populate({
                path: 'supervisor',
                populate: {
                    path: 'userId'
                }
            })
            .populate({
                path: 'teachers',
                populate: {
                    path: 'userId'
                }
            })
            .populate('subjects');

        if (!allData) {
            query = query.skip(skip).limit(limit); // Apply pagination if allData is false
        }

        const data = await query;
        const total = allData ? data.length : await Class.countDocuments();

        return res.status(200).json({
            success: true,
            data,
            total,
            totalPages: allData ? 1 : Math.ceil(total / limit), // Only 1 page for allData
            currentPage: allData ? 1 : page,
            message: 'Classes fetched successfully!',
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!",
        });
    }
};