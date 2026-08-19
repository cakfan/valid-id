export interface NpwpValidationResult {
  valid: boolean;
  format: "old" | "new" | "unknown";
  reason?: string;
}

export function validateNpwp(npwp: string): NpwpValidationResult {
  if (typeof npwp !== "string") {
    return { valid: false, format: "unknown", reason: "NPWP must be a string" };
  }
  return { valid: false, format: "unknown", reason: "Not implemented yet" };
}
