const express = require('express');
const router = express.Router();
const initializeDatabase = require('../db');

// Create a new group
router.post('/creategroup', async (req, res) => {
  const { name, userId } = req.body; // Get userId from request body

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const db = await initializeDatabase();
    const [results] = await db.execute('INSERT INTO `groups` (name, creator_id) VALUES (?, ?)', [name, userId]);
    const groupId = results.insertId;

    await db.execute('INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)', [userId, groupId]);

    res.status(201).json({ id: groupId, name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all groups for a specific user
router.get('/users/:userId/groups', async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  try {
    const db = await initializeDatabase();
    const [results] = await db.execute(
      'SELECT g.* FROM `groups` g JOIN user_groups ug ON g.id = ug.group_id WHERE ug.user_id = ?',
      [userId]
    );
    console.log('Groups for user:', userId);
    res.status(200).json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Search for a user by username or email
router.get('/searchuser', async (req, res) => {
  const { query } = req.query;

  try {
    const db = await initializeDatabase();
    const [rows] = await db.execute('SELECT id, user_name FROM users WHERE email = ? OR user_name = ?', [query, query]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a friend to a group by user ID
router.post('/groups/:groupId/addfriend', async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  console.log('Received groupId:', groupId);
  console.log('Received userId:', userId);

  if (!userId || !groupId) {
    return res.status(400).json({ error: 'userId and groupId are required' });
  }

  try {
    const db = await initializeDatabase();
    await db.execute('INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)', [userId, groupId]);
    res.status(201).json({ message: 'Friend added to group' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get group details
router.get('/groups/:groupId', async (req, res) => {
  const { groupId } = req.params;
  console.log(groupId);

  try {
    const db = await initializeDatabase();
    const [groupResults] = await db.execute('SELECT * FROM `groups` WHERE id = ?', [groupId]);

    if (groupResults.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const groupName = groupResults[0].name;

    const [memberResults] = await db.execute(
      'SELECT users.id, users.user_name FROM users JOIN user_groups ON users.id = user_groups.user_id WHERE user_groups.group_id = ?',
      [groupId]
    );

    res.status(200).json({ group: { ...groupResults[0], name: groupName }, members: memberResults });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a member from a group by user ID
router.delete('/groups/:groupId/removefriend', async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const db = await initializeDatabase();
    const [result] = await db.execute('DELETE FROM user_groups WHERE user_id = ? AND group_id = ?', [userId, groupId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found in group' });
    }

    res.status(200).json({ message: 'Friend removed from group' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a group
router.delete('/groups/:groupId', async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  console.log("hii",userId);

  try {
    const db = await initializeDatabase();

    // Check if the user is the creator of the group
    const [creatorResults] = await db.execute(
      'SELECT creator_id FROM `groups` WHERE id = ?',
      [groupId]
    );

    if (creatorResults.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const creatorId = creatorResults[0].creator_id;

    if (creatorId !== parseInt(userId, 10)) {
      return res.status(403).json({ error: 'You are not authorized to delete this group' });
    }

    // Delete the group
    await db.execute('DELETE FROM `groups` WHERE id = ?', [groupId]);
    await db.execute('DELETE FROM user_groups WHERE group_id = ?', [groupId]);

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
