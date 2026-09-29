import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const allowedPaymentStatuses = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
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

    const paymentStatus = String(
      body.paymentStatus || ""
    );

    if (
      !allowedPaymentStatuses.includes(
        paymentStatus as (typeof allowedPaymentStatuses)[number]
      )
    ) {
      return Response.json(
        {
          error:
            "Invalid payment status.",
        },
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
        {
          error: "Order not found.",
        },
        { status: 404 }
      );
    }

    const order =
      await prisma.order.update({
        where: {
          orderNumber,
        },
        data: {
          paymentStatus:
            paymentStatus as (typeof allowedPaymentStatuses)[number],
        },
      });

    return Response.json({
      success: true,
      order: {
        orderNumber:
          order.orderNumber,
        paymentStatus:
          order.paymentStatus,
      },
    });
  } catch (error) {
    console.error(
      "PAYMENT STATUS UPDATE ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to update payment status.",
      },
      { status: 500 }
    );
  }
}