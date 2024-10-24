const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema(
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
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Excused'],
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);