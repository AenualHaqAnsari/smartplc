import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createCustomerSession } from "@/lib/customer-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(
      body.password || ""
    );

    if (!email || !password) {
      return Response.json(
        {
          error:
            "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const customer =
      await prisma.customer.findUnique({
        where: {
          email,
        },
      });

    if (
      !customer ||
      !customer.passwordHash
    ) {
      return Response.json(
        {
          error:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const passwordValid =
      await bcrypt.compare(
        password,
        customer.passwordHash
      );

    if (!passwordValid) {
      return Response.json(
        {
          error:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    await createCustomerSession(
      customer.id
    );

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "CUSTOMER LOGIN ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to sign in.",
      },
      { status: 500 }
    );
  }
}