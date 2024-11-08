const express = require('express');
const router = express.Router();
const { createSubject, updateSubject, deleteSubject, getAllSubject } = require('../controllers/subject/SubjectController');
const { isAuth, isAdmin } = require('../middlewares/Auth');

router.post('/create/subject', isAuth, isAdmin, createSubject);
router.put('/update/subject', isAuth, isAdmin, updateSubject);
router.delete('/delete/subject', isAuth, isAdmin, deleteSubject);
router.get('/subjects', isAuth, getAllSubject);

module.exports = router;