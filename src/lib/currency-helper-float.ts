import Decimal from "decimal.js";
import {
  CurrencyCode,
  getCurrencySymbol,
  getCurrencyPrecision,
} from "./currency-helper";

// Convert dollars -> cents
export function encodeFloatCurrency({
  value,
  currency,
}: {
  value: number;
  currency?: CurrencyCode;
}) {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      throw new Error("Invalid dollar value");
    }

    // dollars * 100, fixed to 12 decimals max
    return new Decimal(value)
      .times(Math.pow(10, getCurrencyPrecision(currency ?? "USD")))
      .toDecimalPlaces(12, Decimal.ROUND_DOWN) // cut off beyond 12 decimals
      .toNumber();
  } catch (err) {
    console.error("Conversion error (dollarsToCents):", err);
    return 0;
  }
}

// Convert cents -> dollars
export function decodeFloatCurrency({
  value,
  currency,
}: {
  value: number;
  currency?: CurrencyCode;
}) {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      throw new Error("Invalid cents value");
    }

    // cents / 100, fixed to 12 decimals max
    return new Decimal(value)
      .div(Math.pow(10, getCurrencyPrecision(currency ?? "USD")))
      .toDecimalPlaces(12, Decimal.ROUND_DOWN) // cut off beyond 12 decimals
      .toNumber();
  } catch (err) {
    console.error("Conversion error (centsToDollars):", err);
    return 0;
  }
}

export const formatDecodedFloatCurrency = (
  value: number,
  currency?: CurrencyCode
): string => {
  const decodedValue = decodeFloatCurrency({ value, currency });
  return `${getCurrencySymbol(currency ?? "USD")} ${decodedValue}`;
};
