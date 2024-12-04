const Class = require("../../models/Class");
const Parent = require("../../models/Parent");
const Student = require("../../models/Student");
const User = require("../../models/User");
const bcrypt = require('bcryptjs');
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

        // Validate role
        if (role !== 'Student') {
            return res.status(400).json({
                success: false,
                message: 'Invalid role!',
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
            photo: image
        });

        // Create Student
        const userResponse = await Student.create({
            userId: user?._id,
            studentId,
            classId,
            fatherName,
            motherName,
            parent,
            subjects,
            rollNumber,
        });

        // Update the students in Class Schema
        await Class.findByIdAndUpdate(classId, { $push: { students: userResponse?._id } });

        // Send the successful response
        return res.status(200).json({
            success: true,
            data: userResponse,
            message: 'Student registered successfully!'
        });
    } catch (error) {
        console.error(error.message);
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
        const existingStudent = await Student.findById(id);

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found with the id!'
            });
        }

        // Update user profile
        await User.findByIdAndUpdate(existingStudent.userId,
            {
                firstName,
                lastName,
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
                parent,
                subjects,
                rollNumber,
            },
            { new: true });

        // if existing Student classId is not similar to fetched classId
        if (existingStudent?.classId.toString() !== classId) {
            // Add student to new class
            await Class.findByIdAndUpdate(classId,
                { $push: { students: id } }
            );

            // Remove student from old class
            await Class.findByIdAndUpdate(existingStudent.classId,
                { $pull: { students: id } }
            )
        }

        // Handle parent changes
        if (existingStudent.parent.toString() !== parent) {
            // Add student to new parent
            await Parent.findByIdAndUpdate(parent,
                { $push: { students: id } }
            );

            // Remove student from old parent
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
        console.error(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

exports.deleteStudent = async (req, res) => {

}

exports.getAllStudents = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Student.find()
            .populate('userId')
            .populate('classId')
            .populate('parent')
            .populate('attendance')
            .populate('subjects')
            .populate('exams')
            .populate('assignments');

        if (!allData) {
            query = query.skip(skip).limit(limit); // Apply pagination if allData is false
        }

        const data = await query;
        const total = allData ? data.length : await Student.countDocuments();

        return res.status(200).json({
            success: true,
            data,
            total,
            totalPages: allData ? 1 : Math.ceil(total / limit), // Only 1 page for allData
            currentPage: allData ? 1 : page,
            message: 'Students fetched successfully!',
        });
    } catch (error) {
        console.log(error.message);
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
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}