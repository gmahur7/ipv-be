const express = require('express');
const router = express.Router();
const { adminLogin } = require('../Controllers/AdminController');

router.post('/login', adminLogin);

module.exports = router;
