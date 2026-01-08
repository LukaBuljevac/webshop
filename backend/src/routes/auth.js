const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { writeLog } = require("../utils/log");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, role, full_name) VALUES (?, ?, 'customer', ?)",
      [email, passwordHash, fullName || null]
    );

    const user = { id: result.insertId, email, role: "customer" };
    const token = signToken(user);

    await writeLog({ userId: user.id, action: "auth.register", details: { email } });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, role: user.role, fullName: fullName || null },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  try {
    const [rows] = await pool.query(
      "SELECT id, email, role, password_hash, full_name FROM users WHERE email = ?",
      [email]
    );
    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });

    const dbUser = rows[0];
    const ok = await bcrypt.compare(password, dbUser.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(dbUser);

    await writeLog({ userId: dbUser.id, action: "auth.login", details: { email } });

    res.json({
      token,
      user: { id: dbUser.id, email: dbUser.email, role: dbUser.role, fullName: dbUser.full_name },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me (provjera tokena)
router.get("/me", authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, email, role, full_name, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    const u = rows[0];
    res.json({ id: u.id, email: u.email, role: u.role, fullName: u.full_name, createdAt: u.created_at });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// DEV ONLY: POST /api/auth/seed-admin (kreira admin ako ne postoji)
router.post("/seed-admin", async (req, res) => {
  const { email = "admin@webshop.local", password = "Admin123!" } = req.body || {};
  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) return res.json({ message: "Admin already exists", email });

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, role, full_name) VALUES (?, ?, 'admin', ?)",
      [email, passwordHash, "Administrator"]
    );

    await writeLog({ userId: result.insertId, action: "auth.seed_admin", details: { email } });

    res.status(201).json({ message: "Admin created", email, password });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
