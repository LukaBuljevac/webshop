import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useCart } from "../cart/CartContext.jsx";

const API = "http://localhost:4000/api";

export default function Checkout() {
  const nav = useNavigate();
  const { token, user } = useAuth();
  const { items, totalCents, clearCart } = useCart();

  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostal, setShippingPostal] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function placeOrder() {
    setErr("");
    setLoading(true);

    try {
      if (!user) throw new Error("Moraš biti prijavljen.");
      if (!items.length) throw new Error("Košarica je prazna.");

      if (!shippingName.trim()) throw new Error("Upiši ime i prezime.");
      if (!shippingAddress.trim()) throw new Error("Upiši adresu.");
      if (!shippingCity.trim()) throw new Error("Upiši grad.");
      if (!shippingPostal.trim()) throw new Error("Upiši poštanski broj.");
      if (!shippingPhone.trim()) throw new Error("Upiši broj telefona.");

      const payload = {
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
        shipping: {
          name: shippingName.trim(),
          address: shippingAddress.trim(),
          city: shippingCity.trim(),
          postal: shippingPostal.trim(),
          phone: shippingPhone.trim(),
        },
        note: note.trim() ? note.trim() : null,
      };

      const r = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "Narudžba nije uspjela.");

      clearCart();
      nav(`/order-success/${data.orderId}`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div style={{ display: "grid", gap: 10 }}>
        <h1>Checkout</h1>
        <p>Moraš biti prijavljen da bi napravio narudžbu.</p>
        <Link to="/login">Idi na login</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14, maxWidth: 680 }}>
      <h1>Checkout</h1>

      <div style={{ opacity: 0.75 }}>
        Prijavljen kao: <strong>{user.email}</strong>
      </div>

      {/* Shipping */}
      <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: 12, display: "grid", gap: 10 }}>
        <strong>Podaci za dostavu</strong>

        <label style={{ display: "grid", gap: 6 }}>
          Ime i prezime
          <input value={shippingName} onChange={(e) => setShippingName(e.target.value)}
            placeholder="npr. Ivan Horvat"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Adresa
          <input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="npr. Ulica 1"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <label style={{ display: "grid", gap: 6 }}>
            Grad
            <input value={shippingCity} onChange={(e) => setShippingCity(e.target.value)}
              placeholder="npr. Zagreb"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Poštanski broj
            <input value={shippingPostal} onChange={(e) => setShippingPostal(e.target.value)}
              placeholder="npr. 10000"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Telefon
            <input value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)}
              placeholder="npr. +385 99 123 4567"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </label>
        </div>

        <label style={{ display: "grid", gap: 6 }}>
          Napomena (opcionalno)
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
            placeholder="npr. dostava poslije 16h"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>
      </div>

      {/* Summary */}
      <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: 12 }}>
        <strong>Sažetak</strong>
        <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
          {items.map((i) => (
            <div key={i.product.id} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span>{i.product.name} × {i.quantity}</span>
              <span>{((i.product.price_cents * i.quantity) / 100).toFixed(2)} €</span>
            </div>
          ))}
          <hr />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Ukupno</strong>
            <strong>{(totalCents / 100).toFixed(2)} €</strong>
          </div>
        </div>
      </div>

      {err && <div style={{ color: "crimson" }}>{err}</div>}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button disabled={loading} onClick={placeOrder} style={{ padding: 12 }}>
          {loading ? "Šaljem narudžbu..." : "Potvrdi narudžbu"}
        </button>
        <Link to="/cart" style={{ alignSelf: "center" }}>← Nazad u košaricu</Link>
      </div>
    </div>
  );
}
