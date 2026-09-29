import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return Response.json(
        {
          error: "Missing Razorpay payment details.",
        },
        { status: 400 }
      );
    }

    const secret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error(
        "RAZORPAY_KEY_SECRET is not configured."
      );

      return Response.json(
        {
          error:
            "Payment configuration is incomplete.",
        },
        { status: 500 }
      );
    }

    const expectedSignature =
      crypto
        .createHmac("sha256", secret)
        .update(
          `${razorpayOrderId}|${razorpayPaymentId}`
        )
        .digest("hex");

    if (
      expectedSignature !== razorpaySignature
    ) {
      return Response.json(
        {
          error: "Invalid payment signature.",
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      verified: true,
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
    });
  } catch (error) {
    console.error(
      "RAZORPAY PAYMENT VERIFICATION ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to verify payment.",
      },
      { status: 500 }
    );
  }
}