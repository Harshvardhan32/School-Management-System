const mongoose = require('mongoose');
const { Schema } = mongoose;

const classSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        capacity: {
            type: Number,
            required: true,
            index: true
        },
        supervisor: {
            type: String,
            ref: 'Teacher'
        },
        teachers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Teacher'
            }
        ],
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Student'
            }
        ],
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Subject',
                required: true
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);