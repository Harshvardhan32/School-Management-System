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
        class: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Class'
            }
        ],
        startTime: {
            type: Date,
            required: true,
            index: true
        },
        startTime: {
            type: Date,
            required: true,
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);