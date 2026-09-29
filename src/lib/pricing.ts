import { prisma } from "@/lib/prisma";

export type PricingCountry =
  | "IN"
  | "GB"
  | "DE"
  | "FR"
  | "IT"
  | "BE"
  | "ES"
  | "CH"
  | "US"
  | "OTHER";

export type PricingResult = {
  basePrice: number;
  discountRate: number;
  discountAmount: number;
  sellingPrice: number;
};

function normalizeCountry(country?: string | null): PricingCountry {
  const value = (country || "").trim().toLowerCase();

  if (
    value === "india" ||
    value === "in" ||
    value === "ind"
  ) {
    return "IN";
  }

  if (
    value === "united kingdom" ||
    value === "uk" ||
    value === "gb" ||
    value === "great britain"
  ) {
    return "GB";
  }

  if (
    value === "germany" ||
    value === "de" ||
    value === "deutschland"
  ) {
    return "DE";
  }

  if (
    value === "france" ||
    value === "fr"
  ) {
    return "FR";
  }

  if (
    value === "italy" ||
    value === "it"
  ) {
    return "IT";
  }

  if (
    value === "belgium" ||
    value === "be"
  ) {
    return "BE";
  }

  if (
    value === "spain" ||
    value === "es"
  ) {
    return "ES";
  }

  if (
    value === "switzerland" ||
    value === "ch"
  ) {
    return "CH";
  }

  if (
    value === "united states" ||
    value === "united states of america" ||
    value === "usa" ||
    value === "us"
  ) {
    return "US";
  }

  return "OTHER";
}

const SETTING_KEYS: Record<PricingCountry, string> = {
  IN: "discount_india",
  GB: "discount_united_kingdom",
  DE: "discount_germany",
  FR: "discount_france",
  IT: "discount_italy",
  BE: "discount_belgium",
  ES: "discount_spain",
  CH: "discount_switzerland",
  US: "discount_united_states",
  OTHER: "discount_everywhere",
};

export async function getCountryDiscount(
  country?: string | null
): Promise<number> {
  const normalizedCountry = normalizeCountry(country);
  const settingKey = SETTING_KEYS[normalizedCountry];

  const setting = await prisma.storeSetting.findUnique({
    where: {
      key: settingKey,
    },
    select: {
      value: true,
    },
  });

  const discount = Number(setting?.value ?? 0);

  if (!Number.isFinite(discount)) {
    return 0;
  }

  return Math.min(100, Math.max(0, discount));
}

export async function calculateSellingPrice(
  basePrice: number,
  country?: string | null
): Promise<PricingResult> {
  const safeBasePrice = Math.max(
    0,
    Number(basePrice) || 0
  );

  const discountRate =
    await getCountryDiscount(country);

  const discountAmount =
    safeBasePrice * (discountRate / 100);

  const sellingPrice =
    safeBasePrice - discountAmount;

  return {
    basePrice: safeBasePrice,
    discountRate,
    discountAmount,
    sellingPrice,
  };
}