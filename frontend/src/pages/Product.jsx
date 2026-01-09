import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = "http://localhost:4000/api";

export default function Product() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    setErr("");
    fetch(`${API}/products/${id}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.message || "Ne mogu dohvatiti proizvod");
        return data;
      })
      .then(setP)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Učitavam proizvod…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;
  if (!p) return <p>Proizvod ne postoji.</p>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Link to="/shop">← Nazad na shop</Link>

      <div
        style={{
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 16,
          padding: 16,
          display: "grid",
          gap: 12,
        }}
      >
        <div
          style={{
            height: 260,
            borderRadius: 14,
            background: p.image_url ? `url(${p.image_url}) center/cover` : "#eee",
          }}
        />
        <h1 style={{ margin: 0 }}>{p.name}</h1>
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          {(p.price_cents / 100).toFixed(2)} €
        </div>
        <div style={{ opacity: 0.85 }}>{p.description}</div>
        <div style={{ opacity: 0.75 }}>Na stanju: {p.stock}</div>

        <button disabled={p.stock <= 0} style={{ padding: 10 }}>
          {p.stock <= 0 ? "Nije dostupno" : "Dodaj u košaricu (DAN 5)"}
        </button>
      </div>
    </div>
  );
}
