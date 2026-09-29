import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import AdminLogout from "./AdminLogout";

export default async function AdminPage() {
  const authenticated = await requireAdmin();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
    },
  });

  const customerIds = [
    ...new Set(
      orders
        .map((order) => order.customerId)
        .filter(
          (id): id is string => Boolean(id)
        )
    ),
  ];

  const customers = await prisma.customer.findMany({
    where: {
      id: {
        in: customerIds,
      },
    },
  });

  const customerMap = new Map(
    customers.map((customer) => [
      customer.id,
      customer,
    ])
  );

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const totalSales = orders.reduce(
    (total, order) =>
      total + Number(order.total),
    0
  );


  const totalSupportConversations =
    await prisma.supportConversation.count();

  const openSupportConversations =
    await prisma.supportConversation.count({
      where: {
        status: "OPEN",
        blocked: false,
      },
    });

  const blockedSupportConversations =
    await prisma.supportConversation.count({
      where: {
        blocked: true,
      },
    });
return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      {/* Header */}
      <header className="border-b border-[#e2e8f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#0369a1]">
              Store Administration
            </p>

            <h1 className="mt-1 font-serif text-2xl font-bold tracking-[0.08em]">
              INDUSTRIAL AUTOMATION
            </h1>
          </div>          <div className="flex items-center gap-6">
            <Link
              href="/admin/products"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
            >
              Products
            </Link>

            <Link
              href="/admin/reviews"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
            >
              Reviews
            </Link>

            <Link
              href="/admin/support"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
            >
              Support
            </Link>
<Link
  href="/admin/analytics"
  className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
>
  Analytics
</Link>

            <Link
              href="/admin/settings"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
            >
              Settings
            </Link>
            <AdminLogout />


            <Link
              href="/"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
            >
              View Store</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Title */}
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
            Administration
          </p>

          <h2 className="mt-3 font-serif text-5xl font-bold">
            DASHBOARD
          </h2>
        </div>

        {/* Statistics */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Orders"
            value={totalOrders.toString()}
          />

          <StatCard
            label="Pending Orders"
            value={pendingOrders.toString()}
          />

          <StatCard
            label="Total Sales"
            value={`$${totalSales.toFixed(2)}`}
          />
        </div>

        {/* Customer Support */}
        <section className="mt-8 border border-[#e2e8f0] bg-[#ffffff]">
          <div className="flex flex-col gap-5 border-b border-[#e2e8f0] px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#0369a1]">
                Customer Service
              </p>

              <h3 className="mt-2 font-serif text-2xl font-bold tracking-[0.04em]">
                CUSTOMER SUPPORT
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#475569]">
                Manage customer conversations, reply to customers,
                and control support access.
              </p>
            </div>

            <Link
              href="/admin/support"
              className="inline-flex items-center justify-center border border-[#0877b9] bg-[#0877b9] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#075985]"
            >
              Open Support →
            </Link>
          </div>

          <div className="grid gap-px bg-[#e2e8f0] sm:grid-cols-3">
            <div className="bg-[#ffffff] px-6 py-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#999184]">
                Open Conversations
              </p>

              <p className="mt-2 font-serif text-3xl font-bold">
                {openSupportConversations}
              </p>
            </div>

            <div className="bg-[#ffffff] px-6 py-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#999184]">
                Blocked Customers
              </p>

              <p className="mt-2 font-serif text-3xl font-bold">
                {blockedSupportConversations}
              </p>
            </div>

            <div className="bg-[#ffffff] px-6 py-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#999184]">
                Total Conversations
              </p>

              <p className="mt-2 font-serif text-3xl font-bold">
                {totalSupportConversations}
              </p>
            </div>
          </div>
        </section>
        {/* Orders */}
        <div className="mt-12">
          <div className="flex items-end justify-between border-b border-[#e2e8f0] pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#0369a1]">
                Sales
              </p>

              <h2 className="mt-1 font-serif text-2xl font-bold tracking-wide">
                ORDERS
              </h2>
            </div>

            <span className="text-xs text-[#475569]">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-sm border border-[#e2e8f0] bg-[#ffffff]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f1f5f9] text-left">
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#475569]">
                      Order
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#475569]">
                      Customer
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#475569]">
                      Date
                    </th>

                    <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#475569]">
                      Items
                    </th>

                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-[#475569]">
                      Total
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#475569]">
                      Status
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#475569]">
                      Payment
                    </th>

                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-[#475569]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const customer = customerMap.get(
                      order.customerId
                    );

                    const itemCount =
                      order.items.reduce(
                        (total, item) =>
                          total + item.quantity,
                        0
                      );

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-[#e5ded1] transition-colors last:border-b-0 hover:bg-[#f1ece2]"
                      >
                        {/* Order */}
                        <td className="px-4 py-3.5">
                          <Link
                            href={`/admin/orders/${order.orderNumber}`}
                            className="font-mono text-xs font-semibold text-[#0877b9] hover:text-[#075985]"
                          >
                            #{order.orderNumber}
                          </Link>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3.5">
                          {customer ? (
                            <div className="max-w-[230px]">
                              <p className="truncate text-sm font-medium text-[#17212b]">
                                {customer.firstName}{" "}
                                {customer.lastName}
                              </p>

                              <p className="mt-0.5 truncate text-[11px] text-[#625c53]">
                                {customer.email}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-[#625c53]">
                              Unknown customer
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <span className="text-xs text-[#999184]">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </td>

                        {/* Items */}
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-flex min-w-7 items-center justify-center rounded-full border border-[#e2e8f0] bg-[#f1ece2] px-2 py-1 text-[11px] text-[#aaa194]">
                            {itemCount}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="whitespace-nowrap px-4 py-3.5 text-right">
                          <span className="text-sm font-semibold text-[#17212b]">
                            {order.currency === "GBP" ? "£" : order.currency === "EUR" ? "€" : "$"}{Number(order.total).toFixed(2)}
                          </span>
                        </td>

                        {/* Order Status */}
                        <td className="px-4 py-3.5">
                          <StatusBadge
                            status={String(order.status)}
                          />
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-3.5">
                          <StatusBadge
                            status={String(order.paymentStatus)}
                          />
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href={`/admin/orders/${order.orderNumber}`}
                            className="inline-flex items-center border border-[#cbd5e1] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#aaa194] transition hover:border-[#0877b9] hover:bg-[#18140f] hover:text-[#0877b9]"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}

                  {orders.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-14 text-center"
                      >
                        <p className="text-sm text-[#475569]">
                          No orders yet.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-[#e2e8f0] bg-[#ffffff] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[#475569]">
        {label}
      </p>

      <p className="mt-4 font-serif text-3xl font-bold text-[#0877b9]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span className="inline-block border border-[#cbd5e1] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[#0877b9]">
      {status}
    </span>
  );
}
