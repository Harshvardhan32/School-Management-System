const mongoose = require('mongoose');
const { Schema } = mongoose;

const lessonSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoos.model('Lesson', lessonSchema);