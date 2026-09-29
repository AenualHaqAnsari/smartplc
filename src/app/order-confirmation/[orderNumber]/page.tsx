import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SiteFooter from "@/components/site/SiteFooter";

type Props = {
  params: Promise<{
    orderNumber: string;
  }>;
};

function currencySymbol(currency: string) {
  if (currency === "GBP") return "£";
  if (currency === "EUR") return "€";
  if (currency === "INR") return "₹";
  return "$";
}

export default async function OrderConfirmation({
  params,
}: Props) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: {
      orderNumber,
    },

    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: {
                      isPrimary: "desc",
                    },
                  },
                },
              },
            },
          },
        },
      },

      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6 text-center text-[#17212b]">
        <div>
          <h1 className="font-serif text-4xl font-bold">
            ORDER NOT FOUND
          </h1>

          <Link
            href="/"
            className="mt-8 inline-block bg-[#0877b9] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            Return to Store
          </Link>
        </div>
      </main>
    );
  }

  const symbol = currencySymbol(order.currency);

  const orderSubtotal = Number(order.subtotal);
  const orderDiscount = Number(order.discount);
  const orderTax = Number(order.tax);
  const orderShipping = Number(order.shippingCost);
  const orderTotal = Number(order.total);

  /*
   * The discount stored on the order is the total
   * discount applied to the subtotal.
   *
   * Example:
   *
   * Subtotal  = $817.00
   * Discount  = $81.70
   *
   * Discount rate = 10%
   */

  const discountRate =
    orderSubtotal > 0
      ? orderDiscount / orderSubtotal
      : 0;

  const hasDiscount =
    orderDiscount > 0 &&
    discountRate > 0;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">

      {/* Header */}
      <header className="border-b border-[#e2e8f0]">
        <div className="mx-auto max-w-7xl px-6 py-5">

          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-[0.12em] text-[#075985]"
          >
            INDUSTRIAL AUTOMATION
          </Link>

        </div>
      </header>

      {/* Main Confirmation */}
      <section className="mx-auto max-w-4xl px-6 py-20">

        {/* Success */}
        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center border border-[#bda477] text-4xl text-[#0877b9]">
            ✓
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.35em] text-[#0369a1]">
            Order received
          </p>

          <h1 className="mt-3 font-serif text-5xl font-bold">
            THANK YOU
          </h1>

          <p className="mx-auto mt-6 max-w-xl leading-8 text-[#475569]">
            Your order has been successfully recorded.
            Your payment status is shown below.
          </p>

        </div>

        {/* Order Box */}
        <div className="mt-10 border border-[#cbd5e1] bg-[#ffffff] p-7">

          {/* Order Number */}
          <div className="flex flex-col justify-between gap-2 border-b border-[#e2e8f0] pb-5 sm:flex-row sm:items-center">

            <span className="text-sm text-[#475569]">
              Order Number
            </span>

            <strong className="text-[#0877b9]">
              {order.orderNumber}
            </strong>

          </div>

          {/* Products */}
          <div className="mt-6 space-y-6">

            {order.items.map((item) => {

              /*
               * Original price stored on the order.
               */
              const originalItemTotal =
                Number(item.totalPrice);

              /*
               * Apply the same order-level discount
               * percentage to this item.
               */
              const discountedItemTotal =
                hasDiscount
                  ? originalItemTotal *
                    (1 - discountRate)
                  : originalItemTotal;

              const discountedUnitPrice =
                discountedItemTotal /
                Math.max(item.quantity, 1);

              /*
               * Get the product image from:
               *
               * OrderItem
               *   -> Variant
               *      -> Product
               *         -> Images
               *
               * Primary image is first because the
               * Prisma query orders isPrimary DESC.
               */
              const productImage =
                item.variant?.product?.images?.[0]?.url ??
                null;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 border-b border-[#e2e8f0] pb-6 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                >

                  {/* Product Information */}
                  <div className="flex min-w-0 gap-5">

                    {/* Image */}
                    <div className="h-28 w-28 shrink-0 overflow-hidden border border-[#cbd5e1] bg-[#f3eee4]">

                      {productImage ? (
                        <img
                          src={productImage}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-[#777064]">
                          PRODUCT
                        </div>
                      )}

                    </div>

                    {/* Name / Quantity */}
                    <div className="min-w-0">

                      <p className="font-serif text-lg font-semibold">
                        {item.productName}
                      </p>

                      <p className="mt-2 text-sm text-[#777064]">
                        Quantity: {item.quantity}
                      </p>

                      {hasDiscount && (
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#0369a1]">
                          Discount applied
                        </p>
                      )}

                    </div>

                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-left sm:text-right">

                    {/* Original price */}
                    {hasDiscount && (
                      <p className="text-sm text-[#8b8479] line-through">
                        {symbol}
                        {originalItemTotal.toFixed(2)}
                      </p>
                    )}

                    {/* Actual price customer paid */}
                    <p className="mt-1 text-lg font-semibold text-[#0877b9]">
                      {symbol}
                      {discountedItemTotal.toFixed(2)}
                    </p>

                    {/* Unit price */}
                    {item.quantity > 1 && (
                      <p className="mt-1 text-xs text-[#777064]">
                        {symbol}
                        {discountedUnitPrice.toFixed(2)} each
                      </p>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

          {/* Price Summary */}
          <div className="mt-8 border-t border-[#e2e8f0] pt-6">

            {/* Subtotal */}
            <div className="flex justify-between gap-5">

              <span className="text-sm text-[#475569]">
                Subtotal
              </span>

              <span className="text-sm">
                {symbol}
                {orderSubtotal.toFixed(2)}
              </span>

            </div>

            {/* Discount */}
            {hasDiscount && (
              <div className="mt-4 flex justify-between gap-5">

                <span className="text-sm text-[#475569]">
                  Discount
                </span>

                <strong className="text-sm text-[#0877b9]">
                  -{symbol}
                  {orderDiscount.toFixed(2)}
                </strong>

              </div>
            )}

            {/* Discount Percentage */}
            {hasDiscount && (
              <div className="mt-2 flex justify-between gap-5">

                <span className="text-xs text-[#8b8479]">
                  Discount Rate
                </span>

                <span className="text-xs text-[#8b8479]">
                  {Math.round(discountRate * 100)}%
                </span>

              </div>
            )}

            {/* Shipping */}
            {orderShipping > 0 && (
              <div className="mt-4 flex justify-between gap-5">

                <span className="text-sm text-[#475569]">
                  Shipping
                </span>

                <span className="text-sm">
                  {symbol}
                  {orderShipping.toFixed(2)}
                </span>

              </div>
            )}

            {/* Tax */}
            {orderTax > 0 && (
              <div className="mt-4 flex justify-between gap-5">

                <span className="text-sm text-[#475569]">
                  Tax
                </span>

                <span className="text-sm">
                  {symbol}
                  {orderTax.toFixed(2)}
                </span>

              </div>
            )}

            {/* Final Total */}
            <div className="mt-6 flex justify-between gap-5 border-t border-[#e2e8f0] pt-6">

              <strong className="font-serif text-2xl">
                Total
              </strong>

              <strong className="text-2xl text-[#0877b9]">
                {symbol}
                {orderTotal.toFixed(2)}
              </strong>

            </div>

          </div>

        </div>

        {/* Payment Status */}
        <div className="mt-5 flex flex-col justify-between gap-2 border-b border-[#e2e8f0] pb-5 sm:flex-row sm:items-center">

          <span className="text-sm text-[#475569]">
            Payment Status
          </span>

          <strong
            className={
              order.paymentStatus === "PAID"
                ? "text-[#0877b9]"
                : "text-[#d79b8d]"
            }
          >
            {order.paymentStatus}
          </strong>

        </div>

        {/* Order Status */}
        <div className="mt-5 flex flex-col justify-between gap-2 border-b border-[#e2e8f0] pb-5 sm:flex-row sm:items-center">

          <span className="text-sm text-[#475569]">
            Order Status
          </span>

          <strong className="text-[#0877b9]">
            {order.status}
          </strong>

        </div>

        {/* Payment ID */}
        {order.payments[0]?.transactionId && (
          <div className="mt-5 flex flex-col justify-between gap-2 border-b border-[#e2e8f0] pb-5 sm:flex-row sm:items-center">

            <span className="text-sm text-[#475569]">
              Payment ID
            </span>

            <strong className="break-all text-right text-sm text-[#0877b9]">
              {order.payments[0].transactionId}
            </strong>

          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

          <Link
            href="/"
            className="border border-[#cbd5e1] px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.2em] hover:border-[#0877b9]"
          >
            Continue Shopping
          </Link>

          <Link
            href="/cart"
            className="bg-[#0877b9] px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            View Cart
          </Link>

        </div>

      </section>

      <SiteFooter />

    </main>
  );
}