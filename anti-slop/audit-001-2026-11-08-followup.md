# Tindak lanjut audit 001 · 2026-11-08

**Disetujui pemilik:** nomor 2 sampai 14. Nomor 1 dan 15 sampai 28 tidak disentuh.

**Verifikasi:** build Vite, ESLint (0 error; 7 warning lama di dashboard), tes frontend 16/16, tes backend 66/66, lalu klik-uji di Chrome headless lewat DevTools Protocol terhadap server dev lokal (data dari database Supabase, hanya dibaca: tidak ada form yang dikirim, tidak ada login). Viewport 1440×900 dan 375×812, dengan dan tanpa `prefers-reduced-motion`. Tidak ada error di console.

## Status per nomor

| No | Aturan | Status | Bukti |
|---|---|---|---|
| 2 | R-02 | Selesai | 0 em dash di `<head>` dan di teks halaman. Database (disetujui pemilik): 7 `projects.description` dan 1 `education.degree` diperbarui dalam satu transaksi, `updated_at` tidak disentuh sehingga urutan project tetap; cadangan nilai lama disimpan. `seedContent.js` ikut diperbaiki. |
| 3 | R-17 | Selesai | Stats tampil "9 Projects", "23 Skills", "3 Roles"; tanpa "+"; kartu bernilai 0 (Certificates) tidak tampil. |
| 4 | R-38 | Selesai | 0 kartu project menampilkan tanggal; `created_at` tidak lagi dipakai sebagai tanggal project. |
| 5 | R-38 | Selesai | Kartu About: "Cimahi, West java, Indonesia" dan headline asli; fallback "Gorontalo"/"Full Stack Dev" dihapus, kartu disembunyikan kalau datanya kosong. |
| 6 | R-27 | Selesai | `/api/profile` digagalkan dengan sengaja: muncul pesan + tombol "Try again"; klik "Try again" setelah jaringan pulih memuat halaman. Stats dan Skills punya state loading/error/kosong; Experience dan Education punya state kosong. |
| 7 | R-24 | Selesai | Semua link `#` di navbar dan Hero punya target (0 link tanpa target). |
| 8 | R-25 | Selesai | Band Quote: teks putih minimal 4.73:1 (sebelumnya 2.43:1). Teks abu-abu kecil: 6.96:1 (sebelumnya 2.36 sampai 3.75:1). Placeholder input: 6.12:1 (sebelumnya 2.07:1). |
| 9 | R-39 | Selesai | Tombol "Pause scrolling" menghentikan marquee (`animation-play-state: paused`) dan "Resume scrolling" menjalankannya lagi. 23 salinan skill `aria-hidden`. Reduced motion: marquee jadi daftar statis terbungkus, salinan dan tombol jeda disembunyikan, glow dan bounce berhenti, 0 elemen AOS tersembunyi. |
| 10 | R-39 | Selesai | Label Contact dan Login terhubung ke input (`label.control`). Link Code/Demo di ponsel punya teks "Code"/"Demo" untuk pembaca layar. Hamburger: `aria-expanded` false/true; drawer `inert` saat tertutup sehingga link tersembunyi tidak terjangkau Tab. |
| 11 | R-39 | Selesai | Semua tombol publik `cursor: pointer`; panah carousel nonaktif `not-allowed`. |
| 12 | R-32 | Selesai | Input Contact dan Login yang fokus menampilkan ring 2px (biru-400 di latar gelap, biru-600 di Login). |
| 13 | R-03 | Selesai | Dot carousel 44×44 px; di ponsel dot disembunyikan (tombol panah 44px, penghitung, dan swipe tetap ada); tidak ada overflow horizontal di 375px. |
| 14 | R-40 | Selesai | Foto Hero `fetchpriority="high"`, `width`/`height` 330; halaman tidak lagi menunggu `/api/profile` (lihat N3). |

Klik-uji tambahan: panah "Next" mengubah penghitung "1–3 of 9" menjadi "4–6 of 9"; dot 1 kembali ke "1–3"; "Read more" membuka modal dan Escape menutupnya; link menu mobile menutup drawer; hamburger 44×44.

## Yang ikut diperbaiki karena berkaitan

- Pause saat hover pada marquee (sudah ada sebelumnya) ternyata tidak pernah berfungsi: class `.animate-marquee` di luar layer Tailwind selalu menang. Sekarang pakai CSS biasa dengan selector lebih spesifik.
- Tombol hamburger diperbesar dari 40px ke 44px.

## Temuan baru dari klik-uji (disetujui pemilik, sudah diperbaiki)

| No | Aturan | Status | Bukti |
|---|---|---|---|
| N1 | R-39 / R-32 | Selesai | Modal "Read more": `role="dialog"`, `aria-modal="true"`, `aria-labelledby` ke judul project. Saat dibuka fokus pindah ke tombol Close, `#root` jadi `inert` (4× Tab tetap di dalam modal). Escape menutup, `inert` dilepas, fokus kembali ke tombol "Read more". |
| N2 | R-03 | Selesai | Tombol tutup modal 44×44; link Code/Demo di ponsel 48×44 dan 46×44. |
| N3 | R-40 | Selesai | Halaman dirender langsung; setiap section memulai request sendiri secara bersamaan. Saat `/api/profile` ditahan: Projects (9 kartu), Stats, Skills sudah tampil, Hero dan About menampilkan skeleton. Saat `/api/profile` gagal: pesan + "Try again" di Hero, About menunjuk ke tombol itu, section lain tetap jalan; "Try again" memulihkan keduanya. `preconnect` ke API dan ke Supabase Storage di `index.html`; hash script inline di CSP tetap cocok. |

## Temuan baru lagi (disetujui pemilik, sudah diperbaiki)

| No | Aturan | Status | Bukti |
|---|---|---|---|
| N4 | R-32 | Selesai | Overlay gambar project ditambah `focus-within:opacity-100`. Dengan Tab sungguhan dari carousel: fokus ke "View source code on GitHub" dan "View live demo" (48×48) membuat overlay terlihat (opacity 1) dengan outline fokus; saat fokus pindah ke "Code", overlay kembali tersembunyi. Hover mouse tetap berfungsi. |

## Delivery Gate (lingkup nomor 2 sampai 14)

PASS untuk R-02, R-03 (di 375px tidak ada overflow; dot, hamburger, tombol modal, link Code/Demo 44px), R-17, R-24, R-25, R-27, R-32, R-38, R-39 dan R-40 pada elemen yang diubah, dengan bukti di tabel di atas. Tidak ada error di console.

Di luar lingkup ini gate masih FAIL, sesuai pilihan pemilik untuk menunda: R-37 (#1, tanpa arah desain), Purpose-Gate #15 sampai #22, Quality Lock #23 sampai #28, Tidak ada temuan baru yang tersisa dari klik-uji.
