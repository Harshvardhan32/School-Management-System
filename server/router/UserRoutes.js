const express = require('express');
const { updateProfilePicture } = require('../controllers/user/User');
const { isAuth } = require('../middlewares/Auth');
const router = express.Router();

router.put('/update-profile-picture', isAuth, updateProfilePicture);

module.exports = router;