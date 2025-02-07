const bcrypt = require('bcryptjs');
const User = require("../../models/User");
const Class = require("../../models/Class");
const Parent = require("../../models/Parent");
const Result = require("../../models/Result");
const Student = require("../../models/Student");
const mailSender = require("../../utils/mailSender");
const Attendance = require("../../models/Attendance");
const { userCredentialsEmail } = require("../../mail/templates/userCredentialsEmail");
require('dotenv').config();

exports.createStudent = async (req, res) => {
    try {
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
            sex,
            remarks,
            studentId,
            classId,
            fatherName,
            motherName,
            parent,
            subjects,
            rollNumber
        } = req.body;

        // Validate required fields for a user
        if (!firstName || !email || !password || !phone || !address || !role || !sex || !studentId || !fatherName || !motherName || !rollNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            });
        }

        // Check for existing user by email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already registered. Please login to continue.'
            });
        }

        // Check for existing student by studentId
        const existingStudentId = await Student.findOne({ studentId });

        if (existingStudentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID should be unique!'
            });
        }

        // Hash password and generate profile image
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate image with the firstName and lastName
        const image = `https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`;

        // Create the user
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
            remarks,
            photo: image
        });

        // Create Student
        const userResponse = await Student.create({
            userId: user?._id,
            studentId,
            classId,
            fatherName,
            motherName,
            parent: parent !== '' ? parent : null,
            subjects,
            rollNumber,
        });

        // Update the students in Class Schema
        await Class.findByIdAndUpdate(classId, { $push: { students: userResponse?._id } });

        await mailSender(
            email,
            'Welcome to ABCD School: Your Login Credentials',
            userCredentialsEmail(
                'ABCD School',
                firstName + ' ' + lastName,
                email,
                studentId,
                password,
                'http://localhost:5173/',
                'support@abcdschool.com'
            )
        );

        // Send the successful response
        return res.status(201).json({
            success: true,
            data: userResponse,
            message: 'Student registered successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

exports.updateStudent = async (req, res) => {
    try {
        const {
            id,
            firstName,
            lastName,
            email,
            phone,
            address,
            bloodType,
            dateOfBirth,
            sex,
            remarks,
            studentId,
            classId,
            fatherName,
            motherName,
            parent,
            subjects,
            rollNumber,
        } = req.body;

        // Validate required fields for a user
        if (!id || !firstName || !email || !phone || !address || !sex || !studentId || !classId || !fatherName || !motherName || !rollNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            });
        }

        // Check for existing Student by id
        const existingStudent = await Student.findById(id).populate('userId');

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found with the id!'
            });
        }

        if (email !== existingStudent?.userId.email) {
            // Check for existing user by email
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already registered with this email.'
                });
            }
        }

        // Update user profile
        await User.findByIdAndUpdate(existingStudent.userId._id,
            {
                firstName,
                lastName,
                email,
                phone,
                address,
                bloodType,
                dateOfBirth,
                sex,
                remarks
            });

        // Update Student
        const updatedStudent = await Student.findByIdAndUpdate(id,
            {
                studentId,
                classId,
                fatherName,
                motherName,
                parent: parent !== '' ? parent : null,
                subjects,
                rollNumber,
            },
            { new: true })
            .populate('userId')
            .populate('classId');

        // if existing Student classId is not similar to fetched classId
        if (existingStudent?.classId.toString() !== classId) {
            await Class.findByIdAndUpdate(classId,
                { $push: { students: id } }
            );

            await Class.findByIdAndUpdate(existingStudent.classId,
                { $pull: { students: id } }
            )
        }

        // Handle parent changes
        if (parent !== '' && existingStudent.parent && existingStudent.parent.toString() !== parent) {
            await Parent.findByIdAndUpdate(parent,
                { $push: { students: id } }
            );

            if (existingStudent.parent) {
                await Parent.findByIdAndUpdate(existingStudent.parent,
                    { $pull: { students: id } }
                )
            }
        }

        // Send the successful response
        return res.status(200).json({
            success: true,
            data: updatedStudent,
            message: 'Student updated successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

exports.deleteStudent = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required!"
            })
        }

        // Check if the student exists
        const existingStudent = await Student.findById(_id);

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found with the given ID!',
            });
        }

        // Delete student profile
        await User.findByIdAndDelete(existingStudent.userId);

        // Delete the student
        const deletedStudent = await Student.findByIdAndDelete(_id);

        await Promise.all([
            Attendance.updateMany(
                { 'studentAttendance.student': _id },
                { $pull: { studentAttendance: { student: _id } } }
            ),
            Parent.updateMany({ students: _id }, { $pull: { students: _id } }),
            Result.findOneAndDelete({ student: _id }),
        ]);

        return res.status(200).json({
            success: true,
            data: deletedStudent,
            message: "Student deleted successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

exports.getAllStudents = async (req, res) => {

    try {
        const studentData = await Student.find()
            .populate('userId')
            .populate('classId')
            .populate('parent')
            .populate('attendance')
            .populate('subjects')
            .populate('exams')
            .populate('assignments');

        // Sort the results based on `userId.firstname`
        studentData.sort((a, b) => {
            const nameA = a.userId?.firstName?.toLowerCase() || '';
            const nameB = b.userId?.firstName?.toLowerCase() || '';
            return nameA.localeCompare(nameB);
        });

        return res.status(200).json({
            success: true,
            data: studentData,
            message: 'Students fetched successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!',
        });
    }
}

exports.getStudentDetails = async (req, res) => {
    try {
        const studentId = req.query.studentId;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID is required'
            })
        }

        const studentDetails = await Student.findById(studentId)
            .populate('userId')
            .populate('classId')
            .populate('parent')
            .populate('attendance')
            .populate('subjects')
            .populate('exams')
            .populate('assignments');

        if (!studentDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not found with the given ID.'
            })
        }

        return res.status(200).json({
            success: true,
            data: studentDetails,
            message: 'Student details fetched successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        });
    }
}