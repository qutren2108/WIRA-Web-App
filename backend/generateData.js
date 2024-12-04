const faker = require('faker'); // Import faker for generating fake data
const { Pool } = require('pg'); // Import pg for connecting to PostgreSQL
require('dotenv').config(); // Load environment variables from .env file
console.log('Database URL:', process.env.DATABASE_URL);

// Create a PostgreSQL pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use the DATABASE_URL from .env
});

// Function to generate and insert data
async function generateData() {
    try {
        console.log('Starting data generation...');

        // Insert 100,000 accounts
        for (let i = 0; i < 100000; i++) {
            const username = faker.internet.userName(); // Generate a fake username
            const email = faker.internet.email(); // Generate a fake email

            // Insert into Account table
            const accountResult = await pool.query(
                'INSERT INTO Account (username, email) VALUES ($1, $2) RETURNING acc_id',
                [username, email]
            );
            const accId = accountResult.rows[0].acc_id;

            // Insert a Character for this Account
            const classId = faker.datatype.number({ min: 1, max: 3 }); // Generate a random class_id
            const characterResult = await pool.query(
                'INSERT INTO Character (acc_id, class_id) VALUES ($1, $2) RETURNING char_id',
                [accId, classId]
            );
            const charId = characterResult.rows[0].char_id;

            // Insert a Score for this Character
            const rewardScore = faker.datatype.number({ min: 1000, max: 2000 }); // Generate a random score
            await pool.query(
                'INSERT INTO Scores (char_id, reward_score) VALUES ($1, $2)',
                [charId, rewardScore]
            );

            // Log progress every 10,000 rows
            if ((i + 1) % 10000 === 0) {
                console.log(`Inserted ${i + 1} rows so far...`);
            }
        }

        console.log('Data generation complete!');
    } catch (err) {
        console.error('Error during data generation:', err);
    } finally {
        await pool.end(); // Close the PostgreSQL pool
    }
}

// Run the data generation function
generateData();
