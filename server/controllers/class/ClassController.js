const Class = require('../../models/Class');
const Teacher = require('../../models/Teacher');

// Function to create class
exports.createClass = async (req, res) => {
    try {
        const {
            className,
            capacity,
        } = req.body;

        if (!className || !capacity) {
            return res.status(400).json({
                success: true,
                message: 'Please fill all required details!'
            })
        }

        const classResponse = await Class.create({
            className,
            capacity,
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
};

// Function to update class
exports.updateClass = async (req, res) => {
    try {

        const {
            classId,
            className,
            capacity,
            supervisor,
            teachers,
            students,
            subjects
        } = req.body;

        if (!classId || !className ||
            !capacity) {
            return res.status(400).json({
                success: true,
                message: 'Please fill all required details!'
            });
        }

        const classData = await Class.findById(classId);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: 'Class not found with the given ID!'
            });
        }

        const updatedResponse = await Class.findByIdAndUpdate(classId, {
            className,
            capacity,
            supervisor,
            teachers,
            students,
            subjects
        }, { new: true })
            .populate('supervisor')
            .populate('teachers')
            .populate('students')
            // .populate('subjects');

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: 'Class update successfully!'
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
};

// Function to delete class
exports.deleteClass = async (req, res) => {
    try {

        const { classId } = req.body;

        if (!classId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        // const classRecord = await Class.findById(classId);

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
};

// Function to get all class
exports.getAllClasses = async (req, res) => {
    try {

        const allClasses = await Class.find()
            .populate('supervisor')
        // .populate('teachers')
        // .populate('students')
        // .populate('subjects');

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