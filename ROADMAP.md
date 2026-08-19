# ROADMAP — valid-id

## Fase 0 — Setup Project
- [x] Init project TypeScript + Bun
- [x] Setup struktur folder (src, kebab-case file naming)
- [x] Setup AGENTS.md (coding conventions, mengikuti pola project sebelumnya)
- [x] Setup build & publish config untuk npm (package.json, tsconfig, exports)
- [x] Setup testing framework (Bun test)

## Fase 1 — Validasi NIK (prioritas utama, paling banyak dipakai)
- [x] Kumpulkan database kode wilayah Kemendagri (provinsi/kabupaten/kecamatan) — simpan sebagai JSON statis di package
- [x] Implementasi `validateNik()` — cek panjang, format, kevalidan kode wilayah
- [x] Implementasi extract data dari NIK: tanggal lahir (termasuk aturan +40 untuk perempuan), jenis kelamin, kode wilayah
- [x] Unit test dengan sample NIK dari beberapa provinsi berbeda (termasuk kasus laki-laki & perempuan)
- [x] Unit test untuk kasus invalid (panjang salah, kode wilayah tidak ada, tanggal tidak valid)

## Fase 2 — Validasi NPWP
- [ ] Riset format lama (15 digit) dan format baru (16 digit berbasis NIK) secara detail
- [ ] Implementasi deteksi otomatis format (lama vs baru)
- [ ] Implementasi validasi checksum untuk format lama
- [ ] Implementasi validasi format untuk format baru (berbasis validasi NIK dari Fase 1)
- [ ] Unit test untuk kedua format, termasuk kasus checksum invalid

## Fase 3 — Validasi NIB
- [ ] Riset format dan struktur NIB (panjang, pola digit) — dokumentasikan sumber referensi
- [ ] Implementasi `validateNib()` — validasi format dasar
- [ ] Dokumentasikan limitasi (tidak ada verifikasi checksum, hanya validasi pola)
- [ ] Unit test untuk kasus format valid/invalid

## Fase 4 — CLI
- [ ] Implementasi CLI command: `valid-id nik <nomor>`, `valid-id npwp <nomor>`, `valid-id nib <nomor>`
- [ ] Output hasil validasi dalam format yang mudah dibaca di terminal (termasuk data hasil parsing jika ada)
- [ ] Setup binary agar bisa dijalankan via `bunx valid-id` / `npx valid-id`

## Fase 5 — Dokumentasi & Polish
- [ ] Tulis README lengkap: instalasi, contoh penggunaan (library + CLI), disclaimer batasan validasi
- [ ] Dokumentasikan API reference untuk setiap fungsi (parameter, return type, contoh)
- [ ] Cantumkan disclaimer jelas: validasi format saja, bukan verifikasi ke sumber resmi
- [ ] Review keseluruhan test coverage

## Fase 6 — Publish
- [ ] Publish ke npm registry sebagai `valid-id`
- [ ] Publish source ke GitHub (open source)
- [ ] Tulis contoh penggunaan di README dengan use case nyata (form KYC, validasi input backend)

## Backlog / Fase 2 Produk (belum prioritas)
- [ ] Port ke Python (PyPI)
- [ ] Dukungan multi-bahasa untuk pesan error
- [ ] Validasi nomor identitas lain (SIM, Paspor)
- [ ] Mekanisme update database kode wilayah yang lebih mudah (seiring ada pemekaran wilayah baru)