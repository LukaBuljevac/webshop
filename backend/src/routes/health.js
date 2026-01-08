const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

router.get("/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({
      status: "ok",
      db: rows?.[0]?.ok === 1 ? "connected" : "unknown",
      time: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "DB connection failed",
    });
  }
});

module.exports = router;
