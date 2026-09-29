import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const allowedStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "CUSTOMIZATION",
  "READY_TO_SHIP",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      orderNumber: string;
    }>;
  }
) {
  try {
    const authenticated = await requireAdmin();

    if (!authenticated) {
      return Response.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { orderNumber } = await params;
    const body = await request.json();

    const status = String(body.status || "");

    if (
      !allowedStatuses.includes(
        status as (typeof allowedStatuses)[number]
      )
    ) {
      return Response.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }

    const existingOrder =
      await prisma.order.findUnique({
        where: {
          orderNumber,
        },
      });

    if (!existingOrder) {
      return Response.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const order = await prisma.$transaction(
  async (tx) => {
    const currentOrder =
      await tx.order.findUnique({
        where: {
          orderNumber,
        },
        include: {
          items: true,
        },
      });

    if (!currentOrder) {
      throw new Error("Order not found.");
    }

    /*
     * Restore stock only when the order is
     * being changed TO CANCELLED for the
     * first time.
     */
    if (
      status === "CANCELLED" &&
      currentOrder.status !== "CANCELLED"
    ) {
      for (const item of currentOrder.items) {
        if (!item.variantId) {
          continue;
        }

        await tx.productVariant.update({
          where: {
            id: item.variantId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    return tx.order.update({
      where: {
        orderNumber,
      },
      data: {
        status:
          status as (typeof allowedStatuses)[number],
      },
    });
  }
);

    return Response.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
      },
    });
  } catch (error) {
    console.error(
      "ORDER STATUS UPDATE ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to update order status.",
      },
      { status: 500 }
    );
  }
}