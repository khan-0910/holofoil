export type Currency = "INR" | "USD" | "EUR" | "GBP";

/**
 * Fixed rates per 1 US dollar. Update them here when they drift.
 * Prices round to the nearest whole unit (rupees to the nearest ₹10).
 */
export const RATES: Record<Currency, number> = { USD: 1, INR: 84, EUR: 0.92, GBP: 0.78 };

export const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: "INR", symbol: "₹", label: "Rupee" },
  { code: "USD", symbol: "$", label: "Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "Pound" },
];

const LOCALE: Record<Currency, string> = { INR: "en-IN", USD: "en-US", EUR: "de-DE", GBP: "en-GB" };

export function convert(usd: number, cur: Currency) {
  const v = usd * RATES[cur];
  return cur === "INR" ? Math.round(v / 10) * 10 : Math.round(v);
}

export function format(usd: number, cur: Currency) {
  return new Intl.NumberFormat(LOCALE[cur], { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(convert(usd, cur));
}

/** Free shipping threshold and flat rate, in dollars. */
export const FREE_SHIP_USD = 100;
export const SHIP_USD = 6;
