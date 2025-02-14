const Calendar = require("../../models/Calendar");

// Create a new calendar
exports.createCalendar = async (req, res) => {
    try {
        const { classId, dayOfWeek, schedule } = req.body;

        if (!classId || !dayOfWeek || !schedule) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        // Check if a calendar for the class on the specified day already exists
        const existingCalendar = await Calendar.findOne({ classId, dayOfWeek });

        if (existingCalendar) {
            return res.status(400).json({
                success: false,
                message: "A calendar for this class on this day already exists."
            });
        }

        // Create a new calendar
        const calendar = new Calendar({
            classId,
            dayOfWeek,
            schedule
        });

        await calendar.save();

        return res.status(201).json({
            success: true,
            data: calendar,
            message: "Calendar created successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

// Update an existing calendar
exports.updateCalendar = async (req, res) => {
    try {
        const { id, schedule } = req.body;

        if (!id || !schedule) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        // Find the calendar by ID
        const calendar = await Calendar.findById(id);
        if (!calendar) {
            return res.status(404).json({
                success: false,
                message: "Calendar not found."
            });
        }

        // Update the schedule
        calendar.schedule = schedule;

        await calendar.save();

        return res.status(200).json({
            success: true,
            data: calendar,
            message: "Calendar updated successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

exports.deleteCalendar = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Calendar ID is required!'
            });
        }

        await Calendar.findByIdAndDelete(_id);

        return res.status(200).json({
            success: true,
            message: 'Calendar deleted successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.getAllCalendars = async (req, res) => {
    try {
        const calendarData = await Calendar.find()
            .populate('classId')
            .populate('schedule.subject')
            .populate({
                path: 'schedule.teacher',
                populate: {
                    path: 'userId'
                }
            }).sort({ dayOfWeek: 1 });

        return res.status(200).json({
            success: true,
            data: calendarData,
            message: 'All Calendars fetched successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}