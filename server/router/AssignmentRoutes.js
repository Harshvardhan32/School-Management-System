const express = require('express');
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');
const { createAssignment, updateAssignment, deleteAssignment, getAllAssignment } = require('../controllers/assignment/AssignmentController');
const router = express.Router();

router.post('/create/assignment', isAuth, isAdminOrTeacher, createAssignment);
router.put('/update/assignment', isAuth, isAdminOrTeacher, updateAssignment);
router.delete('/delete/assignment', isAuth, isAdminOrTeacher, deleteAssignment);
router.get('/assignments', isAuth, getAllAssignment);

module.exports = router;