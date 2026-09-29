import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customer-auth";

const MAX_MESSAGE_LENGTH = 2000;

async function getCustomerConversation(customerId: string) {
  return prisma.supportConversation.findFirst({
    where: {
      customerId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
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
}

export async function GET() {
  try {
    const customerId = await getCustomerId();

    if (!customerId) {
      return Response.json(
        {
          error: "Please log in to use support chat.",
        },
        { status: 401 }
      );
    }

    const conversation =
      await getCustomerConversation(customerId);

    if (!conversation) {
      return Response.json({
        success: true,
        conversation: null,
      });
    }

    return Response.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("GET /api/support error:", error);

    return Response.json(
      {
        error: "Unable to load support chat.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const customerId = await getCustomerId();

    if (!customerId) {
      return Response.json(
        {
          error: "Please log in to send a support message.",
        },
        { status: 401 }
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

    let conversation =
      await prisma.supportConversation.findFirst({
        where: {
          customerId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

    if (conversation?.blocked) {
      return Response.json(
        {
          error:
            "Your support chat has been blocked. Please contact us by email if you need further assistance.",
          blocked: true,
        },
        { status: 403 }
      );
    }

    if (
      conversation &&
      conversation.status === "CLOSED"
    ) {
      conversation =
        await prisma.supportConversation.create({
          data: {
            customerId,
            status: "OPEN",
          },
        });
    }

    if (!conversation) {
      conversation =
        await prisma.supportConversation.create({
          data: {
            customerId,
            status: "OPEN",
          },
        });
    }

    const createdMessage =
      await prisma.supportMessage.create({
        data: {
          conversationId: conversation.id,
          sender: "CUSTOMER",
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
      await prisma.supportConversation.findUnique({
        where: {
          id: conversation.id,
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
    console.error("POST /api/support error:", error);

    return Response.json(
      {
        error: "Unable to send support message.",
      },
      { status: 500 }
    );
  }
}
