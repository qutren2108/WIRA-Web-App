const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const pool = require('./db/db').default; // Import PostgreSQL connection pool
const accountsRouter = require('./routes/accounts'); // Import accountsRouter
=======
const pool = require('./db/db'); // Import PostgreSQL connection pool
>>>>>>> origin/main
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

<<<<<<< HEAD
// Accounts Router
app.use('/api/accounts', accountsRouter);

=======
>>>>>>> origin/main
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
<<<<<<< HEAD
        console.error('Error fetching accounts:', error.message);
=======
        console.error('Error fetching accounts:', error);
>>>>>>> origin/main
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

<<<<<<< HEAD
// Rankings API with caching
=======
// POST to create a new account
app.post('/api/accounts', async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ success: false, message: 'Username and Email are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO Account (username, email) VALUES ($1, $2) RETURNING *',
            [username, email]
        );

        cache.clear();

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ success: false, message: 'Error creating account' });
    }
});

// PUT to update an account
app.put('/api/accounts/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ success: false, message: 'Username and Email are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE Account SET username = $1, email = $2 WHERE acc_id = $3 RETURNING *',
            [username, email, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        cache.clear();

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ success: false, message: 'Error updating account' });
    }
});

// DELETE an account
app.delete('/api/accounts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM Account WHERE acc_id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        cache.clear();

        res.status(200).json({ success: true, message: 'Account deleted' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ success: false, message: 'Error deleting account' });
    }
});

// Fetch characters with pagination
app.get('/api/accounts/:acc_id/characters', async (req, res) => {
    const { acc_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const query = `
            SELECT * FROM Character
            WHERE acc_id = $1
            ORDER BY char_id ASC
            LIMIT $2 OFFSET $3
        `;
        const result = await pool.query(query, [acc_id, limit, offset]);

        const countQuery = `
            SELECT COUNT(*) AS total FROM Character
            WHERE acc_id = $1
        `;
        const countResult = await pool.query(countQuery, [acc_id]);
        const totalCount = parseInt(countResult.rows[0].total);

        res.status(200).json({
            success: true,
            data: result.rows,
            pagination: {
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: parseInt(page),
            },
        });
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Delete a character
app.delete('/api/characters/:char_id', async (req, res) => {
    const { char_id } = req.params;

    try {
        const result = await pool.query('DELETE FROM Character WHERE char_id = $1', [char_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Character not found' });
        }

        res.status(200).json({ success: true, message: 'Character deleted' });
    } catch (error) {
        console.error('Error deleting character:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Rankings with caching
>>>>>>> origin/main
app.get('/api/rankings', async (req, res) => {
    const { search = '' } = req.query; // Get the search query
    const cacheKey = `rankings:${search}`;

    try {
        if (cache.has(cacheKey)) {
            console.log('Returning cached rankings...');
<<<<<<< HEAD
=======
            console.log(`Searching for rankings with search term: ${search}`);
>>>>>>> origin/main
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

<<<<<<< HEAD
=======
        if (result.rows.length === 0) {
            console.log('No rankings data found');
        } else {
            console.log('Rankings fetched:', result.rows);
        }

>>>>>>> origin/main
        cache.set(cacheKey, result.rows);

        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
<<<<<<< HEAD
        console.error('Error fetching rankings:', error.message);
=======
        console.error('Error fetching rankings:', error);
>>>>>>> origin/main
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

<<<<<<< HEAD
// Fetch scores for a specific character
app.get('/api/characters/:id/scores', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM Scores WHERE char_id = $1', [id]);

        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching scores:', error.message);
=======
// Get scores for a specific character
app.get('/api/characters/:id/scores', async (req, res) => {
    const { id } = req.params; // Character ID
    try {
        const result = await pool.query('SELECT * FROM Scores WHERE char_id = $1', [id]);
        console.log('Scores fetched:', result.rows);
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching scores:', error);
>>>>>>> origin/main
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

<<<<<<< HEAD
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

=======
>>>>>>> origin/main
// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
