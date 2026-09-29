import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createCustomerSession } from "@/lib/customer-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = String(
      body.firstName || ""
    ).trim();

    const lastName = String(
      body.lastName || ""
    ).trim();

    const email = String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

    const phone = String(
    body.phone || ""
  ).trim();

  const country = String(
    body.country || ""
  ).trim();

    const password = String(
      body.password || ""
    );

    if (
      !firstName ||
      !lastName ||
    !email ||
    !country ||
    !password
    ) {
      return Response.json(
        {
          error:
            "First name, last name, email and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        {
          error:
            "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const existingCustomer =
      await prisma.customer.findUnique({
        where: {
          email,
        },
      });

    if (existingCustomer) {
      return Response.json(
        {
          error:
            "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const customer =
      await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email,
          phone: phone || null,
        country,
        passwordHash,
        },
      });

    await createCustomerSession(
      customer.id
    );

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "CUSTOMER REGISTRATION ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to create your account.",
      },
      { status: 500 }
    );
  }
}