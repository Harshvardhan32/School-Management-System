const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

exports.signUp = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session for transactions
    try {
        session.startTransaction(); // Start the transaction

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
            adminId,
            teacherId,
            classes,
            subjects,
            studentId,
            classId,
            fatherName,
            motherName,
            rollNumber,
            parentId,
            students,
        } = req.body;

        // Validate required fields
        if (!firstName || !email || !password || !phone || !address || !role || !sex) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!',
            });
        }

        // Validate role
        if (!['Admin', 'Teacher', 'Student', 'Parent'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified!',
            });
        }

        // Check for existing user by email
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already registered. Please login to continue.',
            });
        }

        // Hash password and generate profile image
        const hashedPassword = await bcrypt.hash(password, 10);
        const image = `https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`;

        // Create the user
        const user = await User.create(
            [{
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
                photo: image,
            }],
            { session }
        );

        let userResponse;

        // Handle role-specific logic
        if (role === 'Admin') {
            if (!adminId) throw new Error('Admin ID is required!');

            const existingAdminId = await Admin.findOne({ adminId }).session(session);

            if (existingAdminId) throw new Error('Admin ID should be unique!');

            userResponse = await Admin.create(
                [{ userId: user?._id, adminId }],
                { session }
            );
        } else if (role === 'Teacher') {
            if (!teacherId) throw new Error('Teacher ID is required!');

            const existingTeacherId = await Teacher.findOne({ teacherId }).session(session);

            if (existingTeacherId) throw new Error('Teacher ID should be unique!');

            userResponse = await Teacher.create(
                [{ userId: user?._id, teacherId, classes, subjects }],
                { session }
            );

            if (classes?.length > 0) {
                await Promise.all(
                    classes.map((classId) =>
                        Class.findByIdAndUpdate(
                            classId,
                            { $push: { teachers: userResponse?._id } },
                            { session }
                        )
                    )
                );
            }

            if (subjects?.length > 0) {
                await Promise.all(
                    subjects.map((subjectId) =>
                        Subject.findByIdAndUpdate(
                            subjectId,
                            { $push: { teachers: userResponse?._id } },
                            { session }
                        )
                    )
                );
            }
        } else if (role === 'Student') {
            if (!studentId || !fatherName || !motherName || !rollNumber) {
                throw new Error('Please fill all required student details!');
            }

            const existingStudentId = await Student.findOne({ studentId }).session(session);

            if (existingStudentId) throw new Error('Student ID should be unique!');

            userResponse = await Student.create(
                [
                    {
                        userId: user?._id,
                        studentId,
                        classId,
                        fatherName,
                        motherName,
                        subjects,
                        rollNumber,
                    },
                ],
                { session }
            );

            if (classId) {
                await Class.findByIdAndUpdate(
                    classId,
                    { $push: { students: userResponse?._id } },
                    { session }
                );
            }
        } else if (role === 'Parent') {
            if (!parentId) throw new Error('Parent ID is required!');

            const existingParentId = await Parent.findOne({ parentId }).session(session);
            
            if (existingParentId) throw new Error('Parent ID should be unique!');

            userResponse = await Parent.create(
                [{ userId: user?._id, parentId, students }],
                { session }
            );

            if (students?.length > 0) {
                await Promise.all(
                    students.map((studentId) =>
                        Student.findByIdAndUpdate(
                            studentId,
                            { parent: userResponse?._id },
                            { session }
                        )
                    )
                );
            }
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            data: userResponse,
            message: 'User registered successfully!',
        });
    } catch (error) {
        // Rollback the transaction in case of error
        await session.abortTransaction();
        session.endSession();

        console.error(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!',
        });
    }
};