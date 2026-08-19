import { validateNik } from "../nik/validate-nik";
import { isValidLuhn } from "./luhn";
import { detectNpwpFormat, type NpwpFormat } from "./npwp-format-detector";

const NPWP_LENGTHS = [15, 16];

export interface NpwpValidationResult {
  valid: boolean;
  format: NpwpFormat;
  reason?: string;
  data?: {
    taxpayerType?: string;
    serialNumber?: string;
    kppCode?: string;
    branchCode?: string;
  };
}

const TAXPAYER_TYPE_NAMES: Record<string, string> = {
  "0": "Instansi Pemerintah",
  "1": "Badan",
  "2": "Badan",
  "3": "Badan",
  "4": "Usaha Perorangan",
  "5": "Pegawai Negeri",
  "6": "Usaha Perorangan",
  "7": "Perorangan Lainnya",
  "8": "Perorangan Lainnya",
  "9": "Perorangan Lainnya",
};

export function validateNpwp(npwp: string): NpwpValidationResult {
  if (typeof npwp !== "string") {
    return { valid: false, format: "unknown", reason: "NPWP harus berupa string" };
  }

  const cleaned = npwp.replace(/[\s.-]/g, "").trim();

  if (!NPWP_LENGTHS.includes(cleaned.length)) {
    return {
      valid: false,
      format: "unknown",
      reason: `NPWP harus 15 atau 16 digit, ditemukan ${cleaned.length} digit`,
    };
  }

  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, format: "unknown", reason: "NPWP hanya boleh berisi angka" };
  }

  const format = detectNpwpFormat(cleaned);

  if (format === "old_15") {
    return validateOldFormat(cleaned);
  }

  if (format === "new_16") {
    return validateNew16Format(cleaned);
  }

  if (format === "new_nik") {
    return validateNikFormat(cleaned);
  }

  return { valid: false, format: "unknown", reason: "Format NPWP tidak dikenal" };
}

function validateOldFormat(npwp: string): NpwpValidationResult {
  const firstNine = npwp.slice(0, 9);
  if (!isValidLuhn(firstNine)) {
    return { valid: false, format: "old_15", reason: "Checksum NPWP tidak valid" };
  }

  return {
    valid: true,
    format: "old_15",
    data: {
      taxpayerType: TAXPAYER_TYPE_NAMES[npwp[1]!] ?? "Tidak diketahui",
      serialNumber: npwp.slice(0, 8),
      kppCode: npwp.slice(9, 12),
      branchCode: npwp.slice(12, 15),
    },
  };
}

function validateNew16Format(npwp: string): NpwpValidationResult {
  const firstTen = npwp.slice(0, 10);
  if (!isValidLuhn(firstTen)) {
    return { valid: false, format: "new_16", reason: "Checksum NPWP tidak valid" };
  }

  return {
    valid: true,
    format: "new_16",
    data: {
      taxpayerType: TAXPAYER_TYPE_NAMES[npwp[2]!] ?? "Tidak diketahui",
      serialNumber: npwp.slice(1, 9),
      kppCode: npwp.slice(10, 13),
      branchCode: npwp.slice(13, 16),
    },
  };
}

function validateNikFormat(npwp: string): NpwpValidationResult {
  const nikResult = validateNik(npwp);
  if (!nikResult.valid) {
    return {
      valid: false,
      format: "new_nik",
      reason: `NPWP berbasis NIK tidak valid: ${nikResult.reason}`,
    };
  }

  return {
    valid: true,
    format: "new_nik",
  };
}
