"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  CURRENCIES,
  type CurrencyCode,
} from "@/lib/currency";

type CurrencyContextType = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  rates: Record<string, number>;
  loading: boolean;
};

const CurrencyContext =
  createContext<CurrencyContextType | undefined>(
    undefined
  );

const STORAGE_KEY = "site_currency";

export function CurrencyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currency, setCurrencyState] =
    useState<CurrencyCode>("USD");

  const [rates, setRates] =
    useState<Record<string, number>>({
      USD: 1,
      GBP: 1,
      INR: 1,
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const saved =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (
      saved === "USD" ||
      saved === "GBP" ||
      saved === "INR"
    ) {
      window.setTimeout(() => setCurrencyState(saved), 0);
    } else if (saved === "EUR") {
      window.setTimeout(() => {
        setCurrencyState("INR");
        window.localStorage.setItem(STORAGE_KEY, "INR");
      }, 0);
    }

    async function loadRates() {
      try {
        const response = await fetch(
          "/api/currency/rates",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load currency rates."
          );
        }

        const data =
          await response.json();

        if (data.rates) {
          setRates({
            USD: 1,
            GBP:
              Number(data.rates.GBP) || 1,
            INR:
              Number(data.rates.INR) || 1,
          });
        }
      } catch (error) {
        console.error(
          "CURRENCY LOAD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadRates();
  }, []);

  function setCurrency(
    nextCurrency: CurrencyCode
  ) {
    setCurrencyState(nextCurrency);

    window.localStorage.setItem(
      STORAGE_KEY,
      nextCurrency
    );
  }

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      rates,
      loading,
    }),
    [currency, rates, loading]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context =
    useContext(CurrencyContext);

  if (!context) {
    throw new Error(
      "useCurrency must be used inside CurrencyProvider"
    );
  }

  return context;
}

export { CURRENCIES };
