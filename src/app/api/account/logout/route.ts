import { clearCustomerSession } from "@/lib/customer-auth";

export async function POST() {
  try {
    await clearCustomerSession();

    return Response.redirect(
      new URL("/account/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
    );
  } catch (error) {
    console.error(
      "CUSTOMER LOGOUT ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to sign out.",
      },
      { status: 500 }
    );
  }
}