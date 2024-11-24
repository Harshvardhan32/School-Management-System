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

        const lessonResponse = await Lesson.create({
            title,
            description,
            subject
        });

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
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Lesson.find()
            .populate('subject');

        if (!allData) {
            query = query.skip(skip).limit(limit); // Apply pagination if allData is false
        }

        const data = await query;
        const total = allData ? data.length : await Lesson.countDocuments();

        return res.status(200).json({
            success: true,
            data,
            total,
            totalPages: allData ? 1 : Math.ceil(total / limit), // Only 1 page for allData
            currentPage: allData ? 1 : page,
            message: 'Lessons fetched successfully!',
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