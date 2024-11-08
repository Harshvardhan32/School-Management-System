const express = require('express');
const { isAuth, isAdminOrTeacher } = require('../middlewares/Auth');
const { createEvent, updateEvent, deleteEvent, getAllEvent } = require('../controllers/event/EventController');
const router = express.Router();

router.post('/create/event', isAuth, isAdminOrTeacher, createEvent);
router.put('/update/event', isAuth, isAdminOrTeacher, updateEvent);
router.delete('/delete/event', isAuth, isAdminOrTeacher, deleteEvent);
router.get('/events', isAuth, getAllEvent);

module.exports = router;