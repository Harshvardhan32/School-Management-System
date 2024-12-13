const mongoose = require('mongoose');
const { Schema } = mongoose;

const subjectSchema = new Schema(
    {
        subjectName: {
            type: String,
            required: true,
            index: true
        },
        classes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Class',
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