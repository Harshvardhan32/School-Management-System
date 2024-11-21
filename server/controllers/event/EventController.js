const Event = require('../../models/Event');

exports.createEvent = async (req, res) => {
    try {

        const { title, content, startDate, endDate, classes } = req.body;

        if (!title || !content || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const eventResponse = await Event.create({ title, content, startDate, endDate });

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
        const { eventId, title, content, classId, startDate, endDate } = req.body;

        if (!eventId || !title || !content || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const updatedResponse = await Event.findByIdAndUpdate(eventId, { title, content, classId, startDate, endDate }, { new: true });

        return res.status(200).json({
            success: true,
            data: updatedResponse,
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

        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required!'
            })
        }

        // Find the event with the given ID and delete the record
        const deletedResponse = await Event.findByIdAndDelete(eventId);

        // If no event was found with that ID
        if (!deletedResponse) {
            return res.status(404).json({
                success: false,
                message: 'Event not found!'
            });
        }

        // Send the successful response
        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: 'Event deleted successfully!'
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

exports.getAllEvent = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Event.find();

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
};