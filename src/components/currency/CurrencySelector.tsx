"use client";

import { useCurrency } from "./CurrencyProvider";

export default function CurrencySelector() {
  const {
    currency,
    setCurrency,
    loading,
  } = useCurrency();

  return (
    <label className="group relative inline-flex items-center">
      <span className="sr-only">
        Select currency
      </span>

      <span
        className="pointer-events-none mr-2 text-[10px] uppercase tracking-[0.15em] text-[#777064]"
        aria-hidden="true"
      >
        Currency
      </span>

      <select
        value={currency}
        onChange={(event) =>
          setCurrency(
            event.target.value as
              | "USD"
              | "GBP"
              | "INR"
          )
        }
        disabled={loading}
        aria-label="Select currency"
        className="cursor-pointer appearance-none border border-[#4a4031] bg-[#ffffff] px-3 py-2 pr-8 text-xs font-semibold uppercase tracking-[0.12em] text-[#17212b] outline-none transition hover:border-[#0284c7] focus:border-[#0284c7] disabled:cursor-wait disabled:opacity-60"
      >
        <option value="USD">USD &mdash; $</option>
        <option value="GBP">GBP &mdash; &#163;</option>
        <option value="INR">INR &mdash; &#8377;</option>
      </select>

      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-[#0877b9]"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m5 7 5 5 5-5"
        />
      </svg>
    </label>
  );
}

