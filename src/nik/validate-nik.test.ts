import { describe, expect, it } from "bun:test";
import { validateNik } from "./validate-nik";

describe("validateNik", () => {
  describe("valid NIK", () => {
    it("validates male NIK from DKI Jakarta", () => {
      // 317106 = MENTENG, Kota Jakarta Pusat
      // 150190 = male, born 15 Jan 1990
      // 0001 = sequence
      const result = validateNik("3171061501900001");
      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.region.provinceCode).toBe("31");
      expect(result.data!.region.provinceName).toBe("DKI JAKARTA");
      expect(result.data!.region.regencyCode).toBe("3171");
      expect(result.data!.region.regencyName).toBe("KOTA ADM. JAKARTA PUSAT");
      expect(result.data!.region.districtCode).toBe("317106");
      expect(result.data!.region.districtName).toBe("MENTENG");
      expect(result.data!.birthDate.gender).toBe("male");
      expect(result.data!.birthDate.day).toBe(15);
      expect(result.data!.birthDate.month).toBe(1);
      expect(result.data!.birthDate.year).toBe(1990);
    });

    it("validates female NIK from DKI Jakarta (+40 rule)", () => {
      // 317106 = MENTENG
      // 550190 = female born 15 Jan 1990 (15+40=55)
      // 0002 = sequence
      const result = validateNik("3171065501900002");
      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.birthDate.gender).toBe("female");
      expect(result.data!.birthDate.day).toBe(15);
      expect(result.data!.birthDate.month).toBe(1);
      expect(result.data!.birthDate.year).toBe(1990);
    });

    it("validates male NIK from Jawa Barat", () => {
      // 320101 = Kedungbadak, Kab. Bogor
      // 200394 = male, born 20 Mar 1994
      const result = validateNik("3201012003940001");
      expect(result.valid).toBe(true);
      expect(result.data!.region.provinceName).toBe("JAWA BARAT");
      expect(result.data!.region.regencyName).toBe("KAB. BOGOR");
      expect(result.data!.birthDate.gender).toBe("male");
      expect(result.data!.birthDate.day).toBe(20);
      expect(result.data!.birthDate.month).toBe(3);
      expect(result.data!.birthDate.year).toBe(1994);
    });

    it("validates female NIK from Jawa Timur", () => {
      // 357301 = Blimbing, Kota Malang
      // 611285 = female born 21 Dec 1985 (21+40=61)
      const result = validateNik("3573016112850001");
      expect(result.valid).toBe(true);
      expect(result.data!.region.provinceName).toBe("JAWA TIMUR");
      expect(result.data!.region.districtName).toBe("BLIMBING");
      expect(result.data!.birthDate.gender).toBe("female");
      expect(result.data!.birthDate.day).toBe(21);
      expect(result.data!.birthDate.month).toBe(12);
      expect(result.data!.birthDate.year).toBe(1985);
    });

    it("validates NIK with leading zeros in date", () => {
      // 330101 = Kedungreja, Kab. Cilacap
      // 050100 = male, born 05 Jan 2000
      const result = validateNik("3301010501000001");
      expect(result.valid).toBe(true);
      expect(result.data!.birthDate.day).toBe(5);
      expect(result.data!.birthDate.month).toBe(1);
      expect(result.data!.birthDate.year).toBe(2000);
      expect(result.data!.birthDate.gender).toBe("male");
    });
  });

  describe("invalid NIK — format", () => {
    it("rejects non-string input", () => {
      const result = validateNik(1234567890123456 as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("NIK harus berupa string");
    });

    it("rejects empty string", () => {
      const result = validateNik("");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("16 digit");
    });

    it("rejects NIK with too few digits", () => {
      const result = validateNik("317101150190000");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("16 digit");
    });

    it("rejects NIK with too many digits", () => {
      const result = validateNik("31710115019000011");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("16 digit");
    });

    it("rejects NIK with non-numeric characters", () => {
      const result = validateNik("317101150190000A");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("angka");
    });

    it("handles NIK with spaces (stripped)", () => {
      const result = validateNik("3171 0115 0190 0001");
      expect(result.valid).toBe(true);
    });

    it("handles NIK with dashes (stripped)", () => {
      const result = validateNik("3171-0115-0190-0001");
      expect(result.valid).toBe(true);
    });
  });

  describe("invalid NIK — region codes", () => {
    it("rejects unknown province code", () => {
      const result = validateNik("9971011501900001");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("provinsi");
    });

    it("rejects unknown regency code", () => {
      // 3199 is not a valid regency in DKI Jakarta
      const result = validateNik("3199011501900001");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("kabupaten/kota");
    });

    it("rejects unknown district code", () => {
      // 317199 is not a valid district in Kota Jakarta Pusat
      const result = validateNik("3171991501900001");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("kecamatan");
    });
  });

  describe("invalid NIK — dates", () => {
    it("rejects invalid day (32)", () => {
      // Day 32 is invalid even for female (32 < 40 so treated as male day 32)
      const result = validateNik("3171013201900001");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("Tanggal lahir");
    });

    it("rejects invalid month (13)", () => {
      const result = validateNik("3171011513900001");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("Tanggal lahir");
    });

    it("rejects invalid month (00)", () => {
      const result = validateNik("3171011500900001");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("Tanggal lahir");
    });

    it("rejects Feb 30 (non-leap year assumption)", () => {
      // 30 Feb 1990 is invalid (1990 is not a leap year)
      const result = validateNik("3171013002900001");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("Tanggal lahir");
    });
  });
});
