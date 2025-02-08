const Exam = require('../../models/Exam');
const Result = require('../../models/Result');
const Student = require('../../models/Student');

exports.createExam = async (req, res) => {
    try {
        const {
            examName,
            description,
            startDate,
            endDate,
            classes,
            subjects
        } = req.body;

        if (!examName || !description || !startDate || !endDate || !classes || !subjects) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const examResponse = await Exam.create({
            examName,
            description,
            startDate,
            endDate,
            classes,
            subjects
        });

        // Update student - exam relationships
        if (classes?.length > 0) {
            await Student.updateMany(
                { classId: { $in: classes } }, // Match all students with classId in the provided classes array
                { $push: { exams: examResponse._id } } // Push the exam ID to the exams array
            );
        }

        return res.status(201).json({
            success: true,
            data: examResponse,
            message: 'Exam created successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.updateExam = async (req, res) => {
    try {
        const {
            id,
            examName,
            description,
            startDate,
            endDate,
            classes,
            subjects
        } = req.body;

        if (!id || !examName || !description || !startDate || !endDate || !classes || !subjects) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        // Check for existing Exam by id
        const existingExam = await Exam.findById(id);

        if (!existingExam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found with the given ID!'
            })
        }

        const updatedResponse = await Exam.findByIdAndUpdate(id,
            {
                examName,
                description,
                startDate,
                endDate,
                classes,
                subjects
            },
            { new: true });

        // Handle added and removed classes
        const addedClasses = classes.filter(classId => !existingExam.classes.includes(classId));

        const removedClasses = existingExam.classes.filter(classId => !classes.includes(classId));

        // Handle added classes
        if (addedClasses.length > 0) {
            await Student.updateMany(
                { classId: { $in: addedClasses } }, // Match any student whose classId is in addedClasses
                { $push: { exams: id } } // Add the exam ID to their exams array
            );
        }

        // Handle removed classes
        if (removedClasses.length > 0) {
            await Student.updateMany(
                { classId: { $in: removedClasses } }, // Match any student whose classId is in removedClasses
                { $pull: { exams: id } } // Remove the exam ID from their exams array
            );
        }

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: 'Exam Updated Successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.deleteExam = async (req, res) => {
    try {

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Exam ID is required!'
            })
        }

        // Fetch the existing Exam
        const existingExam = await Exam.findById(_id);

        if (!existingExam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found with the given ID!'
            });
        }

        // Delete the Exam
        const deletedResponse = await Exam.findByIdAndDelete(_id);

        // Remove Exam From Students' records
        if (existingExam?.classes.length > 0) {
            await Student.updateMany(
                { classId: { $in: existingExam.classes } },
                { $pull: { exams: _id } }
            );
        }

        // Remove Exam from Results
        await Result.updateMany(
            { "subjectResults.examResults.exam": _id },
            {
                $pull: {
                    "subjectResults.$[].examResults": { exam: _id }
                }
            }
        );

        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: 'Exam deleted successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.getAllExams = async (req, res) => {
    try {
        const examData = await Exam.find()
            .populate({
                path: 'subjects',
                populate: {
                    path: 'classes'
                }
            })
            .populate('classes').sort({ examName: 1 });

        return res.status(200).json({
            success: true,
            data: examData,
            message: 'Exams fetched successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!',
        });
    }
}