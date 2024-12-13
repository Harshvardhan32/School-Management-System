const express = require('express');
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');
const {
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents } = require('../controllers/event/EventController');
const router = express.Router();

router.post('/create', isAuth, isAdminOrTeacher, createEvent);
router.put('/update', isAuth, isAdminOrTeacher, updateEvent);
router.delete('/delete', isAuth, isAdminOrTeacher, deleteEvent);
router.get('/events', isAuth, getAllEvents);

module.exports = router;