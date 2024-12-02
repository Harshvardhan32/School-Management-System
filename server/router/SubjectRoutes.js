const express = require('express');
const router = express.Router();
const {
    createSubject,
    updateSubject,
    deleteSubject,
    getAllSubjects
} = require('../controllers/subject/SubjectController');
const { isAuth, isAdmin } = require('../middlewares/Auth');

router.post('/create', isAuth, createSubject);
router.put('/update', isAuth, isAdmin, updateSubject);
router.delete('/delete', isAuth, isAdmin, deleteSubject);
router.get('/subjects', isAuth, getAllSubjects);

module.exports = router;