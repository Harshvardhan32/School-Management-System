const express = require('express');
const { isAuth, isAdmin, isAdminOrTeacher } = require('../middlewares/Auth');
const {
    getAllTeachers,
    getTeacherDetails,
    createTeacher,
    updateTeacher,
    deleteTeacher
} = require('../controllers/teacher/TeacherController');
const router = express.Router();

router.post('/create', isAuth, isAdmin, createTeacher);
router.put('/update', isAuth, isAdminOrTeacher, updateTeacher);
router.delete('/delete', isAuth, isAdmin, deleteTeacher);
router.get('/teachers', isAuth, getAllTeachers);
router.get('/teacher-details', isAuth, getTeacherDetails);

module.exports = router;