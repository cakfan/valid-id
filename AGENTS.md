# AGENTS.md — valid-id

Panduan ini berlaku untuk siapa pun (manusia atau AI agent) yang menulis kode di project ini. Tujuannya: kode tetap mudah dipelihara dalam jangka panjang, meski dikerjakan solo.

## 1. Penamaan File

- Semua nama file pakai **kebab-case**: `validate-nik.ts`, `validate-npwp.ts`, `region-lookup.ts`.
- Tidak ada camelCase, PascalCase, atau snake_case untuk nama file — termasuk file konfigurasi custom.
- Nama file harus deskriptif terhadap isinya, bukan generik. Hindari `utils.ts`, `helper.ts`, `misc.ts` — pecah jadi file spesifik sesuai fungsinya, misal `birth-date-extractor.ts`, `npwp-format-detector.ts`.
- Struktur folder mengikuti domain, bukan tipe file. Contoh:
  ```
  src/
    nik/
      validate-nik.ts
      birth-date-extractor.ts
    npwp/
      validate-npwp.ts
      npwp-format-detector.ts
    nib/
      validate-nib.ts
    regions/
      region-lookup.ts
      region-code-data.json
    cli/
      cli-entry.ts
  ```

## 2. Penamaan Variabel & Fungsi

- Nama variabel dan fungsi harus **manusiawi dan deskriptif** — bisa dibaca seperti kalimat, bukan singkatan kriptik.
  - Baik: `birthDate`, `regionCode`, `validateNik()`
  - Hindari: `bd`, `rc`, `valNik()`
- Untuk istilah domain-spesifik (NIK, NPWP, NIB, kode wilayah), gunakan istilah yang sudah baku daripada disingkat sendiri. Contoh: `provinceCode`, `regencyCode`, `districtCode` — bukan `pc`, `rgc`, `dc`.
- Boolean diberi prefix jelas: `isValidFormat`, `hasRegionMatch` — bukan `valid`, `flag`.
- Fungsi diberi nama sebagai kata kerja yang menjelaskan aksinya: `extractBirthDateFromNik()`, bukan `nikDate()` atau `process()`.

## 3. Tidak Ada Redundansi (Single Source of Truth)

- Data kode wilayah hanya ada di satu file data (`region-code-data.json`), tidak boleh ada salinan hardcoded di file validasi lain.
- Logika parsing NIK (extract tanggal lahir, jenis kelamin, kode wilayah) hanya boleh ada satu implementasi — dipakai bersama oleh `validate-nik.ts` dan `validate-npwp.ts` (karena NPWP format baru berbasis NIK), bukan diduplikasi.
- Konstanta (pola regex, panjang digit per jenis nomor, dst) didefinisikan satu kali di file konfigurasi terkait, lalu di-import di tempat lain — tidak di-copy-paste ulang.
- Sebelum menambah fungsi/helper baru, cek dulu apakah fungsi serupa sudah ada di codebase.

## 4. Kode Bersih & Best Practices

- Satu fungsi hanya bertanggung jawab atas satu hal (single responsibility). Jika sebuah fungsi butuh komentar untuk menjelaskan "bagian ini melakukan X, bagian ini melakukan Y" — itu tandanya fungsi tersebut harus dipecah.
- Hindari nested logic yang dalam (lebih dari 2-3 level). Gunakan early return untuk mengurangi nesting, terutama pada validasi berlapis (panjang → format → checksum → kode wilayah).
- Semua fungsi publik (exported dari package, dipakai konsumen library) diberi tipe TypeScript eksplisit untuk parameter dan return value — ini krusial karena `valid-id` adalah library yang API publiknya jadi kontrak dengan pengguna.
- CLI tetap tipis — logic validasi diletakkan di layer terpisah (`src/<domain>/`), CLI hanya memanggil fungsi tersebut dan memformat output ke terminal.
- Error handling eksplisit: hasil validasi selalu dikembalikan sebagai object terstruktur (`{ valid: boolean, ... }`), bukan throw exception untuk kasus format tidak valid — reserve exception hanya untuk input yang benar-benar salah tipe (misalnya bukan string).
- Tidak ada magic number tanpa penjelasan — gunakan named constant. Contoh: `const NIK_LENGTH = 16;` bukan angka `16` langsung di tengah validasi.
- Komentar hanya untuk menjelaskan **kenapa**, bukan **apa** — terutama penting di bagian aturan domain yang tidak intuitif (misal aturan tanggal lahir +40 untuk perempuan di NIK) karena itu butuh konteks yang tidak jelas dari kode saja.

## 5. Konsistensi dengan Project Lain

Project ini mengikuti konvensi yang sama dengan project lain dalam portofolio (CekSaham, Biayabangun, api-harga-pangan, api-waktu):
- Seluruh tooling pakai **Bun** (bukan npm/yarn/pnpm) — instalasi dependency, run script, build, test, semua lewat `bun`.
- Commit message singkat, deskriptif, present tense (misal: `add nik validation logic`, bukan `added` atau `adding`).
- Dokumentasi (PRD.md, ROADMAP.md, AGENTS.md) selalu diperbarui saat scope atau keputusan teknis berubah — jangan biarkan dokumen basi.

## 6. Testing

- Setiap fungsi validasi (`validateNik`, `validateNpwp`, `validateNib`) wajib punya unit test dengan sample data yang mencakup kasus valid dan invalid, termasuk edge case (kode wilayah tidak dikenal, checksum salah, format transisi NPWP).
- Test diletakkan berdampingan dengan file yang diuji (`validate-nik.ts` → `validate-nik.test.ts`), bukan di folder `__tests__` terpisah.
- Karena ini library publik, breaking change pada return type atau signature fungsi harus terdeteksi oleh test sebelum publish — jalankan test sebagai bagian dari proses build/publish, bukan langkah terpisah yang bisa terlewat.

## 7. Disclaimer & Batasan (Khusus Project Ini)

- Setiap fungsi validasi hanya memvalidasi **format/struktur**, bukan verifikasi ke sumber data resmi (Dukcapil, DJP, OSS). Ini harus tercermin di penamaan fungsi dan dokumentasi — jangan gunakan nama yang menyiratkan verifikasi resmi (misal `verifyNik` yang terkesan cek ke database asli).
- Package ini tidak boleh melakukan panggilan jaringan (network call) apa pun — murni validasi lokal berbasis pola dan data statis yang disertakan dalam package, untuk menjaga privasi data yang divalidasi pengguna.