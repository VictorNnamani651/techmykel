// Nigeria-only (V1). Normalizes any common NG mobile format to E.164 "+234XXXXXXXXXX".
// Accepts: +2348012345678, 2348012345678, 08012345678, 8012345678.
// Returns null if it isn't a valid NG mobile number.
export function normalizeNgPhone(input: string): string | null {
  const digits = (input ?? "").replace(/\D/g, "");

  let national: string;
  if (digits.startsWith("234")) national = digits.slice(3);
  else if (digits.startsWith("0")) national = digits.slice(1);
  else national = digits;

  // NG national significant mobile number: 10 digits starting with 7, 8, or 9.
  if (national.length !== 10 || !/^[789]/.test(national)) return null;

  return `+234${national}`;
}

export function isValidNgPhone(input: string): boolean {
  return normalizeNgPhone(input) !== null;
}

// For display: "+2348012345678" -> "0801 234 5678".
export function formatNgPhone(e164: string): string {
  const national = e164.startsWith("+234") ? e164.slice(4) : e164;
  if (national.length !== 10) return e164;
  return `0${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
}
