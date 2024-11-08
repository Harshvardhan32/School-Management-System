const express = require('express');
const {
    createAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
    getAllAnnouncement
} = require('../controllers/announcement/AnnouncementController');
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');
const router = express.Router();

router.post('/create/announcement', isAuth, isAdminOrTeacher, createAnnouncement);
router.put('/update/announcement', isAuth, isAdminOrTeacher, updateAnnouncement);
router.delete('/delete/announcement', isAuth, isAdminOrTeacher, deleteAnnouncement);
router.get('/announcements', isAuth, getAllAnnouncement);

module.exports = router;