import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customer-auth";

export async function GET() {
  try {
    const customerId = await getCustomerId();

    if (!customerId) {
      return Response.json(
        {
          error: "Please log in.",
        },
        { status: 401 }
      );
    }

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
          error: "Customer account not found.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      country: customer.country,
    });
  } catch (error) {
    console.error(
      "GET /api/account/country error:",
      error
    );

    return Response.json(
      {
        error: "Unable to load customer country.",
      },
      { status: 500 }
    );
  }
}
