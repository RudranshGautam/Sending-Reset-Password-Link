const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendinblue = require('nodemailer-sendinblue');
const db = require('../db/connection');

// Setup Sendinblue transporter
const transporter = nodemailer.createTransport(sendinblue({
    apiKey: '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'
}));

// Forgot Password Request
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        // Check if the user exists
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (!user.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = user[0].id;
        const resetToken = uuidv4();

        // Insert a new password reset request
        await db.query(
            'INSERT INTO ForgotPasswordRequests (id, userId, isactive) VALUES (?, ?, true)',
            [resetToken, userId]
        );

        const resetUrl = `http://localhost:3000/password/resetpassword/${resetToken}`;

        const mailOptions = {
            from: 'gunnusharma981@gmail.com',  // Your sender email
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click here to reset your password: ${resetUrl}`
        };

        // Send email with reset link
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Error processing forgot password request:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Check if the token exists and is active
        const [resetRequest] = await db.query(
            'SELECT * FROM ForgotPasswordRequests WHERE id = ? AND isactive = true',
            [token]
        );

        if (!resetRequest.length) {
            return res.status(404).json({ message: 'Invalid or expired token' });
        }

        const userId = resetRequest[0].userId;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        // Set the request as inactive
        await db.query('UPDATE ForgotPasswordRequests SET isactive = false WHERE id = ?', [token]);

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
};

// Get Reset Password Form
exports.getResetPasswordForm = async (req, res) => {
    const { token } = req.params;

    // Verify token before showing the reset form
    const [resetRequest] = await db.query(
        'SELECT * FROM ForgotPasswordRequests WHERE id = ? AND isactive = true',
        [token]
    );

    if (!resetRequest.length) {
        return res.status(404).send('Invalid or expired token');
    }

    res.sendFile(path.join(__dirname, '../views/reset-password.html'));
};
