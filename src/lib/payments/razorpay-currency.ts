export async function getUsdToInrRate(): Promise<number> {
  const response = await fetch(
    "https://api.frankfurter.dev/v2/rates?base=USD&quotes=INR",
    { cache: "no-store" }
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
}
