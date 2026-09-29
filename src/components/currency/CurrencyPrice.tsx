"use client";

import { useCurrency } from "./CurrencyProvider";
import { formatCurrency } from "@/lib/currency";

export default function CurrencyPrice({
  amountUSD,
}: {
  amountUSD: number;
}) {
  const { currency, rates } = useCurrency();

  return (
    <>
      {formatCurrency(
        amountUSD,
        currency,
        rates
      )}
    </>
  );
}
