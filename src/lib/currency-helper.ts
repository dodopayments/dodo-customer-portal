export type CurrencyCode =
  | "AED"
  | "ALL"
  | "AMD"
  | "ANG"
  | "ARS"
  | "AUD"
  | "AWG"
  | "AZN"
  | "BAM"
  | "BDT"
  | "BIF"
  | "BMD"
  | "BND"
  | "BOB"
  | "BRL"
  | "BSD"
  | "BWP"
  | "BZD"
  | "CAD"
  | "CHF"
  | "CLP"
  | "CNY"
  | "CRC"
  | "CZK"
  | "DJF"
  | "DKK"
  | "DOP"
  | "EGP"
  | "ETB"
  | "EUR"
  | "FJD"
  | "GBP"
  | "GEL"
  | "GMD"
  | "GNF"
  | "GTQ"
  | "GYD"
  | "HKD"
  | "HNL"
  | "HUF"
  | "IDR"
  | "ILS"
  | "INR"
  | "JPY"
  | "KMF"
  | "KRW"
  | "KZT"
  | "LKR"
  | "LRD"
  | "LSL"
  | "MAD"
  | "MGA"
  | "MKD"
  | "MOP"
  | "MUR"
  | "MVR"
  | "MWK"
  | "MXN"
  | "MYR"
  | "NGN"
  | "NOK"
  | "NPR"
  | "NZD"
  | "PEN"
  | "PGK"
  | "PHP"
  | "PLN"
  | "PYG"
  | "QAR"
  | "RON"
  | "RSD"
  | "RWF"
  | "SAR"
  | "SBD"
  | "SCR"
  | "SEK"
  | "SGD"
  | "SRD"
  | "SZL"
  | "THB"
  | "TOP"
  | "TRY"
  | "TWD"
  | "TZS"
  | "UGX"
  | "USD"
  | "UYU"
  | "VND"
  | "VUV"
  | "WST"
  | "XAF"
  | "XOF"
  | "XPF"
  | "ZAR"
  | "ZMW";

export const parseCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
};

// Zero-decimal currencies — the only supported non-2-decimal currencies
// (no 3-decimal currencies are supported). The smallest unit IS the major
// unit (e.g. 1500 JPY = ¥1500, not ¥15.00). Everything else defaults to 2.
const CURRENCY_PRECISION: Partial<Record<CurrencyCode, number>> = {
  BIF: 0,
  CLP: 0,
  DJF: 0,
  GNF: 0,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  MGA: 0,
  PYG: 0,
  RWF: 0,
  UGX: 0,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
};

export const getCurrencyPrecision = (
  currency: CurrencyCode | undefined | null,
): number => {
  const effectiveCurrency = currency ?? "USD";
  return CURRENCY_PRECISION[effectiveCurrency] ?? 2;
};

export const encodeCurrency = (
  value: number,
  currency: CurrencyCode | undefined | null,
): number => {
  const precision = getCurrencyPrecision(currency);
  const valueStr = value.toString();
  const decimalIndex = valueStr.indexOf(".");
  if (decimalIndex === -1) {
    return Number(valueStr + "0".repeat(precision));
  }
  const integerPart = valueStr.slice(0, decimalIndex);
  const fractionalPart = valueStr.slice(decimalIndex + 1);
  const combined = integerPart + fractionalPart.padEnd(precision, "0");
  return Number(combined.slice(0, decimalIndex + precision) || combined);
};

export const decodeCurrency = (
  value: number,
  currency: CurrencyCode | undefined | null,
): number => {
  const precision = getCurrencyPrecision(currency);
  const divisor = Math.pow(10, precision);
  return Number((value / divisor).toFixed(precision));
};

export const formatCurrency = (
  value: number,
  currency: CurrencyCode | undefined | null,
  compact: boolean = false,
): string => {
  const precision = getCurrencyPrecision(currency);
  const effectiveCurrency = currency ?? "USD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: effectiveCurrency,
    ...(compact
      ? {
          notation: "compact",
          compactDisplay: "short",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }
      : { minimumFractionDigits: precision, maximumFractionDigits: precision }),
  }).format(value);
};

export const getCurrencySymbol = (
  currency: CurrencyCode | undefined | null,
): string => {
  const effectiveCurrency = currency ?? "USD";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: effectiveCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(0).replace(/\d/g, "").trim();
};

export const decodeFloatCurrency = ({
  value,
  currency,
}: {
  value: number;
  currency: CurrencyCode | undefined | null;
}): string => {
  const precision = getCurrencyPrecision(currency);
  const divisor = Math.pow(10, precision);
  const decodedValue = value / divisor;
  return decodedValue.toFixed(precision);
};
