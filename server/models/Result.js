const mongoose = require('mongoose');
const { Schema } = mongoose;

const resultSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        classId: {
            type: Schema.Types.ObjectId,
            ref: 'Class',
            required: true
        },
        subjectResults: [
            {
                subject: {
                    type: Schema.Types.ObjectId,
                    ref: 'Subject',
                    required: true
                },
                examResults: [
                    {
                        exam: {
                            type: Schema.Types.ObjectId,
                            ref: 'Exam',
                            required: true
                        },
                        score: {
                            type: String,
                            required: true
                        },
                        maxScore: {
                            type: String,
                            required: true
                        },
                        percentage: {
                            type: String,
                            required: true
                        },
                        grade: {
                            type: String,
                            enum: ['A', 'B', 'C', 'D', 'E', 'F'],
                            required: true
                        }
                    }
                ],
                subjectGrade: {
                    type: String,
                    enum: ['A', 'B', 'C', 'D', 'E', 'F'],
                    required: true
                }
            }
        ],
        overallPercentage: {
            type: String,
            required: true
        },
        remarks: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);