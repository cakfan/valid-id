const NIB_LENGTH = 13;

export interface NibValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validate NIB (Nomor Induk Berusaha) format.
 *
 * Limitasi: NIB adalah 13 digit angka acak yang diterbitkan oleh sistem OSS.
 * Tidak ada algoritma checksum publik yang terdokumentasi untuk NIB.
 * Validasi ini hanya memeriksa format/struktur (panjang dan tipe karakter),
 * bukan keabsahan NIB terhadap database OSS.
 */
export function validateNib(nib: string): NibValidationResult {
  if (typeof nib !== "string") {
    return { valid: false, reason: "NIB harus berupa string" };
  }

  const cleaned = nib.replace(/[\s.-]/g, "").trim();

  if (cleaned.length !== NIB_LENGTH) {
    return {
      valid: false,
      reason: `NIB harus ${NIB_LENGTH} digit, ditemukan ${cleaned.length} digit`,
    };
  }

  if (!/^\d{13}$/.test(cleaned)) {
    return { valid: false, reason: "NIB hanya boleh berisi angka" };
  }

  return { valid: true };
}
