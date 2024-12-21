const mongoose = require('mongoose');
const { Schema } = mongoose;

const calendarSchema = new Schema(
    {
        classId: {
            type: Schema.Types.ObjectId,
            ref: 'Class',
            required: true
        },
        dayOfWeek: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        schedule: [
            {
                type: {
                    type: String,
                    enum: ['class', 'break'],
                    required: true
                },
                subject: {
                    type: Schema.Types.ObjectId,
                    ref: 'Subject'
                },
                teacher: {
                    type: Schema.Types.ObjectId,
                    ref: 'Teacher'
                },
                startTime: {
                    type: String,
                    required: true
                },
                endTime: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Calendar', calendarSchema);