const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        studentId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        classId: {
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
            index: true
        },
        attendance: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Attendance',
                index: true
            }
        ],
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Subject',
                index: true
            }
        ],
        rollNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        exams: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Exam',
                index: true
            }
        ],
        assignments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Assignment',
                index: true
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);