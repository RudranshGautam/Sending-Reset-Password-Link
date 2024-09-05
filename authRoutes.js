// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path'); // Import path module
const authController = require('../controllers/authController');

// Serve signup and login pages
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signup.html'));
});

router.post('/signup', authController.signup);

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.post('/login', authController.login);

module.exports = router;
