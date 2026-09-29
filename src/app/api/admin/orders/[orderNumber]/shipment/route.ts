import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = [
  "NOT_SHIPPED",
  "LABEL_CREATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "EXCEPTION",
  "RETURNED",
] as const;

function parseDate(value: unknown) {
  if (!value) {
    return null;
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date.");
  }

  return date;
}

export async function GET(
  _request: Request,
  context: {
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

    const { orderNumber } = await context.params;

    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
      },
      select: {
        id: true,
      },
    });

    if (!order) {
      return Response.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const shipment = await prisma.shipment.findUnique({
      where: {
        orderId: order.id,
      },
      include: {
        events: {
          orderBy: {
            eventTime: "desc",
          },
        },
      },
    });

    return Response.json({
      success: true,
      shipment,
    });
  } catch (error) {
    console.error(
      "GET ADMIN SHIPMENT ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to load shipment information.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: {
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

    const { orderNumber } = await context.params;

    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
      },
      include: {
        shipment: true,
      },
    });

    if (!order) {
      return Response.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const courier = String(
      body.courier || ""
    ).trim();

    const trackingNumber = String(
      body.trackingNumber || ""
    ).trim();

    const status = String(
      body.status || "NOT_SHIPPED"
    ).trim();

    const currentLocation = String(
      body.currentLocation || ""
    ).trim();

    const notes = String(
      body.notes || ""
    ).trim();

    const eventDescription = String(
      body.eventDescription || ""
    ).trim();

    if (!courier) {
      return Response.json(
        { error: "Courier is required." },
        { status: 400 }
      );
    }

    if (
      !VALID_STATUSES.includes(
        status as (typeof VALID_STATUSES)[number]
      )
    ) {
      return Response.json(
        { error: "Invalid shipment status." },
        { status: 400 }
      );
    }

    const shippedAt = parseDate(
      body.shippedAt
    );

    const estimatedDelivery = parseDate(
      body.estimatedDelivery
    );

    const deliveredAt = parseDate(
      body.deliveredAt
    );

    const now = new Date();

    const previousStatus =
      order.shipment?.status ?? null;

    const shipment =
      await prisma.shipment.upsert({
        where: {
          orderId: order.id,
        },

        create: {
          orderId: order.id,
          courier,
          trackingNumber:
            trackingNumber || null,
          status:
            status as (typeof VALID_STATUSES)[number],
          shippedAt,
          estimatedDelivery,
          deliveredAt,
          currentLocation:
            currentLocation || null,
          lastUpdated: now,
          notes: notes || null,
        },

        update: {
          courier,
          trackingNumber:
            trackingNumber || null,
          status:
            status as (typeof VALID_STATUSES)[number],
          shippedAt,
          estimatedDelivery,
          deliveredAt,
          currentLocation:
            currentLocation || null,
          lastUpdated: now,
          notes: notes || null,
        },
      });

    const statusChanged =
      previousStatus !== status;

    if (
      !order.shipment ||
      statusChanged ||
      eventDescription
    ) {
      await prisma.shipmentEvent.create({
        data: {
          shipmentId: shipment.id,

          status:
            status as (typeof VALID_STATUSES)[number],

          description:
            eventDescription ||
            (
              !order.shipment
                ? "Shipment created."
                : `Shipment status updated to ${status.replaceAll("_", " ")}.`
            ),

          location:
            currentLocation || null,

          eventTime: now,
        },
      });
    }

    const updatedShipment =
      await prisma.shipment.findUnique({
        where: {
          id: shipment.id,
        },
        include: {
          events: {
            orderBy: {
              eventTime: "desc",
            },
          },
        },
      });

    return Response.json({
      success: true,
      shipment: updatedShipment,
    });
  } catch (error) {
    console.error(
      "POST ADMIN SHIPMENT ERROR:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save shipment information.",
      },
      { status: 500 }
    );
  }
}
