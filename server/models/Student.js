const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        studentId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        class: {
            type: Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
            index: true
        },
        fatherName: {
            type: String,
            required: true,
        },
        motherName: {
            type: String,
            required: true,
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Parent',
        },
        attendance: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Attendance'
            }
        ],
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Subject',
                required: true
            }
        ],
        rollNumber: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        exams: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Exam'
            }
        ],
        assignments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Assignment'
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);