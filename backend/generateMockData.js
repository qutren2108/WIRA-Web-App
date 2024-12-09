const { faker } = require('@faker-js/faker');
const pool = require('./db/db'); // Adjust the path to your `db.js` file

const generateMockData = async () => {
    console.log('Generating mock data...');
    try {
        // Start a transaction
        await pool.query('BEGIN');

        for (let i = 0; i < 10000; i++) {
            // Create an Account
            const username = faker.internet.username(); // Updated method
            const email = faker.internet.email();
            const accResult = await pool.query(
                'INSERT INTO Account (username, email) VALUES ($1, $2) RETURNING acc_id',
                [username, email]
            );
            const acc_id = accResult.rows[0].acc_id;

            // Prepare batch insert for Characters
            const characterValues = [];
            for (let j = 1; j <= 8; j++) {
                characterValues.push(`(${acc_id}, ${j})`);
            }
            const charResult = await pool.query(
                `INSERT INTO Character (acc_id, class_id) VALUES ${characterValues.join(
                    ','
                )} RETURNING char_id`
            );

            // Prepare batch insert for Scores
            const scoreValues = [];
            charResult.rows.forEach((char) => {
                for (let k = 0; k < 10; k++) {
                    const reward_score = faker.number.int({ min: 0, max: 1000 }); // Updated method
                    scoreValues.push(`(${char.char_id}, ${reward_score})`);
                }
            });

            // Batch insert scores
            await pool.query(
                `INSERT INTO Scores (char_id, reward_score) VALUES ${scoreValues.join(',')}`
            );
        }

        // Commit the transaction
        await pool.query('COMMIT');
        console.log('Mock data generation complete.');
    } catch (error) {
        console.error('Error generating mock data:', error);
        // Rollback in case of error
        await pool.query('ROLLBACK');
    } finally {
        pool.end();
    }
};

generateMockData();
