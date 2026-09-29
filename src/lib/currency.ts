export type CurrencyCode = "USD" | "GBP" | "INR";

export const CURRENCIES: Record<
  CurrencyCode,
  {
    code: CurrencyCode;
    name: string;
    symbol: string;
    locale: string;
  }
> = {
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    locale: "en-US",
  },

  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    locale: "en-GB",
  },

  INR: {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    locale: "en-IN",
  },
};

export function formatCurrency(
  amountUSD: number,
  currency: CurrencyCode,
  rates: Record<string, number>
) {
  const rate =
    currency === "USD"
      ? 1
      : Number(rates[currency] ?? 1);

  const convertedAmount =
    amountUSD * rate;

  return new Intl.NumberFormat(
    CURRENCIES[currency].locale,
    {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(convertedAmount);
}
