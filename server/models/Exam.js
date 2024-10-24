const mongoose = require('mongoose');
const { Schema } = mongoose;

const examSchema = new Schema(
    {
        examName: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        description: {
            type: String,
            required: true,
            index: true
        },
        date: {
            type: Date,
            required: true,
        },
        class: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Class',
                required: true
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);