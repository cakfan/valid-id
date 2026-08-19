# @cakfan/valid-id

[![npm version](https://img.shields.io/npm/v/@cakfan/valid-id)](https://www.npmjs.com/package/@cakfan/valid-id)
[![license](https://img.shields.io/npm/l/@cakfan/valid-id)](https://github.com/cakfan/valid-id/blob/main/LICENSE)

Validate and parse Indonesian identity numbers — NIK, NPWP, and NIB — in JavaScript and TypeScript.

Zero dependencies. Works in Node.js, Bun, Deno, and the browser.

## Features

- **NIK validation** — format, region codes (Kemendagri 2025), birth date, gender extraction
- **NPWP validation** — auto-detects old (15-digit), new 16-digit, and NIK-based formats with Luhn checksum
- **NIB validation** — 13-digit format check for Nomor Induk Berusaha
- **CLI support** — run via `npx @cakfan/valid-id`
- **TypeScript** — full type definitions included
- **Zero dependencies** — no network calls, all validation is local
- **Input normalization** — accepts dots, dashes, and spaces

## Table of Contents

- [Install](#install)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Library](#library)
  - [CLI](#cli)
- [API Reference](#api-reference)
- [Region Data](#region-data)
- [Use Cases](#use-cases)
- [Limitations](#limitations)
- [License](#license)

## Install

```bash
npm install @cakfan/valid-id
```

Also available with bun, yarn, or pnpm:

```bash
bun add @cakfan/valid-id
yarn add @cakfan/valid-id
pnpm add @cakfan/valid-id
```

## Quick Start

```typescript
import { validateNik, validateNpwp, validateNib } from "@cakfan/valid-id";

validateNik("3171061501900001");    // { valid: true, data: { region, birthDate, ... } }
validateNpwp("01.300.066.6-091.000"); // { valid: true, format: "old_15", ... }
validateNib("1234567890123");        // { valid: true }
```

## Usage

### Library

```typescript
import { validateNik, validateNpwp, validateNib } from "@cakfan/valid-id";

// Validate NIK (Nomor Induk Kependudukan)
const nik = validateNik("3171 0615 0190 0001"); // spaces are auto-stripped
if (nik.valid) {
  console.log(nik.data.region.provinceName); // "DKI JAKARTA"
  console.log(nik.data.region.regencyName);  // "KOTA ADM. JAKARTA PUSAT"
  console.log(nik.data.region.districtName); // "MENTENG"
  console.log(nik.data.birthDate.year);      // 1990
  console.log(nik.data.birthDate.month);     // 1
  console.log(nik.data.birthDate.day);       // 15
  console.log(nik.data.birthDate.gender);    // "male"
}

// Validate NPWP (Nomor Pokok Wajib Pajak)
const npwp = validateNpwp("01.300.066.6-091.000"); // dots and dashes are auto-stripped
if (npwp.valid) {
  console.log(npwp.format);              // "old_15"
  console.log(npwp.data.taxpayerType);   // "Instansi Pemerintah"
  console.log(npwp.data.kppCode);        // "091"
  console.log(npwp.data.branchCode);     // "000"
}

// Validate NIB (Nomor Induk Berusaha)
const nib = validateNib("1234567890123");
if (nib.valid) {
  console.log("NIB format is valid");
}
```

### CLI

```bash
npx @cakfan/valid-id nik 3171061501900001
npx @cakfan/valid-id npwp 01.300.066.6-091.000
npx @cakfan/valid-id nib 1234567890123
```

Example output:

```
✓ NIK valid
  Provinsi    : DKI JAKARTA (31)
  Kab/Kota    : KOTA ADM. JAKARTA PUSAT (3171)
  Kecamatan   : MENTENG (317106)
  Tgl Lahir   : 15-01-1990
  Gender      : Laki-laki
```

## API Reference

### `validateNik(nik: string): NikValidationResult`

Validates a 16-digit NIK (Nomor Induk Kependudukan). Checks format, region codes against the Kemendagri database, and birth date validity. Extracts parsed data including gender (via the +40 rule for females).

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | Whether the NIK is valid |
| `reason` | `string?` | Explanation if invalid |
| `data.region` | `NikRegionInfo` | Province, regency, district (code + name) |
| `data.birthDate` | `BirthDateInfo` | Day, month, year, gender, Date object |
| `data.sequenceNumber` | `number` | Last 4 digits |

### `validateNpwp(npwp: string): NpwpValidationResult`

Validates an NPWP (Nomor Pokok Wajib Pajak). Auto-detects format:

| Format | Digits | Description |
|--------|--------|-------------|
| `old_15` | 15 | Traditional NPWP with Luhn checksum |
| `new_16` | 16 | New format (starts with `0`) with Luhn checksum |
| `new_nik` | 16 | NIK-based NPWP (validated as NIK) |

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | Whether the NPWP is valid |
| `format` | `NpwpFormat` | Detected format |
| `reason` | `string?` | Explanation if invalid |
| `data.taxpayerType` | `string?` | Taxpayer category |
| `data.kppCode` | `string?` | Tax office code |
| `data.branchCode` | `string?` | Branch code ("000" = head office) |

### `validateNib(nib: string): NibValidationResult`

Validates a 13-digit NIB (Nomor Induk Berusaha). Format check only.

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | Whether the NIB format is valid |
| `reason` | `string?` | Explanation if invalid |

### `extractBirthDateFromNik(digits: string): BirthDateInfo | null`

Lower-level function to extract birth date from the 6-digit date portion of a NIK (digits 7-12). Handles the +40 rule for females.

## Region Data

NIK validation includes a static database of Indonesian region codes (Kemendagri 2025):

- 34 provinces
- 488 regencies/cities
- 6,635 districts

Source: Kepmendagri No. 300.2.2-2138 Tahun 2025.

> **Note**: 4 newly formed Papua provinces (BPS codes 92, 95, 96, 97) do not yet have official Kemendagri codes and are excluded from validation.

## Use Cases

- **KYC forms** — validate user identity numbers during registration
- **Backend validation** — verify NIK/NPWP format before database insertion
- **Fintech onboarding** — check taxpayer identification numbers
- **E-commerce** — validate buyer/seller identity for compliance
- **Government apps** — validate citizen identification numbers
- **Tax filing** — verify NPWP format before submission

## Limitations

- **Format validation only** — does not verify against official government databases (Dukcapil, DJP, OSS)
- **No network calls** — all validation is local, using static data bundled in the package
- **NIB has no checksum** — only 13-digit format is validated; authenticity cannot be verified locally
- **Region codes may become outdated** — new regencies/districts (pemekaran wilayah) require a package update

## License

MIT
