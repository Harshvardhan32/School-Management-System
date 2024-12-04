const express = require('express');
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');
const {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAllAssignments
} = require('../controllers/assignment/AssignmentController');
const router = express.Router();

router.post('/create', isAuth, isAdminOrTeacher, createAssignment);
router.put('/update', isAuth, isAdminOrTeacher, updateAssignment);
router.delete('/delete', isAuth, isAdminOrTeacher, deleteAssignment);
router.get('/assignments', isAuth, getAllAssignments);

module.exports = router;