import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { customer, items } = body;

    if (!customer || !items || items.length === 0) {
      return Response.json(
        {
          error: "Invalid order data.",
        },
        { status: 400 }
      );
    }

    if (
      !customer.firstName ||
      !customer.lastName ||
      !customer.email ||
      !customer.phone ||
      !customer.address1 ||
      !customer.city ||
      !customer.state ||
      !customer.postalCode ||
      !customer.country
    ) {
      return Response.json(
        {
          error: "Please complete all required customer and shipping fields.",
        },
        { status: 400 }
      );
    }

    /*
     * IMPORTANT:
     * Never trust prices sent by the browser.
     *
     * We use the product/variant IDs from the cart
     * and retrieve the real prices from PostgreSQL.
     */

    const variantIds = items
      .map((item: { variantId?: string }) => item.variantId)
      .filter(
        (id: string | undefined): id is string =>
          Boolean(id)
      );

    const variants = await prisma.productVariant.findMany({
      where: {
        id: {
          in: variantIds,
        },
      },
      include: {
        product: true,
      },
    });

    if (variants.length !== variantIds.length) {
      return Response.json(
        {
          error: "One or more products are no longer available.",
        },
        { status: 400 }
      );
    }

    const variantMap = new Map(
      variants.map((variant) => [
        variant.id,
        variant,
      ])
    );

    let subtotal = 0;

    type OrderItemData = {
  productId: string;
  productName: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customSize: boolean;
  measurements?: Record<string, string>;
};

const orderItems: OrderItemData[] = items.map(
  (item: {
    variantId?: string;
    productId: string;
    quantity: number;
    customSize?: boolean;
    measurements?: Record<string, string>;
  }) => {
    if (!item.variantId) {
      throw new Error(
        "A product variant is required."
      );
    }

    const variant = variantMap.get(item.variantId);

    if (!variant) {
      throw new Error(
        "Product variant not found."
      );
    }

    const quantity = Number(item.quantity);

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new Error(
        "Invalid product quantity."
      );
    }

    if (
  !Number.isInteger(quantity) ||
  quantity < 1
) {
  throw new Error(
    "Invalid product quantity."
  );
}

    const unitPrice = Number(variant.price);
    const totalPrice = unitPrice * quantity;

    subtotal += totalPrice;

    return {
      productId: variant.productId,
      productName: variant.product.name,
      variantId: variant.id,
      quantity,
      unitPrice,
      totalPrice,
      customSize: Boolean(item.customSize),
      measurements: item.measurements,
    };
  }
);

    const orderNumber = `MA-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    const order = await prisma.$transaction(
      async (tx) => {
        const existingCustomer =
          await tx.customer.findUnique({
            where: {
              email: customer.email.toLowerCase(),
            },
          });

        const dbCustomer =
  existingCustomer ??
  (await tx.customer.create({
    data: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email.toLowerCase(),
      phone: customer.phone,
      passwordHash: null,
    },
  }));

        const address = await tx.address.create({
          data: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            address1: customer.address1,
            address2:
              customer.address2 || null,
            city: customer.city,
            state: customer.state,
            postalCode: customer.postalCode,
            country: customer.country,
            phone: customer.phone,
            customerId: dbCustomer.id,
          },
        });

        const order = await tx.order.create({
          data: {
            orderNumber,

            customerId: dbCustomer.id,

            shippingAddressId: address.id,

            subtotal,

            shippingCost: 0,

            discount: 0,

            tax: 0,

            total: subtotal,

            currency: "USD",

            status: "PENDING",

            paymentStatus: "PENDING",

            items: {
              create: orderItems.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                variantId: item.variantId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                customSize: item.customSize,
              })),
            },
          },

          include: {
            items: true,
          },
        });

        /*
         * Save custom measurements separately.
         */

       

        /*
         * Reduce stock after successfully creating
         * the order.
         */

       

        return order;
      }
    );

    return Response.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error("ORDER CREATION ERROR:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create order.",
      },
      { status: 500 }
    );
  }
}