export type PaymentMethod =
  | "RAZORPAY"
  | "PAYPAL"
  | "WISE"
  | "PAYONEER";

export const PAYMENT_METHODS = [
  {
    id: "PAYPAL" as const,
    name: "PayPal",
    description: "Pay securely with PayPal.",
    automated: true,
  },
  {
    id: "WISE" as const,
    name: "Wise",
    description: "Pay by bank transfer through Wise.",
    automated: false,
  },
  {
    id: "PAYONEER" as const,
    name: "Payoneer",
    description: "Pay using a Payoneer payment request.",
    automated: false,
  },
  {
    id: "RAZORPAY" as const,
    name: "Card / Razorpay",
    description: "Pay by card through Razorpay.",
    automated: true,
  },
] as const;

export function isPaymentMethod(
  value: string
): value is PaymentMethod {
  return PAYMENT_METHODS.some(
    (method) => method.id === value
  );
}
