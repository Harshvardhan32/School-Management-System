const express = require('express');
const { isAuth } = require('../middlewares/Auth');
const { updateProfilePicture } = require('../controllers/user/User');
const router = express.Router();

router.put('/update-profile-picture', isAuth, updateProfilePicture);

module.exports = router;