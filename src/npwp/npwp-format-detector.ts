export type NpwpFormat = "old_15" | "new_nik" | "new_16" | "unknown";

export function detectNpwpFormat(cleaned: string): NpwpFormat {
  if (cleaned.length === 15) {
    return "old_15";
  }
  if (cleaned.length === 16) {
    if (cleaned.startsWith("0")) {
      return "new_16";
    }
    return "new_nik";
  }
  return "unknown";
}
