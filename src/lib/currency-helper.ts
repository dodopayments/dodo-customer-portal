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
  BHD: 3, // Bahraini Dinar (1 dinar = 1000 fils)
  IQD: 3, // Iraqi Dinar
  JOD: 3, // Jordanian Dinar
  KWD: 3, // Kuwaiti Dinar
  LYD: 3, // Libyan Dinar
  OMR: 3, // Omani Rial
  TND: 3, // Tunisian Dinar
  JPY: 0, // Japanese Yen
  KRW: 0, // South Korean Won
  VND: 0, // Vietnamese Dong
  USD: 2,
  EUR: 2,
  GBP: 2,
  INR: 2,
} as Record<CurrencyCode, number>;

export const getCurrencyPrecision = (
  currency: CurrencyCode | undefined | null
): number => {
  const effectiveCurrency = currency ?? "USD";
  return CURRENCY_PRECISION[effectiveCurrency] ?? 2;
};

export const encodeCurrency = (
  value: number,
  currency: CurrencyCode | undefined | null
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
  currency: CurrencyCode | undefined | null
): number => {
  const precision = getCurrencyPrecision(currency);
  const divisor = Math.pow(10, precision);
  return Number((value / divisor).toFixed(precision));
};

export const getCurrencySymbol = (
  currency: CurrencyCode | undefined | null
): string => {
  return (
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency ?? "USD",
    })
      .formatToParts(1)
      .find((part) => part.type === "currency")?.value ?? "$"
  );
};


export const formatCurrency = (
  value: number,
  currency: CurrencyCode | undefined | null,
  compact: boolean = false
): string => {
  const precision = getCurrencyPrecision(currency);
  const effectiveCurrency = currency ?? "USD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: effectiveCurrency,
    ...(compact ? { notation: "compact", compactDisplay: "short", minimumFractionDigits: 0, maximumFractionDigits: 0 } : { minimumFractionDigits: precision, maximumFractionDigits: precision,}),
   
   
  }).format(value);
};
