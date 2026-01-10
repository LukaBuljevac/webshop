import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Cart() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { items, updateQty, removeFromCart, clearCart, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ display: "grid", gap: 10 }}>
        <h1>Košarica</h1>
        <p>Košarica je prazna.</p>
        <Link to="/shop">← Povratak u shop</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>Košarica</h1>

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((i) => (
          <div
            key={i.product.id}
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              padding: 12,
              borderRadius: 12,
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div style={{ display: "grid" }}>
              <strong>{i.product.name}</strong>
              <span style={{ opacity: 0.7 }}>
                {(i.product.price_cents / 100).toFixed(2)} € / kom
              </span>
            </div>

            <input
              type="number"
              min={1}
              value={i.quantity}
              onChange={(e) => updateQty(i.product.id, Number(e.target.value))}
              style={{ width: 70, padding: 8 }}
            />

            <button onClick={() => removeFromCart(i.product.id)}>Ukloni</button>
          </div>
        ))}
      </div>

      <h2>Ukupno: {(totalCents / 100).toFixed(2)} €</h2>

      {!user && (
        <div style={{ color: "crimson" }}>
          Moraš se prijaviti prije narudžbe.
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button disabled={!user} onClick={() => nav("/checkout")} style={{ padding: 12 }}>
          Nastavi na checkout
        </button>

        <button onClick={clearCart} style={{ padding: 12, background: "white" }}>
          Očisti košaricu
        </button>

        <Link to="/shop" style={{ alignSelf: "center" }}>← Nastavi kupovati</Link>
      </div>
    </div>
  );
}
