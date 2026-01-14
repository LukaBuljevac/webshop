import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "32px 16px" }}>
      <section
        className="card"
        style={{
          width: "min(960px, 100%)",
          margin: "0 auto",
          padding: "56px 28px",
          borderRadius: 24,
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.07), rgba(0,0,0,0.02))",
          textAlign: "center",
          display: "grid",
          gap: 18,
          boxShadow: "0 18px 60px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 52, letterSpacing: -0.5 }}>
          WebShop
        </h1>

        <p className="muted" style={{ margin: 0, fontSize: 18, lineHeight: 1.6 }}>
          {user
            ? `Dobrodošao, ${user.name} 👋`
            : "Dobrodošao! Prijavi se ili se registriraj 👋"}
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          <Link to="/shop" style={btnPrimary}>Idi u Shop</Link>

          {!user && (
            <>
              <Link to="/register" style={btnSecondary}>Registracija</Link>
              <Link to="/login" style={btnSecondary}>Prijava</Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

const btnPrimary = {
  display: "inline-block",
  padding: "12px 16px",
  borderRadius: 14,
  textDecoration: "none",
  border: "1px solid rgba(0,0,0,0.2)",
  background: "#111",
  color: "white",
  minWidth: 140,
  textAlign: "center",
};

const btnSecondary = {
  display: "inline-block",
  padding: "12px 16px",
  borderRadius: 14,
  textDecoration: "none",
  border: "1px solid rgba(0,0,0,0.2)",
  background: "white",
  color: "#111",
  minWidth: 140,
  textAlign: "center",
};
