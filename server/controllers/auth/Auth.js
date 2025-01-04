const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Admin = require('../../models/Admin');
const Parent = require('../../models/Parent');
const Teacher = require('../../models/Teacher');
const Student = require('../../models/Student');
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
                message: 'User not found with this ID.',
            })
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
        console.log(error.message);
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
                message: "The password is incorrect!"
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
        console.log(error.message);
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

        const updatedDetails = await User.findOneAndUpdate(
            { email },
            {
                token,
                resetPasswordExpires: Date.now() + 3600000
            },
            { new: true }
        )

        const url = `http://localhost:5173/update-password/${token}`;

        // await mailSender(
        //     email,
        //     "Password Reset",
        //     `<p>Your Link for email verification is ${url}. Please click this url to reset your password.</p>`
        // )

        return res.status(200).json({
            success: true,
            url,
            message: 'Email sent successfully, Please check your email to continue further.'
        })
    } catch (error) {
        console.log(error.message);
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

        console.log("TOken: ", token);

        const userDetails = await User.findOne({ token });

        console.log("USERDETAILS: ", userDetails);

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

        const user = await User.findOneAndUpdate(
            { token },
            { password: encryptedPassword },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.deleteAccount = async (req, res) => {
    try {

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required!"
            });
        }

        const user = await Admin.findOne({ adminId: userId }).populate('userId')
            || await Teacher.findOne({ teacherId: userId }).populate('userId')
            || await Student.findOne({ studentId: userId }).populate('userId')
            || await Parent.findOne({ parentId: userId }).populate('userId');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        console.log("User: ", user?.userId?.role);

        const role = user?.userId?.role;
        let deletedResponse;
        if (role === 'Teacher') {
            await User.findByIdAndDelete(user?.userId?._id);
            deletedResponse = await Teacher.findByIdAndDelete(user?._id);

            // TODO:
            // 1. Delete Assignment Created by the teacher
            // 2. Delete supervisor in the class Schema
            // 3. Delete teachers in the class Schema
            // 4. Delete teachers in the student Schema
        } else if (role === 'Student') {
            await User.findByIdAndDelete(user?.userId?._id);
            deletedResponse = await Student.findByIdAndDelete(user?._id);

            // TODO:
            // 1. Delete student from Attendance Schema
            // 2. Delete students from the Class Schema
            // 3. Delete students from Parent Schema
            // 4. Delete student from Result Schema

        } else if (role === 'Parent') {
            await User.findByIdAndDelete(user?.userId?._id);
            deletedResponse = await Teacher.findByIdAndDelete(user?._id);

            // TODO:
            // 1. Delete Parent from the Parent Schema
            // 2. Delete parent from the Student Schema
            // 1. Delete Parent from the Parent Schema
            // 1. Delete Parent from the Parent Schema
        }

        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!",
        });
    }
}