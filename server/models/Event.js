const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            index: true
        },
        content: {
            type: String,
            required: true,
            index: true
        },
        classId: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Class'
            }
        ],
        startDate: {
            type: Date,
            required: true,
            index: true
        },
        endDate: {
            type: Date,
            required: true,
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);