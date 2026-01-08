export default function Shop() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <h1>Shop</h1>

      {/* FILTER BAR */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Pretraži proizvode..."
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            minWidth: 220,
          }}
        />
        <select style={{ padding: "10px", borderRadius: 10 }}>
          <option>Svi proizvodi</option>
          <option>Dostupni</option>
        </select>
      </div>

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <div
            key={id}
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 16,
              padding: 16,
              display: "grid",
              gap: 10,
            }}
          >
            <div
              style={{
                height: 140,
                borderRadius: 12,
                background: "#eee",
              }}
            />
            <strong>Primjer proizvoda</strong>
            <span style={{ opacity: 0.7 }}>99.99 €</span>
            <button>Dodaj u košaricu</button>
          </div>
        ))}
      </div>
    </div>
  );
}
