const mongoose = require('mongoose');
const { Schema } = mongoose;

const classSchema = new Schema(
    {
        className: {
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
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
        },
        teachers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Teacher'
            }
        ],
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Subject'
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);