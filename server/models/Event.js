const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema(
    {
        eventName: {
            type: String,
            required: true,
            index: true
        },
        eventDescription: {
            type: String,
            required: true,
            index: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);