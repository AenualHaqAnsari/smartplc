import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getCustomerId,
} from "@/lib/customer-auth";

export default async function AccountPage() {
  const customerId = await getCustomerId();

  if (!customerId) {
    redirect("/account/login");
  }

  const customer =
    await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
      include: {
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        },
      },
    });

  if (!customer) {
    redirect("/account/login");
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
          Customer Account
        </p>

        <h1 className="mt-3 font-serif text-5xl font-bold">
          WELCOME, {customer.firstName.toUpperCase()}
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Account Information */}
          <aside className="h-fit border border-[#cbd5e1] bg-[#ffffff] p-7">
            <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
              Your Details
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                  Name
                </p>

                <p className="mt-1 font-serif text-lg">
                  {customer.firstName}{" "}
                  {customer.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                  Email
                </p>

                <p className="mt-1 break-words text-[#0877b9]">
                  {customer.email}
                </p>
              </div>

              {customer.phone && (
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                    Phone
                  </p>

                  <p className="mt-1">
                    {customer.phone}
                  </p>
                </div>
              )}
            </div>

            <form
              action="/api/account/logout"
              method="POST"
              className="mt-8"
            >
              <button
                type="submit"
                className="w-full border border-[#cbd5e1] px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#0877b9] transition hover:border-[#0284c7]"
              >
                Sign Out
              </button>
            </form>
          </aside>

          {/* Orders */}
          <section>
            <div className="border border-[#cbd5e1] bg-[#ffffff] p-7">
              <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
                Your Orders
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold">
                ORDER HISTORY
              </h2>

              {customer.orders.length === 0 ? (
                <div className="mt-8 border border-dashed border-[#cbd5e1] p-8 text-center">
                  <p className="font-serif text-xl">
                    No orders yet
                  </p>

                  <p className="mt-2 text-sm text-[#475569]">
                    Your completed orders will
                    appear here.
                  </p>

                  <Link
                    href="/products"
                    className="mt-6 inline-flex bg-[#0877b9] px-7 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#ffffff]"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  {customer.orders.map(
                    (order) => (
                      <Link
  key={order.id}
  href={`/account/orders/${order.orderNumber}`}
  className="block border border-[#e2e8f0] p-5 transition hover:border-[#bda477]"
>
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                          <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                              Order
                            </p>

                            <p className="mt-1 font-serif text-lg font-semibold text-[#0877b9]">
                              {order.orderNumber}
                            </p>

                            <p className="mt-1 text-xs text-[#777064]">
                              {order.createdAt.toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-4">
                            <div>
                              <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                                Payment
                              </p>

                              <p
                                className={
                                  order.paymentStatus ===
                                  "PAID"
                                    ? "mt-1 text-sm text-[#0877b9]"
                                    : "mt-1 text-sm text-[#d79b8d]"
                                }
                              >
                                {order.paymentStatus}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs uppercase tracking-[0.15em] text-[#777064]">
                                Total
                              </p>

                              <p className="mt-1 text-lg font-semibold">
                                $
                                {Number(
                                  order.total
                                ).toFixed(2)}
                              </p>
                            </div>
                            <div className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0877b9]">
  View Order â†’
</div>
                          </div>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
          <SiteFooter />
    </main>
  );
}
