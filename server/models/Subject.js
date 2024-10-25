const mongoose = require('mongoose');
const { Schema } = mongoose;

const subjectSchema = new Schema(
    {
        subjectName: {
            type: String,
            required: true,
            index: true
        },
        class: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Class',
                required: true
            }
        ],
        teacher: {
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);