const Event = require('../../models/Event');

exports.createEvent = async (req, res) => {
    try {

        const {
            title,
            content,
            classes,
            startDate,
            endDate,
        } = req.body;

        if (!title || !content || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const eventResponse = await Event.create({
            title,
            content,
            classes,
            startDate,
            endDate,
        });

        return res.status(200).json({
            success: true,
            data: eventResponse,
            message: 'Event created successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const {
            id,
            title,
            content,
            classes,
            startDate,
            endDate
        } = req.body;

        if (!id || !title || !content || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        // Check for existing Event by id
        const existingEvent = await Event.findById(id);

        if (!existingEvent) {
            return res.status(400).json({
                success: false,
                message: 'Event not found with the given ID.'
            });
        }

        const updatedEvent = await Event.findByIdAndUpdate(id,
            {
                title,
                content,
                classes,
                startDate,
                endDate
            }, { new: true });

        return res.status(200).json({
            success: true,
            data: updatedEvent,
            message: 'Event updated successfully!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

exports.deleteEvent = async (req, res) => {
    try {

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required!'
            })
        }

        const existingEvent = await Event.findById(_id);

        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found with the given ID!'
            })
        }

        const deletedEvent = await Event.findByIdAndDelete(_id);

        // Send the successful response
        return res.status(200).json({
            success: true,
            data: deletedEvent,
            message: 'Event Deleted Successfully!'
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

exports.getAllEvent = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Event.find().populate('classes');

        if (!allData) {
            query = query.skip(skip).limit(limit); // Apply pagination if allData is false
        }

        const data = await query;
        const total = allData ? data.length : await Event.countDocuments();

        return res.status(200).json({
            success: true,
            data,
            total,
            totalPages: allData ? 1 : Math.ceil(total / limit), // Only 1 page for allData
            currentPage: allData ? 1 : page,
            message: 'Events fetched successfully!',
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!',
        });
    }
}



exports.deleteLesson = async (req, res) => {
    try {
        const { _id } = req.body;

        // Validate _id
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Lesson ID is required!',
            });
        }

        // Fetch the existing lesson
        const existingLesson = await Lesson.findById(_id);

        if (!existingLesson) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found with the given ID!',
            });
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
            message: 'Lesson deleted successfully!',
        });
    } catch (error) {
        console.error('Error deleting lesson:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!',
        });
    }
};