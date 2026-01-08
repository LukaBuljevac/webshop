import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "16px", maxWidth: 1100, width: "100%", margin: "0 auto" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
