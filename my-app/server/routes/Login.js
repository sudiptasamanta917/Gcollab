const express = require('express');
const router = express.Router();
const initializeDatabase = require('../db');

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login request received:', email); // Log email for tracking

    try {
        const db = await initializeDatabase();
        const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) {
            console.log('No user found with email:', email); // Log when no user is found
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        if (password !== user.password) {
            console.log('Invalid password for user:', email); // Log when password is incorrect
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log('User authenticated successfully:', email); // Log successful authentication
        res.json({ success: true, message: 'Login successful', userId: user.id });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;
