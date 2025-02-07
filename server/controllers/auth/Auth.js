const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Admin = require('../../models/Admin');
const Parent = require('../../models/Parent');
const Teacher = require('../../models/Teacher');
const Student = require('../../models/Student');
const mailSender = require('../../utils/mailSender');
const { resetPasswordEmail } = require('../../mail/templates/resetPasswordEmail');
require('dotenv').config();

exports.login = async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        // Find user with provided userId
        const user = await Admin.findOne({ adminId: userId })
            .populate('userId')
            || await Teacher.findOne({ teacherId: userId })
                .populate('userId')
                .populate('classes')
                .populate('subjects')
            || await Student.findOne({ studentId: userId })
                .populate('userId')
                .populate('classId')
            || await Parent.findOne({ parentId: userId })
                .populate('userId')
                .populate({
                    path: "students",
                    populate: [
                        { path: "userId" },
                        { path: "classId" }
                    ]
                });

        // If user not found with provided userId
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User ID is incorrect.',
            });
        }

        // Generate JWT token and Compare Password
        if (await bcrypt.compare(password, user?.userId.password)) {
            const token = jwt.sign(
                {
                    email: user?.userId?.email,
                    id: user?.userId?._id,
                    role: user?.userId?.role,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '24h'
                }
            )

            // Save token to user document in database
            const updatedUser = await User.findByIdAndUpdate(user?.userId._id,
                { token }, { new: true });

            updatedUser.password = undefined;
            user.token = token;
            user.userId = updatedUser;

            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                data: user,
                message: 'User login successfully!'
            })
        } else {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;

        if (!userId || !oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const userDetails = await User.findById(userId);

        // Validate old password
        const isPasswordMatched = await bcrypt.compare(oldPassword, userDetails?.password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect!"
            });
        }

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        const updatedUserDetails = await User.findByIdAndUpdate(userId,
            { password: encryptedPassword },
            { new: true });

        // TODO: Send password change email

        return res.status(200).json({
            success: true,
            data: updatedUserDetails,
            message: "Password Updated Successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!",
        });
    }
}

exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `This Email: ${email} is not Registered With Us, Please Enter a Valid Email.`,
            });
        }

        const token = crypto.randomBytes(20).toString("hex");

        await User.findOneAndUpdate(
            { email },
            {
                token,
                resetPasswordExpires: Date.now() + 600000
            });

        const url = `http://localhost:5173/update-password/${token}`;

        await mailSender(
            email,
            'Reset Your Password',
            resetPasswordEmail(url)
        );

        return res.status(201).json({
            success: true,
            message: 'Email sent successfully, Please check your email to continue further.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {

        const { password, confirmPassword, token } = req.body;

        if (confirmPassword !== password) {
            return res.status(400).json({
                success: false,
                message: 'Password and Confirm Password do not match. Please try again.'
            });
        }

        const userDetails = await User.findOne({ token });

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "Token is Invalid",
            });
        }

        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success: false,
                message: 'Token is Expired, Please Regenerate Your Token.'
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            { token },
            { password: encryptedPassword }
        );

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully!'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}