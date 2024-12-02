const express = require('express');
const router = express.Router();
const {
    createLesson,
    updateLesson,
    deleteLesson,
    getAllLessons
} = require('../controllers/lesson/LessonController');
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');

router.post('/create', isAuth, isAdminOrTeacher, createLesson);
router.put('/update', isAuth, isAdminOrTeacher, updateLesson);
router.delete('/delete', isAuth, isAdminOrTeacher, deleteLesson);
router.get('/lessons', isAuth, getAllLessons);

module.exports = router;