const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        adminId: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);