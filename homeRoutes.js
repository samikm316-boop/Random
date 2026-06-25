const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Route: GET /api/home/dashboard
// Retrieves profile info, level, XP, streak, and location
router.get('/dashboard', async (req, res) => {
    try {
        // Hardcoded userId for initial setup, will be replaced by auth middleware
        const userId = 1; 
        const userQuery = await pool.query(
            'SELECT name, profile_pic, level, xp, streak, location_status FROM users WHERE id = $1', 
            [userId]
        );
        res.json({ success: true, data: userQuery.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route: PUT /api/home/location
// Updates 'Home' or 'Outside' status
router.put('/location', async (req, res) => {
    const { status } = req.body;
    try {
        const userId = 1;
        await pool.query('UPDATE users SET location_status = $1 WHERE id = $2', [status, userId]);
        res.json({ success: true, message: `Location updated to ${status}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
