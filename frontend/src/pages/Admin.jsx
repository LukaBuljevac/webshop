import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

const API = "http://localhost:4000/api";

function eurosToCents(eurString) {
  const n = Number(String(eurString).replace(",", "."));
  if (Number.isNaN(n)) return null;
  return Math.round(n * 100);
}

function centsToEurosString(cents) {
  return (Number(cents || 0) / 100).toFixed(2);
}

export default function Admin() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);

  // form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceEur, setPriceEur] = useState("");
  const [stock, setStock] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  async function loadAll() {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`${API}/products/admin/all`, { headers: authHeaders });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Ne mogu dohvatiti proizvode (admin)");
      setItems(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setMode("create");
    setEditingId(null);
    setName("");
    setDescription("");
    setPriceEur("");
    setStock("0");
    setImageUrl("");
    setIsActive(true);
  }

  function startEdit(p) {
    setMode("edit");
    setEditingId(p.id);
    setName(p.name || "");
    setDescription(p.description || "");
    setPriceEur(centsToEurosString(p.price_cents));
    setStock(String(p.stock ?? 0));
    setImageUrl(p.image_url || "");
    setIsActive(Boolean(p.is_active));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");

    const price_cents = eurosToCents(priceEur);
    const st = Number(stock);

    if (!name.trim() || !description.trim()) return setErr("Naziv i opis su obavezni.");
    if (price_cents === null || price_cents <= 0) return setErr("Cijena mora biti broj > 0.");
    if (!Number.isInteger(st) || st < 0) return setErr("Stock mora biti cijeli broj >= 0.");

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price_cents,
      stock: st,
      image_url: imageUrl.trim() ? imageUrl.trim() : null,
      is_active: isActive,
    };

    try {
      if (mode === "create") {
        const r = await fetch(`${API}/products`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.message || "Create failed");
      } else {
        const r = await fetch(`${API}/products/${editingId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.message || "Update failed");
      }

      resetForm();
      await loadAll();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  async function softDelete(id) {
    if (!confirm("Obrisati (deaktivirati) proizvod?")) return;
    try {
      const r = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "Delete failed");
      await loadAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  if (loading) return <p>Učitavam admin proizvode…</p>;

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <h1>Admin – Proizvodi</h1>

      <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>
          {mode === "create" ? "Dodaj proizvod" : `Uredi proizvod #${editingId}`}
        </h2>

        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <label>
            Naziv
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </label>

          <label>
            Opis
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </label>

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <label>
              Cijena (€)
              <input
                value={priceEur}
                onChange={(e) => setPriceEur(e.target.value)}
                placeholder="npr. 19.99"
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
              />
            </label>

            <label>
              Stock
              <input
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                type="number"
                min={0}
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
              />
            </label>
          </div>

          <label>
            Image URL (opcionalno)
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Aktivan (vidljiv u shopu)
          </label>

          {err && <div style={{ color: "crimson" }}>{err}</div>}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={{ padding: 10 }}>
              {mode === "create" ? "Dodaj" : "Spremi promjene"}
            </button>

            {mode === "edit" && (
              <button
                type="button"
                onClick={resetForm}
                style={{ padding: 10, background: "white", border: "1px solid rgba(0,0,0,0.2)" }}
              >
                Odustani
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <h2 style={{ marginBottom: 0 }}>Svi proizvodi</h2>
        <p style={{ marginTop: 0, opacity: 0.75 }}>
          Admin vidi i deaktivirane proizvode. Shop prikazuje samo aktivne.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
                <th style={{ padding: 10 }}>ID</th>
                <th style={{ padding: 10 }}>Naziv</th>
                <th style={{ padding: 10 }}>Cijena</th>
                <th style={{ padding: 10 }}>Stock</th>
                <th style={{ padding: 10 }}>Aktivan</th>
                <th style={{ padding: 10 }}>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <td style={{ padding: 10 }}>{p.id}</td>
                  <td style={{ padding: 10 }}>{p.name}</td>
                  <td style={{ padding: 10 }}>{centsToEurosString(p.price_cents)} €</td>
                  <td style={{ padding: 10 }}>{p.stock}</td>
                  <td style={{ padding: 10 }}>{p.is_active ? "DA" : "NE"}</td>
                  <td style={{ padding: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => startEdit(p)} style={{ padding: "6px 10px" }}>
                      Uredi
                    </button>
                    <button onClick={() => softDelete(p.id)} style={{ padding: "6px 10px" }}>
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={loadAll}
          style={{ padding: 10, justifySelf: "start", background: "white", border: "1px solid rgba(0,0,0,0.2)" }}
        >
          Osvježi listu
        </button>
      </div>
    </div>
  );
}
