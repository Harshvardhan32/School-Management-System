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
            }
        ],
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Subject',
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);