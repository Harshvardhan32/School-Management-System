const bcrypt = require('bcryptjs');
const User = require("../../models/User");
const Parent = require("../../models/Parent");
const Student = require("../../models/Student");

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
            await Student.updateMany(
                { _id: { $in: students } }, // Match all students whose _id is in the students array
                { parent: userResponse?._id } // Update the parent field with the given userResponse._id
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
    try {
        const {
            id,
            firstName,
            lastName,
            email,
            phone,
            address,
            sex,
            parentId,
            students
        } = req.body;

        // Validate required fields for a user
        if (!id || !firstName || !email || !phone || !address || !sex || !parentId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            });
        }

        // Check for existing Parent by id
        const existingParent = await Parent.findById(id).populate('userId');

        if (!existingParent) {
            return res.status(400).json({
                success: false,
                message: 'Parent not found with the id!'
            });
        }

        if (email !== existingParent?.userId?.email) {

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
        await User.findByIdAndUpdate(existingParent?.userId._id,
            {
                firstName,
                lastName,
                email,
                phone,
                address,
                sex,
            });

        // Determine added and removed students
        const addedStudents = students && students.filter((studentId) => !existingParent?.students.includes(studentId));

        const removedStudents = students && existingParent?.students.filter((studentId) => !students.includes(studentId));

        // Update student relationships
        if (students && addedStudents?.length > 0) {
            await Student.updateMany(
                { _id: { $in: addedStudents } }, // Match all students whose _id is in the addedStudents array
                { parent: id } // Set the parent field to the given id
            );
        }

        if (students && removedStudents?.length > 0) {
            await Student.updateMany(
                { _id: { $in: removedStudents } }, // Match all students whose _id is in the removedStudents array
                { parent: null } // Set the parent field to null
            );
        }

        // Update parent with new students array
        const updatedParent = await Parent.findByIdAndUpdate(id,
            { parentId, students },
            { new: true });

        // Send the successful response
        return res.status(200).json({
            success: true,
            data: updatedParent,
            message: 'Parent Updated Successfully!'
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

exports.deleteParent = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Parent ID is required!"
            })
        }

        // Check if the parent exists
        const existingParent = await Parent.findById(_id);

        if (!existingParent) {
            return res.status(404).json({
                success: false,
                message: 'Parent not found with the given ID!',
            });
        }

        // Delete parent profile
        await User.findByIdAndDelete(existingParent.userId);

        // Delete the parent
        const deletedParent = await Parent.findByIdAndDelete(_id);

        await Student.updateMany({ parent: _id }, { $set: { parent: null } });

        return res.status(200).json({
            success: true,
            data: deletedParent,
            message: "Parent Deleted Successfully!"
        });
    } catch (error) {

    }
}

exports.getAllParents = async (req, res) => {

    try {
        const parentData = await Parent.find()
            .populate('userId')
            .populate({
                path: "students",
                populate: [
                    { path: "userId" },
                    { path: "classId" }
                ]
            });

        // Sort the results based on `userId.firstName`
        parentData.sort((a, b) => {
            const nameA = a.userId?.firstName?.toLowerCase() || '';
            const nameB = b.userId?.firstName?.toLowerCase() || '';
            return nameA.localeCompare(nameB);
        });

        return res.status(200).json({
            success: true,
            data: parentData,
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