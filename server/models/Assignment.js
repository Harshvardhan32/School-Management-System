const mongoose = require('mongoose');
const {Schema} = mongoose;

const assignmentSchema = new Schema(
    {
        title: {
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
        assignedDate: {
            type: Date,
            required: true,
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
        class: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Class',
                required: true
            }
        ],
        subject: {
            type: Schema.Types.ObjectId,
            ref: 'Subject',
            required: true
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);