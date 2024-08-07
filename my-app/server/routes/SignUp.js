const express = require('express');
const router = express.Router();
const initializeDatabase = require('../db');

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate request body
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)';

  try {
    const db = await initializeDatabase();
    await db.execute(sql, [username, email, password]);
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;
