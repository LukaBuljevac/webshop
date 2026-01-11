import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

const API = "http://localhost:4000/api";

function euro(cents) {
  return (Number(cents || 0) / 100).toFixed(2);
}

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null); // { order, items }
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  async function loadOrders() {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`${API}/admin/orders`, { headers });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "Ne mogu dohvatiti narudžbe.");
      setOrders(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function openOrder(id) {
    setErr("");
    try {
      const r = await fetch(`${API}/admin/orders/${id}`, { headers });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "Ne mogu dohvatiti detalje narudžbe.");
      setSelected(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function updateStatus(orderId, status) {
    setErr("");
    try {
      const r = await fetch(`${API}/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "Ne mogu promijeniti status.");

      await loadOrders();
      await openOrder(orderId);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p>Učitavam narudžbe…</p>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Admin – Narudžbe</h1>
        <button onClick={loadOrders} style={{ padding: 10, background: "white", border: "1px solid rgba(0,0,0,0.2)" }}>
          Osvježi
        </button>
      </div>

      {err && <div style={{ color: "crimson" }}>{err}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, alignItems: "start" }}>
        {/* LEFT: list */}
        <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: 12, borderBottom: "1px solid rgba(0,0,0,0.08)", fontWeight: 800 }}>
            Lista narudžbi ({orders.length})
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <th style={{ padding: 10 }}>ID</th>
                  <th style={{ padding: 10 }}>User</th>
                  <th style={{ padding: 10 }}>Status</th>
                  <th style={{ padding: 10 }}>Total</th>
                  <th style={{ padding: 10 }}>Datum</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => openOrder(o.id)}
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      background: selected?.order?.id === o.id ? "rgba(0,0,0,0.04)" : "transparent",
                    }}
                  >
                    <td style={{ padding: 10 }}>#{o.id}</td>
                    <td style={{ padding: 10 }}>{o.user_email}</td>
                    <td style={{ padding: 10 }}>{o.status}</td>
                    <td style={{ padding: 10 }}>{euro(o.total_cents)} €</td>
                    <td style={{ padding: 10 }}>{new Date(o.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: details */}
        <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 14, padding: 12, display: "grid", gap: 10 }}>
          {!selected ? (
            <div style={{ opacity: 0.7 }}>Klikni narudžbu s liste za detalje.</div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>Narudžba #{selected.order.id}</div>
                  <div style={{ opacity: 0.75 }}>{selected.order.user_email}</div>
                </div>
                <div style={{ fontWeight: 900 }}>{euro(selected.order.total_cents)} €</div>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <strong>Shipping</strong>
                <div style={{ opacity: 0.85 }}>
                  {selected.order.shipping_name}<br />
                  {selected.order.shipping_address}<br />
                  {selected.order.shipping_postal} {selected.order.shipping_city}<br />
                  {selected.order.shipping_phone}
                </div>
                {selected.order.note && (
                  <div style={{ opacity: 0.85 }}>
                    <strong>Napomena:</strong> {selected.order.note}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <strong>Stavke</strong>
                {selected.items.map((it) => (
                  <div key={it.id} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span>{it.product_name} × {it.quantity}</span>
                    <span>{euro(it.price_cents * it.quantity)} €</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <strong>Status</strong>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["pending", "paid", "shipped", "cancelled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.order.id, s)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid rgba(0,0,0,0.2)",
                        background: selected.order.status === s ? "rgba(0,0,0,0.08)" : "white",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
