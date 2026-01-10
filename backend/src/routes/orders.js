const express = require("express");
const { pool } = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { writeLog } = require("../utils/log");

const router = express.Router();

function isPosInt(n) {
  return Number.isInteger(n) && n > 0;
}

/**
 * POST /api/orders
 * Body:
 * {
 *   items: [{ product_id: number, quantity: number }],
 *   shipping: { name, address, city, postal, phone, email }  (optional fields)
 * }
 */
router.post("/", authRequired, async (req, res) => {
  const { items, shipping, note } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const normalized = items.map((i) => ({
    product_id: Number(i.product_id),
    quantity: Number(i.quantity),
  }));

  if (
    normalized.some(
      (i) => !isPosInt(i.product_id) || !isPosInt(i.quantity)
    )
  ) {
    return res.status(400).json({ message: "Invalid cart items" });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1) Dohvati proizvode iz baze
    const ids = [...new Set(normalized.map((i) => i.product_id))];

    const [products] = await conn.query(
      `SELECT id, name, price_cents, stock, is_active
       FROM products
       WHERE id IN (${ids.map(() => "?").join(",")})`,
      ids
    );

    const byId = new Map(products.map((p) => [p.id, p]));

    // 2) Validacija: postoji? aktivan? dovoljno stocka?
    for (const item of normalized) {
      const p = byId.get(item.product_id);
      if (!p) {
        return res.status(400).json({ message: `Product ${item.product_id} not found` });
      }
      if (p.is_active !== 1) {
        return res.status(400).json({ message: `Product "${p.name}" is not available` });
      }
      if (p.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for "${p.name}"` });
      }
    }

    // 3) Izračun total-a po DB cijeni
    let total = 0;
    for (const item of normalized) {
      const p = byId.get(item.product_id);
      total += p.price_cents * item.quantity;
    }

    // 4) Dinamički detektiraj koja polja postoje u orders tablici
    //    i pripremi INSERT koji uključuje shipping polja ako postoje.
    const [cols] = await conn.query("DESCRIBE orders");
    const colNames = new Set(cols.map((c) => c.Field));

    // Polja koja pokušavamo podržati (ako postoje u tablici)
    const shippingMap = [
      ["shipping_name", "name"],
      ["shipping_address", "address"],
      ["shipping_city", "city"],
      ["shipping_postal", "postal"],
      ["shipping_phone", "phone"],
      ["shipping_email", "email"],
    ];

    // Minimalno: ako tablica zahtijeva shipping_name, tražimo ga od frontenda
    if (colNames.has("shipping_name")) {
      if (!shipping?.name || String(shipping.name).trim() === "") {
        return res.status(400).json({ message: "Missing shipping name" });
      }
    }

    const insertCols = ["user_id", "total_cents"];
    const insertVals = [req.user.id, total];

    for (const [dbCol, bodyKey] of shippingMap) {
      if (!colNames.has(dbCol)) continue; // ako kolona ne postoji, preskoči

      const val = shipping?.[bodyKey];
      // Ako postoji kolona, upiši string ili NULL
      insertCols.push(dbCol);
      insertVals.push(val !== undefined && val !== null ? String(val).trim() : null);
    }

    if (colNames.has("note")) {
        insertCols.push("note");
        insertVals.push(note !== undefined && note !== null ? String(note) : null);
    }

    const placeholders = insertCols.map(() => "?").join(", ");

    // 5) Kreiraj order
    const [orderRes] = await conn.query(
      `INSERT INTO orders (${insertCols.join(", ")}) VALUES (${placeholders})`,
      insertVals
    );

    const orderId = orderRes.insertId;

    // 6) Kreiraj order_items i smanji stock
    for (const item of normalized) {
      const p = byId.get(item.product_id);

      await conn.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price_cents) VALUES (?, ?, ?, ?)",
        [orderId, p.id, item.quantity, p.price_cents]
      );

      await conn.query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, p.id]
      );
    }

    // 7) Log
    await writeLog({
      userId: req.user.id,
      action: "order.create",
      details: { orderId, total },
    });

    await conn.commit();
    return res.status(201).json({ orderId });
  } catch (err) {
    await conn.rollback();
    console.error("ORDER FAILED:", err);
    return res.status(500).json({
      message: "Order failed",
      error: err.code || err.message,
    });
  } finally {
    conn.release();
  }
});

module.exports = router;
