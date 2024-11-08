const Admin = require('../../models/Admin');
const Parent = require('../../models/Parent');
const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');

exports.getUserDetails = async (req, res) => {
    try {

        const { role, userId } = req.body;

        if (!role || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const userResponse = {};
        if (role === 'Admin') {
            userResponse = await Admin.findOne({
                userId
            }).populate('userId').exec();
        } else if (role === 'Teacher') {
            userResponse = await Teacher.findOne({ userId })
                .populate('userId')
                .populate('classes')
                .populate('subjects').exec();
        } else if (role === 'Student') {
            userResponse = await Student.findOne
                ({ userId })
                .populate('userId')
                .populate('classId')
                .populate('parent')
                .populate('attendance')
                .populate('subjects')
                .populate('exams')
                .populate('assignments').exec();
        } else if (role === 'Parent') {
            userResponse = await Admin.findOne({ userId })
                .populate('userId')
                .populate('students').exec();
        }

        if (!userResponse) {
            return res.status(404).json({
                success: false,
                message: 'User not found with the given ID.'
            })
        }

        return res.status(200).json({
            success: true,
            data: userResponse,
            message: 'User details fetched successfully!'
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

exports.getAllTeachers = async (req, res) => {
    try {
        const allTeachers = await Teacher.find();

        return res.status(200).json({
            success: true,
            data: allTeachers,
            message: 'All teacher fetched successfully!'
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

exports.getAllStudents = async (req, res) => {
    try {
        const allStudents = await Student.find();

        return res.status(200).json({
            success: true,
            data: allStudents,
            message: 'All student fetched successfully!'
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

exports.getAllParents = async (req, res) => {
    try {
        const allParents = await Parent.find();

        return res.status(200).json({
            success: true,
            data: allParents,
            message: 'All parent fetched successfully!'
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