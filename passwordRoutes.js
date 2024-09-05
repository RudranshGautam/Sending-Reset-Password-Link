const express = require('express');
const passwordController = require('../controllers/passwordController');

const router = express.Router();

// Forgot password route
router.post('/forgotpassword', passwordController.forgotPassword);

// Reset password form route
router.get('/resetpassword/:token', passwordController.getResetPasswordForm);

// Reset password route
router.post('/resetpassword/:token', passwordController.resetPassword);

module.exports = router;
