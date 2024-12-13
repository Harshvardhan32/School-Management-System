const express = require('express');
const router = express.Router();
const {
    login,
    changePassword,
    resetPasswordToken,
    resetPassword,
    deleteAccount
} = require('../controllers/auth/Auth');
const { isAuth, isAdmin } = require('../middlewares/Auth');

router.post('/login', login)
router.put('/change-password', isAuth, changePassword);
router.post('/reset-password-token', resetPasswordToken);
router.put('/reset-password', resetPassword);
router.delete('/delete-account', isAuth, isAdmin, deleteAccount);

module.exports = router;