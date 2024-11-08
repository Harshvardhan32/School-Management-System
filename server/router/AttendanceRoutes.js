const express = require('express');
const { isAuth,  isAdminOrTeacher } = require('../middlewares/Auth');
const { createAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendance/AttendanceController');
const router = express.Router();

router.post('/create/attendance', isAuth, isAdminOrTeacher, createAttendance);
router.put('/update/attendance', isAuth, isAdminOrTeacher, updateAttendance);
router.delete('/delete/attendance', isAuth, isAdminOrTeacher, deleteAttendance);
// router.get('/attendance', isAuth, getAttendance);
// router.get('/attendances', isAuth, getAllAttendance);

module.exports = router;