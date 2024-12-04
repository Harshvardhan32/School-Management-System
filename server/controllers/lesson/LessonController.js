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
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

exports.getAllLessons = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Lesson.find();

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