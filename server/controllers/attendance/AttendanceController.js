const Attendance = require('../../models/Attendance');
const Student = require('../../models/Student');

// Function to create attendance
exports.createAttendance = async (req, res) => {
    try {

        const { date, classId, studentAttendance } = req.body;

        if (!date || !classId || !studentAttendance) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        // Check for existing attendance record
        const existingAttendance = await Attendance.findOne({ date, classId });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: 'Attendance record already exists for the selected date and class!',
            });
        }

        const attendanceResponse = await Attendance.create({
            date,
            classId,
            studentAttendance
        });

        const studentIds = studentAttendance?.map((item) => item.student);

        await Student.updateMany(
            { _id: { $in: studentIds } },
            { attendance: attendanceResponse?._id }
        );

        return res.status(200).json({
            success: true,
            data: attendanceResponse,
            message: 'Attendance Created Successfully!'
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

// Function to update attendance
exports.updateAttendance = async (req, res) => {
    try {

        const { id, date, classId, studentAttendance } = req.body;

        if (!id || !date || !classId || !studentAttendance) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        // Find the attendance record by ID
        const existingAttendance = await Attendance.findById(id);

        if (!existingAttendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found!"
            });
        }

        let hasChanges = false;

        // Update status only if it has changed
        existingAttendance.studentAttendance.forEach((existingRecord) => {
            const updatedRecord = studentAttendance.find(
                (newRecord) => String(newRecord.student) === String(existingRecord.student)
            );
            if (updatedRecord && updatedRecord.status !== existingRecord.status) {
                existingRecord.status = updatedRecord.status; // Update the status
                hasChanges = true;
            }
        });

        if (hasChanges) {
            // Save the updated attendance document
            await existingAttendance.save();
        }

        return res.status(200).json({
            success: true,
            data: existingAttendance,
            message: 'Attendance Updated Successfully!'
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

// Function to get all attendance
exports.getAllAttendance = async (req, res) => {
    try {
        const attendanceData = await Attendance.find()
            .populate({
                path: 'studentAttendance.student',
                populate: [
                    { path: 'userId' },
                    { path: 'classId' }
                ]
            });

        return res.status(200).json({
            success: true,
            data: attendanceData,
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
}