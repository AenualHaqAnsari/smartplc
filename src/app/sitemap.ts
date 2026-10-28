export const dynamic = "force-dynamic";
import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { applications, capabilitySlugs, saudiServicePages } from "@/lib/seo-content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||"https://smartplcsolutions.com").replace(/\/$/,"");
 const [categories,products]=await Promise.all([
  prisma.category.findMany({where:{active:true},select:{slug:true,updatedAt:true}}),
  prisma.product.findMany({where:{status:"ACTIVE"},select:{slug:true,updatedAt:true}}),
 ]);
 const pages:MetadataRoute.Sitemap=["/","/about","/contact","/request-quote","/services","/it-services","/it-services/gst-billing-software","/it-services/ai-agent-development","/faq","/shipping-policy","/policies/privacy","/policies/returns","/policies/cancellation","/policies/terms","/policies/shipping","/products","/applications","/europe/industrial-automation","/delta-plc-programming-delhi","/siemens-plc-programming-delhi","/delta-plc-programming-haridwar","/siemens-plc-programming-haridwar"].map(path=>({url:`${siteUrl}${path}`,changeFrequency:path==="/"||path==="/products"||path==="/applications"?"weekly":"yearly",priority:path==="/"?1:path==="/products"||path==="/applications"?0.9:path==="/europe/industrial-automation"?0.7:path.includes("plc-programming-")?0.7:0.5}));
 const capabilityPages=capabilitySlugs.map(slug=>({url:`${siteUrl}/${slug}`,changeFrequency:"monthly" as const,priority:0.7}));
 const applicationPages=applications.map(page=>({url:`${siteUrl}/applications/${page.slug}`,changeFrequency:"monthly" as const,priority:0.7}));
 const saudiPages=saudiServicePages.map(page=>({url:`${siteUrl}/saudi-arabia/${page.slug}`,changeFrequency:"monthly" as const,priority:0.7}));
 return [...pages,...capabilityPages,...applicationPages,...saudiPages,...categories.map(c=>({url:`${siteUrl}/products/category/${encodeURIComponent(c.slug)}`,lastModified:c.updatedAt,changeFrequency:"weekly" as const,priority:0.8})),...products.map(p=>({url:`${siteUrl}/products/${p.slug}`,lastModified:p.updatedAt,changeFrequency:"weekly" as const,priority:0.9}))];
}
