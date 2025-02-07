const express = require('express');
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');
const {
    createMessage,
    updateMessage,
    deleteMessage,
    getAllMessages
} = require('../controllers/message/MessageController');
const router = express.Router();

router.post('/create', isAuth, isAdminOrTeacher, createMessage);
router.put('/update', isAuth, isAdminOrTeacher, updateMessage);
router.delete('/delete', isAuth, isAdminOrTeacher, deleteMessage);
router.get('/messages', isAuth, getAllMessages);

module.exports = router;