const express = require('express');
const cors = require('cors');
const pool = require('./db/db').default; // Import PostgreSQL connection pool
const accountsRouter = require('./routes/accounts'); // Import accountsRouter
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory cache
const cache = new Map();

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the WIRA API!');
});

// Accounts Router
app.use('/api/accounts', accountsRouter);

// GET accounts with search, pagination, and caching
app.get('/api/accounts', async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    const cacheKey = `accounts:${page}:${search}`;

    try {
        if (cache.has(cacheKey)) {
            return res.status(200).json(cache.get(cacheKey));
        }

        const query = `
            SELECT * FROM Account
            WHERE username ILIKE $1 OR email ILIKE $1
            ORDER BY acc_id ASC
            LIMIT $2 OFFSET $3
        `;
        const accountsResult = await pool.query(query, [`%${search}%`, limit, offset]);

        const countQuery = `
            SELECT COUNT(*) AS total FROM Account
            WHERE username ILIKE $1 OR email ILIKE $1
        `;
        const countResult = await pool.query(countQuery, [`%${search}%`]);
        const totalCount = parseInt(countResult.rows[0].total);

        const response = {
            success: true,
            data: accountsResult.rows,
            pagination: {
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: parseInt(page),
            },
        };

        cache.set(cacheKey, response);

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching accounts:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Rankings API with caching
app.get('/api/rankings', async (req, res) => {
    const { search = '' } = req.query; // Get the search query
    const cacheKey = `rankings:${search}`;

    try {
        if (cache.has(cacheKey)) {
            console.log('Returning cached rankings...');
            return res.status(200).json({ success: true, data: cache.get(cacheKey) });
        }

        const query = `
            SELECT a.username, SUM(s.reward_score) AS total_score
            FROM Account a
            JOIN Character c ON a.acc_id = c.acc_id
            JOIN Scores s ON c.char_id = s.char_id
            WHERE a.username ILIKE $1
            GROUP BY a.username
            ORDER BY total_score DESC
            LIMIT 10;
        `;
        const result = await pool.query(query, [`%${search}%`]);

        cache.set(cacheKey, result.rows);

        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching rankings:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Fetch scores for a specific character
app.get('/api/characters/:id/scores', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM Scores WHERE char_id = $1', [id]);

        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching scores:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Top 10 players by score
app.get('/api/accounts/top', async (_req, res) => {
    try {
        const query = `
            SELECT acc_id, username, email, total_score
            FROM Account
            ORDER BY total_score DESC
            LIMIT 10
        `;
        const result = await pool.query(query);

        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching top accounts:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
