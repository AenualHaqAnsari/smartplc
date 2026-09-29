import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    const carts = await prisma.cartItem.findMany({
      where: {
        productId: id,
        quantity: {
          gt: 0,
        },
      },
      select: {
        cartId: true,
      },
      distinct: ["cartId"],
    });

    return Response.json({
      success: true,
      basketCount: carts.length,
    });
  } catch (error) {
    console.error(
      "GET /api/products/[id]/baskets error:",
      error
    );

    return Response.json(
      { error: "Unable to load basket count." },
      { status: 500 }
    );
  }
}
