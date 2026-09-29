import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings =
      await prisma.storeSetting.findMany({
        where: {
          key: {
            in: [
              "india_tax_rate",
              "international_tax_rate",
              "free_shipping",
              "discount_india",
              "discount_united_kingdom",
              "discount_germany",
              "discount_france",
              "discount_italy",
              "discount_belgium",
              "discount_spain",
              "discount_switzerland",
              "discount_united_states",
              "discount_everywhere",
            ],
          },
        },
      });

    const settingMap = new Map(
      settings.map((setting) => [
        setting.key,
        setting.value,
      ])
    );

    return Response.json({
      indiaTaxRate: Number(
        settingMap.get("india_tax_rate") ?? "17"
      ),

      internationalTaxRate: Number(
        settingMap.get(
          "international_tax_rate"
        ) ?? "0"
      ),

      discountIndia: Number(
        settingMap.get("discount_india") ?? "0"
      ),

      freeShipping:
        settingMap.get("free_shipping") !==
        "false",

      discountUnitedKingdom: Number(
        settingMap.get(
          "discount_united_kingdom"
        ) ?? "0"
      ),

      discountGermany: Number(
        settingMap.get(
          "discount_germany"
        ) ?? "0"
      ),

      discountFrance: Number(
        settingMap.get(
          "discount_france"
        ) ?? "0"
      ),

      discountItaly: Number(
        settingMap.get(
          "discount_italy"
        ) ?? "0"
      ),

      discountBelgium: Number(
        settingMap.get(
          "discount_belgium"
        ) ?? "0"
      ),

      discountSpain: Number(
        settingMap.get(
          "discount_spain"
        ) ?? "0"
      ),

      discountSwitzerland: Number(
        settingMap.get(
          "discount_switzerland"
        ) ?? "0"
      ),

      discountUnitedStates: Number(
        settingMap.get(
          "discount_united_states"
        ) ?? "0"
      ),

      discountEverywhere: Number(
        settingMap.get(
          "discount_everywhere"
        ) ?? "0"
      ),
    });
  } catch (error) {
    console.error(
      "STORE SETTINGS ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to load store settings.",
      },
      { status: 500 }
    );
  }
}
