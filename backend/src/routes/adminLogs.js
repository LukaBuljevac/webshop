const express = require("express");
const { pool } = require("../config/db");
const { authRequired, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/admin/logs?limit=100
router.get("/logs", authRequired, requireRole("admin"), async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 100), 500);

  try {
    const [rows] = await pool.query(
      `
      SELECT
        l.id,
        l.user_id,
        u.email AS user_email,
        l.action,
        l.details,
        l.created_at
      FROM logs l
      LEFT JOIN users u ON u.id = l.user_id
      ORDER BY l.created_at DESC
      LIMIT ?
      `,
      [limit]
    );

    res.json(rows);
  } catch (err) {
    console.error("ADMIN LOGS FAILED:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
