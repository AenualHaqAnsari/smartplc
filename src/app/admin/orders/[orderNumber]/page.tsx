import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import OrderStatusControl from "./OrderStatusControl";
import OrderCustomerDetails from "./OrderCustomerDetails";
import ShipmentControl from "./ShipmentControl";

function formatOrderAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

type Props = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export default async function AdminOrderPage({
  params,
}: Props) {
  const authenticated = await requireAdmin();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: {
      orderNumber,
    },
    include: {
      items: {
        include: {
          variant: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const customer = order!.customerId
    ? await prisma.customer.findUnique({
        where: {
          id: order!.customerId,
        },
      })
    : null;

  const address = order!.shippingAddressId
    ? await prisma.address.findUnique({
        where: {
          id: order!.shippingAddressId,
        },
      })
    : null;

  const measurements =
    await prisma.customMeasurement.findMany({
      where: {
        orderId: order!.id,
      },
    });

  const itemCount = order!.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      {/* Header */}
      <header className="border-b border-[#e2e8f0] bg-[#ffffff]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link
              href="/admin"
              className="font-serif text-xl font-bold tracking-[0.08em] text-[#d6b875]"
            >
              INDUSTRIAL AUTOMATION
            </Link>

            <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-[#625c53]">
              Store Administration
            </p>
          </div>

          <Link
            href="/admin"
            className="border border-[#cbd5e1] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#777064] transition hover:border-[#0877b9] hover:bg-[#f1f5f9] hover:text-[#0877b9]"
          >
            Orders
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* Order heading */}
        <div className="flex flex-col gap-5 border-b border-[#e2e8f0] pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0369a1]">
              Order Details
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-3xl font-bold text-[#17212b]">
                #{order!.orderNumber}
              </h1>

              <StatusBadge
                status={String(order!.status)}
              />

              <StatusBadge
                status={String(order!.paymentStatus)}
              />
            </div>

            <p className="mt-2 text-xs text-[#625c53]">
              Placed{" "}
              {new Date(
                order!.createdAt
              ).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#625c53]">
                Items
              </p>
              <p className="mt-1 text-lg font-semibold">
                {itemCount}
              </p>
            </div>

            <div className="h-9 w-px bg-[#e2e8f0]" />

            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#625c53]">
                Order Total
              </p>
              <p className="mt-1 text-xl font-bold text-[#0877b9]">
                {formatOrderAmount(Number(order!.total), order!.currency || "USD")}
              </p>
            </div>
          </div>
        </div>

        {/* Status controls */}
        <section className="mt-6 border border-[#e2e8f0] bg-[#ffffff]">
          <div className="flex flex-col gap-4 border-b border-[#e2e8f0] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#0369a1]">
                Order Management
              </p>
              <p className="mt-1 text-xs text-[#625c53]">
                Update order and payment status.
              </p>
            </div>

            <OrderStatusControl
              orderNumber={order!.orderNumber}
              initialStatus={order!.status}
              initialPaymentStatus={
                order!.paymentStatus
              }
            />
          </div>
        </section>

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left column */}
          <div className="min-w-0 space-y-6">
            {/* Products */}
            <section className="overflow-hidden border border-[#e2e8f0] bg-[#ffffff]">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#0369a1]">
                    Order Items
                  </p>
                  <h2 className="mt-1 font-serif text-xl font-bold">
                    PRODUCTS
                  </h2>
                </div>

                <span className="text-xs text-[#625c53]">
                  {itemCount}{" "}
                  {itemCount === 1
                    ? "item"
                    : "items"}
                </span>
              </div>

              <div className="divide-y divide-[#29251f]">
                {order!.items.map((item) => (
                  <div
                    key={item.id}
                    className="px-5 py-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-serif text-lg font-semibold text-[#17212b]">
                          {item.productName}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-[#475569]">
                          {item.variant && (
                            <span>
                              Variant:{" "}
                              <span className="text-[#777064]">
                                {item.variant.name}
                              </span>
                            </span>
                          )}

                          <span>
                            Qty:{" "}
                            <span className="text-[#777064]">
                              {item.quantity}
                            </span>
                          </span>

                          {item.customSize && (
                            <span className="text-[#0877b9]">
                              Custom Size
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 text-left sm:text-right">
                        <p className="text-sm font-semibold text-[#17212b]">
                          $
                          {Number(
                            item.totalPrice
                          ).toFixed(2)}
                        </p>

                        <p className="mt-1 text-[10px] text-[#625c53]">
                          $
                          {Number(
                            item.unitPrice
                          ).toFixed(2)}{" "}
                          each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Customer + shipping */}
            <OrderCustomerDetails
              customer={
                customer
                  ? {
                      firstName:
                        customer.firstName,
                      lastName:
                        customer.lastName,
                      email:
                        customer.email,
                      phone:
                        customer.phone,
                    }
                  : null
              }
              address={
                address
                  ? {
                      firstName:
                        address.firstName,
                      lastName:
                        address.lastName,
                      company:
                        address.company,
                      address1:
                        address.address1,
                      address2:
                        address.address2,
                      city:
                        address.city,
                      state:
                        address.state,
                      postalCode:
                        address.postalCode,
                      country:
                        address.country,
                      phone:
                        address.phone,
                    }
                  : null
              }
              measurements={measurements.map(
                (measurement) => ({
                  id: measurement.id,
                  itemName:
                    measurement.itemName,
                  height:
                    measurement.height?.toString() ??
                    null,
                  chest:
                    measurement.chest?.toString() ??
                    null,
                  waist:
                    measurement.waist?.toString() ??
                    null,
                  hip:
                    measurement.hip?.toString() ??
                    null,
                  shoulder:
                    measurement.shoulder?.toString() ??
                    null,
                  armLength:
                    measurement.armLength?.toString() ??
                    null,
                  bicep:
                    measurement.bicep?.toString() ??
                    null,
                  wrist:
                    measurement.wrist?.toString() ??
                    null,
                  thigh:
                    measurement.thigh?.toString() ??
                    null,
                  knee:
                    measurement.knee?.toString() ??
                    null,
                  calf:
                    measurement.calf?.toString() ??
                    null,
                  ankle:
                    measurement.ankle?.toString() ??
                    null,
                  neck:
                    measurement.neck?.toString() ??
                    null,
                  head:
                    measurement.head?.toString() ??
                    null,
                  unit: measurement.unit,
                  notes: measurement.notes,
                })
              )}
            />

            {/* Custom measurements */}
            {measurements.length > 0 && (
              <section className="border border-[#e2e8f0] bg-[#ffffff]">
                <div className="border-b border-[#e2e8f0] px-5 py-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#0369a1]">
                    Automation Services
                  </p>
                  <h2 className="mt-1 font-serif text-xl font-bold">
                    MEASUREMENTS
                  </h2>
                </div>

                <div className="space-y-5 p-5">
                  {measurements.map(
                    (measurement) => (
                      <div
                        key={measurement.id}
                        className="border border-[#e2e8f0] bg-[#f8fafc] p-4"
                      >
                        {measurement.itemName && (
                          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#0877b9]">
                            {
                              measurement.itemName
                            }
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          <MeasurementValue label="Height" value={measurement.height} unit={measurement.unit} />
                          <MeasurementValue label="Chest" value={measurement.chest} unit={measurement.unit} />
                          <MeasurementValue label="Waist" value={measurement.waist} unit={measurement.unit} />
                          <MeasurementValue label="Hip" value={measurement.hip} unit={measurement.unit} />
                          <MeasurementValue label="Shoulder" value={measurement.shoulder} unit={measurement.unit} />
                          <MeasurementValue label="Arm Length" value={measurement.armLength} unit={measurement.unit} />
                          <MeasurementValue label="Bicep" value={measurement.bicep} unit={measurement.unit} />
                          <MeasurementValue label="Wrist" value={measurement.wrist} unit={measurement.unit} />
                          <MeasurementValue label="Thigh" value={measurement.thigh} unit={measurement.unit} />
                          <MeasurementValue label="Knee" value={measurement.knee} unit={measurement.unit} />
                          <MeasurementValue label="Calf" value={measurement.calf} unit={measurement.unit} />
                          <MeasurementValue label="Ankle" value={measurement.ankle} unit={measurement.unit} />
                          <MeasurementValue label="Neck" value={measurement.neck} unit={measurement.unit} />
                          <MeasurementValue label="Head" value={measurement.head} unit={measurement.unit} />
                        </div>

                        {measurement.notes && (
                          <div className="mt-4 border-t border-[#e2e8f0] pt-4">
                            <p className="text-[9px] uppercase tracking-[0.18em] text-[#625c53]">
                              Customer Notes
                            </p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#777064]">
                              {measurement.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Financial summary */}
            <section className="border border-[#e2e8f0] bg-[#ffffff]">
              <div className="border-b border-[#e2e8f0] px-5 py-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#0369a1]">
                  Financial
                </p>
                <h2 className="mt-1 font-serif text-xl font-bold">
                  ORDER TOTAL
                </h2>
              </div>

              <div className="space-y-3 p-5 text-sm">
                <div className="flex justify-between text-[#475569]">
                  <span>Subtotal</span>
                  <span className="text-[#777064]">
                    $
                    {Number(
                      order!.subtotal
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-[#475569]">
                  <span>Discount</span>
                  <span className="text-[#777064]">
                    -$
                    {Number(
                      order!.discount
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-[#475569]">
                  <span>Shipping</span>
                  <span className="text-[#777064]">
                    $
                    {Number(
                      order!.shippingCost
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-[#475569]">
                  <span>Tax</span>
                  <span className="text-[#777064]">
                    $
                    {Number(
                      order!.tax
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="my-3 h-px bg-[#e2e8f0]" />

                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-bold">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#0877b9]">
                    $
                    {Number(
                      order!.total
                    ).toFixed(2)}
                  </span>
                </div>

                <p className="pt-1 text-right text-[9px] uppercase tracking-[0.15em] text-[#625c53]">
                  {order!.currency}
                </p>
              </div>
            </section>

            {/* Customer quick summary */}
            <section className="border border-[#e2e8f0] bg-[#ffffff]">
              <div className="border-b border-[#e2e8f0] px-5 py-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#0369a1]">
                  Customer
                </p>
                <h2 className="mt-1 font-serif text-xl font-bold">
                  CONTACT
                </h2>
              </div>

              <div className="p-5">
                {customer ? (
                  <>
                    <p className="font-semibold text-[#17212b]">
                      {customer.firstName}{" "}
                      {customer.lastName}
                    </p>

                    <p className="mt-2 break-all text-xs text-[#475569]">
                      {customer.email}
                    </p>

                    {customer.phone && (
                      <p className="mt-1 text-xs text-[#475569]">
                        {customer.phone}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-[#625c53]">
                    Customer information unavailable.
                  </p>
                )}
              </div>
            </section>

            {/* Shipment */}
            <section className="border border-[#e2e8f0] bg-[#ffffff]">
              <div className="border-b border-[#e2e8f0] px-5 py-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#0369a1]">
                  Fulfillment
                </p>
                <h2 className="mt-1 font-serif text-xl font-bold">
                  SHIPMENT
                </h2>
              </div>

              <div className="p-5">
                <ShipmentControl
                  orderNumber={order!.orderNumber}
                />
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function MeasurementValue({
  label,
  value,
  unit,
}: {
  label: string;
  value: unknown;
  unit: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="border border-[#e2e8f0] bg-[#ffffff] px-3 py-2.5">
      <p className="text-[9px] uppercase tracking-[0.14em] text-[#625c53]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#17212b]">
        {String(value)} {unit}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toUpperCase();

  let classes =
    "border-[#cbd5e1] bg-[#f1ece2] text-[#777064]";

  if (
    normalized === "PAID" ||
    normalized === "CONFIRMED" ||
    normalized === "DELIVERED"
  ) {
    classes =
      "border-[#536b45] bg-[#eef3e9] text-[#536b45]";
  }

  if (
    normalized === "PENDING" ||
    normalized === "PROCESSING" ||
    normalized === "CUSTOMIZATION"
  ) {
    classes =
      "border-[#665737] bg-[#f4eee2] text-[#0877b9]";
  }

  if (
    normalized === "FAILED" ||
    normalized === "CANCELLED" ||
    normalized === "REFUNDED" ||
    normalized === "EXCEPTION"
  ) {
    classes =
      "border-[#6f4b43] bg-[#f5e9e5] text-[#8f5146]";
  }

  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.13em] ${classes}`}
    >
      {normalized.replaceAll("_", " ")}
    </span>
  );
}

