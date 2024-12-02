const Class = require("../../models/Class");
const Parent = require("../../models/Parent");
const Student = require("../../models/Student");
const User = require("../../models/User");

exports.createParent = async (req, res) => {
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
            parentId,
            students
        } = req.body;

        // Validate required fields for a user
        if (!firstName || !email || !password || !phone || !address || !role || !sex || !parentId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            });
        }

        // Validate role
        if (role !== 'Parent') {
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

        // Check for existing parent by parentId
        const existingParentId = await Parent.findOne({ parentId });

        if (existingParentId) {
            return res.status(400).json({
                success: false,
                message: 'Parent ID should be unique!'
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

        // Create Parent
        const userResponse = await Parent.create({
            userId: user?._id,
            parentId,
            students
        });

        // Update parent in Student Schema
        if (students?.length > 0) {
            await Promise.all(
                students.map((studentId) =>
                    Student.findByIdAndUpdate(studentId, { parent: userResponse?._id })
                )
            );
        }

        // Send the successful response
        return res.status(200).json({
            success: true,
            data: userResponse,
            message: 'Parent registered successfully!'
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

exports.updateParent = async (req, res) => {

}

exports.deleteParent = async (req, res) => {

}

exports.getAllParents = async (req, res) => {
    try {
        const allData = req.query.allData === 'true';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = Parent.find()
            .populate('userId')
            .populate({
                path: "students",
                populate: {
                    path: "userId",
                }
            });

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
}