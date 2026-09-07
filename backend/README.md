# Backend

API Express + PostgreSQL. Setup, environment variables, dan cara deploy ada di
[README utama](../README.md).

Ringkas:

```bash
npm install
cp .env.example .env      # isi dulu DB_*, JWT_SECRET, SUPABASE_*, ADMIN_*
npm run migrate           # bikin tabel
npm run seed:admin        # buat akun admin pertama
npm run dev               # http://localhost:3001
```
