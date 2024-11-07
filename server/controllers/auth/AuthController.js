const User = require('../../models/User');
const jwt = require('jsonwebtoken');

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
                message: 'Both password are not matched!'
            })
        }

        const existingUser = await User.find({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already registered!'
            })
        }

        const userResponse = await User.create({
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
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
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

        const loginResponse = await User.find({ email });

        if (!loginResponse) {
            return res.status(400).json({
                success: false,
                message: "Record not found! Please SignUp First!"
            })
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

