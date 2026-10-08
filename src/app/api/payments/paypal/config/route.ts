export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();

  if (!clientId) {
    return Response.json(
      { error: "PayPal is not configured." },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  return Response.json(
    { clientId },
    { headers: { "Cache-Control": "no-store" } }
  );
}
