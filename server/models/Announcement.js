const mongoose = require('mongoose');
const { Schema } = mongoose;

const announcementSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        content: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);