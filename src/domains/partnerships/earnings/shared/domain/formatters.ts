type CurrencyCode = string;

const DEFAULT_LOCALE = "en-US";
const DEFAULT_CURRENCY: CurrencyCode = "USD";

export function formatCurrency(
  amount: number,
  { locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY, minimumFractionDigits = 2 }: { locale?: string; currency?: CurrencyCode; minimumFractionDigits?: number } = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits: Math.max(minimumFractionDigits, 2),
  }).format(amount);
}

export function formatCompactCurrency(
  amount: number,
  { locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY }: { locale?: string; currency?: CurrencyCode } = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDeltaPercent(delta: number, { locale = DEFAULT_LOCALE, fractionDigits = 1 }: { locale?: string; fractionDigits?: number } = {}): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `${delta >= 0 ? "+" : ""}${formatter.format(delta)}`;
}

export function formatDateLabel(dateInput: string | Date, { locale = DEFAULT_LOCALE, options }: { locale?: string; options?: Intl.DateTimeFormatOptions } = {}): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat(locale, options ?? { month: "short", day: "numeric", year: "numeric" }).format(date);
}
