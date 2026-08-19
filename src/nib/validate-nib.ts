export interface NibValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateNib(nib: string): NibValidationResult {
  if (typeof nib !== "string") {
    return { valid: false, reason: "NIB must be a string" };
  }
  return { valid: false, reason: "Not implemented yet" };
}
