export async function getUsdToInrRate(): Promise<number> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      "https://api.frankfurter.dev/v2/rates?base=USD&quotes=INR",
      { cache: "no-store", signal: controller.signal }
    );

    if (!response.ok) {
      throw new Error("Unable to load the USD to INR exchange rate.");
    }

    const data = await response.json();
    const rate = Number(data?.[0]?.rate);
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("The USD to INR exchange rate is unavailable.");
    }

    return rate;
  } finally {
    clearTimeout(timeout);
  }
}
