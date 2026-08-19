import { describe, expect, it } from "bun:test";
import { validateNpwp } from "./validate-npwp";

describe("validateNpwp", () => {
  describe("old format (15 digits)", () => {
    it("validates government NPWP", () => {
      // T=0 (Instansi Pemerintah)
      const result = validateNpwp("003000668091000");
      expect(result.valid).toBe(true);
      expect(result.format).toBe("old_15");
      expect(result.data?.taxpayerType).toBe("Instansi Pemerintah");
      expect(result.data?.kppCode).toBe("091");
      expect(result.data?.branchCode).toBe("000");
    });

    it("validates individual NPWP", () => {
      // T=7 (Perorangan Lainnya)
      const result = validateNpwp("073121667091000");
      expect(result.valid).toBe(true);
      expect(result.format).toBe("old_15");
      expect(result.data?.taxpayerType).toBe("Perorangan Lainnya");
    });

    it("validates individual entrepreneur NPWP", () => {
      // T=4 (Usaha Perorangan)
      const result = validateNpwp("042345678091000");
      expect(result.valid).toBe(true);
      expect(result.format).toBe("old_15");
      expect(result.data?.taxpayerType).toBe("Usaha Perorangan");
    });

    it("rejects NPWP with invalid checksum", () => {
      const result = validateNpwp("003000669091000");
      expect(result.valid).toBe(false);
      expect(result.format).toBe("old_15");
      expect(result.reason).toContain("Checksum");
    });
  });

  describe("new 16-digit format (starts with 0)", () => {
    it("validates government NPWP", () => {
      // T=0 (Instansi Pemerintah)
      const result = validateNpwp("0003000668091000");
      expect(result.valid).toBe(true);
      expect(result.format).toBe("new_16");
      expect(result.data?.taxpayerType).toBe("Instansi Pemerintah");
      expect(result.data?.kppCode).toBe("091");
      expect(result.data?.branchCode).toBe("000");
    });

    it("validates individual NPWP", () => {
      // T=7 (Perorangan Lainnya)
      const result = validateNpwp("0073121667091000");
      expect(result.valid).toBe(true);
      expect(result.format).toBe("new_16");
      expect(result.data?.taxpayerType).toBe("Perorangan Lainnya");
    });

    it("validates individual entrepreneur NPWP", () => {
      // T=4 (Usaha Perorangan)
      const result = validateNpwp("0042345678091000");
      expect(result.valid).toBe(true);
      expect(result.format).toBe("new_16");
      expect(result.data?.taxpayerType).toBe("Usaha Perorangan");
    });

    it("rejects NPWP with invalid checksum", () => {
      const result = validateNpwp("0003000669091000");
      expect(result.valid).toBe(false);
      expect(result.format).toBe("new_16");
      expect(result.reason).toContain("Checksum");
    });
  });

  describe("new NIK-based format (16 digits, no leading 0)", () => {
    it("validates NPWP that is a valid NIK", () => {
      const result = validateNpwp("3171061501900001");
      expect(result.valid).toBe(true);
      expect(result.format).toBe("new_nik");
    });

    it("rejects NPWP that is not a valid NIK", () => {
      const result = validateNpwp("9971061501900001");
      expect(result.valid).toBe(false);
      expect(result.format).toBe("new_nik");
      expect(result.reason).toContain("NIK");
    });
  });

  describe("input handling", () => {
    it("handles NPWP with dots and dashes", () => {
      const result = validateNpwp("00.300.066.8-091.000");
      expect(result.valid).toBe(true);
      expect(result.format).toBe("old_15");
    });

    it("handles NPWP with spaces", () => {
      const result = validateNpwp("00300 0668 091 000");
      expect(result.valid).toBe(true);
      expect(result.format).toBe("old_15");
    });
  });

  describe("invalid input", () => {
    it("rejects non-string input", () => {
      const result = validateNpwp(123456789012345 as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("string");
    });

    it("rejects empty string", () => {
      const result = validateNpwp("");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("15 atau 16");
    });

    it("rejects 14-digit number", () => {
      const result = validateNpwp("00300066809100");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("15 atau 16");
    });

    it("rejects 17-digit number", () => {
      const result = validateNpwp("00300066800910000");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("15 atau 16");
    });

    it("rejects non-numeric characters", () => {
      const result = validateNpwp("00300066809100A");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("angka");
    });
  });
});
