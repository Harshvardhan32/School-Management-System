const express = require('express');
const router = express.Router();
const { createExam, updateExam, deleteExam, getAllExam } = require('../controllers/exam/ExamController');
const { isAuth, isAdmin } = require('../middlewares/Auth');

router.post('/create/exam', isAuth, isAdmin, createExam);
router.put('/update/exam', isAuth, isAdmin, updateExam);
router.delete('/delete/exam', isAuth, isAdmin, deleteExam);
router.get('/exams', isAuth, getAllExam);

module.exports = router;