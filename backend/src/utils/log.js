const { pool } = require("../config/db");

async function writeLog({ userId = null, action, details = null }) {
  try {
    await pool.query(
      "INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)",
      [userId, action, details ? JSON.stringify(details) : null]
    );
  } catch {
    // ne rušimo request zbog loga
  }
}

module.exports = { writeLog };
