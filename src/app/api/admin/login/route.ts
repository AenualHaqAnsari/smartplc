import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET
);

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
          error: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return Response.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordValid) {
      return Response.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      adminId: admin.id,
      email: admin.email,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);

    const response = Response.json({
      success: true,
    });

    response.headers.append(
      "Set-Cookie",
      `admin_token=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax${
        process.env.NODE_ENV === "production"
          ? "; Secure"
          : ""
      }`
    );

    return response;
  } catch (error) {
    console.error(
      "ADMIN LOGIN ERROR:",
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