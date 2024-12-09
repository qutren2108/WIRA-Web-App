const express = require("express");
const router = express.Router();
const pool = require('../db/db');

// Get all accounts with pagination and search
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const offset = (page - 1) * limit;

    const accountsQuery = `
      SELECT acc_id, username, email, total_score
      FROM Account
      WHERE username ILIKE $1 OR email ILIKE $1
      ORDER BY total_score DESC
      LIMIT $2 OFFSET $3
    `;
    const accountsResult = await pool.query(accountsQuery, [
      `%${search}%`,
      limit,
      offset,
    ]);

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Account
      WHERE username ILIKE $1 OR email ILIKE $1
    `;
    const countResult = await pool.query(countQuery, [`%${search}%`]);

    const totalPlayers = parseInt(countResult.rows[0].total, 10);

    res.json({
      success: true,
      data: accountsResult.rows,
      pagination: {
        totalItems: totalPlayers,
        totalPages: Math.ceil(totalPlayers / limit),
        currentPage: parseInt(page, 10),
      },
      totalPlayers,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get top 10 accounts by score
router.get("/top", async (_req, res) => {
  try {
    console.log("Pool object:", pool);
    const topAccountsQuery = `
      SELECT acc_id, username, email, total_score
      FROM Account
      ORDER BY total_score DESC
      LIMIT 10
    `;
    const result = await pool.query(topAccountsQuery);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching top accounts:", error.stack); // Log full error details
    res.status(500).json({ success: false, message: error.message }); // Return exact error message
  }
});

// Add a new account
router.post("/", async (req, res) => {
  try {
    const { username, email, total_score } = req.body;

    const insertQuery = `
      INSERT INTO Account (username, email, total_score)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const result = await pool.query(insertQuery, [username, email, total_score]);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding account:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update an account
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, total_score } = req.body;

    const updateQuery = `
      UPDATE Account
      SET username = $1, email = $2, total_score = $3
      WHERE acc_id = $4 RETURNING *
    `;
    const result = await pool.query(updateQuery, [
      username,
      email,
      total_score,
      id,
    ]);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete an account
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = `
      DELETE FROM Account
      WHERE acc_id = $1 RETURNING *
    `;
    const result = await pool.query(deleteQuery, [id]);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
