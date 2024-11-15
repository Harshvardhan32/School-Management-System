const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = new Schema(
    {
        subject: {
            type: Schema.Types.ObjectId,
            ref: 'Subject',
            required: true
        },
        classId: {
            type: Schema.Types.ObjectId,
            ref: 'Class',
            required: true
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true
        },
        assignedDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        dueDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value >= this.assignedDate;
                },
                message: props => `dueDate (${props.value}) should be later than or equal to assignedDate (${this.assignedDate})`
            }
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);