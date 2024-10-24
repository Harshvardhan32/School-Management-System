const mongoose = require('mongoose');
const { Schema } = mongoose;

const teacherSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        teacherId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        classes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Class",
            }
        ],
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Subject",
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);