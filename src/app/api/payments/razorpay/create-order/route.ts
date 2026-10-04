import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customer-auth";
import { getUsdToInrRate } from "@/lib/payments/razorpay-currency";

export async function POST(request: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return Response.json(
        { error: "Razorpay is not configured. Please contact the store." },
        { status: 503 }
      );
    }
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

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

    const customer =
      await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
        select: {
          country: true,
        },
      });

    if (!customer) {
      return Response.json(
        {
          error:
            "Customer account not found.",
        },
        { status: 404 }
      );
    }

    const country =
      String(customer.country || "")
        .trim()
        .toUpperCase();

    if (!country) {
      return Response.json(
        {
          error:
            "Customer country is not configured.",
        },
        { status: 400 }
      );
    }

    /*
     * Load the authenticated customer's
     * database cart.
     *
     * The browser cart is NOT trusted
     * for prices, products, variants,
     * or quantities.
     */
    const cart =
      await prisma.cart.findUnique({
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

    if (
      !cart ||
      cart.items.length === 0
    ) {
      return Response.json(
        {
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    let subtotal = 0;

    for (const item of cart.items) {
      const variant = item.variant;

      if (!variant) {
        return Response.json(
          {
            error:
              "One or more cart items are invalid.",
          },
          { status: 400 }
        );
      }

      if (
        variant.productId !==
        item.productId
      ) {
        return Response.json(
          {
            error:
              "One or more cart items are invalid.",
          },
          { status: 400 }
        );
      }

      const quantity =
        Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return Response.json(
          {
            error:
              "Invalid cart quantity.",
          },
          { status: 400 }
        );
      }

      if (
        variant.stock < quantity
      ) {
        return Response.json(
          {
            error: `${item.product.name} does not have enough stock.`,
          },
          { status: 400 }
        );
      }

      subtotal +=
        Number(variant.price) *
        quantity;
    }

    if (
      !Number.isFinite(subtotal) ||
      subtotal <= 0
    ) {
      return Response.json(
        {
          error:
            "Invalid order total.",
        },
        { status: 400 }
      );
    }

    /*
     * Worldwide shipping is currently free.
     */
    const shippingCost = 0;

    /*
     * Load configurable tax and country discount rates.
     */
    const settings =
      await prisma.storeSetting.findMany({
        where: {
          key: {
            in: [
              "india_tax_rate",
              "international_tax_rate",
                            "discount_india","discount_united_kingdom",
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

    const indiaTaxRate =
      Number(
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

    if (
      !Number.isFinite(
        indiaTaxRate
      ) ||
      indiaTaxRate < 0 ||
      indiaTaxRate > 100
    ) {
      return Response.json(
        {
          error:
            "Invalid India tax configuration.",
        },
        { status: 500 }
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
            "Invalid international tax configuration.",
        },
        { status: 500 }
      );
    }

    const normalizedCountry =
      String(country ?? "")
        .trim()
        .toUpperCase();

    const isIndia =
      normalizedCountry === "IN" ||
      normalizedCountry === "INDIA";

    const taxRate =
      isIndia
        ? indiaTaxRate
        : internationalTaxRate;

    /*
     * Country discount.
     *
     * All countries currently use the
     * "everywhere" setting unless they have
     * their own configured country setting.
     */
    const discountIndia =
      Number(
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

    const discountMap: Record<string, number> = {
      "INDIA":
        discountIndia,

      "IN":
        discountIndia,

      "UNITED KINGDOM":
        discountUnitedKingdom,

      "UK":
        discountUnitedKingdom,

      "GERMANY":
        discountGermany,

      "FRANCE":
        discountFrance,

      "ITALY":
        discountItaly,

      "BELGIUM":
        discountBelgium,

      "SPAIN":
        discountSpain,

      "SWITZERLAND":
        discountSwitzerland,

      "UNITED STATES":
        discountUnitedStates,

      "US":
        discountUnitedStates,

      "USA":
        discountUnitedStates,
    };

    const discountRate =
      Number.isFinite(
        discountMap[normalizedCountry]
      )
        ? discountMap[normalizedCountry]
        : discountEverywhere;

    if (
      !Number.isFinite(discountRate) ||
      discountRate < 0 ||
      discountRate > 100
    ) {
      return Response.json(
        {
          error:
            "Invalid country discount configuration.",
        },
        { status: 500 }
      );
    }

    const discount =
      subtotal *
      (discountRate / 100);

    const discountedSubtotal =
      subtotal - discount;

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
      return Response.json(
        {
          error:
            "Invalid calculated order total.",
        },
        { status: 400 }
      );
    }

    /*
     * Create Razorpay order using
     * the server-calculated final total.
     */
    const exchangeRate = await getUsdToInrRate();
    const amountInPaise = Math.round(total * exchangeRate * 100);
    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      return Response.json(
        { error: "Invalid INR payment amount." },
        { status: 400 }
      );
    }

    const order =
      await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `ma_${Date.now()}`,
        notes: { usdToInrRate: String(exchangeRate) },
      });

    return Response.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,

      subtotal,
      discountRate,
      discount,
      discountedSubtotal,
      shippingCost,
      taxRate,
      tax,
      total,
      exchangeRate,
    });
  } catch (error) {
    console.error(
      "RAZORPAY CREATE ORDER ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to create Razorpay order.",
      },
      { status: 500 }
    );
  }
}
