const Admin = require('../../models/Admin');
const Teacher = require('../../models/Teacher');
const User = require('../../models/User');

exports.createAdmin = async (req, res) => {
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
            adminId
        } = req.body;

        // Validate required fields for a user
        if (!firstName || !email || !password || !phone || !address || !role || !sex || !adminId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            });
        }

        // Validate role
        if (role !== 'Admin') {
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

        // Check for existing admin by adminId
        const existingAdminId = await Admin.findOne({ adminId });

        if (existingAdminId) {
            return res.status(400).json({
                success: false,
                message: 'Admin ID should be unique!'
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

        // Create Admin
        const userResponse = await Admin.create({
            userId: user._id,
            adminId
        });

        // Send the successful response
        return res.status(200).json({
            success: true,
            data: userResponse,
            message: 'User registered successfully!'
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

exports.updateAdmin = async (req, res) => {
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
            adminId,
            remarks
        } = req.body;

        if (!id || !firstName || !email || !phone || !address || !sex || !adminId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            });
        }

        // Check for existing Admin by id
        const existingAdmin = await Admin.findById(id).populate('userId');

        if (!existingAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found with the given ID!'
            });
        }

        if (email !== existingAdmin?.userId.email) {
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
        await User.findByIdAndUpdate(existingAdmin.userId, {
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

        // Update Admin Record
        const updatedAdmin = await Admin.findByIdAndUpdate(id,
            { adminId },
            { new: true }
        ).populate('userId');

        return res.status(200).json({
            success: true,
            data: updatedAdmin,
            message: 'Admin Updated Successfully!'
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        });
    }
}

exports.getAdminDetails = async (req, res) => {
    try {
        const { adminId } = req.body;

        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: 'Admin ID is required'
            })
        }

        const teacherDetails = await Admin.findOne({ adminId })
            .populate('userId');

        if (!teacherDetails) {
            return res.status(404).json({
                success: false,
                message: 'Teacher is not found with the given ID.'
            })
        }

        return res.status(200).json({
            success: true,
            data: teacherDetails,
            message: 'Teacher details fetched successfully!'
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