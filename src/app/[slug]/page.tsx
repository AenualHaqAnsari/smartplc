import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AutomationContentPage from "@/components/seo/AutomationContentPage";
import { capabilityBySlug, capabilitySlugs } from "@/lib/seo-content";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return capabilitySlugs.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const page = capabilityBySlug.get(slug); if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/${page.slug}` }, openGraph: { type: "website", title: `${page.title} | SmartPLC Solutions`, description: page.description, url: `/${page.slug}`, images: [{ url: "/og-smart-plc.png", width: 1200, height: 630, alt: `${page.h1} | SmartPLC Solutions` }] }, twitter: { card: "summary_large_image", title: page.title, description: page.description, images: ["/og-smart-plc.png"] }, robots: { index: true, follow: true } };
}
export default async function CapabilityPage({ params }: Props) { const { slug } = await params; const page = capabilityBySlug.get(slug); if (!page) notFound(); return <AutomationContentPage page={page} family="capability"/>; }
