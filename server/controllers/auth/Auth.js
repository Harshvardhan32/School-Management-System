const Teacher = require('../../models/Teacher');
const Student = require('../../models/Student');
const Admin = require('../../models/Admin');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailSender = require('../../utils/mailSender');

exports.signUp = async (req, res) => {

    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            phone,
            address,
            role,
            bloodType,
            dateOfBirth,
            sex,
            profilePhoto
        } = req.body;

        if (!firstName || !email || !password || !confirmPassword || !phone || !address || !role || !sex) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and Confirm Password do not match. Please try again.'
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already registered. Please login to continue.'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const image = profilePhoto ? profilePhoto : `https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`

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
            profilePhoto: image
        });

        const userResponse = {};
        if (role === 'Admin') {
            const { adminId } = req.body;

            if (!adminId) {
                return res.status(400).json({
                    success: false,
                    message: 'Admin ID is required!'
                })
            }

            userResponse = await Admin.create({
                userId: user?._id,
                adminId
            }).populate('userId').exec();
        } else if (role === 'Teacher') {
            const { teacherId } = req.body;

            if (!teacherId) {
                return res.status(400).json({
                    success: false,
                    message: 'Teacher ID is required!'
                })
            }

            userResponse = await Teacher.create({
                userId: user?._id,
                teacherId
            }).populate('userId').exec();
        } else if (role === 'Student') {
            const { studentId, classId, fatherName, motherName, rollNumber } = req.body;

            if (!studentId || !classId || !fatherName || !motherName || !rollNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Please fill all required details!'
                })
            }

            userResponse = await Student.create({
                userId: user?._id,
                studentId,
                classId,
                fatherName,
                motherName,
                rollNumber
            }).populate('userId').populate('classId').exec();
        } else if (role === 'Parent') {
            const { parentId, students } = req.body;

            if (!parentId || !students) {
                return res.status(400).json({
                    success: false,
                    message: 'Please fill all required details!'
                })
            }

            userResponse = await Admin.create({
                userId: user?._id,
                parentId, students
            }).populate('userId').populate('students').exec();
        }

        await mailSender(
            email,
            'Account Creation',
            `Your account created successfully on ABCD School Online Portal with email: ${email}`
        )

        return res.status(200).json({
            success: true,
            data: userResponse,
            message: 'User registered successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.login = async (req, res) => {

    try {
        const { email, password, } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User is not Registered with Us Please SignUp to Continue."
            })
        }

        // Generate JWT token and Compare Password
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {
                    email: user?.email,
                    id: user?._id,
                    role: user?.role,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '24h'
                }
            )

            // Save token to user document in database
            user.token = token;
            user.password = undefined;

            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                data: user,
                message: 'User login successfully!'
            })
        } else {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.changePassword = async (req, res) => {
    try {

        const { userId, oldPassword, newPassword } = req.body;

        if (!userId || !oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const userDetails = await User.findById(userId);

        // Validate old password
        const isPasswordMatched = await bcrypt.compare(oldPassword, userDetails?.password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "The password is incorrect"
            });
        }

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        // Update password
        const updatedUserDetails = await User.findByIdAndUpdate(userId, { password: encryptedPassword }, { new: true });

        // TODO: Send password change email

        return res.status(200).json({
            success: true,
            message: "Password updated successfully!"

        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!",
        });
    }
}

exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `This Email: ${email} is not Registered With Us, Please Enter a Valid Email.`,
            });
        }

        const token = crypto.randomBytes(20).toString("hex");

        const updatedDetails = await User.findOneAndUpdate(
            { email },
            {
                token,
                resetPasswordExpires: Date.now() + 3600000
            },
            { new: true }
        )

        const url = `http://localhost:5173/update-password/${token}`;

        await mailSender(
            email,
            "Password Reset",
            `<p>Your Link for email verification is ${url}. Please click this url to reset your password.</p>`
        )

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully, Please check your email to continue further.'
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

exports.resetPassword = async (req, res) => {
    try {

        const { password, confirmPassword, token } = req.body;

        if (confirmPassword !== password) {
            return res.status(400).json({
                success: false,
                message: 'Password and Confirm Password do not match. Please try again.'
            });
        }

        const userDetails = await User.findOne({ token });

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "Token is Invalid",
            });
        }

        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success: false,
                message: 'Token is Expired, Please Regenerate Your Token.'
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            { token },
            { password: encryptedPassword },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully!'
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

exports.deleteAccount = async (req, res) => {
    try {

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required!"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // TODO: Delete associated Role Profile with the User

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!",
        });
    }
}