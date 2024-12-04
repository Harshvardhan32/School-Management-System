const express = require('express');
const router = express.Router();
const {
    createSubject,
    updateSubject,
    deleteSubject,
    getAllSubjects
} = require('../controllers/subject/SubjectController');
const { isAuth, isAdmin, isAdminOrTeacher } = require('../middlewares/Auth');

router.post('/create', isAuth, isAdmin, createSubject);
router.put('/update', isAuth, isAdminOrTeacher, updateSubject);
router.delete('/delete', isAuth, isAdmin, deleteSubject);
router.get('/subjects', isAuth, getAllSubjects);

module.exports = router;