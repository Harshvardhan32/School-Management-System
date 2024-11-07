const mongoose = require('mongoose');
const { Schema } = mongoose;

const resultSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        class: {
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
                            type: Number,
                            required: true
                        },
                        maxScore: {
                            type: Number,
                            required: true
                        },
                        percentage: {
                            type: Number,
                            required: true
                        },
                        grade: {
                            type: Schema.Types.ObjectId,
                            required: true
                        }
                    }
                ],
                finalGrade: {
                    type: String,
                    required: true
                }
            }
        ],
        overallPercentage: {
            type: Number,
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