const express = require('express');
const { isAuth, isAdmin, isAdminOrTeacherOrStudent } = require('../middlewares/Auth');
const {
    createStudent,
    updateStudent,
    deleteStudent,
    getAllStudents,
    getStudentDetails
} = require('../controllers/student/StudentController');
const router = express.Router();

router.post('/create', isAuth, isAdmin, createStudent);
router.put('/update', isAuth, isAdminOrTeacherOrStudent, updateStudent);
router.delete('/delete', isAuth, isAdmin, deleteStudent);
router.get('/students', isAuth, getAllStudents);
router.get('/student-details', isAuth, getStudentDetails);

module.exports = router;