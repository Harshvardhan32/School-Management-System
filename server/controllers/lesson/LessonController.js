const Lesson = require('../../models/Lesson');

exports.createLesson = async (req, res) => {
    try {

        const { title, description, subject } = req.body;

        if (!title || !description || !subject) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const lessonRecord = await Lesson.create({
            title,
            description,
            subject
        });

        const lessonResponse = await Lesson.findById(lessonRecord?._id)
            // .populate('subject');

        return res.status(200).json({
            success: true,
            data: lessonResponse,
            message: 'Lesson created successfully!'
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

exports.updateLesson = async (req, res) => {
    try {

        const { lessonId, title, description, subject } = req.body;

        if (!lessonId) {
            return res.status(400).json({
                success: false,
                message: 'Lesson ID is required!'
            })
        }

        const lessonData = await Lesson.findById(lessonId);

        if (!lessonData) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found with the given ID!'
            })
        }

        const updatedResponse = await Lesson.findByIdAndUpdate(lessonId,
            {
                title,
                description,
                subject
            },
            { new: true })
        // .populate('subject');

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: 'Lesson updated successfully!'
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

exports.deleteLesson = async (req, res) => {
    try {

        const { lessonId } = req.params;

        if (!lessonId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const deletedResponse = await Lesson.findByIdAndDelete(lessonId);

        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: 'Lesson deleted successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

exports.getAllLesson = async (req, res) => {
    try {

        const allLessons = await Lesson.find()
        // .populate('subject');

        return res.status(200).json({
            success: true,
            data: allLessons,
            message: 'All lesson fetched successfully!'
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