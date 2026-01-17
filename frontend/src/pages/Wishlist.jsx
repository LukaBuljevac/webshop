import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useWishlist } from "../wishlist/WishlistContext.jsx";

const API = "http://localhost:4000/api";

export default function Wishlist() {
  const { token, user } = useAuth();
  const { ids, toggle, reload } = useWishlist();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user) return;
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`${API}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "Ne mogu dohvatiti wishlist.");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user) {
    return (
      <div style={{ display: "grid", gap: 10 }}>
        <h1>Wishlist</h1>
        <p>Moraš biti prijavljen da koristiš wishlist.</p>
        <Link to="/login">Prijava</Link>
      </div>
    );
  }

  if (loading) return <p>Učitavam wishlist…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ margin: 0 }}>Wishlist</h1>
        <div style={{ opacity: 0.7 }}>{ids.length} favorita</div>
      </div>

      {items.length === 0 ? (
        <div className="card">
          Nema favorita. Dodaj ❤️ iz shopa ili s detalja proizvoda.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {items.map((p) => (
            <div key={p.id} className="card" style={{ display: "grid", gap: 10 }}>
              <div style={{ height: 140, borderRadius: 12, background: p.image_url ? `url(${p.image_url}) center/cover` : "#eee" }} />
              <strong>{p.name}</strong>
              <div className="muted" style={{ fontSize: 13 }}>
                {String(p.description || "").slice(0, 80)}
                {String(p.description || "").length > 80 ? "…" : ""}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 900 }}>{(p.price_cents / 100).toFixed(2)} €</div>
                <button
                  onClick={async () => {
                    await toggle(p.id);
                    await reload();
                    await load();
                  }}
                  style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)", background: "white" }}
                >
                  Ukloni ❤️
                </button>
              </div>
              <Link to={`/product/${p.id}`} style={{ textDecoration: "none", textAlign: "center", padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,0.18)" }}>
                Detalji
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
