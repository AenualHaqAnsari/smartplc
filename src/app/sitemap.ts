export const dynamic = "force-dynamic";
import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||"").replace(/\/$/,"");
 const [categories,products]=await Promise.all([
  prisma.category.findMany({where:{active:true},select:{slug:true,updatedAt:true}}),
  prisma.product.findMany({where:{status:"ACTIVE"},select:{slug:true,updatedAt:true}}),
 ]);
 const pages:MetadataRoute.Sitemap=["/","/about","/contact","/request-quote","/services","/it-services","/faq","/shipping-policy","/policies/privacy","/policies/returns","/policies/cancellation","/policies/terms","/policies/shipping","/products"].map(path=>({url:`${siteUrl}${path}`,changeFrequency:path==="/"||path==="/products"?"weekly":"yearly",priority:path==="/"?1:path==="/products"?0.9:0.5}));
 return [...pages,...categories.map(c=>({url:`${siteUrl}/products/category/${encodeURIComponent(c.slug)}`,lastModified:c.updatedAt,changeFrequency:"weekly" as const,priority:0.8})),...products.map(p=>({url:`${siteUrl}/products/${p.slug}`,lastModified:p.updatedAt,changeFrequency:"weekly" as const,priority:0.9}))];
}
