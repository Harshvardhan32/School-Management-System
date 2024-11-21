const Attendance = require('../../models/Attendance');
const Student = require('../../models/Student');

// Function to create attendance
exports.createAttendance = async (req, res) => {
    try {

        const {
            student,
            classId,
            date,
            status
        } = req.body;

        if (!student || !classId || !date || !status) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const attendanceResponse = await Attendance.create({
            student,
            classId,
            date,
            status
        });

        await Student.findById(student,
            { $push: { attendance: attendanceResponse?._id } }
            , { new: true });

        return res.status(200).json({
            success: true,
            data: attendanceResponse,
            message: 'Attendance created successfully!'
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

// Function to update attendance
exports.updateAttendance = async (req, res) => {
    try {

        const {
            attendanceId,
            student,
            classId,
            date,
            status
        } = req.body;

        if (!attendanceId) {
            return res.status(400).json({
                success: false,
                message: 'Attendance ID is required!'
            })
        }

        const attendanceData = await Attendance.findById(attendanceId);

        if (!attendanceData) {
            return res.status(404).json({
                success: false,
                message: 'Attendance not found with the given ID!'
            })
        }

        const updatedResponse = await Attendance.findByIdAndUpdate(attendanceId, {
            student,
            classId,
            date,
            status
        }, { new: true })
            // .populate('student')
            // .populate('classId')
            ;

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: 'Attendance updated successfully!'
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

exports.deleteAttendance = async (req, res) => {
    try {

        const { attendanceId } = req.params;

        if (!attendanceId) {
            return res.status(400).json({
                success: false,
                message: 'Attendance ID is required!'
            })
        }

        const deletedResponse = await Attendance.findByIdAndDelete(attendanceId);

        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: 'Attendance deleted successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

// Function to get all attendance
exports.getAllAttendance = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Attendance.find()
            .populate('student')
            .populate('classId');

        if (!allData) {
            query = query.skip(skip).limit(limit); // Apply pagination if allData is false
        }

        const data = await query;
        const total = allData ? data.length : await Attendance.countDocuments();

        return res.status(200).json({
            success: true,
            data,
            total,
            totalPages: allData ? 1 : Math.ceil(total / limit), // Only 1 page for allData
            currentPage: allData ? 1 : page,
            message: 'Attendance records fetched successfully!',
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