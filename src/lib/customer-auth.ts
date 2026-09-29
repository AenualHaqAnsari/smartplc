import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET
);

const COOKIE_NAME = "customer_token";

export async function createCustomerSession(
  customerId: string
) {
  const token = await new SignJWT({
    customerId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getCustomerId() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    COOKIE_NAME
  )?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      secret
    );

    if (
      typeof payload.customerId !== "string"
    ) {
      return null;
    }

    return payload.customerId;
  } catch {
    return null;
  }
}

export async function requireCustomer() {
  return getCustomerId();
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}