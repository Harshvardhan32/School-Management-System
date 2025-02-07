const mongoose = require('mongoose');
const Result = require('../../models/Result');
const Student = require('../../models/Student');

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

        const existingData = await Result.findOne({ student });

        if (existingData) {
            return res.status(400).json({
                success: false,
                message: 'Student result already exist!'
            })
        }

        // Convert student and classId to ObjectId
        const studentId = new mongoose.Types.ObjectId(student);
        const classObjId = new mongoose.Types.ObjectId(classId);

        // Validate and process each item in subjectResults array
        const processedSubjectResults = subjectResults?.map(subjectResult => {
            const { subject, examResults, subjectGrade } = subjectResult;

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
                subjectGrade
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

        await Student.findByIdAndUpdate(student, { results: resultResponse._id });

        return res.status(201).json({
            success: true,
            data: resultResponse,
            message: "Result created successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

// Function to update result
exports.updateResult = async (req, res) => {
    try {
        const {
            id,
            student,
            classId,
            subjectResults,
            overallPercentage,
            remarks
        } = req.body;

        if (!id || !student || !classId || !subjectResults || !overallPercentage) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            });
        }

        const existingResult = await Result.findById(id);
        if (!existingResult) {
            return res.status(404).json({
                success: false,
                message: 'Result not found with the given ID!'
            });
        }

        const existingSubjects = existingResult.subjectResults.map(sr => sr.subject.toString());
        const newSubjects = subjectResults.map(sr => sr.subject);

        const removedSubjects = existingSubjects.filter(subject => !newSubjects.includes(subject));
        const addedSubjects = subjectResults.filter(sr => !existingSubjects.includes(sr.subject));

        const bulkOps = [];

        // Remove subjects
        if (removedSubjects.length) {
            bulkOps.push({
                updateOne: {
                    filter: { _id: id },
                    update: { $pull: { subjectResults: { subject: { $in: removedSubjects } } } }
                }
            });
        }

        // Add new subjects
        if (addedSubjects.length) {
            addedSubjects.forEach(({ subject, examResults, subjectGrade }) => {
                const subjectObjId = new mongoose.Types.ObjectId(subject);
                const processedExamResults = examResults?.map(({ exam, score, maxScore, percentage, grade }) => ({
                    exam: new mongoose.Types.ObjectId(exam),
                    score,
                    maxScore,
                    percentage,
                    grade
                }));

                bulkOps.push({
                    updateOne: {
                        filter: { _id: id },
                        update: { $push: { subjectResults: { subject: subjectObjId, examResults: processedExamResults, subjectGrade } } }
                    }
                });
            });
        }

        // Overwrite examResults and subjectGrade for existing subjects
        subjectResults.forEach(subjectResult => {
            const existingSubject = existingResult.subjectResults.find(sr => sr.subject.toString() === subjectResult.subject);
            if (existingSubject) {
                // Overwrite the entire examResults array for the subject and update subjectGrade
                bulkOps.push({
                    updateOne: {
                        filter: { _id: id, "subjectResults.subject": subjectResult.subject },
                        update: {
                            $set: {
                                "subjectResults.$.examResults": subjectResult.examResults.map(({ exam, score, maxScore, percentage, grade }) => ({
                                    exam: new mongoose.Types.ObjectId(exam),
                                    score,
                                    maxScore,
                                    percentage,
                                    grade
                                })),
                                "subjectResults.$.subjectGrade": subjectResult.subjectGrade  // Update subjectGrade
                            }
                        }
                    }
                });
            }
        });

        // Update top-level fields
        bulkOps.push({
            updateOne: {
                filter: { _id: id },
                update: {
                    student: new mongoose.Types.ObjectId(student),
                    classId: new mongoose.Types.ObjectId(classId),
                    overallPercentage,
                    remarks
                }
            }
        });

        // Execute all operations in a batch
        await Result.bulkWrite(bulkOps);

        // Populate and return updated result
        const updatedResult = await Result.findById(id)
            .populate('student')
            .populate('classId')
            .populate('subjectResults.subject')
            .populate('subjectResults.examResults.exam');

        return res.status(200).json({
            success: true,
            data: updatedResult,
            message: "Result updated successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

// Function to delete result
exports.deleteResult = async (req, res) => {
    try {

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Result ID is required!"
            })
        }

        // Check if the class exists
        const existingResult = await Result.findById(_id);

        if (!existingResult) {
            return res.status(404).json({
                success: false,
                message: 'Result not found with the given ID!',
            });
        }

        // Delete the Result
        const deletedResult = await Result.findByIdAndDelete(_id);

        await Student.findByIdAndUpdate(deletedResult._id,
            { result: null }
        );

        return res.status(200).json({
            success: true,
            data: deletedResult,
            message: "Subject deleted successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

// Function to get a result
exports.getResult = async (req, res) => {
    try {

        const resultId = req.query.resultId;

        if (!resultId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const resultResponse = await Result.findById(resultId)
            .populate({
                path: 'student',
                populate: {
                    path: 'userId'
                }
            })
            .populate('classId')
            .populate({
                path: 'subjectResults.subject',
                strictPopulate: false  // Allow population of non-schema paths
            })
            .populate({
                path: 'subjectResults.examResults.exam',
                strictPopulate: false  // Allow population of non-schema paths
            });

        return res.status(200).json({
            success: true,
            data: resultResponse,
            message: "Subject fetched successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

// Function to get all result
exports.getAllResult = async (req, res) => {
    try {

        const resultData = await Result.find()
            .populate({
                path: 'student',
                populate: {
                    path: 'userId'
                }
            })
            .populate('classId')
            .populate('subjectResults.subject')
            .populate('subjectResults.examResults.exam');

        // Sort the results based on `student.userId.firstName`
        resultData.sort((a, b) => {
            const nameA = a.student?.userId?.firstName?.toLowerCase() || '';
            const nameB = b.student?.userId?.firstName?.toLowerCase() || '';
            return nameA.localeCompare(nameB);
        });

        return res.status(200).json({
            success: true,
            data: resultData,
            message: "Results fetched successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!",
        });
    }
}