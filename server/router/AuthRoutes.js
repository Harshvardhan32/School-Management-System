const express = require('express');
const router = express.Router();
const {
    signUp,
    login,
    changePassword,
    resetPasswordToken,
    resetPassword,
    deleteAccount
} = require('../controllers/auth/Auth');
const { isAuth, isAdmin } = require('../middlewares/Auth');

router.post('/auth/signup', signUp)
router.post('/auth/login', login)
router.put('/auth/change-password', isAuth, changePassword);
router.post('/auth/reset-password-token', resetPasswordToken);
router.put('/auth/reset-password', isAuth, resetPassword);
router.delete('/auth/delete-account', isAuth, isAdmin, deleteAccount);

module.exports = router;