# Portfolio — Ali Imran Rodja

Website portfolio pribadi dengan CMS sendiri. Semua konten (projects, skills,
experience, education, certificates, profil) disimpan di database dan dikelola
lewat dashboard admin, bukan hard-coded.

**Live:**
- Frontend — https://portofolio-react-puce.vercel.app
- API — https://portofolio-api-phi.vercel.app

---

## Tech stack

| Bagian | Teknologi |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router 7, Axios |
| Backend | Node.js, Express 5, PostgreSQL (`pg`, raw SQL), JWT, bcrypt, Multer |
| File storage | Supabase Storage (upload gambar & PDF) |
| Deploy | Vercel (frontend + backend), Supabase (database + storage) |

## Struktur folder

```
Portofolio_React/
├── backend/          API Express
│   ├── api/          entry point Vercel (serverless)
│   ├── migrations/   file SQL, dijalankan berurutan
│   ├── src/
│   │   ├── config/       koneksi DB
│   │   ├── controllers/  logika tiap resource
│   │   ├── middleware/    auth (JWT), upload (multer), validasi, rate limit
│   │   ├── routes/        definisi endpoint
│   │   ├── scripts/       migrate & seed admin
│   │   ├── utils/         helper Supabase Storage
│   │   └── validators/    aturan validasi per resource
│   └── server.js     entry point lokal (npm run dev)
└── frontend/         React + Vite
    └── src/
        ├── components/   UI (section landing + dashboard)
        ├── context/      AuthContext (login state)
        ├── hooks/        fetch data per section
        ├── pages/        Home, Login, dashboard/*
        ├── routes/       routing + ProtectedRoute
        └── services/     wrapper Axios per resource
```

---

## Prasyarat

- **Node.js** 18+ (`node -v`)
- **PostgreSQL** — pilih salah satu:
  - install lokal (Postgres.app / Homebrew / Docker), atau
  - langsung pakai connection string dari [Supabase](https://supabase.com) (gratis)
- **Akun Supabase** — untuk file storage (upload gambar/PDF)

---

## Setup lokal

### 1. Clone & masuk folder

```bash
git clone https://github.com/AliRodja/Portofolio_React.git
cd Portofolio_React
```

### 2. Siapkan database

Buat satu database kosong, misalnya `portofolio`:

```bash
createdb portofolio
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Isi `.env` (lihat [tabel variabel](#environment-variables) di bawah). Minimal:
`DB_*`, `JWT_SECRET`, `PORT=3001`, `FRONTEND_URL=http://localhost:5173`,
`SUPABASE_*`, dan `ADMIN_*`.

Jalankan migrasi (bikin tabel) lalu buat akun admin pertama:

```bash
npm run migrate
npm run seed:admin
```

Nyalakan server:

```bash
npm run dev
```

Tes: buka http://localhost:3001 → `{"message":"Portfolio API Running"}`

### 4. Frontend

Terminal baru:

```bash
cd frontend
npm install
cp .env.example .env      # isinya sudah pas untuk lokal
npm run dev
```

Buka http://localhost:5173

### 5. Cek end-to-end

1. Buka `/login` → login pakai `ADMIN_EMAIL` / `ADMIN_PASSWORD` dari `.env`
2. Masuk `/dashboard` → tambah project + upload gambar
3. Buka Home → project & gambar tampil
4. Cek Supabase → Storage → file ada di folder `images/`

---

## Environment variables

### `backend/.env`

| Variabel | Contoh | Keterangan |
|---|---|---|
| `DB_HOST` `DB_PORT` `DB_NAME` `DB_USER` `DB_PASSWORD` | `localhost` `5432` `portofolio` … | koneksi Postgres lokal |
| `DB_SSL` | `false` | `true` untuk Postgres cloud |
| `DATABASE_URL` | `postgresql://user:pass@host:6543/postgres` | **alternatif** DB_* di atas. Kalau di-set, DB_* diabaikan. Dipakai di produksi |
| `JWT_SECRET` | string acak 96 hex | kunci token. `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_IN` | `7d` | masa berlaku token |
| `PORT` | `3001` | samakan dengan `VITE_API_URL`. **Di Vercel jangan di-set** |
| `FRONTEND_URL` | `http://localhost:5173` | untuk CORS. Produksi = URL frontend |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Project URL Supabase |
| `SUPABASE_SECRET_KEY` | `sb_secret_…` / `eyJ…` | Settings → API Keys → Secret key (atau legacy `service_role`) |
| `SUPABASE_BUCKET` | `uploads` | nama bucket **public** di Supabase Storage |
| `ADMIN_USERNAME` `ADMIN_EMAIL` `ADMIN_PASSWORD` | — | dipakai sekali oleh `npm run seed:admin` |

### `frontend/.env`

| Variabel | Contoh | Keterangan |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3001/api` | base URL API, **harus** berakhiran `/api` |

---

## Scripts

### backend

| Perintah | Fungsi |
|---|---|
| `npm run dev` | jalankan server + auto-reload (nodemon) |
| `npm start` | jalankan server (produksi) |
| `npm run migrate` | jalankan migrasi SQL yang belum diterapkan |
| `npm run seed:admin` | buat akun admin pertama dari `ADMIN_*` (skip kalau sudah ada) |
| `npm run reset:admin` | ganti password admin yang sudah ada (pakai `ADMIN_EMAIL` + `ADMIN_PASSWORD` baru) |

### frontend

| Perintah | Fungsi |
|---|---|
| `npm run dev` | dev server Vite |
| `npm run build` | build produksi ke `dist/` |
| `npm run preview` | preview hasil build |

---

## Deploy

Arsitektur produksi: **database + storage di Supabase**, **frontend + backend di Vercel** (dua project terpisah).

### 1. Supabase

1. Buat project baru → catat **Database Password**.
2. **Storage → New bucket** → nama `uploads` → centang **Public bucket**.
3. **Settings → API Keys** → copy **Secret key** (`sb_secret_…`).
4. Tombol **Connect** → **Transaction pooler** → copy connection string
   (port `6543`), ganti `[YOUR-PASSWORD]` dengan password langkah 1.
5. Isi tabel produksi dari laptop — arahkan sementara `backend/.env` ke Supabase,
   lalu:
   ```bash
   npm run migrate
   npm run seed:admin
   ```

### 2. Backend → Vercel

1. **Add New → Project** → import repo ini.
2. **Root Directory:** `backend` · **Framework Preset:** Other.
3. **Environment Variables:**
   - `DATABASE_URL` = connection string transaction pooler dari Supabase
   - `JWT_SECRET`, `JWT_EXPIRES_IN`
   - `FRONTEND_URL` = URL frontend Vercel
   - `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_BUCKET`
   - **jangan** set `PORT`
4. Deploy → tes `https://<backend>.vercel.app/api/projects` → keluar JSON.

Konfigurasi Vercel ada di [`backend/vercel.json`](backend/vercel.json); entry
serverless di [`backend/api/index.js`](backend/api/index.js).

### 3. Frontend → Vercel

1. Import repo yang sama sebagai project **kedua**.
2. **Root Directory:** `frontend` · Framework otomatis terdeteksi (Vite).
3. **Environment Variable:** `VITE_API_URL` = `https://<backend>.vercel.app/api`
   (tipe **Config**, bukan Secret).
4. Deploy.

> Ganti `VITE_API_URL` kapan pun → wajib **Redeploy** frontend (nilai `VITE_*`
> di-bake saat build).

---

## Catatan

- **Cold start** — serverless Vercel "tidur" saat idle; request pertama agak lambat (~2–3 dtk).
- **Batas upload 4 MB** — batas body serverless Vercel ~4.5 MB (diset di [`backend/src/middleware/upload.js`](backend/src/middleware/upload.js)).
- **Auto-cleanup file** — saat row dihapus atau gambar diganti, file lama di Supabase Storage ikut dihapus ([`backend/src/utils/storage.js`](backend/src/utils/storage.js)).
- **Validasi input** — semua endpoint tulis divalidasi di route ([`middleware/validate.js`](backend/src/middleware/validate.js), aturan di [`validators/schemas.js`](backend/src/validators/schemas.js)). Data tidak valid dibalas `400` dengan pesan per field; pesan itu tampil di toast dashboard.
- **Tanggal** — kolom `DATE` dikirim API sebagai teks `YYYY-MM-DD` (tidak bergantung zona waktu server), lihat [`config/db.js`](backend/src/config/db.js).
- **Tidak ada pendaftaran publik** — `POST /api/auth/register` butuh token admin; akun pertama dibuat via `npm run seed:admin`.

## API endpoints

| Endpoint | Auth |
|---|---|
| `POST /api/auth/login` | publik |
| `GET` profile · projects · skills · experiences · education · certificates · social-links · stats | publik |
| `POST /api/messages` (kirim pesan dari form kontak) | publik |
| `POST /api/uploads` | JWT |
| `POST` / `PUT` / `DELETE` semua resource | JWT |
| `GET /api/messages`, `GET /api/dashboard` | JWT |
