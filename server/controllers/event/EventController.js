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

exports.getAllEvents = async (req, res) => {
    try {
        let eventData = await Event.find()
            .populate('classes')
            .sort({ title: 1 });

        return res.status(200).json({
            success: true,
            data: eventData,
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