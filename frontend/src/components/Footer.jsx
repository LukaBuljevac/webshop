export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(0,0,0,0.08)", padding: "18px 16px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 700 }}>WebShop</div>
        <div style={{ opacity: 0.8 }}>
          Brza dostava (24–48h) · Povrat unutar 14 dana · Podrška: support@webshop.local
        </div>
        <div style={{ opacity: 0.7, fontSize: 13 }}>© {new Date().getFullYear()} WebShop — demo projekt</div>
      </div>
    </footer>
  );
}
