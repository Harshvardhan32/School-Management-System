const mongoose = require('mongoose');
const Result = require('../../models/Result');

// Function to create result 
exports.createResult = async (req, res) => {
    try {
        const {
            student,
            classId,
            subjectResults,
            overallPercentage,
            remarks
        } = req.body;

        // Top-level validation
        if (!student || !classId || !subjectResults || !overallPercentage) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            });
        }

        // Convert student and classId to ObjectId
        const studentId = new mongoose.Types.ObjectId(student);
        const classObjId = new mongoose.Types.ObjectId(classId);

        // Validate and process each item in subjectResults array
        const processedSubjectResults = subjectResults?.map(subjectResult => {
            const { subject, examResults, finalGrade } = subjectResult;

            let subjectObjId;
            try {
                subjectObjId = new mongoose.Types.ObjectId(subject);
            } catch (error) {
                throw new Error(`Invalid Subject ID: ${subject}`);
            }

            const processedExamResults = examResults?.map(examResult => {
                const { exam, score, maxScore, percentage, grade } = examResult;

                let examObjId;
                try {
                    examObjId = new mongoose.Types.ObjectId(exam);
                } catch (error) {
                    throw new Error(`Invalid Exam ID: ${exam}`);
                }

                return {
                    exam: examObjId,
                    score,
                    maxScore,
                    percentage,
                    grade
                };
            });

            return {
                subject: subjectObjId,
                examResults: processedExamResults,
                finalGrade
            };
        });

        // Create the result record
        const resultResponse = await Result.create({
            student: studentId,
            classId: classObjId,
            subjectResults: processedSubjectResults,
            overallPercentage,
            remarks
        });

        return res.status(200).json({
            success: true,
            data: resultResponse,
            message: "Result created successfully!"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
};

// TODO: Function to update result
exports.updateResult = async (req, res) => {
    try {

        const {
            resultId,
            student,
            classId,
            subjectName,
            teacher,
            lessons
        } = req.body;

        if (!resultId) {
            return res.status(400).json({
                success: false,
                message: "Result ID is required!"
            })
        }

        const resultData = await Result.findById(resultId);

        if (!resultData) {
            return res.status(404).json({
                success: false,
                message: 'Result not found with the given ID!'
            })
        }

        const updatedResponse = await Result.findByIdAndUpdate(resultId,
            {
                subjectName,
                classId,
                teacher,
                lessons
            }, { new: true })
        // .populate('student')
        // .populate('classId')
        // .populate('subjectResults.subject')
        // .populate('subjectResults.examResults.exam');

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: "Subject updated successfully!"
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

// Function to delete result
exports.deleteResult = async (req, res) => {
    try {

        const { subjectId } = req.body;

        if (!subjectId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const deletedResponse = await Subject.findByIdAndDelete(subjectId);

        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: "Subject deleted successfully!"
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

// Function to get a result
exports.getResult = async (req, res) => {
    try {

        const { resultId } = req.body;

        if (!resultId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const resultResponse = await Result.findById(resultId).populate('student').populate('classId').exec();

        return res.status(200).json({
            success: true,
            data: resultResponse,
            message: "Subject fetched successfully!"
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

// Function to get all result
exports.getAllResult = async (req, res) => {
    try {

        const allResults = await Result.find()
        // .populate('student')
        // .populate('classId')
        // .populate('subjectResults.subject')
        // .populate('subjectResults.examResults.exam');

        return res.status(200).json({
            success: true,
            data: allResults,
            message: "All results fetched successfully!"
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