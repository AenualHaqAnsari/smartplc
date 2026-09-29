import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      conversationId: string;
    }>;
  }
) {
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

    const { conversationId } =
      await context.params;

    if (!conversationId) {
      return Response.json(
        {
          error: "Conversation ID is required.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return Response.json(
        {
          error: "Please enter a message.",
        },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        {
          error: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`,
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
          status: true,
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

    if (conversation.blocked) {
      return Response.json(
        {
          error:
            "This customer is blocked from support chat.",
          blocked: true,
        },
        { status: 403 }
      );
    }

    const createdMessage =
      await prisma.supportMessage.create({
        data: {
          conversationId,
          sender: "ADMIN",
          message,
        },
        select: {
          id: true,
          sender: true,
          message: true,
          createdAt: true,
        },
      });

    const updatedConversation =
      await prisma.supportConversation.update({
        where: {
          id: conversationId,
        },
        data: {
          status: "OPEN",
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

    return Response.json(
      {
        success: true,
        message: createdMessage,
        conversation: updatedConversation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/support/[conversationId] error:",
      error
    );

    return Response.json(
      {
        error: "Unable to send admin reply.",
      },
      { status: 500 }
    );
  }
}