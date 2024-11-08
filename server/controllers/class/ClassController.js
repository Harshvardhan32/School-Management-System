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
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.updateClass = async (req, res) => {
    try {

        const {
            classId,
            name,
            capacity,
            supervisor,
            students,
            subjects
        } = req.body;

        if (!classId || !name ||
            !capacity ||
            !supervisor ||
            !students ||
            !subjects) {
            return res.status(400).json({
                success: true,
                message: 'Please fill all required details!'
            })
        }

        const classData = Class.findById(classId);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: 'Class not found with the given ID!'
            })
        }

        const updatedResponse = Class.findByIdAndUpdate(classId, {
            name,
            capacity,
            supervisor,
            students,
            subjects
        }, { new: true })

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: 'Class update successfully!'
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

exports.deleteClass = async (req, res) => {
    try {

        const { classId } = req.body;

        if (!classId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const deletedResponse = await Class.findByIdAndDelete(classId);

        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: 'Class deleted successfully!'
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

exports.getAllClasses = async (req, res) => {
    try {

        const allClasses = await Class.find();

        return res.status(200).json({
            success: true,
            data: allClasses,
            message: 'All classes fetched successfully!'
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