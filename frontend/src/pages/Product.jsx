import { useParams } from "react-router-dom";

export default function Product() {
  const { id } = useParams();
  return (
    <div>
      <h1>Product #{id}</h1>
      <p>Detalji proizvoda dolaze s API-ja (Dan 4).</p>
    </div>
  );
}
