const express = require("express");
const { pool } = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { writeLog } = require("../utils/log");

const router = express.Router();

/**
 * GET /api/wishlist
 * Vrati wishlist proizvode za ulogiranog usera
 */
router.get("/", authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        p.id, p.name, p.description, p.price_cents, p.image_url, p.stock
      FROM wishlists w
      JOIN products p ON p.id = w.product_id
      WHERE w.user_id = ? AND p.is_active = 1
      ORDER BY w.created_at DESC
      `,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("WISHLIST GET FAILED:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/wishlist/ids
 * Vrati samo product_id listu (brže za ❤️ state)
 */
router.get("/ids", authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT product_id FROM wishlists WHERE user_id = ?",
      [req.user.id]
    );
    res.json(rows.map((r) => r.product_id));
  } catch (err) {
    console.error("WISHLIST IDS FAILED:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/wishlist
 * Body: { product_id: number }
 */
router.post("/", authRequired, async (req, res) => {
  const productId = Number(req.body.product_id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ message: "Invalid product_id" });
  }

  try {
    // provjeri da proizvod postoji i aktivan
    const [[p]] = await pool.query(
      "SELECT id FROM products WHERE id = ? AND is_active = 1",
      [productId]
    );
    if (!p) return res.status(400).json({ message: "Product not available" });

    await pool.query(
      "INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)",
      [req.user.id, productId]
    );

    await writeLog({
      userId: req.user.id,
      action: "wishlist.add",
      details: { productId },
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("WISHLIST ADD FAILED:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/wishlist/:productId
 */
router.delete("/:productId", authRequired, async (req, res) => {
  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ message: "Invalid product_id" });
  }

  try {
    await pool.query(
      "DELETE FROM wishlists WHERE user_id = ? AND product_id = ?",
      [req.user.id, productId]
    );

    await writeLog({
      userId: req.user.id,
      action: "wishlist.remove",
      details: { productId },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("WISHLIST REMOVE FAILED:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
