const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const SECRET = 'scholarseek_secret_key';

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    db.query('SELECT id FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (results.length > 0) return res.status(409).json({ error: 'Email is already registered.' });

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
            [full_name, email, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json({ error: 'Failed to create account.' });

                const token = jwt.sign(
                    { id: result.insertId, email, full_name },
                    SECRET,
                    { expiresIn: '7d' }
                );

                res.status(201).json({
                    message: 'Account created successfully!',
                    token,
                    user: { id: result.insertId, full_name, email }
                });
            }
        );
    });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password.' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

        const token = jwt.sign(
            { id: user.id, email: user.email, full_name: user.full_name },
            SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: { id: user.id, full_name: user.full_name, email: user.email }
        });
    });
});

module.exports = router;