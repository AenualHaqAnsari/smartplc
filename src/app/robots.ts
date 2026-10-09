import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://smartplcsolutions.com"
  ).replace(/\/$/, "");

  const disallow = [
    "/admin/",
    "/account/",
    "/cart",
    "/checkout",
    "/order-confirmation/",
    "/api/",
  ];

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
