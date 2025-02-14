const mongoose = require('mongoose');
const { Schema } = mongoose;

const parentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        parentId: {
            type: String,
            required: true,
            unique: true
        },
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Student',
                index: true
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Parent', parentSchema);