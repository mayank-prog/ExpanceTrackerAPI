const path = require('path');
const express = require('express');
const UserController = require('../controllers/user.js'); 

const router = express.Router();

router.post('/login', UserController.user_login);

router.post('/signup', UserController.user_signup);

router.post('/password', UserController.forgot_password);

module.exports = router;