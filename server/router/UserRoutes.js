const express = require('express');
const {
    updateProfilePicture,
    getUserDetails,
    getAllTeachers,
    getAllStudents,
    getAllParents
} = require('../controllers/user/User');
const { isAuth } = require('../middlewares/Auth');
const router = express.Router();

router.put('/update-profile-picture', isAuth, updateProfilePicture);
router.get('/details', isAuth, getUserDetails);
router.get('/teachers', isAuth, getAllTeachers);
router.get('/students', isAuth, getAllStudents);
router.get('/parents', isAuth, getAllParents);

module.exports = router;