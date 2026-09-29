import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const authenticated = await requireAdmin();

  if (!authenticated) {
    return Response.json(
      {
        error: "Unauthorized.",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const indiaTaxRate = Number(
      body.indiaTaxRate
    );

    const internationalTaxRate = Number(
      body.internationalTaxRate
    );

    const freeShipping = Boolean(body.freeShipping); const discounts = { discount_india:Number(body.discountIndia), discount_united_kingdom:Number(body.discountUnitedKingdom), discount_germany:Number(body.discountGermany), discount_france:Number(body.discountFrance), discount_italy:Number(body.discountItaly), discount_belgium:Number(body.discountBelgium), discount_spain:Number(body.discountSpain), discount_switzerland:Number(body.discountSwitzerland), discount_united_states:Number(body.discountUnitedStates), discount_everywhere:Number(body.discountEverywhere) };

    if (
      !Number.isFinite(indiaTaxRate) ||
      indiaTaxRate < 0 ||
      indiaTaxRate > 100
    ) {
      return Response.json(
        {
          error:
            "India tax rate must be between 0 and 100.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(
        internationalTaxRate
      ) ||
      internationalTaxRate < 0 ||
      internationalTaxRate > 100
    ) {
      return Response.json(
        {
          error:
            "International tax rate must be between 0 and 100.",
        },
        { status: 400 }
      );
    }
await prisma.storeSetting.upsert({
      where: {
        key: "india_tax_rate",
      },
      update: {
        value: indiaTaxRate.toString(),
      },
      create: {
        key: "india_tax_rate",
        value: indiaTaxRate.toString(),
      },
    });

    for (const [key,value] of Object.entries(discounts)) { if (!Number.isFinite(value) || value < 0 || value > 100) { return Response.json({error:"Country discount rates must be between 0 and 100."},{status:400}); } await prisma.storeSetting.upsert({where:{key},update:{value:String(value)},create:{key,value:String(value)}}); }
    for (const [key, value] of Object.entries(discounts)) {
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        return Response.json(
          { error: "Country discount rates must be between 0 and 100." },
          { status: 400 }
        );
      }

      await prisma.storeSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    await prisma.storeSetting.upsert({
      where: {
        key: "international_tax_rate",
      },
      update: {
        value:
          internationalTaxRate.toString(),
      },
      create: {
        key: "international_tax_rate",
        value:
          internationalTaxRate.toString(),
      },
    });

    for (const [key,value] of Object.entries(discounts)) { if (!Number.isFinite(value) || value < 0 || value > 100) { return Response.json({error:"Country discount rates must be between 0 and 100."},{status:400}); } await prisma.storeSetting.upsert({where:{key},update:{value:String(value)},create:{key,value:String(value)}}); }
    await prisma.storeSetting.upsert({
      where: {
        key: "free_shipping",
      },
      update: {
        value: freeShipping
          ? "true"
          : "false",
      },
      create: {
        key: "free_shipping",
        value: freeShipping
          ? "true"
          : "false",
      },
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "ADMIN SETTINGS ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to save settings.",
      },
      { status: 500 }
    );
  }
}