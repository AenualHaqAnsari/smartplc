import {
  getPayPalAccessToken,
  getPayPalApiBase,
} from "@/lib/payments/paypal/paypal";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orderID = String(
      body.orderID || ""
    ).trim();

    if (!orderID) {
      return Response.json(
        {
          error: "PayPal order ID is required.",
        },
        { status: 400 }
      );
    }

    const accessToken =
      await getPayPalAccessToken();

    const response = await fetch(
      `${getPayPalApiBase()}/v2/checkout/orders/${encodeURIComponent(
        orderID
      )}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "PAYPAL CAPTURE ERROR:",
        data
      );

      return Response.json(
        {
          error:
            "Unable to capture PayPal payment.",
        },
        { status: 500 }
      );
    }

    const capture =
      data.purchase_units?.[0]?.payments
        ?.captures?.[0];

    return Response.json({
      success: true,
      orderID: data.id,
      status: data.status,
      captureID: capture?.id || null,
      captureStatus:
        capture?.status || null,
      amount:
        capture?.amount?.value || null,
      currency:
        capture?.amount?.currency_code || null,
    });
  } catch (error) {
    console.error(
      "PAYPAL CAPTURE EXCEPTION:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to complete PayPal payment.",
      },
      { status: 500 }
    );
  }
}
