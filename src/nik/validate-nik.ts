import {
  isValidProvinceCode,
  isValidRegencyCode,
  isValidDistrictCode,
  getProvinceName,
  getRegencyName,
  getDistrictName,
} from "../regions/region-lookup";
import {
  extractBirthDateFromNik,
  type BirthDateInfo,
} from "./birth-date-extractor";

const NIK_LENGTH = 16;

export interface NikRegionInfo {
  provinceCode: string;
  provinceName: string;
  regencyCode: string;
  regencyName: string;
  districtCode: string;
  districtName: string;
}

export interface NikValidationResult {
  valid: boolean;
  reason?: string;
  data?: {
    region: NikRegionInfo;
    birthDate: BirthDateInfo;
    sequenceNumber: number;
  };
}

export function validateNik(nik: string): NikValidationResult {
  if (typeof nik !== "string") {
    return { valid: false, reason: "NIK harus berupa string" };
  }

  const cleaned = nik.replace(/[\s.-]/g, "").trim();

  if (cleaned.length !== NIK_LENGTH) {
    return {
      valid: false,
      reason: `NIK harus ${NIK_LENGTH} digit, ditemukan ${cleaned.length} digit`,
    };
  }

  if (!/^\d{16}$/.test(cleaned)) {
    return { valid: false, reason: "NIK hanya boleh berisi angka" };
  }

  // Validate region codes (digits 1-6)
  const provinceCode = cleaned.slice(0, 2);
  const regencyCode = cleaned.slice(0, 4);
  const districtCode = cleaned.slice(0, 6);

  if (!isValidProvinceCode(provinceCode)) {
    return {
      valid: false,
      reason: `Kode provinsi "${provinceCode}" tidak dikenal`,
    };
  }

  if (!isValidRegencyCode(regencyCode)) {
    return {
      valid: false,
      reason: `Kode kabupaten/kota "${regencyCode}" tidak dikenal`,
    };
  }

  if (!isValidDistrictCode(districtCode)) {
    return {
      valid: false,
      reason: `Kode kecamatan "${districtCode}" tidak dikenal`,
    };
  }

  // Validate and extract birth date (digits 7-12)
  const birthDateInfo = extractBirthDateFromNik(cleaned.slice(6, 12));
  if (!birthDateInfo) {
    return { valid: false, reason: "Tanggal lahir tidak valid" };
  }

  // Sequence number (digits 13-16) — odd = male, even = female
  const sequenceNumber = parseInt(cleaned.slice(12, 16), 10);

  return {
    valid: true,
    data: {
      region: {
        provinceCode,
        provinceName: getProvinceName(provinceCode)!,
        regencyCode,
        regencyName: getRegencyName(regencyCode)!,
        districtCode,
        districtName: getDistrictName(districtCode)!,
      },
      birthDate: birthDateInfo,
      sequenceNumber,
    },
  };
}
