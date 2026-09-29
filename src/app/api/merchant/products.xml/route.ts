import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteImageUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function deriveColor(
  name: string,
  description: string,
  finishValues: string[]
): string {
  const text = `${name} ${description} ${finishValues.join(" ")}`.toLowerCase();

  const colors: string[] = [];

  if (text.includes("black")) colors.push("Black");
  if (text.includes("silver")) colors.push("Silver");
  if (text.includes("gold")) colors.push("Gold");
  if (text.includes("red")) colors.push("Red");
  if (text.includes("blue")) colors.push("Blue");
  if (text.includes("green")) colors.push("Green");
  if (text.includes("brown")) colors.push("Brown");
  if (text.includes("white")) colors.push("White");

  if (colors.length > 0) {
    return Array.from(new Set(colors)).join("/");
  }

  return "Silver";
}

function lowestPrice(
  basePrice: number,
  variants: { price: unknown }[]
): number {
  const prices = variants
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price > 0);

  return prices.length > 0
    ? Math.min(basePrice, ...prices)
    : basePrice;
}

export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
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
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const items = products.map((product) => {
    const images = product.images
      .map((image) => absoluteImageUrl(image.url))
      .filter(Boolean);

    const primaryImage =
      product.images.find((image) => image.isPrimary) ||
      product.images[0];

    const imageUrl = primaryImage
      ? absoluteImageUrl(primaryImage.url)
      : "";

    const additionalImages = images
      .filter((url) => url !== imageUrl)
      .slice(0, 10);

    const basePrice = Number(product.basePrice);

    const price = lowestPrice(basePrice, product.variants);

    const totalStock = product.variants.reduce(
      (sum, variant) =>
        sum + Math.max(0, Number(variant.stock) || 0),
      0
    );

    const availability =
      totalStock > 0 || product.variants.length === 0
        ? "in_stock"
        : "out_of_stock";

    const finishValues = product.variants
      .map((variant) => variant.finish)
      .filter(
        (finish): finish is string =>
          typeof finish === "string" && finish.trim().length > 0
      );

    const color = deriveColor(
      product.name,
      product.description,
      finishValues
    );

    const description =
      product.shortDescription?.trim() ||
      product.description?.trim() ||
      product.name;

    const sku =
      product.sku?.trim() ||
      product.id;

    const productUrl =
      `${SITE_URL}/products/${product.slug}`;

    return {
      id: sku,
      title: product.name,
      description,
      link: productUrl,
      imageUrl,
      additionalImages,
      price,
      availability,
      color,
      category: product.category.name,
    };
  });

  const xmlItems = items
    .map((item) => {
      const additionalImagesXml =
        item.additionalImages.length > 0
          ? item.additionalImages
              .map(
                (url) =>
                  `      <g:additional_image_link>${xmlEscape(url)}</g:additional_image_link>`
              )
              .join("\n")
          : "";

      return `    <item>
      <g:id>${xmlEscape(item.id)}</g:id>
      <g:title>${xmlEscape(item.title)}</g:title>
      <g:description>${xmlEscape(item.description)}</g:description>
      <g:link>${xmlEscape(item.link)}</g:link>
      <g:image_link>${xmlEscape(item.imageUrl)}</g:image_link>
${additionalImagesXml}
      <g:availability>${item.availability}</g:availability>
      <g:price>${item.price.toFixed(2)} USD</g:price>
      <g:brand>Industrial Automation</g:brand>
      <g:condition>new</g:condition>
      <g:age_group>adult</g:age_group>
      <g:gender>unisex</g:gender>
      <g:color>${xmlEscape(item.color)}</g:color>
      <g:google_product_category>Apparel &amp; Accessories</g:google_product_category>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Free Shipping</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Industrial Automation</title>
    <link>${SITE_URL}</link>
    <description>Industrial automation products for control, sensing and machine applications.</description>
${xmlItems}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
