const mongoose = require('mongoose');
const { Schema } = mongoose;

const subjectSchema = new Schema(
    {
        subjectName: {
            type: String,
            required: true,
            index: true
        },
        classId: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Class',
                required: true
            }
        ],
        teachers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Teacher'
            }
        ],
        lessons: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Lesson'
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);