import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:4000/api";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`${API}/products`);
      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        throw new Error(data.message || "Greška pri dohvaćanju proizvoda.");
      }
      if (!Array.isArray(data)) {
        throw new Error("Neočekivan odgovor servera (nije lista).");
      }

      setItems(data);
    } catch (e) {
      setErr(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) =>
      String(p.name || "").toLowerCase().includes(s)
    );
  }, [items, q]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Shop</h1>
        <button
          onClick={load}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.2)",
            background: "white",
            cursor: "pointer",
          }}
        >
          Osvježi
        </button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pretraži proizvode..."
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            minWidth: 240,
            flex: "1 1 240px",
          }}
        />
        <div style={{ opacity: 0.7, alignSelf: "center" }}>
          {items.length} proizvoda
        </div>
      </div>

      {/* States */}
      {loading && <p>Učitavam proizvode…</p>}

      {!loading && err && (
        <div
          style={{
            border: "1px solid rgba(220, 20, 60, 0.35)",
            background: "rgba(220, 20, 60, 0.08)",
            padding: 12,
            borderRadius: 12,
            color: "crimson",
          }}
        >
          <strong>Greška:</strong> {err}
          <div style={{ marginTop: 8, color: "#111" }}>
            Provjeri je li backend upaljen na <code>localhost:4000</code>.
          </div>
        </div>
      )}

      {!loading && !err && filtered.length === 0 && (
        <div
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            padding: 14,
            borderRadius: 12,
            opacity: 0.85,
          }}
        >
          Nema proizvoda za prikaz{q.trim() ? ` za upit "${q.trim()}"` : ""}.
        </div>
      )}

      {/* Grid */}
      {!loading && !err && filtered.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          {filtered.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 16,
                padding: 14,
                display: "grid",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 150,
                  borderRadius: 12,
                  background: p.image_url ? `url(${p.image_url}) center/cover` : "#eee",
                }}
              />

              <div style={{ display: "grid", gap: 4 }}>
                <strong style={{ fontSize: 16 }}>{p.name}</strong>
                <div style={{ opacity: 0.75, fontSize: 13, lineHeight: 1.4 }}>
                  {String(p.description || "").slice(0, 80)}
                  {String(p.description || "").length > 80 ? "…" : ""}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div style={{ fontWeight: 800 }}>
                  {(p.price_cents / 100).toFixed(2)} €
                </div>
                <div style={{ opacity: 0.75, fontSize: 13 }}>
                  Stock: {p.stock}
                </div>
              </div>

              <Link
                to={`/product/${p.id}`}
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  textAlign: "center",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.18)",
                  color: "#111",
                  background: "white",
                }}
              >
                Detalji
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
