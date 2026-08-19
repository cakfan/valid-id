# valid-id

Validate and parse Indonesian identity numbers — NIK, NPWP, and NIB.

Zero dependencies. Runs in Node.js, Bun, Deno, and the browser.

> **Disclaimer**: This library validates **format and structure only**. It does not verify numbers against official databases (Dukcapil, DJP, OSS). Do not use the results as proof of identity or legal validity.

## Install

```bash
# npm
npm install valid-id

# bun
bun add valid-id

# yarn / pnpm
yarn add valid-id
# or
pnpm add valid-id
```

## Usage

### Library

```typescript
import { validateNik, validateNpwp, validateNib } from "valid-id";

// NIK — validates format + region codes + birth date, extracts parsed data
const nik = validateNik("3171061501900001");
if (nik.valid) {
  console.log(nik.data.region.provinceName); // "DKI JAKARTA"
  console.log(nik.data.birthDate.gender);     // "male"
  console.log(nik.data.birthDate.date);       // Date(1990, 0, 15)
}

// NPWP — auto-detects old (15-digit), new 16-digit, and NIK-based formats
const npwp = validateNpwp("01.300.066.6-091.000");
if (npwp.valid) {
  console.log(npwp.format);                // "old_15"
  console.log(npwp.data?.taxpayerType);    // "Instansi Pemerintah"
}

// NIB — validates 13-digit format (no public checksum algorithm exists)
const nib = validateNib("1234567890123");
console.log(nib.valid); // true
```

### CLI

```bash
# via npx / bunx (after install)
npx valid-id nik 3171061501900001
npx valid-id npwp 01.300.066.6-091.000
npx valid-id nib 1234567890123
```

Output:

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

Validates a 16-digit NIK (Nomor Induk Kependudukan). Checks format, region codes (province, regency, district) against the Kemendagri database, and birth date validity. Extracts parsed data including gender (via the +40 rule for females).

Input with spaces or dashes is automatically stripped (`"3171 0615 0190 0001"` is accepted).

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

Input with dots, dashes, or spaces is automatically stripped.

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | Whether the NPWP is valid |
| `format` | `NpwpFormat` | Detected format |
| `reason` | `string?` | Explanation if invalid |
| `data.taxpayerType` | `string?` | Taxpayer category (e.g. "Badan", "Perorangan") |
| `data.kppCode` | `string?` | Tax office code |
| `data.branchCode` | `string?` | Branch code ("000" = head office) |

### `validateNib(nib: string): NibValidationResult`

Validates a 13-digit NIB (Nomor Induk Berusaha). Format check only — no public checksum algorithm exists for NIB.

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | Whether the NIB format is valid |
| `reason` | `string?` | Explanation if invalid |

### `extractBirthDateFromNik(digits: string): BirthDateInfo | null`

Lower-level function to extract birth date from the 6-digit date portion of a NIK (digits 7-12). Handles the +40 rule for females. Returns `null` if the date is invalid.

## Data

The NIK validation includes a static database of Indonesian region codes (Kemendagri 2025):

- 34 provinces
- 488 regencies/cities
- 6,635 districts

Source: Kepmendagri No. 300.2.2-2138 Tahun 2025.

> **Note**: 4 newly formed Papua provinces (BPS codes 92, 95, 96, 97) do not yet have official Kemendagri codes and are excluded from validation.

## Limitations

- **Format validation only** — does not verify against official government databases
- **No network calls** — all validation is local, using static data bundled in the package
- **NIB has no checksum** — only 13-digit format is validated; authenticity cannot be verified locally
- **Region codes may become outdated** — new regencies/districts (pemekaran wilayah) require a package update

## License

MIT
