import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useCart } from "../cart/CartContext.jsx";


const linkStyle = ({ isActive }) => ({
  padding: "8px 10px",
  borderRadius: 8,
  textDecoration: "none",
  color: "inherit",
  background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
});

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();


  function closeMenu() {
    setOpen(false);
  }

  return (
    <header
      style={{
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        background: "white",
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* LOGO */}
        <Link
          to="/"
          style={{
            fontWeight: 800,
            fontSize: 18,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          WebShop
        </Link>

        {/* DESKTOP NAV */}
        <nav className="nav-desktop" style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <NavLink to="/" style={linkStyle}>Home</NavLink>
          <NavLink to="/shop" style={linkStyle}>Shop</NavLink>
          <NavLink to="/cart" style={linkStyle}>
            Cart {totalItems > 0 ? `(${totalItems})` : ""}
          </NavLink>
          

          {user?.role === "admin" && (
            <>
              <NavLink to="/admin/orders" style={linkStyle}>Orders</NavLink>
              <NavLink to="/admin/logs" style={linkStyle}>Logs</NavLink>
              <NavLink to="/admin" style={linkStyle}>Admin</NavLink>
            </>
          )}

          {!user ? (
            <>
              <NavLink to="/login" style={linkStyle}>Login</NavLink>
              <NavLink to="/register" style={linkStyle}>Register</NavLink>
            </>
          ) : (
            <button
              onClick={logout}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.15)",
                background: "white",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          className="nav-mobile-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{
            display: "none",
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "white",
          }}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div
          className="nav-mobile"
          style={{
            borderTop: "1px solid rgba(0,0,0,0.08)",
            background: "white",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: 12,
              display: "grid",
              gap: 8,
            }}
          >
            <NavLink to="/" style={linkStyle} onClick={closeMenu}>Home</NavLink>
            <NavLink to="/shop" style={linkStyle} onClick={closeMenu}>Shop</NavLink>
            <NavLink to="/cart" style={linkStyle} onClick={closeMenu}>
              Cart {totalItems > 0 ? `(${totalItems})` : ""}
            </NavLink>
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin/orders" style={linkStyle} onClick={closeMenu}>Orders</NavLink>
                <NavLink to="/admin/logs" style={linkStyle} onClick={closeMenu}>Logs</NavLink>
                <NavLink to="/admin" style={linkStyle} onClick={closeMenu}>Admin</NavLink>
              </>
            )}

            {!user ? (
              <>
                <NavLink to="/login" style={linkStyle} onClick={closeMenu}>Login</NavLink>
                <NavLink to="/register" style={linkStyle} onClick={closeMenu}>Register</NavLink>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.15)",
                  background: "white",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
