export function isValidLuhn(digits: string): boolean {
  const arr = digits.split("").reverse().map(Number);
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    let d = arr[i]!;
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}
