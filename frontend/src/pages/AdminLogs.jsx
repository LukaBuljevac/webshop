import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

const API = "http://localhost:4000/api";

export default function AdminLogs() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [limit, setLimit] = useState(100);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`${API}/admin/logs?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "Ne mogu dohvatiti logove.");
      setLogs(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Admin – Logs</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            Limit:
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
          </label>
          <button onClick={load} style={{ padding: 10, background: "white", border: "1px solid rgba(0,0,0,0.2)" }}>
            Osvježi
          </button>
        </div>
      </div>

      {loading && <p>Učitavam logove…</p>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      {!loading && !err && (
        <div style={{ overflowX: "auto", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                <th style={{ padding: 10 }}>Time</th>
                <th style={{ padding: 10 }}>User</th>
                <th style={{ padding: 10 }}>Action</th>
                <th style={{ padding: 10 }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <td style={{ padding: 10 }}>{new Date(l.created_at).toLocaleString()}</td>
                  <td style={{ padding: 10 }}>{l.user_email || `user#${l.user_id}`}</td>
                  <td style={{ padding: 10 }}>{l.action}</td>
                  <td style={{ padding: 10, fontFamily: "monospace", fontSize: 12, maxWidth: 520, whiteSpace: "pre-wrap" }}>
                    {typeof l.details === "string" ? l.details : JSON.stringify(l.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
