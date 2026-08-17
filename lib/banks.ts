// Client-safe: rendered in the redeem form's bank picker.
//
// A picklist rather than free text (ADR-0011): "GTB", "GT Bank" and "Guaranty
// Trust Bank" are one bank written three ways, and the Admin is the one who has
// to interpret them while making a transfer.
//
// Includes the fintechs people actually receive money on in Nigeria (Opay,
// PalmPay, Moniepoint, Kuda), not just the commercial banks. If a referrer's
// bank is missing they cannot complete a cash redemption, so add it here.
export const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Jaiz Bank",
  "Keystone Bank",
  "Kuda Bank",
  "Lotus Bank",
  "Moniepoint",
  "Opay",
  "Optimus Bank",
  "PalmPay",
  "Parallex Bank",
  "Polaris Bank",
  "PremiumTrust Bank",
  "Providus Bank",
  "Rubies Bank",
  "Sparkle Microfinance Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "SunTrust Bank",
  "Titan Trust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "VFD Microfinance Bank",
  "Wema Bank",
  "Zenith Bank",
] as const;

export type NigerianBank = (typeof NIGERIAN_BANKS)[number];
