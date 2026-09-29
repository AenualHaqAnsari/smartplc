import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(request: Request) {
  try {
    const authenticated = await requireAdmin();

    if (!authenticated) {
      return Response.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const reviewId =
      typeof body.reviewId === "string"
        ? body.reviewId.trim()
        : "";

    if (!reviewId) {
      return Response.json(
        { error: "Review ID is required." },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
      select: {
        id: true,
      },
    });

    if (!review) {
      return Response.json(
        { error: "Review not found." },
        { status: 404 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        approved: true,
      },
      select: {
        id: true,
        approved: true,
      },
    });

    return Response.json({
      success: true,
      message: "Review approved successfully.",
      review: updatedReview,
    });
  } catch (error) {
    console.error(
      "ADMIN REVIEW APPROVAL ERROR:",
      error
    );

    return Response.json(
      { error: "Unable to approve review." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authenticated = await requireAdmin();

    if (!authenticated) {
      return Response.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const reviewId =
      typeof body.reviewId === "string"
        ? body.reviewId.trim()
        : "";

    if (!reviewId) {
      return Response.json(
        { error: "Review ID is required." },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
      select: {
        id: true,
      },
    });

    if (!review) {
      return Response.json(
        { error: "Review not found." },
        { status: 404 }
      );
    }

    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    return Response.json({
      success: true,
      message: "Review rejected and deleted.",
    });
  } catch (error) {
    console.error(
      "ADMIN REVIEW DELETE ERROR:",
      error
    );

    return Response.json(
      { error: "Unable to delete review." },
      { status: 500 }
    );
  }
}
