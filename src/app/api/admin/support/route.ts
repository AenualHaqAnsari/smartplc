import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const authenticated = await requireAdmin();

    if (!authenticated) {
      return Response.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const conversationId =
      typeof body.conversationId === "string"
        ? body.conversationId.trim()
        : "";

    const blocked =
      typeof body.blocked === "boolean"
        ? body.blocked
        : null;

    if (!conversationId) {
      return Response.json(
        {
          error: "Conversation ID is required.",
        },
        { status: 400 }
      );
    }

    if (blocked === null) {
      return Response.json(
        {
          error: "Blocked status is required.",
        },
        { status: 400 }
      );
    }

    const conversation =
      await prisma.supportConversation.findUnique({
        where: {
          id: conversationId,
        },
        select: {
          id: true,
          blocked: true,
        },
      });

    if (!conversation) {
      return Response.json(
        {
          error: "Support conversation not found.",
        },
        { status: 404 }
      );
    }

    const updatedConversation =
      await prisma.supportConversation.update({
        where: {
          id: conversationId,
        },
        data: {
          blocked,
          blockedAt: blocked
            ? new Date()
            : null,
        },
        select: {
          id: true,
          status: true,
          blocked: true,
          blockedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return Response.json({
      success: true,
      conversation: updatedConversation,
      message: blocked
        ? "Customer has been blocked."
        : "Customer has been unblocked.",
    });
  } catch (error) {
    console.error(
      "POST /api/admin/support error:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to update customer support status.",
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const authenticated = await requireAdmin();

    if (!authenticated) {
      return Response.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const conversations =
      await prisma.supportConversation.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              country: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "asc",
            },
            select: {
              id: true,
              sender: true,
              message: true,
              createdAt: true,
            },
          },
        },
      });

    return Response.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/support error:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to load support conversations.",
      },
      { status: 500 }
    );
  }
}
