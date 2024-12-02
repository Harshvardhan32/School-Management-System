const mongoose = require('mongoose');
const { Schema } = mongoose;

const examSchema = new Schema(
    {
        examName: {
            type: String,
            required: true,
            index: true
        },
        description: {
            type: String,
            required: true,
            index: true
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        classes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Class',
                required: true
            }
        ],
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Subject',
                required: true
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);