"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { formatCurrency } from "@/lib/currency";

type DiscountSettings = {
  discountIndia: number; discountUnitedKingdom: number; discountGermany: number;
  discountFrance: number; discountItaly: number; discountBelgium: number;
  discountSpain: number; discountSwitzerland: number; discountUnitedStates: number;
  discountEverywhere: number;
};

const defaultDiscounts: DiscountSettings = {
  discountIndia: 0, discountUnitedKingdom: 0, discountGermany: 0,
  discountFrance: 0, discountItaly: 0, discountBelgium: 0,
  discountSpain: 0, discountSwitzerland: 0, discountUnitedStates: 0,
  discountEverywhere: 0,
};

export default function ProductCardPrice({
  priceUSD,
  compareAtPriceUSD,
}: {
  priceUSD: number;
  compareAtPriceUSD: number | null;
}) {
  const { currency, rates } = useCurrency();
  const [country, setCountry] = useState("");
  const [discounts, setDiscounts] = useState(defaultDiscounts);

  useEffect(() => {
    let cancelled = false;
    async function loadDiscounts() {
      try {
        const [countryResponse, settingsResponse] = await Promise.all([
          fetch("/api/account/country", { cache: "no-store" }),
          fetch("/api/store-settings", { cache: "no-store" }),
        ]);
        if (cancelled) return;
        if (countryResponse.ok) {
          const data = await countryResponse.json();
          if (!cancelled) setCountry(String(data.country || "").trim().toUpperCase());
        }
        if (settingsResponse.ok) {
          const data = await settingsResponse.json();
          if (!cancelled) {
            setDiscounts({
              discountIndia: Number(data.discountIndia) || 0,
              discountUnitedKingdom: Number(data.discountUnitedKingdom) || 0,
              discountGermany: Number(data.discountGermany) || 0,
              discountFrance: Number(data.discountFrance) || 0,
              discountItaly: Number(data.discountItaly) || 0,
              discountBelgium: Number(data.discountBelgium) || 0,
              discountSpain: Number(data.discountSpain) || 0,
              discountSwitzerland: Number(data.discountSwitzerland) || 0,
              discountUnitedStates: Number(data.discountUnitedStates) || 0,
              discountEverywhere: Number(data.discountEverywhere) || 0,
            });
          }
        }
      } catch {
        // Keep the stored product price if discount settings are unavailable.
      }
    }
    void loadDiscounts();
    return () => { cancelled = true; };
  }, []);

  const discountByCountry: Record<string, number> = {
    INDIA: discounts.discountIndia, IN: discounts.discountIndia,
    "UNITED KINGDOM": discounts.discountUnitedKingdom, UK: discounts.discountUnitedKingdom,
    GERMANY: discounts.discountGermany, FRANCE: discounts.discountFrance,
    ITALY: discounts.discountItaly, BELGIUM: discounts.discountBelgium,
    SPAIN: discounts.discountSpain, SWITZERLAND: discounts.discountSwitzerland,
    "UNITED STATES": discounts.discountUnitedStates, US: discounts.discountUnitedStates,
    USA: discounts.discountUnitedStates,
  };
  const discountRate = discountByCountry[country] ?? discounts.discountEverywhere;
  const discountedPrice = priceUSD * (1 - discountRate / 100);

  return (
    <div className="mt-3">
      <p className="font-bold text-sky-700">{formatCurrency(discountedPrice, currency, rates)}</p>
      {compareAtPriceUSD !== null && (
        <p className="mt-0.5 text-sm font-normal text-slate-500 line-through">
          {formatCurrency(compareAtPriceUSD, currency, rates)}
        </p>
      )}
    </div>
  );
}
