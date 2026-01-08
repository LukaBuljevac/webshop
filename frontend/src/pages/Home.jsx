import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ display: "grid", gap: 32 }}>
      {/* HERO */}
      <section
        style={{
          padding: "48px 24px",
          borderRadius: 20,
          background: "linear-gradient(135deg, #111 0%, #333 100%)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: 40, margin: 0 }}>
          WebShop projekt
        </h1>
        <p style={{ maxWidth: 600, opacity: 0.9 }}>
          Moderan webshop izrađen u Reactu i Node.js-u s MySQL bazom.
          Projekt demonstrira autentikaciju, CRUD operacije i dinamički sadržaj.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <Link
            to="/shop"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "white",
              color: "#111",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Pregled proizvoda
          </Link>
          <Link
            to="/register"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid white",
              color: "white",
              textDecoration: "none",
            }}
          >
            Registracija
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ display: "grid", gap: 16 }}>
        <h2>Funkcionalnosti</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              title: "Autentikacija",
              text: "Registracija i prijava korisnika s ulogama admin i kupac.",
            },
            {
              title: "CRUD proizvoda",
              text: "Admin može dodavati, uređivati i brisati proizvode.",
            },
            {
              title: "Narudžbe",
              text: "Kupci mogu kreirati narudžbe, admin upravlja statusima.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                padding: 20,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <h3>{item.title}</h3>
              <p style={{ opacity: 0.8 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
