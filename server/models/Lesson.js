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
        },
        subject: {
            type: Schema.Types.ObjectId,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);