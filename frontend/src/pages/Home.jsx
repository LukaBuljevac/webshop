export default function Home() {
  const { user } = useAuth();

  return (
    <main className="home">
      <section className="card home-card">
        <h1>WebShop</h1>

        <p className="muted">
          {user
            ? `Dobrodošao, ${user.name} 👋`
            : "Dobrodošao! Prijavi se ili se registriraj 👋"}
        </p>

        <div className="actions">
          {!user && (
            <>
              <button className="btn primary">Prijava</button>
              <button className="btn ghost">Registracija</button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
