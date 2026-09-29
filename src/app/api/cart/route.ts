import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customer-auth";
import type { Prisma } from "@/generated/prisma/client";

const cartItemInclude = {
  product: {
    include: {
      images: {
        orderBy: [
          { isPrimary: "desc" as const },
          { sortOrder: "asc" as const },
        ],
      },
    },
  },
  variant: true,
};

async function getOrCreateCart(customerId: string) {
  return prisma.cart.upsert({
    where: {
      customerId,
    },
    create: {
      customerId,
    },
    update: {},
    include: {
      items: {
        include: cartItemInclude,
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

type CartItemWithRelations = Prisma.CartItemGetPayload<{ include: typeof cartItemInclude }>;

function mapCartItem(item: CartItemWithRelations) {
  const primaryImage =
    item.product?.images?.find(
      (image) => image.isPrimary
    ) ??
    item.product?.images?.[0] ??
    null;

  return {
    ...item,

    imageUrl:
      primaryImage?.url ??
      null,
  };
}

export async function GET() {
  try {
    const customerId = await getCustomerId();

    if (!customerId) {
      return Response.json(
        {
          error: "Please log in to view your cart.",
        },
        { status: 401 }
      );
    }

    const cart = await getOrCreateCart(customerId);

    return Response.json({
      success: true,

      cart: {
        ...cart,

        items: cart.items.map(mapCartItem),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/cart error:",
      error
    );

    return Response.json(
      {
        error: "Unable to load cart.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const customerId = await getCustomerId();

    if (!customerId) {
      return Response.json(
        {
          error:
            "Please log in to add items to your cart.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      productId,
      variantId,
      quantity,
      customSize,
      measurements,
    } = body;

    if (
      !productId ||
      !variantId ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1
    ) {
      return Response.json(
        {
          error: "Invalid cart item.",
        },
        { status: 400 }
      );
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    const variant =
      await prisma.productVariant.findUnique({
        where: {
          id: variantId,
        },
      });

    if (
      !product ||
      !variant ||
      variant.productId !== productId
    ) {
      return Response.json(
        {
          error: "Product variant not found.",
        },
        { status: 404 }
      );
    }

    const requestedQuantity =
      Number(quantity);

    if (
      requestedQuantity >
      variant.stock
    ) {
      return Response.json(
        {
          error: `Only ${variant.stock} item(s) are available in stock.`,
        },
        { status: 400 }
      );
    }

    const cart =
      await prisma.cart.upsert({
        where: {
          customerId,
        },
        create: {
          customerId,
        },
        update: {},
      });

    const existingItem =
      await prisma.cartItem.findUnique({
        where: {
          cartId_variantId_customSize: {
            cartId: cart.id,
            variantId,
            customSize:
              Boolean(customSize),
          },
        },
      });

    let cartItem;

    if (existingItem) {
      const newQuantity =
        existingItem.quantity +
        requestedQuantity;

      if (
        newQuantity >
        variant.stock
      ) {
        return Response.json(
          {
            error: `Only ${variant.stock} item(s) are available in stock.`,
          },
          { status: 400 }
        );
      }

      cartItem =
        await prisma.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity:
              newQuantity,

            measurements:
              customSize
                ? measurements ?? null
                : null,
          },

          include:
            cartItemInclude,
        });
    } else {
      cartItem =
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            variantId,
            quantity:
              requestedQuantity,
            customSize:
              Boolean(customSize),

            measurements:
              customSize
                ? measurements ?? null
                : null,
          },

          include:
            cartItemInclude,
        });
    }

    return Response.json({
      success: true,

      item: mapCartItem(cartItem),
    });
  } catch (error) {
    console.error(
      "POST /api/cart error:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to add item to cart.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const customerId =
      await getCustomerId();

    if (!customerId) {
      return Response.json(
        {
          error:
            "Please log in to update your cart.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      cartItemId,
      quantity,
    } = body;

    if (
      !cartItemId ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1
    ) {
      return Response.json(
        {
          error: "Invalid cart update.",
        },
        { status: 400 }
      );
    }

    const cart =
      await prisma.cart.findUnique({
        where: {
          customerId,
        },
      });

    if (!cart) {
      return Response.json(
        {
          error: "Cart not found.",
        },
        { status: 404 }
      );
    }

    const item =
      await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          cartId: cart.id,
        },
        include: {
          variant: true,
        },
      });

    if (!item) {
      return Response.json(
        {
          error: "Cart item not found.",
        },
        { status: 404 }
      );
    }

    const requestedQuantity =
      Number(quantity);

    if (
      requestedQuantity >
      item.variant.stock
    ) {
      return Response.json(
        {
          error: `Only ${item.variant.stock} item(s) are available in stock.`,
        },
        { status: 400 }
      );
    }

    const updatedItem =
      await prisma.cartItem.update({
        where: {
          id: item.id,
        },

        data: {
          quantity:
            requestedQuantity,
        },

        include:
          cartItemInclude,
      });

    return Response.json({
      success: true,

      item: mapCartItem(updatedItem),
    });
  } catch (error) {
    console.error(
      "PATCH /api/cart error:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to update cart.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const customerId =
      await getCustomerId();

    if (!customerId) {
      return Response.json(
        {
          error:
            "Please log in to modify your cart.",
        },
        { status: 401 }
      );
    }

    const body =
      await request.json();

    const {
      cartItemId,
      clear,
    } = body;

    const cart =
      await prisma.cart.findUnique({
        where: {
          customerId,
        },
      });

    if (!cart) {
      return Response.json({
        success: true,
      });
    }

    if (clear) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return Response.json({
        success: true,
      });
    }

    if (!cartItemId) {
      return Response.json(
        {
          error:
            "Cart item ID is required.",
        },
        { status: 400 }
      );
    }

    await prisma.cartItem.deleteMany({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/cart error:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to remove item.",
      },
      { status: 500 }
    );
  }
}
