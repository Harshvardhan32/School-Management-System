const express = require('express');
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');
const {
    createAttendance,
    updateAttendance,
    getAllAttendance
} = require('../controllers/attendance/AttendanceController');
const router = express.Router();

router.post('/create', isAuth, isAdminOrTeacher, createAttendance);
router.put('/update', isAuth, isAdminOrTeacher, updateAttendance);
router.get('/attendances', isAuth, getAllAttendance);

module.exports = router;