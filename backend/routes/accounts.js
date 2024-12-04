const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// Fetch all accounts
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Account');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a new account
router.post('/', async (req, res) => {
    const { username, email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Account (username, email) VALUES ($1, $2) RETURNING *',
            [username, email]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
