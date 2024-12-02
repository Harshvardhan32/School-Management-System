const Class = require('../../models/Class');
const Subject = require('../../models/Subject');
const Teacher = require('../../models/Teacher');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

exports.createTeacher = async (req, res) => {
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
            teacherId,
            classes,
            subjects
        } = req.body;

        // Validate required fields for a user
        if (!firstName || !email || !password || !phone || !address || !role || !sex || !teacherId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            });
        }

        // Validate role
        if (role !== 'Teacher') {
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

        // Check for existing teacher by teacherId
        const existingTeacherId = await Teacher.findOne({ teacherId });

        if (existingTeacherId) {
            return res.status(400).json({
                success: false,
                message: 'Teacher ID should be unique!'
            });
        }

        // Hash password and generate profile image
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate image with the firstName and lastName
        const image = `https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`;

        // Create teacher profile
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

        // Create Teacher
        const userResponse = await Teacher.create({
            userId: user._id,
            teacherId,
            classes,
            subjects
        });

        // Update teachers in Class Schema
        if (classes?.length > 0) {
            await Promise.all(
                classes.map((classId) =>
                    Class.findByIdAndUpdate(
                        classId,
                        { $push: { teachers: userResponse?._id } }
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
                        { $push: { teachers: userResponse?._id } }
                    )
                )
            );
        }

        // Send the successful response
        return res.status(200).json({
            success: true,
            data: userResponse,
            message: 'Teacher registered successfully!'
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

exports.updateTeacher = async (req, res) => {
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
            teacherId,
            classes,
            subjects
        } = req.body;

        // Validate required fields for a user
        if (!id || !firstName || !email || !phone || !address || !sex || !teacherId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            });
        }

        // Check for existing Teacher by id
        const existingTeacher = await Teacher.findById(id);

        if (!existingTeacher) {
            return res.status(400).json({
                success: false,
                message: 'Teacher not found with the given ID.'
            });
        }

        // Update profile
        await User.findByIdAndUpdate(existingTeacher?.userId,
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

        // Update Teacher
        const updatedTeacher = await Teacher.findByIdAndUpdate(id,
            { teacherId, classes, subjects });

        // Find classes which are not present in existing teacher data
        const addedClasses = classes.filter((item) => !existingTeacher?.classes.includes(item));

        // Find classes which are present in existingTeacher?.classes but not present in classes
        const removedClasses = existingTeacher?.classes.filter((item) => !classes.includes(item));

        // Push new addedClasses
        if (addedClasses?.length > 0) {
            await Promise.all(
                addedClasses.map((classId) =>
                    Class.findByIdAndUpdate(
                        classId,
                        { $push: { teachers: id } }
                    )
                )
            );
        }

        // Pull removedClasses
        if (removedClasses?.length > 0) {
            await Promise.all(
                removedClasses.map((classId) =>
                    Class.findByIdAndUpdate(
                        classId,
                        { $pull: { teachers: id } }
                    )
                )
            );
        }


        // Find subjects which are not present in existing teacher data
        const addedSubjects = classes.filter((item) => !existingTeacher?.classes.includes(item));

        // Find subjects which are present in existingTeacher?.subjects but not present in classes
        const removedSubjects = existingTeacher?.classes.filter((item) => !classes.includes(item));

        // Push new addedSubjects
        if (addedSubjects?.length > 0) {
            await Promise.all(
                addedSubjects.map((subjectId) =>
                    Subject.findByIdAndUpdate(
                        subjectId,
                        { $push: { teachers: id } }
                    )
                )
            );
        }

        // Pull removedSubjects
        if (removedSubjects.length > 0) {
            await Promise.all(
                removedSubjects.map((subjectId) =>
                    Subject.findByIdAndUpdate(
                        subjectId,
                        { $pull: { teachers: id } }
                    )
                )
            );
        }

        return res.status(200).json({
            success: true,
            data: updatedTeacher,
            message: 'Teacher Update Successfully!'
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

exports.deleteTeacher = async (req, res) => {
    try {
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

exports.getAllTeachers = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Teacher.find()
            .populate('userId')
            .populate('classes')
            .populate('subjects');

        if (!allData) {
            query = query.skip(skip).limit(limit); // Apply pagination if allData is false
        }

        const data = await query;
        const total = allData ? data.length : await Teacher.countDocuments();

        return res.status(200).json({
            success: true,
            data,
            total,
            totalPages: allData ? 1 : Math.ceil(total / limit), // Only 1 page for allData
            currentPage: allData ? 1 : page,
            message: 'Teachers fetched successfully!',
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

exports.getTeacherDetails = async (req, res) => {
    try {
        const teacherId = req.query.teacherId;

        if (!teacherId) {
            return res.status(400).json({
                success: false,
                message: 'Teacher ID is required'
            })
        }

        const teacherDetails = await Teacher.findById(teacherId)
            .populate('userId')
            .populate('classes')
            .populate('subjects');

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