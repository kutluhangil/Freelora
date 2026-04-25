export type CurrencyCode = string;

const SYMBOL_MAP: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CHF: "CHF",
  CAD: "C$",
  AUD: "A$",
};

export function currencySymbol(code: CurrencyCode): string {
  return SYMBOL_MAP[code] ?? code;
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "TRY",
  locale: string = "tr-TR",
  options: Intl.NumberFormatOptions = {}
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
      ...options,
    }).format(amount);
  } catch {
    return `${currencySymbol(currency)}${amount.toFixed(2)}`;
  }
}

export function formatNumber(
  value: number,
  locale: string = "tr-TR",
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatPercent(value: number, locale: string = "tr-TR"): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
}
