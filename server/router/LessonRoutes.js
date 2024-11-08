const express = require('express');
const router = express.Router();
const { createLesson, updateLesson, deleteLesson, getAllLesson } = require('../controllers/lesson/LessonController');
const { isAuth, isAdmin } = require('../middlewares/Auth');

router.post('/create/lesson', isAuth, isAdmin, createLesson);
router.put('/update/lesson', isAuth, isAdmin, updateLesson);
router.delete('/delete/lesson', isAuth, isAdmin, deleteLesson);
router.get('/lessons', isAuth, getAllLesson);

module.exports = router;