const express = require('express');
const { isAuth, isAdmin } = require('../middlewares/Auth');
const { createAdmin, updateAdmin, getAdminDetails } = require('../controllers/admin/AdminController');
const router = express.Router();

router.post('/create', createAdmin);
router.put('/update', isAuth, isAdmin, updateAdmin);
router.get('/admin-details', isAuth, getAdminDetails);

module.exports = router;