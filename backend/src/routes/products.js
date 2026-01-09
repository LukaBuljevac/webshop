const express = require("express");
const { pool } = require("../config/db");
const { authRequired, requireRole } = require("../middleware/auth");
const { writeLog } = require("../utils/log");

const router = express.Router();

function isInt(n) {
  return Number.isInteger(n);
}

/**
 * ADMIN: GET all (active + inactive)
 * GET /api/products/admin/all
 */
router.get("/admin/all", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, description, price_cents, image_url, stock, is_active, created_at, updated_at FROM products ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUBLIC: GET list active
 * GET /api/products
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, description, price_cents, image_url, stock FROM products WHERE is_active = 1 ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUBLIC: GET single active
 * GET /api/products/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, description, price_cents, image_url, stock FROM products WHERE id = ? AND is_active = 1",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ADMIN: CREATE
 * POST /api/products
 */
router.post("/", authRequired, requireRole("admin"), async (req, res) => {
  const { name, description, price_cents, image_url, stock } = req.body;

  if (!name?.trim() || !description?.trim()) {
    return res.status(400).json({ message: "Name and description are required" });
  }

  const pc = Number(price_cents);
  const st = stock === undefined ? 0 : Number(stock);

  if (!isInt(pc) || pc <= 0) return res.status(400).json({ message: "price_cents must be a positive integer" });
  if (!isInt(st) || st < 0) return res.status(400).json({ message: "stock must be an integer >= 0" });

  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, description, price_cents, image_url, stock) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), description.trim(), pc, image_url || null, st]
    );

    await writeLog({
      userId: req.user.id,
      action: "product.create",
      details: { productId: result.insertId, name: name.trim() },
    });

    res.status(201).json({ id: result.insertId });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ADMIN: UPDATE
 * PUT /api/products/:id
 */
router.put("/:id", authRequired, requireRole("admin"), async (req, res) => {
  const { name, description, price_cents, image_url, stock, is_active } = req.body;

  if (!name?.trim() || !description?.trim()) {
    return res.status(400).json({ message: "Name and description are required" });
  }

  const pc = Number(price_cents);
  const st = Number(stock);

  if (!isInt(pc) || pc <= 0) return res.status(400).json({ message: "price_cents must be a positive integer" });
  if (!isInt(st) || st < 0) return res.status(400).json({ message: "stock must be an integer >= 0" });

  const activeVal = is_active === undefined ? 1 : (is_active ? 1 : 0);

  try {
    const [r] = await pool.query(
      "UPDATE products SET name=?, description=?, price_cents=?, image_url=?, stock=?, is_active=? WHERE id=?",
      [name.trim(), description.trim(), pc, image_url || null, st, activeVal, req.params.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Not found" });

    await writeLog({
      userId: req.user.id,
      action: "product.update",
      details: { productId: req.params.id },
    });

    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ADMIN: DELETE (soft)
 * DELETE /api/products/:id
 */
router.delete("/:id", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const [r] = await pool.query(
      "UPDATE products SET is_active = 0 WHERE id = ?",
      [req.params.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Not found" });

    await writeLog({
      userId: req.user.id,
      action: "product.delete",
      details: { productId: req.params.id },
    });

    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
