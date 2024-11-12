const Event = require('../../models/Event');

exports.createEvent = async (req, res) => {
    try {

        const { title, content, startTime, endTime } = req.body;

        if (!title || !content || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const eventResponse = await Event.create({ title, content, startTime, endTime });

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
        const { eventId, title, content, classId, startTime, endTime } = req.body;

        if (!eventId || !title || !content || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const updatedResponse = await Event.findByIdAndUpdate(eventId, { title, content, classId, startTime, endTime }, { new: true });

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

        const allEvents = await Event.find();

        return res.status(200).json({
            success: false,
            data: allEvents,
            message: 'All events fetched successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}