const express = require('express');
const { isAuth, isAdmin } = require('../middlewares/Auth');
const {
    createClass,
    updateClass,
    deleteClass,
    getAllClasses } = require('../controllers/class/ClassController');
const router = express.Router();

router.post('/create', isAuth, isAdmin, createClass);
router.put('/update', isAuth, isAdmin, updateClass);
router.delete('/delete', isAuth, isAdmin, deleteClass);
router.get('/classes', isAuth, getAllClasses);

module.exports = router;