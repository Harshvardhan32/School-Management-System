const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: Number,
            required: true
        },
        role: {
            type: String,
            enum: ['Admin', 'Teacher', 'Student', 'Parent'],
            required: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        bloodType: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        sex: {
            type: String,
            required: true
        },
        profilePhoto: {
            type: String,
            trim: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);