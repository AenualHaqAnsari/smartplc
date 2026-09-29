import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customer-auth";
import { sendOrderConfirmationEmail } from "@/lib/email";
import {
  getPayPalAccessToken,
  getPayPalApiBase,
} from "@/lib/payments/paypal/paypal";

type CustomerData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

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

    const customer =
      body.customer as CustomerData;

    const paypalOrderId = String(
      body.orderID || ""
    ).trim();

    if (!customer) {
      return Response.json(
        {
          error:
            "Customer information is required.",
        },
        { status: 400 }
      );
    }

    if (!paypalOrderId) {
      return Response.json(
        {
          error:
            "PayPal order ID is required.",
        },
        { status: 400 }
      );
    }

    const requiredCustomerFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address1",
      "city",
      "state",
      "postalCode",
      "country",
    ] as const;

    for (const field of requiredCustomerFields) {
      if (!customer[field]) {
        return Response.json(
          {
            error:
              "Please complete all required customer and shipping fields.",
          },
          { status: 400 }
        );
      }
    }

    /*
     * Prevent duplicate processing of the
     * same PayPal capture.
     *
     * We also check the PayPal order ID because
     * the capture ID is only available after capture.
     */
    const existingPayment =
      await prisma.payment.findFirst({
        where: {
          provider: "PAYPAL",
          rawResponse: {
            path: ["paypalOrderId"],
            equals: paypalOrderId,
          },
        },
        include: {
          order: true,
        },
      });

    if (existingPayment) {
      return Response.json({
        success: true,
        alreadyProcessed: true,
        orderNumber:
          existingPayment.order.orderNumber,
        orderId:
          existingPayment.order.id,
      });
    }

    /*
     * Load the authenticated customer's
     * database cart.
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

    const dbCustomer =
      await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });

    if (!dbCustomer) {
      return Response.json(
        {
          error:
            "Customer account could not be found.",
        },
        { status: 401 }
      );
    }

    /*
     * Get PayPal access token.
     */
    const accessToken =
      await getPayPalAccessToken();

    /*
     * Fetch the PayPal order before capture.
     * This allows us to verify the order amount,
     * currency and custom metadata before taking
     * the payment.
     */
    const paypalOrderResponse =
      await fetch(
        `${getPayPalApiBase()}/v2/checkout/orders/${encodeURIComponent(
          paypalOrderId
        )}`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
        }
      );

    const paypalOrder =
      await paypalOrderResponse.json();

    if (!paypalOrderResponse.ok) {
      console.error(
        "PAYPAL ORDER FETCH ERROR:",
        paypalOrder
      );

      return Response.json(
        {
          error:
            "Unable to verify PayPal order.",
        },
        { status: 400 }
      );
    }

    if (
      paypalOrder.status !== "APPROVED"
    ) {
      return Response.json(
        {
          error:
            `PayPal order cannot be captured because its status is ${paypalOrder.status}.`,
        },
        { status: 400 }
      );
    }

    const paypalPurchaseUnit =
      paypalOrder.purchase_units?.[0];

    const paypalAmount =
      paypalPurchaseUnit?.amount;

    const paypalCurrency =
      String(
        paypalAmount?.currency_code || ""
      ).toUpperCase();

    const paypalValue =
      Number(
        paypalAmount?.value
      );

    if (
      paypalCurrency !==
      String(
        body.currency || ""
      ).toUpperCase()
    ) {
      return Response.json(
        {
          error:
            "PayPal currency does not match the checkout currency.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(paypalValue) ||
      paypalValue <= 0
    ) {
      return Response.json(
        {
          error:
            "Invalid PayPal payment amount.",
        },
        { status: 400 }
      );
    }

    /*
     * Recalculate the complete order total
     * from the database cart.
     */
    let subtotal = 0;

    const orderItems =
      cart.items.map((cartItem) => {
        const variant =
          cartItem.variant;

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

        const quantity =
          Number(cartItem.quantity);

        if (
          !Number.isInteger(quantity) ||
          quantity < 1
        ) {
          throw new Error(
            "Invalid cart quantity."
          );
        }

        if (
          variant.stock < quantity
        ) {
          throw new Error(
            `${cartItem.product.name} does not have enough stock.`
          );
        }

        const unitPrice =
          Number(variant.price);

        if (
          !Number.isFinite(unitPrice) ||
          unitPrice < 0
        ) {
          throw new Error(
            "Invalid product price."
          );
        }

        const totalPrice =
          unitPrice * quantity;

        subtotal += totalPrice;

        return {
          productId:
            variant.productId,

          productName:
            cartItem.product.name,

          variantId:
            variant.id,

          quantity,

          unitPrice,

          totalPrice,

          customSize:
            Boolean(
              cartItem.customSize
            ),

          measurements:
            cartItem.customSize
              ? (
                  cartItem.measurements as
                    | Record<
                        string,
                        string
                      >
                    | null
                    | undefined
                ) ?? {}
              : null,
        };
      });

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

    const settingMap =
      new Map(
        settings.map(
          (setting) => [
            setting.key,
            setting.value,
          ]
        )
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
      throw new Error(
        "Invalid India tax configuration."
      );
    }

    if (
      !Number.isFinite(
        internationalTaxRate
      ) ||
      internationalTaxRate < 0 ||
      internationalTaxRate > 100
    ) {
      throw new Error(
        "Invalid international tax configuration."
      );
    }

    const country =
      String(
        dbCustomer.country || ""
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

    const taxRate =
      isIndia
        ? indiaTaxRate
        : internationalTaxRate;

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
        ) ?? "50"
      );

    const discountGermany =
      Number(
        settingMap.get(
          "discount_germany"
        ) ?? "50"
      );

    const discountFrance =
      Number(
        settingMap.get(
          "discount_france"
        ) ?? "50"
      );

    const discountItaly =
      Number(
        settingMap.get(
          "discount_italy"
        ) ?? "50"
      );

    const discountBelgium =
      Number(
        settingMap.get(
          "discount_belgium"
        ) ?? "50"
      );

    const discountSpain =
      Number(
        settingMap.get(
          "discount_spain"
        ) ?? "50"
      );

    const discountSwitzerland =
      Number(
        settingMap.get(
          "discount_switzerland"
        ) ?? "50"
      );

    const discountUnitedStates =
      Number(
        settingMap.get(
          "discount_united_states"
        ) ?? "50"
      );

    const discountEverywhere =
      Number(
        settingMap.get(
          "discount_everywhere"
        ) ?? "50"
      );

    const discountMap: Record<
      string,
      number
    > = {
      "UNITED KINGDOM":
        discountUnitedKingdom,
      UK:
        discountUnitedKingdom,
      GERMANY:
        discountGermany,
      FRANCE:
        discountFrance,
      ITALY:
        discountItaly,
      BELGIUM:
        discountBelgium,
      SPAIN:
        discountSpain,
      SWITZERLAND:
        discountSwitzerland,
      "UNITED STATES":
        discountUnitedStates,
      US:
        discountUnitedStates,
      USA:
        discountUnitedStates,
    };

    const discountRate =
      isIndia
        ? discountIndia
        : (
            discountMap[
              country
            ] ??
            discountEverywhere
          );

    if (
      !Number.isFinite(
        discountRate
      ) ||
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
      (
        discountedSubtotal +
        shippingCost
      ) *
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

    const currency =
      String(
        body.currency || "USD"
      ).toUpperCase() as CurrencyCode;

    if (
      currency !== "USD" &&
      currency !== "GBP" &&
      currency !== "EUR"
    ) {
      throw new Error(
        "Unsupported currency."
      );
    }

    const exchangeRate =
      await getExchangeRate(
        currency
      );

    const expectedPayPalAmount =
      Math.round(
        total *
        exchangeRate *
        100
      ) / 100;

    /*
     * Verify the PayPal order amount before
     * capturing the payment.
     */
    if (
      Math.abs(
        paypalValue -
        expectedPayPalAmount
      ) > 0.01
    ) {
      console.error(
        "PAYPAL AMOUNT MISMATCH:",
        {
          subtotal,
          discountRate,
          discount,
          discountedSubtotal,
          taxRate,
          tax,
          total,
          currency,
          exchangeRate,
          expectedPayPalAmount,
          paypalValue,
        }
      );

      return Response.json(
        {
          error:
            "PayPal payment amount does not match the order total.",
        },
        { status: 400 }
      );
    }

    /*
     * Capture the PayPal payment.
     */
    const captureResponse =
      await fetch(
        `${getPayPalApiBase()}/v2/checkout/orders/${encodeURIComponent(
          paypalOrderId
        )}/capture`,
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
          cache: "no-store",
        }
      );

    const captureData =
      await captureResponse.json();

    if (!captureResponse.ok) {
      console.error(
        "PAYPAL CAPTURE ERROR:",
        captureData
      );

      return Response.json(
        {
          error:
            "Unable to capture PayPal payment.",
        },
        { status: 500 }
      );
    }

    if (
      captureData.status !==
      "COMPLETED"
    ) {
      return Response.json(
        {
          error:
            "PayPal payment was not completed.",
        },
        { status: 400 }
      );
    }

    const capture =
      captureData.purchase_units?.[0]
        ?.payments?.captures?.[0];

    if (
      !capture ||
      capture.status !== "COMPLETED"
    ) {
      return Response.json(
        {
          error:
            "PayPal payment capture was not completed.",
        },
        { status: 400 }
      );
    }

    const captureAmount =
      Number(
        capture.amount?.value
      );

    const captureCurrency =
      String(
        capture.amount?.currency_code ||
          ""
      ).toUpperCase();

    if (
      captureCurrency !== currency ||
      !Number.isFinite(
        captureAmount
      ) ||
      Math.abs(
        captureAmount -
        expectedPayPalAmount
      ) > 0.01
    ) {
      console.error(
        "PAYPAL CAPTURE AMOUNT MISMATCH:",
        {
          captureAmount,
          captureCurrency,
          expectedPayPalAmount,
          currency,
        }
      );

      return Response.json(
        {
          error:
            "Captured PayPal amount does not match the order total.",
        },
        { status: 400 }
      );
    }

    const captureId =
      String(
        capture.id || ""
      ).trim();

    if (!captureId) {
      return Response.json(
        {
          error:
            "PayPal capture ID was not returned.",
        },
        { status: 500 }
      );
    }

    /*
     * Prevent duplicate processing using the
     * PayPal capture ID.
     */
    const existingCapture =
      await prisma.payment.findFirst({
        where: {
          transactionId:
            captureId,
        },
        include: {
          order: true,
        },
      });

    if (existingCapture) {
      return Response.json({
        success: true,
        alreadyProcessed: true,
        orderNumber:
          existingCapture.order.orderNumber,
        orderId:
          existingCapture.order.id,
      });
    }

    const orderNumber =
      `MA-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

    /*
     * Everything below happens in one
     * database transaction.
     */
    const order =
      await prisma.$transaction(
        async (tx) => {
          const address =
            await tx.address.create({
              data: {
                firstName:
                  customer.firstName,

                lastName:
                  customer.lastName,

                address1:
                  customer.address1,

                address2:
                  customer.address2 ||
                  null,

                city:
                  customer.city,

                state:
                  customer.state,

                postalCode:
                  customer.postalCode,

                country:
                  customer.country,

                phone:
                  customer.phone,

                customerId:
                  dbCustomer.id,
              },
            });

          const createdOrder =
            await tx.order.create({
              data: {
                orderNumber,

                customerId:
                  dbCustomer.id,

                shippingAddressId:
                  address.id,

                subtotal,

                shippingCost,

                discount,

                tax,

                total,

                currency,

                status:
                  "CONFIRMED",

                paymentStatus:
                  "PAID",

                items: {
                  create:
                    orderItems.map(
                      (item) => ({
                        productId:
                          item.productId,

                        productName:
                          item.productName,

                        variantId:
                          item.variantId,

                        quantity:
                          item.quantity,

                        unitPrice:
                          item.unitPrice,

                        totalPrice:
                          item.totalPrice,

                        customSize:
                          item.customSize,
                      })
                    ),
                },

                payments: {
                  create: {
                    provider:
                      "PAYPAL",

                    transactionId:
                      captureId,

                    amount:
                      expectedPayPalAmount,

                    currency,

                    status:
                      "PAID",

                    rawResponse: {
                      paypalOrderId,
                      paypalCaptureId:
                        captureId,
                      paypalStatus:
                        captureData.status,
                      amount:
                        captureAmount,
                      currency:
                        captureCurrency,
                    },
                  },
                },
              },

              include: {
                items: true,
              },
            });

          /*
           * Save custom measurements.
           */
          for (const item of orderItems) {
            if (
              !item.customSize ||
              !item.measurements
            ) {
              continue;
            }

            const measurements =
              item.measurements;

            await tx.customMeasurement.create({
              data: {
                orderId:
                  createdOrder.id,

                itemName:
                  item.productName,

                height:
                  measurements.height
                    ? Number(
                        measurements.height
                      )
                    : null,

                chest:
                  measurements.chest
                    ? Number(
                        measurements.chest
                      )
                    : null,

                waist:
                  measurements.waist
                    ? Number(
                        measurements.waist
                      )
                    : null,

                hip:
                  measurements.hip
                    ? Number(
                        measurements.hip
                      )
                    : null,

                shoulder:
                  measurements.shoulder
                    ? Number(
                        measurements.shoulder
                      )
                    : null,

                armLength:
                  measurements.armLength
                    ? Number(
                        measurements.armLength
                      )
                    : null,

                bicep:
                  measurements.bicep
                    ? Number(
                        measurements.bicep
                      )
                    : null,

                wrist:
                  measurements.wrist
                    ? Number(
                        measurements.wrist
                      )
                    : null,

                thigh:
                  measurements.thigh
                    ? Number(
                        measurements.thigh
                      )
                    : null,

                knee:
                  measurements.knee
                    ? Number(
                        measurements.knee
                      )
                    : null,

                calf:
                  measurements.calf
                    ? Number(
                        measurements.calf
                      )
                    : null,

                ankle:
                  measurements.ankle
                    ? Number(
                        measurements.ankle
                      )
                    : null,

                neck:
                  measurements.neck
                    ? Number(
                        measurements.neck
                      )
                    : null,

                head:
                  measurements.head
                    ? Number(
                        measurements.head
                      )
                    : null,

                unit: "cm",

                notes: null,
              },
            });
          }

          /*
           * Deduct stock exactly once.
           */
          for (const item of orderItems) {
            const stockUpdate =
              await tx.productVariant.updateMany({
                where: {
                  id:
                    item.variantId,

                  stock: {
                    gte:
                      item.quantity,
                  },
                },

                data: {
                  stock: {
                    decrement:
                      item.quantity,
                  },
                },
              });

            if (
              stockUpdate.count !== 1
            ) {
              throw new Error(
                `${item.productName} does not have enough stock.`
              );
            }
          }

          /*
           * Clear only this customer's cart.
           */
          await tx.cartItem.deleteMany({
            where: {
              cartId:
                cart.id,
            },
          });

          return createdOrder;
        }
      );

    /*
     * Send confirmation email after the
     * database transaction succeeds.
     */
    try {
      await sendOrderConfirmationEmail({
        customerName:
          `${customer.firstName} ${customer.lastName}`,

        customerEmail:
          customer.email,

        orderNumber:
          order.orderNumber,

        items:
          order.items.map(
            (item) => ({
              productName:
                item.productName,

              quantity:
                item.quantity,

              totalPrice:
                item.totalPrice.toString(),
            })
          ),

        total:
          order.total.toString(),
      });
    } catch (emailError) {
      console.error(
        "ORDER CONFIRMATION EMAIL ERROR:",
        emailError
      );
    }

    return Response.json({
      success: true,

      orderNumber:
        order.orderNumber,

      orderId:
        order.id,

      paypalOrderId,

      paypalCaptureId:
        captureId,
    });
  } catch (error) {
    console.error(
      "PAYPAL COMPLETE ORDER ERROR:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to complete PayPal order.",
      },
      { status: 500 }
    );
  }
}

