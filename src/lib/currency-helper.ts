export type CurrencyCode =
  | "AED"
  | "ALL"
  | "AMD"
  | "ANG"
  | "AOA"
  | "ARS"
  | "AUD"
  | "AWG"
  | "AZN"
  | "BAM"
  | "BBD"
  | "BDT"
  | "BGN"
  | "BHD"
  | "BIF"
  | "BMD"
  | "BND"
  | "BOB"
  | "BRL"
  | "BSD"
  | "BWP"
  | "BYN"
  | "BZD"
  | "CAD"
  | "CHF"
  | "CLP"
  | "CNY"
  | "COP"
  | "CRC"
  | "CUP"
  | "CVE"
  | "CZK"
  | "DJF"
  | "DKK"
  | "DOP"
  | "DZD"
  | "EGP"
  | "ETB"
  | "EUR"
  | "FJD"
  | "FKP"
  | "GBP"
  | "GEL"
  | "GHS"
  | "GIP"
  | "GMD"
  | "GNF"
  | "GTQ"
  | "GYD"
  | "HKD"
  | "HNL"
  | "HRK"
  | "HTG"
  | "HUF"
  | "IDR"
  | "ILS"
  | "INR"
  | "IQD"
  | "JMD"
  | "JOD"
  | "JPY"
  | "KES"
  | "KGS"
  | "KHR"
  | "KMF"
  | "KRW"
  | "KWD"
  | "KYD"
  | "KZT"
  | "LAK"
  | "LBP"
  | "LKR"
  | "LRD"
  | "LSL"
  | "LYD"
  | "MAD"
  | "MDL"
  | "MGA"
  | "MKD"
  | "MMK"
  | "MNT"
  | "MOP"
  | "MRU"
  | "MUR"
  | "MVR"
  | "MWK"
  | "MXN"
  | "MYR"
  | "MZN"
  | "NAD"
  | "NGN"
  | "NIO"
  | "NOK"
  | "NPR"
  | "NZD"
  | "OMR"
  | "PAB"
  | "PEN"
  | "PGK"
  | "PHP"
  | "PKR"
  | "PLN"
  | "PYG"
  | "QAR"
  | "RON"
  | "RSD"
  | "RUB"
  | "RWF"
  | "SAR"
  | "SBD"
  | "SCR"
  | "SEK"
  | "SGD"
  | "SHP"
  | "SLE"
  | "SLL"
  | "SOS"
  | "SRD"
  | "SSP"
  | "STN"
  | "SVC"
  | "SZL"
  | "THB"
  | "TND"
  | "TOP"
  | "TRY"
  | "TTD"
  | "TWD"
  | "TZS"
  | "UAH"
  | "UGX"
  | "USD"
  | "UYU"
  | "UZS"
  | "VES"
  | "VND"
  | "VUV"
  | "WST"
  | "XAF"
  | "XCD"
  | "XOF"
  | "XPF"
  | "YER"
  | "ZAR"
  | "ZMW";

export const parseCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
};

const CURRENCY_PRECISION: Record<CurrencyCode, number> = {
  // Three-decimal currencies (Stripe-supported, ISO 4217).
  // 1 major unit = 1000 subunits (e.g. 1.500 KWD = 1500 fils).
  BHD: 3,
  IQD: 3,
  JOD: 3,
  KWD: 3,
  LYD: 3,
  OMR: 3,
  TND: 3,

  // Zero-decimal currencies (Stripe-supported).
  // The smallest unit IS the major unit (e.g. 1500 JPY = ¥1500, not ¥15.00).
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

  USD: 2,
  EUR: 2,
  GBP: 2,
  INR: 2,
} as Record<CurrencyCode, number>;

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
