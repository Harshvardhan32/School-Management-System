const Exam = require('../../models/Exam');
const Class = require('../../models/Class');
const Event = require('../../models/Event');
const Result = require('../../models/Result');
const Parent = require('../../models/Parent');
const Subject = require('../../models/Subject');
const Teacher = require('../../models/Teacher');
const Student = require('../../models/Student');
const Attendance = require('../../models/Attendance');
const Assignment = require('../../models/Assignment');

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
            supervisor: supervisor ? supervisor : null,
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
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

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

        if (!id || !className || !capacity) {
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
                supervisor: supervisor ? supervisor : null,
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
                { _id: { $in: addedTeachers } },
                { $push: { classes: id } }
            );
        }

        if (removedTeachers?.length > 0) {
            await Teacher.updateMany(
                { _id: { $in: removedTeachers } },
                { $pull: { classes: id } }
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
                { _id: { $in: addedSubjects } },
                { $push: { classes: id } }
            );
        }

        if (removedSubjects?.length > 0) {
            await Subject.updateMany(
                { _id: { $in: removedSubjects } },
                { $pull: { classes: id } }
            );
        }

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: 'Class Update Successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

// Function to delete a class
exports.deleteClass = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Class ID is required!',
            });
        }

        // Check if the class exists
        const existingClass = await Class.findById(_id);

        if (!existingClass) {
            return res.status(404).json({
                success: false,
                message: 'Class not found with the given ID!',
            });
        }

        // Delete the class
        const deletedClass = await Class.findByIdAndDelete(_id);

        // Find and delete students associated with the class
        const deletedStudentIds = await Student.find({ classId: _id }).distinct('_id');
        await Student.deleteMany({ classId: _id });

        // Remove references to the class from related schemas
        await Promise.all([
            Assignment.deleteMany({ classId: _id }),
            Attendance.deleteMany({ classId: _id }),
            Event.updateMany({ classes: _id }, { $pull: { classes: _id } }),
            Exam.updateMany({ classes: _id }, { $pull: { classes: _id } }),
            Result.deleteMany({ classId: _id }),
            Parent.updateMany(
                { students: { $in: deletedStudentIds } },
                { $pull: { students: { $in: deletedStudentIds } } }
            ),
            Subject.updateMany({ classes: _id }, { $pull: { classes: _id } }),
            Teacher.updateMany({ classes: _id }, { $pull: { classes: _id } }),
        ]);

        // Send the successfull response
        return res.status(200).json({
            success: true,
            data: deletedClass,
            message: 'Class deleted successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!',
        });
    }
};

// Function to get all class
exports.getAllClasses = async (req, res) => {
    try {
        const classData = await Class.find()
            .populate({
                path: 'supervisor',
                populate: {
                    path: 'userId'
                }
            })
            .populate({
                path: 'teachers',
                populate: [
                    { path: 'userId' },
                    { path: 'classes' }
                ]
            })
            .populate({
                path: 'subjects',
                populate: {
                    path: 'classes'
                }
            }).sort({ className: 1 });

        return res.status(200).json({
            success: true,
            data: classData,
            message: 'Classes fetched successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!",
        });
    }
}