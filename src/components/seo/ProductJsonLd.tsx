type ProductJsonLdVariant = {
  id: string;
  name: string;
  sku?: string | null;
  price: string;
  compareAtPrice?: string | null;
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
  compareAtPriceUSD?: string | null;
  discountRate?: number;
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
  compareAtPriceUSD,
  discountRate = 0,
  inStock,
  customAvailable = false,
  variants = [],
  reviews = [],
  slug,
}: ProductJsonLdProps) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://smartplcsolutions.com").replace(/\/$/, "");
  const validVariants = variants.filter(
    (variant) =>
      Number.isFinite(Number(variant.price)) &&
      Number(variant.price) > 0
  );

  const offers = (validVariants.length > 0 ? validVariants : [{
    id: "product",
    name,
    price: priceUSD,
    compareAtPrice: compareAtPriceUSD,
    stock: inStock ? 1 : 0,
  }]).map((variant) => {
    const basePrice = Number(variant.price);
    const salePrice = basePrice * (1 - Math.min(100, Math.max(0, discountRate)) / 100);
    const compareAt = Number(variant.compareAtPrice);
    const originalPrice = Number.isFinite(compareAt) && compareAt > basePrice
      ? compareAt
      : basePrice;
    const hasSale = salePrice < originalPrice - 0.009;

    return {
      "@type": "Offer",
      price: (hasSale ? salePrice : originalPrice).toFixed(2),
      priceCurrency: "USD",
      availability: Number(variant.stock) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/products/${slug}`,
    };
  });

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

    offers: offers.map((offer) => ({
      ...offer,

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
    })),

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
