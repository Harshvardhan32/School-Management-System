const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema(
    {
        date: {
            type: Date,
            required: true
        },
        studentAttendance: [
            {
                student: {
                    type: Schema.Types.ObjectId,
                    ref: 'Student',
                    required: true
                },
                status: {
                    type: String,
                    enum: ['Present', 'Absent'],
                },
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);