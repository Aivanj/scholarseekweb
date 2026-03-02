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

// GET /api/profile/get
router.get('/get', verifyToken, (req, res) => {
    db.query('SELECT * FROM profiles WHERE user_id = ?', [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (results.length === 0) return res.json({ profile: null });
        res.json({ profile: results[0] });
    });
});

// POST /api/profile/save
router.post('/save', verifyToken, (req, res) => {
    const { full_name, year_level, gpa, major, region, gender, income } = req.body;

    const query = `
        INSERT INTO profiles (user_id, full_name, year_level, gpa, major, region, gender, income)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            full_name = VALUES(full_name),
            year_level = VALUES(year_level),
            gpa = VALUES(gpa),
            major = VALUES(major),
            region = VALUES(region),
            gender = VALUES(gender),
            income = VALUES(income)
    `;

    db.query(query, [req.user.id, full_name, year_level, gpa, major, region, gender, income], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to save profile.' });
        res.json({ message: 'Profile saved successfully!' });
    });
});

module.exports = router;