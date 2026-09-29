import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { prisma } from "@/lib/prisma";
import CurrencyPrice from "@/components/currency/CurrencyPrice";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;

  const query = q?.trim() ?? "";

  const products = query
    ? await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              category: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        include: {
          category: true,
          images: {
            where: {
              isPrimary: true,
            },
            take: 1,
          },
          variants: {
            orderBy: {
              price: "asc",
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
          Find Automation Products
        </p>

        <h1 className="mt-3 font-serif text-5xl font-bold">
          SEARCH
        </h1>

        <form
          action="/search"
          method="GET"
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search PLCs, HMIs, drives, sensors..."
            className="min-h-14 flex-1 border border-[#cbd5e1] bg-[#ffffff] px-5 text-[#17212b] outline-none placeholder:text-[#6f685d] focus:border-[#0284c7]"
          />

          <button
            type="submit"
            className="bg-[#0877b9] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff] transition hover:bg-[#075985]"
          >
            Search
          </button>
        </form>

        {query ? (
          <p className="mt-10 text-sm uppercase tracking-[0.15em] text-[#475569]">
            {products.length} result
            {products.length === 1 ? "" : "s"} for &quot;{query}&quot;
          </p>
        ) : (
          <p className="mt-10 text-[#475569]">
            Enter a product name, category, or description to search.
          </p>
        )}

        {query && products.length === 0 && (
          <div className="mt-8 border border-[#cbd5e1] bg-[#ffffff] p-10 text-center">
            <p className="font-serif text-2xl">
              No products found
            </p>

            <p className="mt-3 text-[#475569]">
              Try another search term.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex bg-[#0877b9] px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff]"
            >
              Browse Products
            </Link>
          </div>
        )}

        {products.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const image = product.images[0];
              const price =
                product.variants[0]?.price ??
                product.basePrice;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#191714]">
                    {image ? (
                      <img
                        src={image.url}
                        alt={
                          image.altText ||
                          product.name
                        }
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-serif text-2xl text-[#4d463b]">
                          INDUSTRIAL AUTOMATION
                        </span>
                      </div>
                    )}

                    {product.featured && (
                      <div className="absolute left-4 top-4 border border-[#6b5b3e] bg-[#f8fafc]/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#0877b9]">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="pt-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8e8578]">
                      {product.category.name}
                    </p>

                    <h2 className="mt-2 font-serif text-xl font-semibold group-hover:text-[#075985]">
                      {product.name}
                    </h2>

                    <p className="mt-3 text-lg font-semibold text-[#0877b9]">
                      <CurrencyPrice amountUSD={Number(price)} />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
          <SiteFooter />
    </main>
  );
}

