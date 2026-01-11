const express = require("express");
const { pool } = require("../config/db");
const { authRequired, requireRole } = require("../middleware/auth");
const { writeLog } = require("../utils/log");

const router = express.Router();

// GET /api/admin/orders  (list)
router.get("/orders", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        o.id,
        o.user_id,
        u.email AS user_email,
        o.status,
        o.total_cents,
        o.shipping_name,
        o.shipping_city,
        o.created_at
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
      `
    );
    res.json(rows);
  } catch (err) {
    console.error("ADMIN ORDERS LIST FAILED:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/orders/:id  (details)
router.get("/orders/:id", authRequired, requireRole("admin"), async (req, res) => {
  const orderId = Number(req.params.id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  try {
    const [[order]] = await pool.query(
      `
      SELECT
        o.*,
        u.email AS user_email
      FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE o.id = ?
      `,
      [orderId]
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    const [items] = await pool.query(
      `
      SELECT
        oi.id,
        oi.product_id,
        p.name AS product_name,
        oi.quantity,
        oi.price_cents
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
      `,
      [orderId]
    );

    res.json({ order, items });
  } catch (err) {
    console.error("ADMIN ORDER DETAILS FAILED:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch("/orders/:id/status", authRequired, requireRole("admin"), async (req, res) => {
  const orderId = Number(req.params.id);
  const { status } = req.body;

  const allowed = new Set(["pending", "paid", "shipped", "cancelled"]);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ message: "Invalid order id" });
  }
  if (!allowed.has(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const [r] = await pool.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, orderId]
    );

    if (r.affectedRows === 0) return res.status(404).json({ message: "Order not found" });

    await writeLog({
      userId: req.user.id,
      action: "order.status.update",
      details: { orderId, status },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("ADMIN ORDER STATUS UPDATE FAILED:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
