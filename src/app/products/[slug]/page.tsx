import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customer-auth";
import ProductDetails from "./ProductDetails";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import { getCountryDiscount } from "@/lib/pricing";
import { headers } from "next/headers";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import RelatedProducts from "./RelatedProducts";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const customerId = await getCustomerId();

  const customer = customerId
    ? await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
        select: {
          country: true,
        },
      })
    : null;

  const discountSettings =
    await prisma.storeSetting.findMany({
      where: {
        key: {
          in: [
            "discount_india",
            "discount_united_kingdom",
            "discount_germany",
            "discount_france",
            "discount_italy",
            "discount_belgium",
            "discount_spain",
            "discount_switzerland",
            "discount_united_states",
            "discount_everywhere",
          ],
        },
      },
    });

  const discountMap = new Map(
    discountSettings.map((setting) => [
      setting.key,
      Number(setting.value) || 0,
    ])
  );

  const country =
    String(customer?.country ?? "")
      .trim()
      .toUpperCase();

  const countryDiscountMap: Record<string, number> = {
    INDIA:
      discountMap.get("discount_india") ?? 0,
    IN:
      discountMap.get("discount_india") ?? 0,

    "UNITED KINGDOM":
      discountMap.get("discount_united_kingdom") ?? 0,
    UK:
      discountMap.get("discount_united_kingdom") ?? 0,

    GERMANY:
      discountMap.get("discount_germany") ?? 0,

    FRANCE:
      discountMap.get("discount_france") ?? 0,

    ITALY:
      discountMap.get("discount_italy") ?? 0,

    BELGIUM:
      discountMap.get("discount_belgium") ?? 0,

    SPAIN:
      discountMap.get("discount_spain") ?? 0,

    SWITZERLAND:
      discountMap.get("discount_switzerland") ?? 0,

    "UNITED STATES":
      discountMap.get("discount_united_states") ?? 0,
    US:
      discountMap.get("discount_united_states") ?? 0,
    USA:
      discountMap.get("discount_united_states") ?? 0,
  };

  const discountRate =
    countryDiscountMap[country] ??
    (discountMap.get("discount_everywhere") ?? 0);


  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      variants: {
        orderBy: {
          price: "asc",
        },
      },
      reviews: {
        where: {
          approved: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!product || product.status !== "ACTIVE") {
    return {
      title: "Product Not Found | Industrial Automation",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const categoryName =
    product.category?.name?.trim() || "";

  const variantNames = product.variants
    .map((variant) => variant.name?.trim())
    .filter(Boolean);

  const variantKeywords = Array.from(
    new Set(variantNames)
  );

  const keywords = Array.from(
    new Set([
      product.name.trim(),
      categoryName,
      ...variantKeywords,
      "industrial automation equipment",
      "PLC equipment",
      "automation hardware",
      "industrial automation products",
    ].filter(Boolean))
  );

  const title =
    product.seoTitle?.trim() ||
    `${product.name}${
      categoryName ? ` | ${categoryName}` : ""
    } | Industrial Automation`;

  const rawDescription =
    product.seoDescription?.trim() ||
    product.shortDescription?.trim() ||
    product.description?.trim() ||
    `${product.name}${
      categoryName ? ` from ${categoryName}` : ""
    } - handcrafted industrial automation equipment from Industrial Automation.`;

  const description =
    rawDescription.length > 160
      ? `${rawDescription
          .slice(0, 157)
          .trimEnd()}...`
      : rawDescription;

  const primaryImage =
    product.images.find(
      (image) => image.isPrimary
    ) || product.images[0];

  const primaryImageUrl = primaryImage
    ? primaryImage.url.startsWith("http")
      ? primaryImage.url
      : `${process.env.NEXT_PUBLIC_SITE_URL || ""}${primaryImage.url}`
    : undefined;

  return {
    title,
    description,
    keywords,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical:
        `${process.env.NEXT_PUBLIC_SITE_URL || ""}/products/${slug}`,
    },

    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Industrial Automation",
      url:
        `${process.env.NEXT_PUBLIC_SITE_URL || ""}/products/${slug}`,
      locale: "en_US",

      images: [
        {
          url: primaryImageUrl || "/og-smart-plc.png",
          alt: primaryImageUrl
            ? primaryImage?.altText || product.name
            : "Smart PLC Solutions — industrial automation products and services",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImageUrl || "/og-smart-plc.png"],
    },
  };
}
export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const customerId = await getCustomerId();

  const customer = customerId
    ? await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
        select: {
          country: true,
        },
      })
    : null;

  const discountSettings =
    await prisma.storeSetting.findMany({
      where: {
        key: {
          in: [
            "discount_india",
            "discount_united_kingdom",
            "discount_germany",
            "discount_france",
            "discount_italy",
            "discount_belgium",
            "discount_spain",
            "discount_switzerland",
            "discount_united_states",
            "discount_everywhere",
          ],
        },
      },
    });

  const discountMap = new Map(
    discountSettings.map((setting) => [
      setting.key,
      Number(setting.value) || 0,
    ])
  );

  const country =
    String(customer?.country ?? "")
      .trim()
      .toUpperCase();

  const countryDiscountMap: Record<string, number> = {
    INDIA:
      discountMap.get("discount_india") ?? 0,
    IN:
      discountMap.get("discount_india") ?? 0,

    "UNITED KINGDOM":
      discountMap.get("discount_united_kingdom") ?? 0,
    UK:
      discountMap.get("discount_united_kingdom") ?? 0,

    GERMANY:
      discountMap.get("discount_germany") ?? 0,

    FRANCE:
      discountMap.get("discount_france") ?? 0,

    ITALY:
      discountMap.get("discount_italy") ?? 0,

    BELGIUM:
      discountMap.get("discount_belgium") ?? 0,

    SPAIN:
      discountMap.get("discount_spain") ?? 0,

    SWITZERLAND:
      discountMap.get("discount_switzerland") ?? 0,

    "UNITED STATES":
      discountMap.get("discount_united_states") ?? 0,
    US:
      discountMap.get("discount_united_states") ?? 0,
    USA:
      discountMap.get("discount_united_states") ?? 0,
  };

  const discountRate =
    countryDiscountMap[country] ??
    (discountMap.get("discount_everywhere") ?? 0);



  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      videos: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
      variants: {
        orderBy: {
          price: "asc",
        },
      },
      reviews: {
        where: {
          approved: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!product || product.status !== "ACTIVE") {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/` },
    { name: product.category.name, url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/products?category=${product.category.slug}` },
    { name: product.name, url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/products/${product.slug}` },
  ];
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ProductJsonLd
        name={product.name}
        description={product.description}
        sku={product.sku}
        category={product.category.name}
        images={product.images.map((image) => image.url)}
        priceUSD={product.basePrice.toString()}
        compareAtPriceUSD={product.compareAtPrice?.toString() ?? null}
        discountRate={discountRate}
        inStock={product.variants.some((variant) => variant.stock > 0)}
        customAvailable={product.variants.some((variant) => variant.customAvailable)}
        variants={product.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          price: variant.price.toString(),
          compareAtPrice: variant.compareAtPrice?.toString() ?? null,
          stock: variant.stock,
          size: variant.size,
          sizeType: variant.sizeType,
          gauge: variant.gauge,
          finish: variant.finish,
          customAvailable: variant.customAvailable,
        }))}
        slug={product.slug}
        reviews={product.reviews.map((review) => ({
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          createdAt: review.createdAt.toISOString(),
        }))}
      />
      <ProductDetails
        initialDiscountRate={discountRate}
        product={{
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  brand: product.brand,
  model: product.model,
  specifications: JSON.stringify(product.specifications ?? {}),
  basePrice: product.basePrice.toString(),
  compareAtPrice: product.compareAtPrice?.toString() ?? null,

  category: product.category.name,
        images: product.images.map((image) => ({
          id: image.id,
          url: image.url,
          altText: image.altText,
          isPrimary: image.isPrimary,
        })),
        videos: product.videos.map((video) => ({ id: video.id, url: video.url, title: video.title, sortOrder: video.sortOrder })),
        variants: product.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          price: variant.price.toString(),
          compareAtPrice: variant.compareAtPrice?.toString() ?? null,
          stock: variant.stock,
          size: variant.size,
          sizeType: variant.sizeType,
          gauge: variant.gauge,
          finish: variant.finish,
          customAvailable: variant.customAvailable,
        })),
      reviews: product.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
      })),
      }}
      />
      <RelatedProducts
        productId={product.id}
        categoryId={product.categoryId}
        discountRate={discountRate}
      />
    </>
  );
}
