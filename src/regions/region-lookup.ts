import regionData from "./region-code-data.json";

export function getProvinceName(code: string): string | undefined {
  return regionData.provinces[code as keyof typeof regionData.provinces];
}

export function getRegencyName(code: string): string | undefined {
  return regionData.regencies[code as keyof typeof regionData.regencies];
}

export function getDistrictName(code: string): string | undefined {
  return regionData.districts[code as keyof typeof regionData.districts];
}

export function isValidProvinceCode(code: string): boolean {
  return code in regionData.provinces;
}

export function isValidRegencyCode(code: string): boolean {
  return code in regionData.regencies;
}

export function isValidDistrictCode(code: string): boolean {
  return code in regionData.districts;
}
