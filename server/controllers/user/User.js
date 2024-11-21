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
                .populate('classId')
                .populate('parent')
                .populate('attendance')
                .populate('subjects')
                .populate('exams')
                .populate('assignments');

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

exports.getAllParents = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Parent.find()
            .populate('userId')
            .populate('students');

        if (!allData) {
            query = query.skip(skip).limit(limit); // Apply pagination if allData is false
        }

        const data = await query;
        const total = allData ? data.length : await Parent.countDocuments();

        return res.status(200).json({
            success: true,
            data,
            total,
            totalPages: allData ? 1 : Math.ceil(total / limit), // Only 1 page for allData
            currentPage: allData ? 1 : page,
            message: 'Parents fetched successfully!',
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!',
        });
    }
};