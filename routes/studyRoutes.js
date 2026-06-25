const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Route: POST /api/study/subjects
// Creates a new subject folder
router.post('/subjects', async (req, res) => {
    const { name } = req.body;
    try {
        const userId = 1;
        const result = await pool.query(
            'INSERT INTO subjects (user_id, name) VALUES ($1, $2) RETURNING *', 
            [userId, name]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route: POST /api/study/notes
// Creates a plain or AI-enhanced note
router.post('/notes', async (req, res) => {
    const { subject_id, title, content, is_enhanced, ai_metadata } = req.body;
    try {
        const userId = 1;
        const result = await pool.query(
            'INSERT INTO notes (user_id, subject_id, title, content, is_enhanced, ai_metadata) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, subject_id, title, content, is_enhanced, ai_metadata]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route: GET /api/study/notes
// Gets all notes for a user
router.get('/notes', async (req, res) => {
    try {
        const userId = 1;
        const result = await pool.query('SELECT * FROM notes WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route: DELETE /api/study/notes/:id
// Long press to delete a note
router.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM notes WHERE id = $1', [id]);
        res.json({ success: true, message: 'Note deleted permanently' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
