# PRD — valid-id

## 1. Latar Belakang

Startup fintech, proptech, dan e-commerce di Indonesia yang butuh validasi identitas (KYC, onboarding user, form registrasi) hampir selalu menulis ulang regex/logic validasi NIK, NPWP, dan NIB dari nol. Tidak ada library open source Indonesia yang menjadi standar untuk kebutuhan ini — developer biasanya copy-paste dari Stack Overflow atau gist yang kualitasnya tidak konsisten dan sering tidak mengikuti perubahan format terbaru (misalnya integrasi NIK ke NPWP mulai 2024).

## 2. Tujuan Produk

Menyediakan library open source (npm package, dengan CLI pendamping) untuk memvalidasi dan mem-parsing format nomor identitas Indonesia:
1. NIK (Nomor Induk Kependudukan) — validasi format + extract data (tanggal lahir, jenis kelamin, kode wilayah).
2. NPWP (Nomor Pokok Wajib Pajak) — validasi format lama (15 digit) dan format baru (16 digit berbasis NIK).
3. NIB (Nomor Induk Berusaha) — validasi format dasar.

Non-goal (di luar scope):
- Tidak melakukan verifikasi keabsahan data ke sumber resmi (Dukcapil, DJP, OSS) — hanya validasi format/struktur.
- Tidak menyimpan atau mengirim data yang divalidasi ke server manapun — murni library yang jalan di sisi pengguna (client-side/server-side lokal).
- Tidak menyediakan UI/aplikasi — murni library + CLI.

## 3. Target Pengguna

- Developer yang membangun form onboarding/KYC di aplikasi fintech, proptech, e-commerce.
- Developer yang butuh validasi input identitas di backend maupun frontend (Node.js/Bun environment).
- Tim data/QA yang butuh CLI cepat untuk cek validitas format data secara manual.

## 4. Fitur Utama (Scope Fase 1 — MVP)

### 4.1 Validasi NIK
- Fungsi `validateNik(nik: string)` — validasi panjang, format, dan kevalidan kode wilayah (provinsi/kabupaten/kecamatan) terhadap database kode wilayah Kemendagri.
- Extract data dari NIK yang valid: tanggal lahir, jenis kelamin (berdasarkan aturan tanggal +40 untuk perempuan), kode wilayah domisili saat pembuatan e-KTP.

### 4.2 Validasi NPWP
- Fungsi `validateNpwp(npwp: string)` — deteksi otomatis format (lama 15 digit vs baru 16 digit berbasis NIK), validasi checksum untuk format lama, validasi format untuk format baru.

### 4.3 Validasi NIB
- Fungsi `validateNib(nib: string)` — validasi format dasar (panjang, pola digit). Didokumentasikan dengan jelas bahwa ini validasi format saja, karena tidak ada algoritma checksum publik yang terdokumentasi untuk NIB.

### 4.4 CLI
- Command `valid-id nik <nomor>`, `valid-id npwp <nomor>`, `valid-id nib <nomor>` — output hasil validasi dan data hasil parsing (jika ada) ke terminal.

### 4.5 Database Kode Wilayah
- Data kode wilayah Kemendagri (provinsi/kabupaten/kecamatan) disertakan sebagai bagian dari package, untuk mendukung validasi NIK.

## 5. Fitur Fase 2 (Belum Prioritas)

- Dukungan bahasa lain untuk pesan error/output (saat ini default Bahasa Indonesia).
- Port ke bahasa lain (Python/PyPI) selain TypeScript/npm.
- Validasi nomor identitas lain (SIM, Paspor) jika ada demand.
- Auto-update database kode wilayah saat ada pemekaran wilayah baru.

## 6. Nama Project

**valid-id** — nama package npm, pendek, deskriptif, langsung menjelaskan fungsinya sebagai validator identitas Indonesia.

## 7. Tech Stack

- **Bahasa**: TypeScript
- **Runtime/tooling**: Bun (build, test, publish)
- **Distribusi**: npm package + CLI binary (bisa dijalankan via `bunx valid-id` / `npx valid-id`)
- **Tanpa dependency eksternal berat** — library validasi murni tidak butuh database server, HTTP client, atau framework; database kode wilayah disertakan sebagai file JSON statis di dalam package.

## 8. Metrik Keberhasilan (untuk riset/penggunaan sendiri)

- `validateNik` dapat memvalidasi dan mem-parsing data dengan benar untuk sample NIK dari seluruh provinsi.
- `validateNpwp` dapat membedakan format lama dan baru secara otomatis tanpa perlu parameter tambahan dari pengguna.
- Package dapat di-install dan dipakai dengan API yang sederhana (tanpa konfigurasi tambahan) dalam waktu di bawah 5 menit oleh developer baru.

## 9. Risiko & Constraint

- Validasi hanya sebatas format/struktur — perlu disclaimer jelas di README supaya tidak disalahartikan sebagai verifikasi keabsahan data resmi, untuk menghindari kesalahpahaman penggunaan (misalnya dianggap pengganti verifikasi Dukcapil/DJP).
- Database kode wilayah perlu di-maintain seiring waktu (ada pemekaran wilayah yang mengubah kode) — perlu proses update berkala meski tidak otomatis.
- Format NPWP dalam masa transisi (dua format berlaku bersamaan) — logic deteksi format perlu diuji dengan sample data dari kedua format.
- Algoritma checksum NIB tidak terdokumentasi secara publik — validasi NIB akan lebih terbatas dibanding NIK/NPWP, perlu dikomunikasikan sebagai limitasi yang jelas di dokumentasi.