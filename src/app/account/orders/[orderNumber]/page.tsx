import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customer-auth";

type Props = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export default async function CustomerOrderPage({
  params,
}: Props) {
  const { orderNumber } = await params;

  const customerId = await getCustomerId();

  if (!customerId) {
    redirect("/account/login");
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      customerId,
    },
    include: {
      items: {
          include: {
            variant: true,
          },
        },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      shippingAddress: true,
      shipment: {
        include: {
          events: {
            orderBy: {
              eventTime: "desc",
            },
          },
        },
      },
    },
  });

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
        <StoreHeader />

        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
            Customer Account
          </p>

          <h1 className="mt-3 font-serif text-5xl font-bold">
            ORDER NOT FOUND
          </h1>

          <p className="mt-5 text-[#475569]">
            This order could not be found in your account.
          </p>

          <Link
            href="/account"
            className="mt-8 inline-block bg-[#0877b9] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff]"
          >
            Back to Account
          </Link>
        </section>
      </main>
    );
  }

  const payment = order.payments[0];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
          Order Details
        </p>

        <h1 className="mt-3 font-serif text-5xl font-bold">
          {order.orderNumber}
        </h1>

        <p className="mt-4 text-sm text-[#777064]">
          Placed on{" "}
          {order.createdAt.toLocaleDateString()}
        </p>

        {/* Status */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="border border-[#cbd5e1] bg-[#ffffff] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#777064]">
              Order Status
            </p>

            <p className="mt-2 text-lg font-semibold text-[#0877b9]">
              {order.status}
            </p>
          </div>

          <div className="border border-[#cbd5e1] bg-[#ffffff] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#777064]">
              Payment Status
            </p>

            <p
              className={
                order.paymentStatus === "PAID"
                  ? "mt-2 text-lg font-semibold text-[#0877b9]"
                  : "mt-2 text-lg font-semibold text-[#d79b8d]"
              }
            >
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Items */}
        <section className="mt-8 border border-[#cbd5e1] bg-[#ffffff] p-7">
          <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
            Items
          </p>

          <div className="mt-6 space-y-5">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-5 border-b border-[#e2e8f0] pb-5 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-serif text-lg font-semibold">
  {item.productName}
</p>

{item.variant && (
  <div className="mt-2 space-y-1 text-xs text-[#475569]">
    <p>
      Variant:{" "}
      <span className="text-[#0877b9]">
        {item.variant.name}
      </span>
    </p>

    {item.variant.size && (
      <p>
        Size:{" "}
        <span className="text-[#0877b9]">
          {item.variant.size}
        </span>
      </p>
    )}

    {item.variant.gauge && (
      <p>
        Gauge:{" "}
        <span className="text-[#0877b9]">
          {item.variant.gauge}
        </span>
      </p>
    )}

    {item.variant.finish && (
      <p>
        Finish:{" "}
        <span className="text-[#0877b9]">
          {item.variant.finish}
        </span>
      </p>
    )}
  </div>
)}

<p className="mt-2 text-xs text-[#777064]">
  Quantity: {item.quantity}
</p>

                  {item.customSize && (
                    <p className="mt-1 text-xs text-[#0877b9]">
                      Custom Size
                    </p>
                  )}
                </div>

                <p className="shrink-0 text-lg font-semibold text-[#0877b9]">
                  ${Number(item.totalPrice).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Shipment & Tracking */}
        {order.shipment && (
          <section className="mt-8 border border-[#cbd5e1] bg-[#ffffff] p-7">
            <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
              Shipment & Tracking
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold">
              DELIVERY INFORMATION
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                  Courier
                </p>
                <p className="mt-2 font-semibold">
                  {order.shipment.courier}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                  Shipment Status
                </p>
                <p className="mt-2 font-semibold text-[#0877b9]">
                  {order.shipment.status.replaceAll("_", " ")}
                </p>
              </div>

              {order.shipment.trackingNumber && (
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                    Tracking Number
                  </p>
                  <p className="mt-2 break-all font-semibold text-[#0877b9]">
                    {order.shipment.trackingNumber}
                  </p>
                </div>
              )}

              {order.shipment.currentLocation && (
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                    Current Location
                  </p>
                  <p className="mt-2">
                    {order.shipment.currentLocation}
                  </p>
                </div>
              )}

              {order.shipment.estimatedDelivery && (
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                    Estimated Delivery
                  </p>
                  <p className="mt-2 text-[#0877b9]">
                    {new Date(
                      order.shipment.estimatedDelivery
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}

              {order.shipment.shippedAt && (
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                    Shipped
                  </p>
                  <p className="mt-2">
                    {new Date(
                      order.shipment.shippedAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}

              {order.shipment.deliveredAt && (
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                    Delivered
                  </p>
                  <p className="mt-2 text-[#0877b9]">
                    {new Date(
                      order.shipment.deliveredAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {order.shipment.trackingNumber && (
              <div className="mt-6">
                <a
                  href={
                    order.shipment.courier
                      .toLowerCase()
                      .includes("dhl")
                      ? `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${encodeURIComponent(order.shipment.trackingNumber)}`
                      : order.shipment.courier
                          .toLowerCase()
                          .includes("fedex")
                        ? `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(order.shipment.trackingNumber)}`
                        : order.shipment.courier
                            .toLowerCase()
                            .includes("ups")
                          ? `https://www.ups.com/track?tracknum=${encodeURIComponent(order.shipment.trackingNumber)}`
                          : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#0877b9] px-7 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#ffffff]"
                >
                  Track Shipment
                </a>
              </div>
            )}

            {order.shipment.events.length > 0 && (
              <div className="mt-8 border-t border-[#e2e8f0] pt-7">
                <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
                  Tracking History
                </p>

                <div className="mt-6 space-y-6">
                  {order.shipment.events.map((event) => (
                    <div
                      key={event.id}
                      className="border-l border-[#bda477] pl-5"
                    >
                      <div className="flex flex-col justify-between gap-2 sm:flex-row">
                        <strong className="text-[#0877b9]">
                          {event.status.replaceAll("_", " ")}
                        </strong>

                        <span className="text-xs text-[#777064]">
                          {new Date(
                            event.eventTime
                          ).toLocaleString()}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#475569]">
                        {event.description}
                      </p>

                      {event.location && (
                        <p className="mt-1 text-xs text-[#777064]">
                          {event.location}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
        {/* Shipping Address */}
        {order.shippingAddress && (
          <section className="mt-8 border border-[#cbd5e1] bg-[#ffffff] p-7">
            <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
              Shipping Address
            </p>

            <div className="mt-5 leading-7 text-[#475569]">
              <p className="font-semibold text-[#17212b]">
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </p>

              <p>{order.shippingAddress.address1}</p>

              {order.shippingAddress.address2 && (
                <p>{order.shippingAddress.address2}</p>
              )}

              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
              </p>

              <p>
                {order.shippingAddress.postalCode}
              </p>

              <p>{order.shippingAddress.country}</p>
            </div>
          </section>
        )}

        {/* Totals */}
        <section className="mt-8 border border-[#cbd5e1] bg-[#ffffff] p-7">
          <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
            Order Summary
          </p>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between text-[#475569]">
              <span>Subtotal</span>
              <span>
                ${Number(order.subtotal).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-[#475569]">
              <span>Shipping</span>
              <span>
                ${Number(order.shippingCost).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-[#475569]">
              <span>Discount</span>
              <span>
                -${Number(order.discount).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-[#475569]">
              <span>Tax</span>
              <span>
                ${Number(order.tax).toFixed(2)}
              </span>
            </div>

            <div className="mt-5 flex justify-between border-t border-[#e2e8f0] pt-5">
              <strong className="font-serif text-xl">
                Total
              </strong>

              <strong className="text-2xl text-[#0877b9]">
                ${Number(order.total).toFixed(2)}
              </strong>
            </div>
          </div>
        </section>

        {/* Payment */}
        {payment && (
          <section className="mt-8 border border-[#cbd5e1] bg-[#ffffff] p-7">
            <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
              Payment
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex justify-between gap-5">
                <span className="text-sm text-[#777064]">
                  Provider
                </span>

                <span className="text-sm">
                  {payment.provider}
                </span>
              </div>

              <div className="flex justify-between gap-5">
                <span className="text-sm text-[#777064]">
                  Transaction ID
                </span>

                <span className="break-all text-right text-sm text-[#0877b9]">
                  {payment.transactionId}
                </span>
              </div>
            </div>
          </section>
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/account"
            className="border border-[#cbd5e1] px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.2em] hover:border-[#0284c7]"
          >
            Back to Account
          </Link>

          <Link
            href="/products"
            className="bg-[#0877b9] px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff]"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
          <SiteFooter />
    </main>
  );
}





