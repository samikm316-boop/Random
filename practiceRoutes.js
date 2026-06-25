const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Route: GET /api/practice/notes/:id/flashcards
// Get instant flashcards generated from a note
router.get('/notes/:id/flashcards', async (req, res) => {
    const { id } = req.params;
    try {
        const flashcards = await pool.query('SELECT * FROM flashcards WHERE note_id = $1', [id]);
        res.json(flashcards.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route: GET /api/practice/notes/:id/quiz
// Get quiz data and saved states
router.get('/notes/:id/quiz', async (req, res) => {
    const { id } = req.params;
    try {
        const quiz = await pool.query('SELECT * FROM quizzes WHERE note_id = $1', [id]);
        res.json(quiz.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
