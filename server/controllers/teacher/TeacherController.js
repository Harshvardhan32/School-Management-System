const Assignment = require('../../models/Assignment');
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
            remarks,
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
            remarks,
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
            await Class.updateMany(
                { _id: { $in: classes } }, // Match all classes with _id in the provided classes array
                { $push: { teachers: userResponse?._id } } // Push the teacher ID to the teachers array
            );
        }

        // Update teachers in Subject Schema
        if (subjects?.length > 0) {
            await Subject.updateMany(
                { _id: { $in: subjects } }, // Match all subjects with _id in the provided subjects array
                { $push: { teachers: userResponse?._id } } // Push the teacher ID to the teachers array
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
            subjects,
            remarks
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

        // Update user profile
        await User.findByIdAndUpdate(existingTeacher.userId,
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

        // Update Teacher record
        const updatedTeacher = await Teacher.findByIdAndUpdate(id,
            { teacherId, classes, subjects }, { new: true });

        // Handle added and removed classes
        const addedClasses = classes.filter(classId => !existingTeacher.classes.includes(classId));

        const removedClasses = existingTeacher.classes.filter(classId => !classes.includes(classId));

        // Update class relationships
        if (addedClasses?.length > 0) {
            await Class.updateMany(
                { _id: { $in: addedClasses } }, // Match classes in the addedClasses array
                { $addToSet: { teachers: id } } // Add teacher ID to the teachers array, avoiding duplicates
            );
        }

        if (removedClasses?.length > 0) {
            await Class.updateMany(
                { _id: { $in: removedClasses } }, // Match classes in the removedClasses array
                { $pull: { teachers: id } } // Remove teacher ID from the teachers array
            );
        }

        // Handle added and removed subjects
        const addedSubjects = subjects.filter(subjectId => !existingTeacher.subjects.includes(subjectId));

        const removedSubjects = existingTeacher.subjects.filter(subjectId => !subjects.includes(subjectId));

        // Update subject relationships
        if (addedSubjects?.length > 0) {
            await Subject.updateMany(
                { _id: { $in: addedSubjects } }, // Match subjects in the addedSubjects array
                { $addToSet: { teachers: id } } // Add teacher ID to the teachers array, avoiding duplicates
            );
        }

        if (removedSubjects.length > 0) {
            await Subject.updateMany(
                { _id: { $in: removedSubjects } }, // Match subjects in the removedSubjects array
                { $pull: { teachers: id } } // Remove teacher ID from the teachers array
            );
        }

        // Send the successful response
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
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Teacher ID is required!"
            })
        }

        // Check if the teacher exists
        const existingTeacher = await Teacher.findById(_id);

        if (!existingTeacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found with the given ID!',
            });
        }

        // Delete teacher profile
        await User.findByIdAndDelete(existingTeacher.userId);

        // Delete the teacher
        const deletedTeacher = await Teacher.findByIdAndDelete(_id);

        await Promise.all([
            Assignment.deleteMany({ teacher: _id }),
            Class.updateMany({ supervisor: _id }, { supervisor: null }),
            Class.updateMany({ teachers: _id }, { $pull: { teachers: _id } }),
            Subject.updateMany({ teachers: _id }, { $pull: { teachers: _id } }),
        ])

        return res.status(200).json({
            success: true,
            data: deletedTeacher,
            message: "Teacher Deleted Successfully!"
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

exports.getAllTeachers = async (req, res) => {

    try {
        const teacherData = await Teacher.find()
            .populate('userId')
            .populate('classes')
            .populate('subjects');

        return res.status(200).json({
            success: true,
            data: teacherData,
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