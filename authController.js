// controllers/authController.js
const db = require('../db/connection');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await db.query('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);

        // Redirect to login or home page
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'An error occurred during signup' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch the user from the database
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];

        // Check the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Successful login
        res.redirect('/home'); // Redirect to a successful login page or dashboard
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};
