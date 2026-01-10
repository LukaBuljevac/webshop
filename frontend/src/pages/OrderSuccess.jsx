import { Link, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <h1>Narudžba uspješna ✅</h1>
      <p>Tvoja narudžba je kreirana. Broj narudžbe: <strong>#{id}</strong></p>
      <Link to="/shop">Nazad u shop</Link>
    </div>
  );
}
