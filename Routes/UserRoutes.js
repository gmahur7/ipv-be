const express = require('express');
const { registerUser, loginUser, logoutUser, userProfile, updateUserClick, fetchAllUsers } = require('../Controllers/UserControllers'); // Import controllers
const { isAuthenticated, isAdminAuthenticated } = require('../Middleware/Authentication');

const router = express.Router();

router.route('/').post(registerUser).get(isAdminAuthenticated,fetchAllUsers);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/profile', isAuthenticated,userProfile);
router.put('/update-click',updateUserClick);

module.exports = router;
