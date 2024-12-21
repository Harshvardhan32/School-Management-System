const express = require('express');
const router = express.Router();
const { createCalendar, updateCalendar, getAllCalendars } = require('../controllers/calender/CalendarController');
const { isAuth, isAdmin } = require('../middlewares/Auth');

router.post('/create', isAuth, isAdmin, createCalendar);
router.put('/update', isAuth, isAdmin, updateCalendar);
router.get('/calendars', isAuth, getAllCalendars);

module.exports = router;