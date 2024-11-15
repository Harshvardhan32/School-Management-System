const cloudinary = require('cloudinary').v2;
const Admin = require('../../models/Admin');
const Parent = require('../../models/Parent');
const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');
const User = require('../../models/User');

exports.updateProfilePicture = async (req, res) => {
    try {
        const { id } = req.body;
        const photo = req.file;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found with the given ID!'
            })
        }

        const options = {
            resource_type: 'auto'
        }

        let imageDetails;
        try {
            imageDetails = await cloudinary.uploader.upload(photo, options);
        } catch (error) {
            throw new Error(error.message);
        }

        const image = imageDetails ? imageDetails?.secure_url : `https://api.dicebear.com/8.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`;

        const updatedDetails = await User.findByIdAndUpdate(
            id,
            {
                photo: image
            }
        );

        return res.status(200).json({
            success: true,
            data: updatedDetails,
            message: 'Profile picture updated successsfully!'
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

exports.getUserDetails = async (req, res) => {
    try {

        const { role, id } = req.body;

        if (!role || !id) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        if (role !== 'Admin' && role !== 'Teacher' && role !== 'Student' && role !== 'Parent') {
            return res.status(400).json({
                success: false,
                message: "Invalid role specified!"
            });
        }

        let userResponse;
        if (role === 'Admin') {

            userResponse = await Admin.findById(id)
                .populate('userId');

        } else if (role === 'Teacher') {

            userResponse = await Teacher.findById(id)
                .populate('userId')
            // .populate('classes')
            // .populate('subjects');

        } else if (role === 'Student') {

            userResponse = await Student.findById(id)
                .populate('userId')
            // .populate('classId')
            // .populate('parent')
            // .populate('attendance')
            // .populate('subjects')
            // .populate('exams')
            // .populate('assignments');

        } else if (role === 'Parent') {

            userResponse = await Parent.findById(id)
                .populate('userId')
            // .populate('students');

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
        const allTeachers = await Teacher.find()
            .populate('userId')
        // .populate('classes')
        // .populate('subjects');

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
        const allStudents = await Student.find()
            .populate('userId')
        // .populate('classId')
        // .populate('attendance')
        // .populate('subjects')
        // .populate('exams')
        // .populate('assignments');

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
        const allParents = await Parent.find()
            .populate('userId')
        // .populate('students');

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