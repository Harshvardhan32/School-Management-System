const Lesson = require('../../models/Lesson');
const Subject = require('../../models/Subject');

exports.createLesson = async (req, res) => {
    try {

        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const lessonResponse = await Lesson.create({
            title,
            description,
        });

        return res.status(200).json({
            success: true,
            data: lessonResponse,
            message: 'Lesson created successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.updateLesson = async (req, res) => {
    try {

        const { id, title, description } = req.body;

        if (!id || !title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Lesson ID is required!'
            })
        }

        const existingLesson = await Lesson.findById(id);

        if (!existingLesson) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found with the given ID!'
            })
        }

        const updatedLesson = await Lesson.findByIdAndUpdate(id,
            {
                title,
                description,
            },
            { new: true });

        return res.status(200).json({
            success: true,
            data: updatedLesson,
            message: 'Lesson updated successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.deleteLesson = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Lesson ID is required!'
            })
        }

        // Fetch the existing lesson
        const existingLesson = await Lesson.findById(_id);

        if (!existingLesson) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found with the given ID!'
            })
        }

        // Delete the lesson
        const deletedLesson = await Lesson.findByIdAndDelete(_id);

        // Remove lesson from Subject schema
        await Subject.updateMany(
            { lessons: _id },
            {
                $pull: { lessons: _id },
            }
        );

        return res.status(200).json({
            success: true,
            data: deletedLesson,
            message: 'Lesson Deleted Successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

exports.getAllLessons = async (req, res) => {
    try {
        const lessonData = await Lesson.find().sort({ title: 1 });

        return res.status(200).json({
            success: true,
            data: lessonData,
            message: 'Lessons fetched successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!',
        });
    }
};