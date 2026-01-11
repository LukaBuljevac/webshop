import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section
        className="card"
        style={{
          display: "grid",
          gap: 10,
          padding: 22,
          background: "linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.02))",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 34 }}>Dobrodošao u WebShop</h1>
        <p className="muted" style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>
          Demo webshop projekt napravljen u Reactu (Vite) i Node.js (Express) uz MySQL bazu preko XAMPP-a.
          U shopu možeš pregledati proizvode, dodati ih u košaricu i kreirati narudžbu.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
          <Link to="/shop" style={btnPrimary}>Idi u Shop</Link>
          <Link to="/register" style={btnSecondary}>Registracija</Link>
          <Link to="/login" style={btnSecondary}>Prijava</Link>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        <div className="card">
          <strong>✅ Responzivan dizajn</strong>
          <p className="muted">
            Navigacija i sadržaj se prilagođavaju mobilnim uređajima i desktopu.
          </p>
        </div>

        <div className="card">
          <strong>✅ Dinamični sadržaj</strong>
          <p className="muted">
            Proizvodi, košarica i narudžbe učitavaju se i mijenjaju bez reload-a (fetch + JSON).
          </p>
        </div>

        <div className="card">
          <strong>✅ Admin uloga</strong>
          <p className="muted">
            Admin upravlja proizvodima i narudžbama (statusi) te ima evidenciju akcija (logs).
          </p>
        </div>
      </section>
    </div>
  );
}

const btnPrimary = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 12,
  textDecoration: "none",
  border: "1px solid rgba(0,0,0,0.2)",
  background: "#111",
  color: "white",
};

const btnSecondary = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 12,
  textDecoration: "none",
  border: "1px solid rgba(0,0,0,0.2)",
  background: "white",
  color: "#111",
};
