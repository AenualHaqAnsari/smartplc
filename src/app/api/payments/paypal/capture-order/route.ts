export async function POST() {
  return Response.json(
    { error: "Complete PayPal payments through checkout." },
    { status: 410 }
  );
}