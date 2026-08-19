import { describe, expect, it } from "bun:test";
import { validateNib } from "./validate-nib";

describe("validateNib", () => {
  describe("valid NIB", () => {
    it("validates 13-digit NIB", () => {
      const result = validateNib("1234567890123");
      expect(result.valid).toBe(true);
    });

    it("validates NIB with leading zeros", () => {
      const result = validateNib("0001234567890");
      expect(result.valid).toBe(true);
    });

    it("validates NIB with all zeros", () => {
      const result = validateNib("0000000000000");
      expect(result.valid).toBe(true);
    });
  });

  describe("invalid NIB — format", () => {
    it("rejects non-string input", () => {
      const result = validateNib(1234567890123 as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("string");
    });

    it("rejects empty string", () => {
      const result = validateNib("");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("13 digit");
    });

    it("rejects NIB with too few digits", () => {
      const result = validateNib("123456789012");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("13 digit");
    });

    it("rejects NIB with too many digits", () => {
      const result = validateNib("12345678901234");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("13 digit");
    });

    it("rejects NIB with non-numeric characters", () => {
      const result = validateNib("123456789012A");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("angka");
    });

    it("handles NIB with spaces (stripped)", () => {
      const result = validateNib("1234 567 890 123");
      expect(result.valid).toBe(true);
    });

    it("handles NIB with dashes (stripped)", () => {
      const result = validateNib("123-456-789-0123");
      expect(result.valid).toBe(true);
    });
  });
});
