const mongoose = require('mongoose');
const { Schema } = mongoose;

const gradeSchema = new Schema(
    {
        // student: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Student',
        //     required: true
        // },
        // subject: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Subject',
        //     required: true
        // },
        // exam: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Exam',
        //     required: true
        // },
        // score: {
        //     type: Number,
        //     required: true
        // },
        grade: {
            type: String,
            enum: ['A', 'B', 'C'],
            required: true
        },
        remarks: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Grade', gradeSchema);