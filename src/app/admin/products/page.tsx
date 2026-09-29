import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const authenticated = await requireAdmin();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const { status } = await searchParams;
  const showArchived = status === "ARCHIVED";
  const products = await prisma.product.findMany({
    where: showArchived
      ? { status: "ARCHIVED" }
      : { status: { not: "ARCHIVED" } },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
      variants: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <header className="border-b border-[#e2e8f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#0369a1]">
              Store Administration
            </p>

            <h1 className="mt-1 font-serif text-2xl font-bold tracking-[0.08em]">
              INDUSTRIAL AUTOMATION
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
            >
              Orders
            </Link>

            <Link
              href="/"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
            >
              Store
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
              Catalog
            </p>

            <h2 className="mt-3 font-serif text-5xl font-bold">
              PRODUCTS
            </h2>

            <p className="mt-3 text-sm text-[#475569]">
              {showArchived ? "Archived products are retained for historical orders and can be reviewed here." : "Manage your current Industrial Automation catalog. Archived products are hidden from this view."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={showArchived ? "/admin/products" : "/admin/products?status=ARCHIVED"}
              className="border border-[#cbd5e1] px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.15em] text-slate-700 hover:border-sky-600 hover:text-sky-700"
            >
              {showArchived ? "Current Catalog" : "View Archived Products"}
            </Link>
            {!showArchived && <Link
              href="/admin/products/new"
              className="inline-block bg-[#0284c7] px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#0369a1]"
            >
              + Add Product
            </Link>}
          </div>
        </div>

        {/* Product Statistics */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Products"
            value={products.length.toString()}
          />

          <StatCard
            label="Active Products"
            value={products
              .filter(
                (product) =>
                  product.status === "ACTIVE"
              )
              .length.toString()}
          />

          <StatCard
            label="Featured Products"
            value={products
              .filter(
                (product) => product.featured
              )
              .length.toString()}
          />
        </div>

        {/* Products Table */}
        <div className="mt-8 overflow-x-auto border border-[#e2e8f0]">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f1ece2] text-left">
                <th className="px-5 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                  Product
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                  Category
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                  Price
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                  Variants
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                  Stock
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                  Status
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                  Featured
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const totalStock =
                  product.variants.reduce(
                    (total, variant) =>
                      total + variant.stock,
                    0
                  );

                const primaryImage =
                  product.images[0]?.url;

                return (
                  <tr
                    key={product.id}
                    className="border-b border-[#e2e8f0] hover:bg-[#f1ece2]"
                  >
                    {/* Product */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-14 shrink-0 overflow-hidden bg-[#1b1814]">
                          {primaryImage ? (
                            <img
                              src={primaryImage}
                              alt={
                                product.images[0]
                                  ?.altText ||
                                product.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[8px] uppercase text-[#4b4439]">
                              No Image
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-serif font-bold">
                            {product.name}
                          </p>

                          {product.sku && (
                            <p className="mt-1 text-xs text-[#475569]">
                              SKU: {product.sku}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 text-sm text-[#999184]">
                      {product.category.name}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3.5 font-semibold text-[#0877b9]">
                      $
                      {Number(
                        product.basePrice
                      ).toFixed(2)}
                    </td>

                    {/* Variants */}
                    <td className="px-4 py-3.5 text-sm text-[#999184]">
                      {product.variants.length}
                    </td>

                    {/* Stock */}
<td className="px-4 py-3.5">
  <div className="flex items-center gap-2">
    <StockBadge stock={totalStock} />
  </div>
</td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge
                        status={String(
                          product.status
                        )}
                      />
                    </td>

                    {/* Featured */}
                    <td className="px-4 py-3.5">
                      {product.featured ? (
                        <span className="text-xs uppercase tracking-[0.12em] text-[#0877b9]">
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-[#555047]">
                          No
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="border border-[#cbd5e1] px-4 py-2 text-xs uppercase tracking-[0.12em] hover:border-[#0877b9] hover:text-[#0877b9]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-20 text-center text-[#475569]"
                  >
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

function StockBadge({
  stock,
}: {
  stock: number;
}) {
  if (stock <= 0) {
    return (
      <span className="text-xs uppercase tracking-[0.12em] text-[#d79b8d]">
        Out of Stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="text-xs uppercase tracking-[0.12em] text-[#d6b875]">
        {stock} Low
      </span>
    );
  }

  return (
    <span className="text-sm text-[#999184]">
      {stock}
    </span>
  );
}
