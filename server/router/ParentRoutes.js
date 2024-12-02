const express = require('express');
const { isAuth, isAdmin, isAdminOrParent } = require('../middlewares/Auth');
const {
    createParent,
    updateParent,
    deleteParent,
    getAllParents
} = require('../controllers/parent/Parent');
const router = express.Router();

router.post('/create', isAuth, isAdmin, createParent);
router.put('/update', isAuth, isAdminOrParent, updateParent);
router.delete('/delete', isAuth, isAdmin, deleteParent);
router.get('/parents', isAuth, getAllParents);

module.exports = router;