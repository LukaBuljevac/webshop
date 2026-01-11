# WebShop Projekt (React + Node.js + MySQL)

Demo webshop aplikacija napravljena u Reactu (Vite) i Node.js (Express) uz MySQL bazu (XAMPP).

## Tehnologije
- Frontend: React + Vite + react-router-dom
- Backend: Node.js + Express
- DB: MySQL (XAMPP)
- Komunikacija: REST API + JSON + fetch (AJAX)

## Pokretanje (lokalno)
### 1) Baza (XAMPP)
- Pokreni XAMPP i uključi MySQL
- Kreiraj bazu: `webshop`
- Import schema (ako imaš): `database/schema.sql`
- Import demo proizvoda: `database/seed.sql` (opcionalno)

### 2) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
