import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customer-auth";
import {
  getPayPalAccessToken,
  getPayPalApiBase,
} from "@/lib/payments/paypal/paypal";

type CurrencyCode = "USD" | "GBP" | "EUR";

async function getExchangeRate(
  currency: CurrencyCode
): Promise<number> {
  if (currency === "USD") {
    return 1;
  }

  const response = await fetch(
    "https://api.frankfurter.dev/v2/rates?base=USD&quotes=GBP,EUR",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load exchange rates.");
  }

  const data = await response.json();

  const rateItem = data.find(
    (item: { quote?: string }) =>
      item.quote === currency
  );

  const rate = Number(rateItem?.rate);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(
      `Unable to load ${currency} exchange rate.`
    );
  }

  return rate;
}

export async function POST(request: Request) {
  try {
    const customerId = await getCustomerId();

    if (!customerId) {
      return Response.json(
        {
          error:
            "Please log in before checkout.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const currency = String(
      body.currency || "USD"
    ).toUpperCase() as CurrencyCode;

    if (
      currency !== "USD" &&
      currency !== "GBP" &&
      currency !== "EUR"
    ) {
      return Response.json(
        {
          error: "Unsupported currency.",
        },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        customerId,
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return Response.json(
        {
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    const customer =
      await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });

    if (!customer) {
      return Response.json(
        {
          error:
            "Customer account could not be found.",
        },
        { status: 401 }
      );
    }

    let subtotal = 0;

    for (const cartItem of cart.items) {
      const variant = cartItem.variant;

      if (!variant) {
        throw new Error(
          "One or more cart items are invalid."
        );
      }

      if (
        variant.productId !==
        cartItem.productId
      ) {
        throw new Error(
          "One or more cart items are invalid."
        );
      }

      const quantity = Number(
        cartItem.quantity
      );

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        throw new Error(
          "Invalid cart quantity."
        );
      }

      if (variant.stock < quantity) {
        throw new Error(
          `${cartItem.product.name} does not have enough stock.`
        );
      }

      const unitPrice = Number(
        variant.price
      );

      if (
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
      ) {
        throw new Error(
          "Invalid product price."
        );
      }

      subtotal +=
        unitPrice * quantity;
    }

    if (
      !Number.isFinite(subtotal) ||
      subtotal <= 0
    ) {
      throw new Error(
        "Invalid order total."
      );
    }

    const settings =
      await prisma.storeSetting.findMany({
        where: {
          key: {
            in: [
              "india_tax_rate",
              "international_tax_rate",
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

    const indiaTaxRate = Number(
      settingMap.get(
        "india_tax_rate"
      ) ?? "17"
    );

    const internationalTaxRate =
      Number(
        settingMap.get(
          "international_tax_rate"
        ) ?? "0"
      );

    const country = String(
      customer.country || ""
    )
      .trim()
      .toUpperCase();

    if (!country) {
      throw new Error(
        "Customer country is not configured."
      );
    }

    const isIndia =
      country === "INDIA" ||
      country === "IN";

    const taxRate = isIndia
      ? indiaTaxRate
      : internationalTaxRate;

    const discountIndia = Number(
      settingMap.get(
        "discount_india"
      ) ?? "0"
    );

    const discountUnitedKingdom =
      Number(
        settingMap.get(
          "discount_united_kingdom"
        ) ?? "0"
      );

    const discountGermany =
      Number(
        settingMap.get(
          "discount_germany"
        ) ?? "0"
      );

    const discountFrance =
      Number(
        settingMap.get(
          "discount_france"
        ) ?? "0"
      );

    const discountItaly =
      Number(
        settingMap.get(
          "discount_italy"
        ) ?? "0"
      );

    const discountBelgium =
      Number(
        settingMap.get(
          "discount_belgium"
        ) ?? "0"
      );

    const discountSpain =
      Number(
        settingMap.get(
          "discount_spain"
        ) ?? "0"
      );

    const discountSwitzerland =
      Number(
        settingMap.get(
          "discount_switzerland"
        ) ?? "0"
      );

    const discountUnitedStates =
      Number(
        settingMap.get(
          "discount_united_states"
        ) ?? "0"
      );

    const discountEverywhere =
      Number(
        settingMap.get(
          "discount_everywhere"
        ) ?? "0"
      );

    const discountMap: Record<
      string,
      number
    > = {
      "UNITED KINGDOM":
        discountUnitedKingdom,
      UK: discountUnitedKingdom,
      GERMANY: discountGermany,
      FRANCE: discountFrance,
      ITALY: discountItaly,
      BELGIUM: discountBelgium,
      SPAIN: discountSpain,
      SWITZERLAND:
        discountSwitzerland,
      "UNITED STATES":
        discountUnitedStates,
      US: discountUnitedStates,
      USA: discountUnitedStates,
    };

    const discountRate = isIndia
      ? discountIndia
      : (
          discountMap[country] ??
          discountEverywhere
        );

    if (
      !Number.isFinite(discountRate) ||
      discountRate < 0 ||
      discountRate > 100
    ) {
      throw new Error(
        "Invalid country discount configuration."
      );
    }

    const discount =
      subtotal *
      (discountRate / 100);

    const discountedSubtotal =
      subtotal - discount;

    const shippingCost = 0;

    const tax =
      (discountedSubtotal +
        shippingCost) *
      (taxRate / 100);

    const total =
      discountedSubtotal +
      shippingCost +
      tax;

    if (
      !Number.isFinite(total) ||
      total <= 0
    ) {
      throw new Error(
        "Invalid order total."
      );
    }

    const exchangeRate =
      await getExchangeRate(
        currency
      );

    const paypalAmount =
      Math.round(
        total *
          exchangeRate *
          100
      ) / 100;

    const accessToken =
      await getPayPalAccessToken();

    const response = await fetch(
      `${getPayPalApiBase()}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
          "Content-Type":
            "application/json",
          Prefer:
            "return=representation",
        },
        body: JSON.stringify({
          intent: "CAPTURE",

          application_context: {
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",
          },

          purchase_units: [
            {
              custom_id:
                `MA|${currency}|${total.toFixed(
                  2
                )}|${exchangeRate}`,

              amount: {
                currency_code: currency,
                value: paypalAmount.toFixed(2),
              },
            },
          ],
        }),
        cache: "no-store",
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "PAYPAL CREATE ORDER ERROR:",
        data
      );

      return Response.json(
        {
          error:
            "Unable to create PayPal order.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      orderID: data.id,
      amount:
        paypalAmount.toFixed(2),
      currency,
    });
  } catch (error) {
    console.error(
      "PAYPAL CREATE ORDER EXCEPTION:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start PayPal payment.",
      },
      { status: 500 }
    );
  }
}

