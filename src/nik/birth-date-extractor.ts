export interface BirthDateInfo {
  day: number;
  month: number;
  year: number;
  gender: "male" | "female";
  date: Date;
}

const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isValidDate(day: number, month: number, year: number): boolean {
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > MONTH_DAYS[month - 1]!) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function extractBirthDateFromNik(
  digits7to12: string
): BirthDateInfo | null {
  let day = parseInt(digits7to12.slice(0, 2), 10);
  const month = parseInt(digits7to12.slice(2, 4), 10);
  const yearShort = parseInt(digits7to12.slice(4, 6), 10);

  // Females have +40 added to the day (digits 7-8)
  let gender: "male" | "female";
  if (day > 40) {
    gender = "female";
    day -= 40;
  } else {
    gender = "male";
  }

  // Determine full year from 2-digit year
  const currentYear = new Date().getFullYear();
  const currentShortYear = currentYear % 100;
  const century = yearShort > currentShortYear ? 1900 : 2000;
  const fullYear = century + yearShort;

  if (!isValidDate(day, month, fullYear)) {
    return null;
  }

  return {
    day,
    month,
    year: fullYear,
    gender,
    date: new Date(fullYear, month - 1, day),
  };
}
