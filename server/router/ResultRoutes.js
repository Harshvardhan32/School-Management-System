const express = require('express');
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');
const { createResult, updateResult, deleteResult, getResult, getAllResult } = require('../controllers/result/ResultController');
const router = express.Router();

router.post('/create/result', isAuth, isAdminOrTeacher, createResult);
router.put('/update/result', isAuth, isAdminOrTeacher, updateResult);
router.delete('/delete/result', isAuth, isAdminOrTeacher, deleteResult);
router.get('/result', isAuth, getResult);
router.get('/results', isAuth, getAllResult);

module.exports = router;