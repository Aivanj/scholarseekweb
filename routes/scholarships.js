const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET = 'scholarseek_secret_key';

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided.' });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

// GET /api/scholarships/saved
router.get('/saved', verifyToken, (req, res) => {
    db.query('SELECT scholarship_id FROM saved_scholarships WHERE user_id = ?', [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.json({ saved: results.map(r => r.scholarship_id) });
    });
});

// POST /api/scholarships/save
router.post('/save', verifyToken, (req, res) => {
    const { scholarship_id } = req.body;

    db.query('SELECT id FROM saved_scholarships WHERE user_id = ? AND scholarship_id = ?', [req.user.id, scholarship_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error.' });

        if (results.length > 0) {
            db.query('DELETE FROM saved_scholarships WHERE user_id = ? AND scholarship_id = ?', [req.user.id, scholarship_id], (err) => {
                if (err) return res.status(500).json({ error: 'Failed to unsave.' });
                res.json({ message: 'Scholarship unsaved.', saved: false });
            });
        } else {
            db.query('INSERT INTO saved_scholarships (user_id, scholarship_id) VALUES (?, ?)', [req.user.id, scholarship_id], (err) => {
                if (err) return res.status(500).json({ error: 'Failed to save.' });
                res.json({ message: 'Scholarship saved!', saved: true });
            });
        }
    });
});

// GET /api/scholarships/progress
router.get('/progress', verifyToken, (req, res) => {
    db.query('SELECT scholarship_id, status FROM application_progress WHERE user_id = ?', [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        const progress = { planning: [], inProgress: [], submitted: [] };
        results.forEach(r => { if (progress[r.status]) progress[r.status].push(r.scholarship_id); });
        res.json({ progress });
    });
});

// POST /api/scholarships/progress/add
router.post('/progress/add', verifyToken, (req, res) => {
    const { scholarship_id, status } = req.body;
    db.query('INSERT IGNORE INTO application_progress (user_id, scholarship_id, status) VALUES (?, ?, ?)', [req.user.id, scholarship_id, status], (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to add to progress.' });
        if (result.affectedRows === 0) return res.status(409).json({ error: 'Already in progress tracker.' });
        res.json({ message: 'Added to progress!' });
    });
});

// PUT /api/scholarships/progress/move
router.put('/progress/move', verifyToken, (req, res) => {
    const { scholarship_id, status } = req.body;
    db.query('UPDATE application_progress SET status = ? WHERE user_id = ? AND scholarship_id = ?', [status, req.user.id, scholarship_id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to update progress.' });
        res.json({ message: 'Progress updated!' });
    });
});

// DELETE /api/scholarships/progress/remove
router.delete('/progress/remove', verifyToken, (req, res) => {
    const { scholarship_id } = req.body;
    db.query('DELETE FROM application_progress WHERE user_id = ? AND scholarship_id = ?', [req.user.id, scholarship_id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to remove.' });
        res.json({ message: 'Removed from progress.' });
    });
});

module.exports = router;