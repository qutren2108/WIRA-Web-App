const { Pool } = require('pg'); // PostgreSQL client
require('dotenv').config(); // Load environment variables from .env file

// Create a connection pool using the DATABASE_URL from .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Log successful connection
pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database.');
});

// Export the pool for use in other files
module.exports = pool;
