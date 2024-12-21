const express = require('express');
const router = express.Router();
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');
const {
    createAttendance,
    updateAttendance,
    getAllAttendance
} = require('../controllers/attendance/AttendanceController');

router.post('/create', isAuth, isAdminOrTeacher, createAttendance);
router.put('/update', isAuth, isAdminOrTeacher, updateAttendance);
router.get('/attendances', isAuth, getAllAttendance);

module.exports = router;