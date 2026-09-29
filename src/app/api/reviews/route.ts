import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customer-auth";

export async function POST(request: Request) {
  try {
    const customerId = await getCustomerId();

    if (!customerId) {
      return Response.json(
        { error: "Please log in to submit a review." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId =
      typeof body.productId === "string"
        ? body.productId.trim()
        : "";

    const rating = Number(body.rating);

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const comment =
      typeof body.comment === "string"
        ? body.comment.trim()
        : "";

    if (!productId) {
      return Response.json(
        { error: "Product is required." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return Response.json(
        { error: "Rating must be between 1 and 5 stars." },
        { status: 400 }
      );
    }

    if (!title && !comment) {
      return Response.json(
        { error: "Please write a review." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!product) {
      return Response.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    /*
     * Only customers who have purchased this product
     * can submit a verified review.
     *
     * We check confirmed/paid orders belonging to the
     * authenticated customer.
     */
    const purchasedItem =
      await prisma.orderItem.findFirst({
        where: {
          productId,
          order: {
            customerId,
            paymentStatus: "PAID",
          },
        },
        select: {
          id: true,
        },
      });

    if (!purchasedItem) {
      return Response.json(
        {
          error:
            "You can review this product after purchasing it.",
        },
        { status: 403 }
      );
    }

    const existingReview =
      await prisma.review.findFirst({
        where: {
          productId,
          customerId,
        },
        select: {
          id: true,
        },
      });

    if (existingReview) {
      return Response.json(
        {
          error:
            "You have already reviewed this product.",
        },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        customerId,
        rating,
        title: title || null,
        comment: comment || null,
        approved: false,
      },
      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        approved: true,
        createdAt: true,
      },
    });

    return Response.json(
      {
        success: true,
        message:
          "Thank you. Your review has been submitted and is awaiting approval.",
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "REVIEW SUBMISSION ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to submit your review.",
      },
      { status: 500 }
    );
  }
}
