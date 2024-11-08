const express = require('express');
const router = express.Router();
const { createClass, updateClass, deleteClass, getAllClasses } = require('../controllers/class/ClassController');
const { isAuth, isAdmin } = require('../middlewares/Auth');

router.post('/create/class', isAuth, isAdmin, createClass);
router.put('/update/class', isAuth, isAdmin, updateClass);
router.delete('/delete/class', isAuth, isAdmin, deleteClass);
router.get('/classes', isAuth, getAllClasses);

module.exports = router;