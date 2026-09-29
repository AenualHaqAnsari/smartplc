export async function GET() {
  try {
    const response = await fetch(
      "https://api.frankfurter.dev/v2/rates?base=USD&quotes=GBP,INR",
      {
        next: {
          revalidate: 21600,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Unable to fetch exchange rates."
      );
    }

    const data = await response.json();

    const rates: Record<string, number> = {
      USD: 1,
      GBP: 1,
      INR: 1,
    };

    for (const item of data) {
      if (
        item.quote === "GBP" ||
        item.quote === "INR"
      ) {
        rates[item.quote] = Number(
          item.rate
        );
      }
    }

    return Response.json({
      base: "USD",
      rates,
      date:
        data?.[0]?.date ?? null,
    });
  } catch (error) {
    console.error(
      "CURRENCY RATE ERROR:",
      error
    );

    return Response.json(
      {
        base: "USD",
        rates: {
          USD: 1,
          GBP: 1,
          INR: 1,
        },
        date: null,
        error:
          "Unable to load current exchange rates.",
      },
      { status: 200 }
    );
  }
}
