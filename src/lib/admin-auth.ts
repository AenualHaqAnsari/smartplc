import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET
);

export async function requireAdmin() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    "admin_token"
  )?.value;

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}