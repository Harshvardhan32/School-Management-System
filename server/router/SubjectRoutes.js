const express = require('express');
const router = express.Router();
const {
    createSubject,
    updateSubject,
    deleteSubject,
    getAllSubject
} = require('../controllers/subject/SubjectController');
const { isAuth, isAdmin } = require('../middlewares/Auth');

router.post('/create', isAuth, isAdmin, createSubject);
router.put('/update', isAuth, isAdmin, updateSubject);
router.delete('/delete', isAuth, isAdmin, deleteSubject);
router.get('/subjects', isAuth, getAllSubject);

module.exports = router;