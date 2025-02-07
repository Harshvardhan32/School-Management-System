const express = require('express');
const { isAuth } = require('../middlewares/Auth');
const {
    login,
    changePassword,
    resetPasswordToken,
    resetPassword
} = require('../controllers/auth/Auth');
const router = express.Router();

router.post('/login', login)
router.put('/change-password', isAuth, changePassword);
router.post('/reset-password-token', resetPasswordToken);
router.put('/reset-password', resetPassword);

module.exports = router;