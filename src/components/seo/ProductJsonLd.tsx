type ProductJsonLdVariant = {
  id: string;
  name: string;
  sku?: string | null;
  price: string;
  stock: number;
  size?: string | null;
  sizeType?: "STANDARD" | "CUSTOM";
  gauge?: string | null;
  finish?: string | null;
  customAvailable?: boolean;
};

type ProductJsonLdProps = {
  name: string;
  description: string;
  sku?: string | null;
  category?: string | null;
  images: string[];
  priceUSD: string;
  inStock: boolean;
  customAvailable?: boolean;
  variants?: ProductJsonLdVariant[];
  reviews?: {
    rating: number;
    title?: string | null;
    comment?: string | null;
    createdAt: string;
  }[];
  slug: string;
};

export default function ProductJsonLd({
  name,
  description,
  sku,
  category,
  images,
  priceUSD,
  inStock,
  customAvailable = false,
  variants = [],
  reviews = [],
  slug,
}: ProductJsonLdProps) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const validVariants = variants.filter(
    (variant) =>
      Number.isFinite(Number(variant.price)) &&
      Number(variant.price) > 0
  );

  const variantPrices = validVariants.map((variant) =>
    Number(variant.price)
  );

  const lowestVariantPrice =
    variantPrices.length > 0
      ? Math.min(...variantPrices)
      : Number(priceUSD);

  const highestVariantPrice =
    variantPrices.length > 0
      ? Math.max(...variantPrices)
      : Number(priceUSD);

  const totalStock = validVariants.reduce(
    (sum, variant) => sum + Math.max(0, Number(variant.stock) || 0),
    0
  );

  const hasCustomVariant =
    customAvailable ||
    validVariants.some(
      (variant) => variant.customAvailable === true
    );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",

    name,
    description,

    ...(sku ? { sku } : {}),

    ...(category ? { category } : {}),

    ...(images.length ? { image: images } : {}),

    offers: {
      "@type": "AggregateOffer",

      lowPrice: lowestVariantPrice.toFixed(2),
      highPrice: highestVariantPrice.toFixed(2),
      priceCurrency: "USD",

      offerCount:
        validVariants.length > 0
          ? validVariants.length
          : 1,

      availability:
        inStock || totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",

      url: `${siteUrl}/products/${slug}`,

      shippingDetails: {
        "@type": "OfferShippingDetails",

        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "*",
        },

        deliveryTime: {
          "@type": "ShippingDeliveryTime",

          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: hasCustomVariant ? 10 : 5,
            maxValue: hasCustomVariant ? 15 : 7,
            unitCode: "DAY",
          },

          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 4,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },

      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        merchantReturnLink:
          `${siteUrl}/policies/returns`,
      },
    },

    ...(validVariants.length
      ? {
          additionalProperty: validVariants.flatMap(
            (variant) => {
              const properties: {
                "@type": string;
                name: string;
                value: string;
              }[] = [];

              if (variant.size) {
                properties.push({
                  "@type": "PropertyValue",
                  name: "Size",
                  value: variant.size,
                });
              }

              if (variant.sizeType) {
                properties.push({
                  "@type": "PropertyValue",
                  name: "Size Type",
                  value: variant.sizeType,
                });
              }

              if (variant.gauge) {
                properties.push({
                  "@type": "PropertyValue",
                  name: "Gauge",
                  value: variant.gauge,
                });
              }

              if (variant.finish) {
                properties.push({
                  "@type": "PropertyValue",
                  name: "Finish",
                  value: variant.finish,
                });
              }

              if (variant.customAvailable) {
                properties.push({
                  "@type": "PropertyValue",
                  name: "Custom Size",
                  value: "Available",
                });
              }

              return properties;
            }
          ),
        }
      : {}),

    ...(reviews.length
      ? {
          aggregateRating: {
            "@type": "AggregateRating",

            ratingValue: (
              reviews.reduce(
                (sum, review) => sum + review.rating,
                0
              ) / reviews.length
            ).toFixed(1),

            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1,
          },

          review: reviews.map((review) => ({
            "@type": "Review",

            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 1,
            },

            ...(review.title
              ? {
                  name: review.title,
                }
              : {}),

            ...(review.comment
              ? {
                  reviewBody: review.comment,
                }
              : {}),

            datePublished: review.createdAt,

            author: {
              "@type": "Person",
              name: "Customer",
            },
          })),
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(
          /</g,
          "\\u003c"
        ),
      }}
    />
  );
}