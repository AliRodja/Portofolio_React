# DESIGN.md · Portfolio Ali Imran Rodja

Arah desain untuk halaman publik (`/`). Login dan dashboard admin tidak ikut aturan ini.

**Sumber arah:** referensi visual dari pemilik (portfolio UX designer bergaya terang, judul hitam tebal, foto lingkaran dengan garis panduan, section gelap berselang). Dipakai sebagai inspirasi, bukan disalin: isi, nama, dan logo tetap milik Ali.

**Design Read:** portfolio pribadi untuk rekruter dan calon klien yang menilai junior full-stack developer yang juga mendesain UI, dengan gaya terang yang percaya diri dan bertumpu pada tipografi.

**Dial:** ENERGY 2 / RHYTHM 2 / MOTION 2

## Identitas

- **Siapa:** Ali Imran Rodja, junior full-stack web developer dan UI/UX designer, mantan ketua himpunan (HMTIF-UNPAS).
- **Kepribadian:** lugas, rapi, percaya diri lewat isi (project, peran, tahun), bukan lewat efek.
- **Suara copy:** orang pertama, kalimat pendek, spesifik. Tanpa em dash, tanpa buzzword, tanpa "Stay tuned".

## Warna

| Token | Nilai | Dipakai untuk | Kontras |
|---|---|---|---|
| Kertas | `#FFFFFF` | latar section terang | |
| Tinta | `#111113` | judul dan teks utama di terang; latar band gelap | 18.9:1 di kertas |
| Teks sekunder | zinc-600 `#52525B` | paragraf dan label di terang | 7.7:1 |
| Aksen | blue-700 `#1D4ED8` | kotak sorot kata (teks putih di atasnya), cincin foto, link, garis aktif | 6.7:1 di kertas; putih di atasnya 6.7:1 |
| Aksen di gelap | blue-400 `#60A5FA` | sorotan dan link di band gelap | 7.4:1 di tinta |
| Teks sekunder di gelap | zinc-400 `#A1A1AA` | paragraf di band gelap | 7.4:1 |
| Garis | zinc-200 / zinc-800 | pembatas (dekoratif) | |
| Tepi input | zinc-500 `#71717A` | border field form, terang dan gelap | 4.8:1 di kertas, 3.9:1 di tinta |

Satu aksen saja: biru, meneruskan warna logo. Hijau hanya untuk titik status "Available for work".

## Tipografi

- **Judul:** Archivo (400 dan 700, self-hosted). Grotesk lebar yang mendekati referensi; campuran 400 dan 700 dalam satu judul adalah suara utamanya.
- **Isi, label, form:** Inter (self-hosted). Sangat terbaca di ukuran kecil; dipisah dari judul supaya hierarki jelas.
- Tidak ada label uppercase dengan tracking lebar.

## Ikon

- **Lucide** (`lucide-react`) untuk semua ikon fungsional di halaman publik: menu, panah, kontak, status, Services. Satu gaya garis di seluruh halaman.
- **Logo merek** (GitHub, LinkedIn, Instagram, WordPress, logo skill) tetap dari `react-icons`, karena Lucide tidak menyediakan logo merek.
- Setiap ikon harus relevan dengan isinya; kalau tidak ada yang cocok, tanpa ikon (contoh: Midtrans).

## Ciri khas (motif)

1. **Kotak sorot kata:** satu kata kunci di setiap judul section diberi kotak aksen (teks putih di atas blue-700), seperti "My portfolio" di referensi.
2. **Garis panduan ala Figma:** garis putus-putus dan tanda sudut di sekitar foto Hero, merujuk ke pekerjaan desain UI.

## Komposisi dan ritme

- Terang: Hero, Skills, Projects, Experience, Education, Certificates.
- Gelap: About (+ Services) setelah Hero, lalu Contact dan footer di akhir. Band gelap memberi jeda; komposisi tiap section tetap berbeda (dua kolom, daftar per kategori, carousel, timeline, form).
- **Lebar penuh dengan jarak tepi lega (pilihan pemilik, 2026-11-08):** section dan isinya membentang selebar layar tanpa `max-width`, dengan jarak tepi yang ikut membesar: 24px ponsel, 40px tablet, 80px laptop, 96px desktop, 128px layar lebar. (Versi jarak 40px sempat dicoba dan terasa terlalu dempet.) Paragraf panjang tetap dibatasi lebarnya agar nyaman dibaca.
- Bar statistik menyeberangi batas Hero dan band gelap pertama, tetap di tengah dengan lebarnya sendiri.
- Radius: 12px untuk kartu dan tombol, 6px untuk tag. Tidak ada yang berbentuk pill kecuali titik status dan dot carousel.
- Bayangan hanya satu, tipis, pada bar statistik (penanda elevasi karena ia melayang di atas dua section).

## Gerakan (MOTION 2)

Dinaikkan dari MOTION 1 atas permintaan pemilik (2026-11-08), lalu dirancang ulang supaya lebih hidup. Semua efek berjalan **sekali** saat blok pertama kali terlihat, lalu diam. Mesinnya `Reveal.jsx` (IntersectionObserver) dan CSS "Scroll reveal" di `index.css`. Kurva: `cubic-bezier(0.22, 1, 0.36, 1)`.

| Efek | Di mana | Tujuan |
|---|---|---|
| Naik 32px + blur ke tajam (blur hanya ≥768px) | Judul section dan blok besar | Kesan "fokus" saat konten masuk |
| Kotak sorot menyapu dari kiri, lalu warna kata berganti | Kata kunci setiap judul | Mengarahkan mata ke motif utama situs |
| Masuk berurutan (stagger) | Teks Hero, Services, What I bring, chip Skills, info kontak | Memberi urutan baca |
| Garis panduan tergambar, cincin bergeser ke posisi, sparkle berputar masuk | Foto Hero | Menghidupkan motif frame ala alat desain |
| Angka menghitung naik ke angka asli | Bar statistik | Menarik mata ke data nyata, berhenti tepat di nilai database |
| Garis timeline tumbuh ke bawah | Experience | Menggambarkan urutan waktu |

- **Tidak ada** float, pulse, bounce, marquee, atau animasi yang berulang.
- **`prefers-reduced-motion`:** semua blok langsung tampil, transisi dimatikan, angka statistik langsung angka akhir.
- Selain itu hanya status hover, fokus, dan aktif. Scroll carousel hanya karena aksi pengguna.

## Pengecualian yang dipilih pemilik (R-37)

| Elemen | Aturan yang bertabrakan | Keputusan |
|---|---|---|
| Bar statistik di bawah Hero | R-17 angka tanpa sumber | Dipertahankan, dengan angka asli dari database, tanpa "+", tanpa blur. Angka 0 tidak ditampilkan. |
| Latar blob pastel blur di Hero | R-01 / R-13 latar glow berwarna | Dipertahankan, statis, hanya di Hero, warna biru pucat dari aksen. |
| Ikon sparkle dekoratif dekat foto | R-04 ikon AI generik | Dipertahankan, satu buah, `aria-hidden`. |
| Ikon Lucide di seluruh halaman | R-04 set ikon dipilih karena gaya library (Lucide disebut langsung) | Dipilih pemilik (2026-11-08) supaya gaya ikon seragam. Syaratnya tetap: setiap ikon relevan dengan isinya. |
| Section Services | R-38 konten harus nyata | Dipertahankan; isinya hanya dari daftar yang disetujui pemilik (4 layanan, disetujui 2026-11-08, `frontend/src/constants/services.js`). |
| Navbar pill mengambang dengan glow biru di link aktif | R-11 semua elemen berbentuk pill / R-13 glow dekoratif | Dipilih pemilik dari gambar contoh (2026-11-08). Pill hanya untuk bar, tombol Contact Me, dan dropdown; glow hanya satu, di bawah link section yang sedang dilihat. Experience, Education, Certificates digabung di dropdown "Journey". Tombol kanan hanya "Contact Me" (pengunjung tidak butuh login). |
