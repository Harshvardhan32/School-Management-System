const express = require('express');
const { isAuth, isAdmin } = require('../middlewares/Auth');
const {
    createCalendar,
    updateCalendar,
    getAllCalendars,
    deleteCalendar
} = require('../controllers/calender/CalendarController');
const router = express.Router();

router.post('/create', isAuth, isAdmin, createCalendar);
router.put('/update', isAuth, isAdmin, updateCalendar);
router.delete('/delete', isAuth, isAdmin, deleteCalendar);
router.get('/calendars', isAuth, getAllCalendars);

module.exports = router;