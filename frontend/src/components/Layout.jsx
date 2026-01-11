import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  return (
    <div style={{ minHeight: "100%", display: "grid", gridTemplateRows: "auto 1fr auto" }}>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <footer style={{ padding: 16, textAlign: "center", opacity: 0.7 }}>
        © {new Date().getFullYear()} WebShop — React + Node + MySQL
      </footer>
    </div>
  );
}
