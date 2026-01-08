import { useAuth } from "../auth/AuthContext.jsx";

export default function Admin() {
  const { user } = useAuth();
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <h1>Admin Panel</h1>
      <p>Prijavljen kao: <strong>{user?.email}</strong> ({user?.role})</p>
      <p>DAN 4: ovdje ide CRUD proizvoda. DAN 6: narudžbe.</p>
    </div>
  );
}
