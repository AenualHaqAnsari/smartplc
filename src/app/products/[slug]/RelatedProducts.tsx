import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CurrencyPrice from "@/components/currency/CurrencyPrice";

type RelatedProductsProps = {
  productId: string;
  categoryId: string | null;
  discountRate: number;
};

export default async function RelatedProducts({
  productId,
  categoryId,
  discountRate,
}: RelatedProductsProps) {
  const selectFields = {
    id: true,
    name: true,
    slug: true,
    seoTitle: true,
    basePrice: true,
    images: {
      orderBy: [
        {
          isPrimary: "desc" as const,
        },
        {
          sortOrder: "asc" as const,
        },
      ],
      take: 1,
      select: {
        url: true,
        altText: true,
      },
    },
  };

  // First: prefer products from the same category.
  const sameCategoryProducts = categoryId
    ? await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          id: {
            not: productId,
          },
          categoryId,
        },
        select: selectFields,
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
      })
    : [];

  const remainingCount = 4 - sameCategoryProducts.length;

  // If the category does not have enough products,
  // fill the remaining slots with products from other categories.
  const fallbackProducts =
    remainingCount > 0
      ? await prisma.product.findMany({
          where: {
            status: "ACTIVE",
            id: {
              not: productId,
            },
            ...(sameCategoryProducts.length > 0
              ? {
                  id: {
                    notIn: sameCategoryProducts.map(
                      (product) => product.id
                    ),
                  },
                }
              : {}),
          },
          select: selectFields,
          orderBy: {
            createdAt: "desc",
          },
          take: remainingCount,
        })
      : [];

  const relatedProducts = [
    ...sameCategoryProducts,
    ...fallbackProducts,
  ];

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-products-heading"
      className="mt-14 border-t border-[#e2e8f0] pt-10"
    >
      <div className="mb-7">
        <p className="text-xs uppercase tracking-[0.2em] text-[#0369a1]">
          Explore More Industrial Automation Products
        </p>

        <h2
          id="related-products-heading"
          className="mt-2 font-serif text-3xl font-bold text-[#17212b]"
        >
          You May Also Like
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {relatedProducts.map((relatedProduct) => {
          const image = relatedProduct.images[0];

          const originalPrice =
            Number(relatedProduct.basePrice);

          const discountedPrice =
            originalPrice * (1 - discountRate / 100);

          return (
            <article
              key={relatedProduct.id}
              className="group border border-[#e2e8f0] bg-[#ffffff] transition hover:border-[#cbd5e1]"
            >
              <Link href={`/products/${relatedProduct.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-[#f3eee4]">
                  {image ? (
                    <img
                      src={image.url}
                      alt={
                        image.altText ||
                        relatedProduct.seoTitle ||
                        relatedProduct.name
                      }
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.12em] text-[#777064]">
                      Industrial Automation Products
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-serif text-base font-semibold leading-6 text-[#17212b] group-hover:text-[#0877b9]">
                    {relatedProduct.name}
                  </h3>

                  <p className="mt-3 text-sm font-semibold text-[#0877b9]">
                    <CurrencyPrice amountUSD={discountedPrice} />
                  </p>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
