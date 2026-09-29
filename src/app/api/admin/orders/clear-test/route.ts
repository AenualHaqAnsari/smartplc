import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function DELETE() {
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
    const result = await prisma.order.deleteMany({});

    return Response.json({
      success: true,
      deletedOrders: result.count,
      message: `Deleted ${result.count} test order(s).`,
    });
  } catch (error) {
    console.error(
      "CLEAR TEST ORDERS ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to clear test orders.",
      },
      { status: 500 }
    );
  }
}
