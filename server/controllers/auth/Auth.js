const mongoose = require('mongoose');
const crypto = require('crypto');
const Teacher = require('../../models/Teacher');
const Student = require('../../models/Student');
const Admin = require('../../models/Admin');
const Parent = require('../../models/Parent');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailSender = require('../../utils/mailSender');
const Class = require('../../models/Class');
const Subject = require('../../models/Subject');
require('dotenv').config();

exports.signUp = async (req, res) => {

    const session = await mongoose.startSession(); // Start a session for transactions

    try {
        session.startTransaction(); // Start the transaction

        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            address,
            role,
            bloodType,
            dateOfBirth,
            sex
        } = req.body;

        // Validate required fields for a user
        if (!firstName || !email || !password || !phone || !address || !role || !sex) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        // Validate role
        if (!['Admin', 'Teacher', 'Student', 'Parent'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified!',
            });
        }

        // Check for existing user by email
        const existingUser = await User.findOne({ email }).session(session);

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already registered. Please login to continue.'
            })
        }

        // Hash password and generate profile image
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate image with the firstName and lastName
        const image = `https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`

        // Create the user
        const user = await User.create(
            [{
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
                photo: image
            }], { session }
        );

        let userResponse;

        // Handle role-specific logic
        if (role === 'Admin') {
            const { adminId } = req.body;

            // Validate adminId
            if (!adminId) {
                throw new Error('Admin ID is required!');
            }

            // Check for existing admin by adminId
            const existingAdminId = await Admin.findOne({ adminId }).session(session);

            if (existingAdminId) {
                throw new Error('Admin ID should be unique!');
            }

            // Create Admin
            userResponse = await Admin.create(
                [{
                    userId: user?._id,
                    adminId
                }], { session }
            );

        } else if (role === 'Teacher') {
            const { teacherId, classes, subjects } = req.body;

            //  Validate teacherId
            if (!teacherId) {
                throw new Error('Teacher ID is required!');
            }

            // Check for existing teacher by teacherId
            const existingTeacherId = await Teacher.findOne({ teacherId }).session(session);

            if (existingTeacherId) {
                throw new Error('Teacher ID should be unique!');
            }

            // Create Teacher
            userResponse = await Teacher.create(
                [{
                    userId: user?._id,
                    teacherId,
                    classes,
                    subjects
                }], { session }
            );

            // Update teachers in Class Schema
            if (classes?.length > 0) {
                await Promise.all(
                    classes.map((classId) =>
                        Class.findByIdAndUpdate(
                            classId,
                            { $push: { teachers: userResponse?._id } },
                            { session }
                        )
                    )
                );
            }

            // Update teachers in Subject Schema
            if (subjects?.length > 0) {
                await Promise.all(
                    subjects.map((subjectId) =>
                        Subject.findByIdAndUpdate(
                            subjectId,
                            { $push: { teachers: userResponse?._id } },
                            { session }
                        )
                    )
                );
            }

        } else if (role === 'Student') {
            const { studentId, classId, fatherName, motherName, subjects, rollNumber } = req.body;

            // Validate required fields for Student
            if (!studentId || !fatherName || !motherName || !rollNumber) {
                throw new Error('Please fill all required student details!');
            }

            // Check for existing student by studentId
            const existingStudentId = await Student.findOne({ studentId }).session(session);

            if (existingStudentId) {
                throw new Error('Student ID should be unique!');
            }

            // Create Student
            userResponse = await Student.create(
                [{
                    userId: user?._id,
                    studentId,
                    classId,
                    fatherName,
                    motherName,
                    subjects,
                    rollNumber,
                }],
                { session }
            );

            // Update the students in Class Schema
            await Class.findByIdAndUpdate(classId,
                { $push: { students: userResponse?._id } },
                { session }
            );

        } else {
            const { parentId, students } = req.body;

            // Validate parentId
            if (!parentId) {
                throw new Error('Parent ID is required!');
            }

            // Check for existing parent by parentId
            const existingParentId = await Parent.findOne({ parentId }).session(session);

            if (existingParentId) {
                throw new Error('Parent ID should be unique!');
            }

            // Create Parent
            userResponse = await Parent.create(
                [{
                    userId: user?._id,
                    parentId,
                    students
                }],
                { session }
            );

            // Update parent in Student Schema
            if (students?.length > 0) {
                await Promise.all(
                    students.map((studentId) =>
                        Student.findByIdAndUpdate(
                            studentId,
                            { parent: userResponse?._id },
                            { session }
                        )
                    )
                );
            }
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // await mailSender(
        //     email,
        //     'Account Creation',
        //     `Your account created successfully on ABCD School Online Portal with email: ${email}`
        // )

        // Send the successfull response
        return res.status(200).json({
            success: true,
            data: userResponse,
            message: 'User registered successfully!'
        })

    } catch (error) {
        // Rollback the transaction in case of error
        await session.abortTransaction();
        session.endSession();

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
                .populate('parent')
                .populate('attendance')
                .populate('subjects')
                .populate('exams')
                .populate('assignments')
            || await Parent.findOne({ parentId: userId })
                .populate('userId')
                .populate('students');

        // If user not found with provided userId
        if (user === null) {
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
            const updatedUser = await User.findByIdAndUpdate(user?.userId._id, { token }, { new: true });

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