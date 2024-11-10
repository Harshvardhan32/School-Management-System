const Teacher = require('../../models/Teacher');
const Student = require('../../models/Student');
const Admin = require('../../models/Admin');
const Parent = require('../../models/Parent');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mailSender = require('../../utils/mailSender');
require('dotenv').config();

exports.signUp = async (req, res) => {

    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            phone,
            address,
            role,
            bloodType,
            dateOfBirth,
            sex,
            photo
        } = req.body;

        if (!firstName || !email || !password || !confirmPassword || !phone || !address || !role || !sex) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and Confirm Password do not match. Please try again.'
            })
        }

        if (role !== 'Admin' || role !== 'Teacher' || role !== 'Student' || role !== 'Parent') {
            return res.status(400).json({
                success: false,
                message: "Invalid role specified!"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already registered. Please login to continue.'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const image = photo ? photo : `https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            address,
            role,
            bloodType,
            dateOfBirth,
            sex,
            profilePhoto: image
        });

        let userResponse = {};
        if (role === 'Admin') {
            const { adminId } = req.body;

            if (!adminId) {
                return res.status(400).json({
                    success: false,
                    message: 'Admin ID is required!'
                })
            }

            const existingAdminId = await Parent.findOne({ adminId });
            if (existingAdminId) {
                await User.findByIdAndDelete(user?._id);
                return res.status(400).json({
                    success: false,
                    message: 'Admin ID should be unique!'
                })
            }

            const adminRecord = await Admin.create({
                userId: user?._id,
                adminId
            });

            userResponse = await Admin.findById(adminRecord?._id).populate('userId');
        } else if (role === 'Teacher') {
            const { teacherId } = req.body;

            if (!teacherId) {
                return res.status(400).json({
                    success: false,
                    message: 'Teacher ID is required!'
                })
            }

            const existingTeacherId = await Teacher.findOne({ teacherId });
            if (existingTeacherId) {
                await User.findByIdAndDelete(user?._id);
                return res.status(400).json({
                    success: false,
                    message: 'Teacher ID should be unique!'
                })
            }

            const teacherRecord = await Teacher.create({
                userId: user?._id,
                teacherId
            });

            userResponse = await Teacher.findById(teacherRecord?._id).populate('userId');
        } else if (role === 'Student') {
            const { studentId, classId, fatherName, motherName, rollNumber } = req.body;

            if (!studentId || !fatherName || !motherName || !rollNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Please fill all required details!'
                })
            }

            const existingStudentId = await Student.findOne({ studentId });
            if (existingStudentId) {
                await User.findByIdAndDelete(user?._id);
                return res.status(400).json({
                    success: false,
                    message: 'Student ID should be unique!'
                })
            }

            const studentRecord = await Student.create({
                userId: user?._id,
                studentId,
                classId,
                fatherName,
                motherName,
                rollNumber,
            });

            userResponse = await Student.findById(studentRecord?._id).populate('userId');
        } else {
            const { parentId } = req.body;

            if (!parentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Parent ID is required!'
                })
            }

            const existingParentId = await Parent.findOne({ parentId });
            if (existingParentId) {
                await User.findByIdAndDelete(user?._id);
                return res.status(400).json({
                    success: false,
                    message: 'Parent ID should be unique!'
                })
            }

            const parentRecord = await Parent.create({
                userId: user?._id,
                parentId,
            });

            userResponse = await Parent.findById(parentRecord?._id).populate('userId');
        }

        // await mailSender(
        //     email,
        //     'Account Creation',
        //     `Your account created successfully on ABCD School Online Portal with email: ${email}`
        // )

        return res.status(200).json({
            success: true,
            data: userResponse,
            message: 'User registered successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.login = async (req, res) => {

    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const user = await Admin.findOne({ adminId: userId }).populate('userId')
            || await Teacher.findOne({ teacherId: userId }).populate('userId')
            || await Student.findOne({ studentId: userId }).populate('userId')
            || await Parent.findOne({ parentId: userId }).populate('userId');

        if (user === null) {
            return res.status(400).json({
                success: false,
                message: 'User not found with this ID.',
            })
        }

        // Generate JWT token and Compare Password
        if (await bcrypt.compare(password, user?.userId?.password)) {
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
            user.token = token;
            user.password = undefined;

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
        const updatedUserDetails = await User.findByIdAndUpdate(userId, { password: encryptedPassword }, { new: true });

        // TODO: Send password change email

        return res.status(200).json({
            success: true,
            data: updatedUserDetails,
            message: "Password updated successfully!"
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

        console.log("User: ", user);
        const deleteUser = await User.findByIdAndDelete(user?.userId?._id);
        console.log("Delete User: ", deleteUser);

        let deletedResponse;
        if (user?.userId?.role === 'Admin') {
            deletedResponse = await Admin.findByIdAndDelete(user?._id);
        } else if (user?.userId?.role === 'Teacher') {
            deletedResponse = await Teacher.findByIdAndDelete(user?._id);
        } else if (user?.userId?.role === 'Student') {
            deletedResponse = await Student.findByIdAndDelete(user?._id);
        } else {
            deletedResponse = await Parent.findByIdAndDelete(user?._id);
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