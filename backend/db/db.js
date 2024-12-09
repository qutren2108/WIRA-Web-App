const { Pool } = require('pg'); // Use CommonJS syntax
require('dotenv').config(); // Load environment variables

// Create a connection pool using the DATABASE_URL from .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database.');
});

module.exports = pool; // Export the pool instance
