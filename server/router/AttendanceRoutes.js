const express = require('express');
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');
const {
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAllAttendance
} = require('../controllers/attendance/AttendanceController');
const router = express.Router();

router.post('/create', isAuth, isAdminOrTeacher, createAttendance);
router.put('/update', isAuth, isAdminOrTeacher, updateAttendance);
router.delete('/delete', isAuth, isAdminOrTeacher, deleteAttendance);
router.get('/attendances', isAuth, getAllAttendance);

module.exports = router;