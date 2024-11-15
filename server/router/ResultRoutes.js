const express = require('express');
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');
const {
    createResult,
    updateResult,
    deleteResult,
    getResult,
    getAllResult
} = require('../controllers/result/ResultController');
const router = express.Router();

router.post('/create', isAuth, isAdminOrTeacher, createResult);
router.put('/update', isAuth, isAdminOrTeacher, updateResult);
router.delete('/delete', isAuth, isAdminOrTeacher, deleteResult);
router.get('/result-details', isAuth, getResult);
router.get('/results', isAuth, getAllResult);

module.exports = router;