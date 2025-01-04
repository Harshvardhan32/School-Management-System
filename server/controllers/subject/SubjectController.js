const Assignment = require('../../models/Assignment');
const Class = require('../../models/Class');
const Exam = require('../../models/Exam');
const Result = require('../../models/Result');
const Student = require('../../models/Student');
const Subject = require('../../models/Subject');
const Teacher = require('../../models/Teacher');

exports.createSubject = async (req, res) => {
    try {

        const { subjectName, classes, teachers, lessons } = req.body;

        if (!subjectName || !classes) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const subjectResponse = await Subject.create({
            subjectName,
            classes,
            teachers,
            lessons
        });

        // Update subjects in Class Schema
        if (classes?.length > 0) {
            await Promise.all(
                classes.map((classId) =>
                    Class.findByIdAndUpdate(
                        classId,
                        { $push: { subjects: subjectResponse?._id } }
                    )
                )
            );
        }

        // Update subjects in Teacher Schema
        if (teachers?.length > 0) {
            await Promise.all(
                teachers.map((teacherId) =>
                    Teacher.findByIdAndUpdate(
                        teacherId,
                        { $push: { subjects: subjectResponse?._id } }
                    )
                )
            );
        }

        return res.status(200).json({
            success: true,
            data: subjectResponse,
            message: "Subject Created Successfully!"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.updateSubject = async (req, res) => {
    try {

        const {
            id,
            subjectName,
            classes,
            teachers,
            lessons
        } = req.body;

        if (!id || !subjectName || !classes) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        // Check for existing Subject by id
        const existingSubject = await Subject.findById(id);

        if (!existingSubject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found with the given ID!'
            })
        }

        const updatedResponse = await Subject.findByIdAndUpdate(id,
            {
                subjectName,
                classes,
                teachers,
                lessons
            }, { new: true });

        // Handle added and removed classes
        const addedClasses = classes.filter(classId => !existingSubject.classes.includes(classId));

        const removedClasses = existingSubject.classes.filter(classId => !classes.includes(classId));

        // Update class relationships
        if (addedClasses?.length > 0) {
            await Class.updateMany(
                { _id: { $in: addedClasses } },
                { $push: { subjects: id } }
            );
        }

        if (removedClasses?.length > 0) {
            await Class.updateMany(
                { _id: { $in: removedClasses } },
                { $pull: { subjects: id } }
            );
        }

        // Handle added and removed classes
        const addedTeachers = teachers.filter(teacherId => !existingSubject.teachers.includes(teacherId));

        const removedTeachers = existingSubject.teachers.filter(teacherId => !teachers.includes(teacherId));

        // Update teacher relationships
        if (addedTeachers?.length > 0) {
            await Teacher.updateMany(
                { _id: { $in: addedTeachers } },
                { $push: { subjects: id } }
            );
        }

        if (removedTeachers?.length > 0) {
            await Teacher.updateMany(
                { _id: { $in: removedTeachers } },
                { $pull: { subjects: id } }
            );
        }

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: "Subject Updated Successfully!"
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.deleteSubject = async (req, res) => {
    try {

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Subject ID is required!"
            })
        }

        // Check if the subject exists
        const existingSubject = await Subject.findById(_id);

        if (!existingSubject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found with the given ID!',
            });
        }

        // Delete the subject
        const deletedSubject = await Subject.findByIdAndDelete(_id);

        await Promise.all([
            Assignment.deleteMany({ subject: _id }),
            Class.updateMany(
                { subjects: _id },
                { $pull: { subjects: _id } }
            ),
            Exam.updateMany(
                { subjects: _id },
                { $pull: { subjects: _id } }
            ),
            Result.updateMany(
                { 'subjectResults.subject': _id },
                { $pull: { subjectResults: { subject: _id } } }
            ),
            Student.updateMany(
                { subjects: _id },
                { $pull: { subjects: _id } }
            ),
            Teacher.updateMany(
                { subjects: _id },
                { $pull: { subjects: _id } }
            ),
        ])

        return res.status(200).json({
            success: true,
            data: deletedSubject,
            message: "Subject Deleted Successfully!"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.getAllSubjects = async (req, res) => {

    try {
        const subjectData = await Subject.find()
            .populate('classes')
            .populate({
                path: 'teachers',
                populate: {
                    path: 'userId'
                }
            })
            .populate('lessons').sort({ subjectName: 1 });

        return res.status(200).json({
            success: true,
            data: subjectData,
            message: "Subjects fetched successfully!",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!",
        });
    }
}