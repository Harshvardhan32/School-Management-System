const Class = require('../../models/Class');

exports.createClass = async (req, res) => {
    try {

        const {
            name,
            capacity,
            supervisor,
            students,
            subjects
        } = req.body;

        if (!name ||
            !capacity ||
            !supervisor ||
            !students ||
            !subjects) {
            return res.status(400).json({
                success: true,
                message: 'Please fill all required details!'
            })
        }

        const classResponse = await Class.create({
            name,
            capacity,
            supervisor,
            students,
            subjects
        });

        return res.status(200).json({
            success: true,
            data: classResponse,
            message: 'Class created successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}

exports.updateClass = async (req, res) => {
    try {

        const {
            name,
            capacity,
            supervisor,
            students,
            subjects
        } = req.body;

        if (!name ||
            !capacity ||
            !supervisor ||
            !students ||
            !subjects) {
            return res.status(400).json({
                success: true,
                message: 'Please fill all required details!'
            })
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}

exports.deleteClass = async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}

exports.getClass = async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}

exports.getAllClass = async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}