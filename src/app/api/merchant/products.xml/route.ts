import { prisma } from "@/lib/prisma";
import { getCountryDiscount } from "@/lib/pricing";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  let siteUrl: string;
  try {
    if (!configuredSiteUrl) throw new Error("Missing site URL");
    const parsed = new URL(configuredSiteUrl);
    if (
      !["http:", "https:"].includes(parsed.protocol) ||
      (process.env.NODE_ENV === "production" && parsed.protocol !== "https:")
    ) {
      throw new Error("Invalid site URL");
    }
    siteUrl = parsed.origin;
  } catch {
    return new Response("NEXT_PUBLIC_SITE_URL must be set to the public site origin.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const absoluteUrl = (value: string) => new URL(value, `${siteUrl}/`).toString();
  const discountRate = await getCountryDiscount("US");

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
    const images = product.images.map((image) => absoluteUrl(image.url));

    const primaryImage =
      product.images.find((image) => image.isPrimary) ||
      product.images[0];

    const imageUrl = primaryImage
      ? absoluteUrl(primaryImage.url)
      : "";

    const additionalImages = images
      .filter((url) => url !== imageUrl)
      .slice(0, 10);

    const basePrice = Number(product.basePrice);

    const priceOptions = product.variants.length > 0
      ? product.variants.map((variant) => ({
          price: Number(variant.price),
          compareAtPrice: Number(variant.compareAtPrice),
        }))
      : [{ price: basePrice, compareAtPrice: Number(product.compareAtPrice) }];
    const validPriceOptions = priceOptions.filter(({ price }) => Number.isFinite(price) && price > 0);
    const lowestPriceOption = validPriceOptions.length > 0
      ? validPriceOptions.reduce((lowest, option) => option.price < lowest.price ? option : lowest)
      : { price: basePrice, compareAtPrice: Number(product.compareAtPrice) };
    const price = Number.isFinite(lowestPriceOption.compareAtPrice) && lowestPriceOption.compareAtPrice > lowestPriceOption.price
      ? lowestPriceOption.compareAtPrice
      : lowestPriceOption.price;
    const discountedPrice = lowestPriceOption.price * (1 - discountRate / 100);

    const totalStock = product.variants.reduce(
      (sum, variant) =>
        sum + Math.max(0, Number(variant.stock) || 0),
      0
    );

    const availability =
      totalStock > 0
        ? "in_stock"
        : "out_of_stock";

    const description =
      product.shortDescription?.trim() ||
      product.description?.trim() ||
      product.name;

    const sku =
      product.sku?.trim() ||
      product.id;

    const productUrl =
      `${siteUrl}/products/${product.slug}`;

    if (!imageUrl || !Number.isFinite(price) || price <= 0) return null;

    return {
      id: sku,
      title: product.name,
      description,
      link: productUrl,
      imageUrl,
      additionalImages,
      price,
      salePrice: discountedPrice < price - 0.009 ? discountedPrice : null,
      availability,
      category: product.category.name,
      brand: product.brand?.trim() || null,
      mpn: product.model?.trim() || null,
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

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
      ${item.salePrice !== null ? `<g:sale_price>${item.salePrice.toFixed(2)} USD</g:sale_price>` : ""}
      ${item.brand ? `<g:brand>${xmlEscape(item.brand)}</g:brand>` : ""}
      ${item.mpn ? `<g:mpn>${xmlEscape(item.mpn)}</g:mpn>` : ""}
      <g:product_type>${xmlEscape(`Industrial Automation > ${item.category}`)}</g:product_type>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Industrial Automation</title>
    <link>${siteUrl}</link>
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
