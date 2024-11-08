const Attendance = require('../../models/Attendance');

exports.createAttendance = async (req, res) => {
    try {

        const { student, classId, date, status } = req.body;

        if (!student || !classId || !date || !status) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const attendanceResponse = await Attendance.create({ student, classId, date, status });

        return res.status(200).json({
            success: true,
            data: attendanceResponse,
            message: 'Attendance created successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

exports.updateAttendance = async (req, res) => {
    try {

        const { attendanceId, student, classId, date, status } = req.body;

        if (!attendanceId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const oldAttendanceRes = await Attendance.findById(attendanceId);

        if (!oldAttendanceRes) {
            return res.status(404).json({
                success: false,
                message: 'Record not found with this ID!'
            })
        }

        const updatedAttendance = await Attendance.findByIdAndUpdate(attendanceId, { student, classId, date, status }, { new: true });

        return res.status(200).json({
            success: true,
            data: updatedAttendance,
            message: 'Attendance updated successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
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
                message: 'Please fill all required details!'
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

exports.getAttendance = async (req, res) => {
    try {

        const { attendanceId } = req.body;

        if (!attendanceId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const attendanceResponse = await Attendance.findById(attendanceId);

        return res.status(200).json({
            success: true,
            data: attendanceResponse,
            message: 'Attendance data fetched successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

exports.getAllAttendance = async (req, res) => {
    try {

        const allAttendance = await Attendance.find();

        return res.status(200).json({
            success: true,
            data: allAttendance,
            message: 'All attendance fetched successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}