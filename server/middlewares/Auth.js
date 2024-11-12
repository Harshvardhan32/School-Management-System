const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.isAuth = async (req, res, next) => {
    try {
        const token =
            req.cookies.token ||
            req.body.token ||
            req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            return res.status(400).json({
                success: false,
                message: `Token Missing`
            });
        }

        try {
            // Verifying the JWT using the secret key stored in environment variables

            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (error) {
            // If JWT verification fails, return 401 Unauthorized response
            console.log(error.message);
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }

        // If JWT is valid, move on to the next middleware or request handler
        next();
    } catch (error) {
        console.log(error.message);
        console.log("IS AUTH ERROR!");
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        const { role } = req.user;

        if (role !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Admin",
            });
        }

        next();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.isStudent = async (req, res, next) => {
    try {

        const { role } = req.user;

        if (role !== 'Student') {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Student",
            });
        }

        next();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.isTeacher = async (req, res, next) => {
    try {

        const { role } = req.user;

        if (role !== 'Teacher') {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Teacher",
            });
        }

        next();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.isParent = async (req, res, next) => {
    try {

        const { role } = req.user;

        if (role !== 'Parent') {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Parent",
            });
        }

        next();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.isAdminOrTeacher = (req, res, next) => {
    try {

        const { role } = req.user;

        console.log("ROLE: ", role);

        if (role !== 'Admin' && role !== 'Teacher') {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Admin and Teacher.",
            });
        }

        next();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
};